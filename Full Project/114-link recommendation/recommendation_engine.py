import pandas as pd
import numpy as np
import mysql.connector
from datetime import datetime
import re
import random
from sklearn.preprocessing import StandardScaler
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import faiss
from fuzzywuzzy import fuzz
from transliterate import translit
from textblob import TextBlob
from sklearn.cluster import KMeans
from transformers import pipeline
from scipy.sparse import csr_matrix
from typing import List, Dict, Tuple, Optional, Union

class CarRecommendationSystem:
    """A class to manage car recommendation system with cleaner and modular code."""
    
    def __init__(self, conn):
        """
        Initialize the recommendation system with an existing MySQLConnection
        and a Hugging Face text-classification pipeline.
        """
        self.conn = conn
        self.cursor = self.conn.cursor()
        
        self.classifier = pipeline(
            "text-classification",
            model="asafaya/bert-base-arabic",
            tokenizer="asafaya/bert-base-arabic",
            framework="pt"
        )
        self.data = None
        self.cars_scaled = None
        self.faiss_index = None
        self.description_similarity_df = None
        self.unique_brands = None
        self.unique_models = None
        self.unique_bodies = None
        self.unique_locations = None
        self.scaler = StandardScaler()

    def load_and_clean_data(self) -> None:
        """Load and preprocess data from the database."""
        
        query = """
            SELECT advertisementid, created_at, carbodytype, carcolor, cardescription, carfueltype, 
                   carmake, carmodel, carprice, carproductionyear, cartransmissiontype, enginecapacity, 
                   kilometers, owner, ownerlocation, ownerphonenumber
            FROM advertisement
        """
        self.cursor.execute(query)
        columns = [column[0] for column in self.cursor.description]
        cars_raw = self.cursor.fetchall()
        self.data = pd.DataFrame([list(row) for row in cars_raw], columns=columns)

        numeric_cols = ['carprice', 'carproductionyear', 'enginecapacity', 'kilometers']
        self.data[numeric_cols] = self.data[numeric_cols].astype(float)

        string_cols = ['carmake', 'carmodel', 'carbodytype', 'ownerlocation']
        for col in string_cols:
            self.data[f'{col}_original'] = self.data[col].str.lower().str.strip()
            self.data[col] = self.data[f'{col}_original']

        self.data['carprice'] = self.data.groupby(['carmake', 'carproductionyear'])['carprice'].transform(
            lambda x: x.fillna(x.mean())
        ).fillna(self.data['carprice'].mean())
        self.data['carproductionyear'] = self.data.groupby('carmake')['carproductionyear'].transform(
            lambda x: x.fillna(x.mean())
        ).fillna(self.data['carproductionyear'].mean())
        self.data['kilometers'] = self.data['kilometers'].fillna(self.data['kilometers'].mean())
        self.data['enginecapacity'] = self.data['enginecapacity'].fillna(self.data['enginecapacity'].mean())
        self.data['Age'] = 2025 - self.data['carproductionyear']

        for col in string_cols:
            self.data[col] = pd.Categorical(self.data[col]).codes

        self.unique_brands = self.data['carmake_original'].unique().tolist()
        self.unique_models = self.data['carmodel_original'].unique().tolist()
        self.unique_bodies = self.data['carbodytype_original'].unique().tolist()
        self.unique_locations = self.data['ownerlocation_original'].unique().tolist()

        numeric_columns = ['carproductionyear', 'enginecapacity', 'kilometers', 'carprice', 'Age']
        categorical_columns = ['carmake', 'carmodel', 'carbodytype', 'ownerlocation']
        cars_numeric = self.data[numeric_columns + categorical_columns]
        self.cars_scaled = pd.DataFrame(
            self.scaler.fit_transform(cars_numeric),
            columns=cars_numeric.columns,
            index=self.data['advertisementid']
        )

        dimension = self.cars_scaled.shape[1]
        self.faiss_index = faiss.IndexFlatL2(dimension)
        self.faiss_index.add(self.cars_scaled.values.astype(np.float32))

        self.data['cardescription'] = self.data['cardescription'].fillna('').astype(str)
        tfidf = TfidfVectorizer()
        description_vectors = tfidf.fit_transform(self.data['cardescription'])
        description_similarity = cosine_similarity(description_vectors)
        self.description_similarity_df = pd.DataFrame(
            description_similarity,
            index=self.data['advertisementid'],
            columns=self.data['advertisementid']
        )

    def build_user_item_matrix(self, searches: List[Tuple]) -> Tuple[csr_matrix, List, List, Dict, Dict]:
        """Build user-item interaction matrix for Collaborative Filtering."""
        user_ids = sorted({search[1] for search in searches if search[1] is not None})
        item_ids = self.data['advertisementid'].values
        user_id_to_idx = {uid: idx for idx, uid in enumerate(user_ids)}
        item_id_to_idx = {iid: idx for idx, iid in enumerate(item_ids)}

        rows, cols, data_values = [], [], []
        for search in searches:
            user_id, query = search[1], search[2]
            if not query or user_id not in user_id_to_idx:
                continue

            parsed = self.parse_search_query(query)
            brand, model = parsed['brand'], parsed['model']
            if not (brand or model):
                continue

            matching_cars = self.data[
                (self.data['carmake_original'].str.lower() == (brand.lower() if brand else brand)) &
                (self.data['carmodel_original'].str.lower() == (model.lower() if model else model))
            ]

            for ad_id in matching_cars['advertisementid']:
                if ad_id in item_id_to_idx:
                    rows.append(user_id_to_idx[user_id])
                    cols.append(item_id_to_idx[ad_id])
                    data_values.append(1.0)

        user_item_matrix = csr_matrix((data_values, (rows, cols)), shape=(len(user_ids), len(item_ids)))
        return user_item_matrix, user_ids, item_ids, user_id_to_idx, item_id_to_idx

    def compute_user_similarity(self, user_item_matrix: csr_matrix) -> np.ndarray:
        """Compute cosine similarity between users for Collaborative Filtering."""
        return cosine_similarity(user_item_matrix)

    def get_cf_recommendations(
        self,
        user_id: int,
        user_item_matrix: csr_matrix,
        user_similarity: np.ndarray,
        user_ids: List,
        item_ids: List,
        user_id_to_idx: Dict,
        item_id_to_idx: Dict,
        top_k: int = 5
    ) -> pd.DataFrame:
        """Get Collaborative Filtering recommendations for a user."""
        if user_id not in user_id_to_idx:
            return pd.DataFrame()

        user_idx = user_id_to_idx[user_id]
        sim_scores = user_similarity[user_idx]
        similar_user_indices = np.argsort(sim_scores)[::-1][1:top_k + 1]
        similar_users_scores = sim_scores[similar_user_indices]

        item_scores = np.zeros(user_item_matrix.shape[1])
        for sim_idx, sim_score in zip(similar_user_indices, similar_users_scores):
            user_interactions = user_item_matrix[sim_idx].toarray().flatten()
            item_scores += sim_score * user_interactions

        if item_scores.max() > 0:
            item_scores /= item_scores.max()

        cf_scores = pd.Series(item_scores, index=[item_ids[i] for i in range(len(item_ids))])
        cf_recs = self.data[self.data['advertisementid'].isin(cf_scores.index)].copy()
        cf_recs['cf_score'] = cf_recs['advertisementid'].map(cf_scores)
        return cf_recs

    def extract_implicit_preferences(self, query: str) -> Dict[str, Union[bool, str, None]]:
        """Extract implicit preferences from the search query using BERT."""
        prefs = {
            'economic': False,
            'fuel_type': None,
            'transmission_type': None,
            'luxury': False
        }
        query_lower = query.lower().strip()
        try:
            query_translit = translit(query_lower, 'ar', reversed=True)
        except Exception:
            query_translit = query_lower

        result = self.classifier(query)
        label, score = result[0]['label'], result[0]['score']

        if any(kw in query_lower for kw in ['اقتصادية', 'economic', 'رخيصة']):
            prefs['economic'] = True if label != 'POSITIVE' or score <= 0.7 else 'رخيصة' in query_lower
            prefs['fuel_type'] = 'diesel' if 'وقود' in query_lower or 'fuel' in query_translit else None

        fuel_types = {
            'ديزل': 'diesel',
            'biesel': 'diesel',
            'بنزين': 'gasoline',
            'gasoline': 'gasoline',
            'كهربائية': 'hybrid',
            'hybrid': 'hybrid'
        }
        prefs['fuel_type'] = next(
            (fuel_types[kw] for kw in fuel_types if kw in query_lower or kw in query_translit),
            prefs['fuel_type']
        )

        transmission_types = {
            'اوتوماتيك': 'automatic',
            'automatic': 'automatic',
            'مانيوال': 'manual',
            'manual': 'manual'
        }
        prefs['transmission_type'] = next(
            (transmission_types[kw] for kw in transmission_types if kw in query_lower or kw in query_translit),
            None
        )

        if 'فاخرة' in query_lower or 'luxury' in query_lower or 'luxury' in label:
            prefs['luxury'] = True

        return prefs

    def parse_search_query(self, query: str) -> Dict[str, Union[str, float, bool, None, List[str]]]:
        """Parse a search query to extract structured information."""
        parsed = {
            'brand': None,
            'model': None,
            'body': None,
            'location': None,
            'max_price': None,
            'min_year': None,
            'max_km': None,
            'sentiment': None,
            'fuel_type': None,
            'transmission_type': None,
            'economic': False,
            'luxury': False,
            'positive_words': [],
            'negative_words': []
        }

        query_lower = query.lower().strip()
        try:
            query_translit = translit(query_lower, 'ar', reversed=True)
        except Exception:
            query_translit = query_lower
        blob = TextBlob(query_translit)
        sentiment_score = blob.sentiment.polarity
        parsed['sentiment'] = 'positive' if sentiment_score > 0 else 'negative' if sentiment_score < 0 else 'neutral'

        query_words = query_translit.split()
        parsed['brand'] = next(
            (brand for brand in self.unique_brands for word in query_words if fuzz.ratio(word, brand.lower()) >= 80),
            None
        )
        parsed['model'] = next(
            (model for model in self.unique_models for word in query_words if fuzz.ratio(word, model.lower()) >= 80),
            None
        )
        parsed['body'] = next(
            (body for body in self.unique_bodies for word in query_words if fuzz.ratio(word, body.lower()) >= 80),
            None
        )
        parsed['location'] = next(
            (loc for loc in self.unique_locations for word in query_words if fuzz.ratio(word, loc.lower()) >= 80),
            None
        )

        price_match = re.search(r'(\d+\.?\d*m)', query_lower) or re.search(r'(\d+\.?\d*k)', query_lower)
        if price_match:
            price_str = price_match.group(1).replace('m', '').replace('k', '')
            parsed['max_price'] = float(price_str) * (1000000 if 'm' in price_match.group(0) else 1000)

        year_match = re.search(r'\b(20\d{2})\b', query_lower)
        parsed['min_year'] = int(year_match.group(1)) if year_match else None

        parsed['max_km'] = 5000 if 'zero' in query_lower else None

        positive_words = ['نضيفة', 'فبريكة', 'ممتازة', 'جديدة', 'clean', 'excellent', 'new']
        negative_words = ['مش', 'لا', 'ما', 'قديمة', 'not', 'old']
        parsed['positive_words'] = [word for word in query_lower.split() if word in positive_words]
        parsed['negative_words'] = [word for word in query_lower.split() if word in negative_words]

        implicit_prefs = self.extract_implicit_preferences(query)
        parsed.update(implicit_prefs)

        return parsed

    def update_user_profile(self, user_id: int, searches: List[Tuple]) -> Dict:
        """Update user profile based on their search history."""
        user_searches = [s for s in searches if s[1] == user_id]
        if not user_searches:
            popular_locations = self.data['ownerlocation_original'].value_counts().index.tolist()
            popular_brands = self.data['carmake_original'].value_counts().index.tolist()
            popular_bodies = self.data['carbodytype_original'].value_counts().index.tolist()
            return {
                'locations': popular_locations,
                'brands': popular_brands,
                'bodies': popular_bodies,
                'avg_price': self.data['carprice'].mean(),
                'avg_year': 2015,
                'search_price': False,
                'search_year': False
            }

        profile = {'user_id': user_id}
        now = datetime.now()
        recency_sum = sum((now - s[3]).total_seconds() / (24 * 3600) for s in user_searches)

        parsed_searches = [self.parse_search_query(s[2]) for s in user_searches if s[2]]
        if not parsed_searches:
            return profile

        profile['search_brands'] = [p['brand'] for p in parsed_searches if p['brand']]
        profile['search_models'] = [p['model'] for p in parsed_searches if p['model']]
        profile['search_locations'] = [p['location'] for p in parsed_searches if p['location']]
        profile['search_bodies'] = [p['body'] for p in parsed_searches if p['body']]
        profile['search_prices'] = [p['max_price'] for p in parsed_searches if p['max_price']]
        profile['search_years'] = [p['min_year'] for p in parsed_searches if p['min_year']]
        profile['max_km'] = next((p['max_km'] for p in parsed_searches if p['max_km']), None)
        profile['sentiments'] = [p['sentiment'] for p in parsed_searches]
        profile['positive_words'] = list(set(word for p in parsed_searches for word in p['positive_words']))
        profile['negative_words'] = list(set(word for p in parsed_searches for word in p['negative_words']))
        profile['fuel_types'] = list(set(p['fuel_type'] for p in parsed_searches if p['fuel_type']))
        profile['transmission_types'] = list(set(p['transmission_type'] for p in parsed_searches if p['transmission_type']))
        profile['economic'] = any(p['economic'] for p in parsed_searches)
        profile['luxury'] = any(p['luxury'] for p in parsed_searches)

        profile['preferred_brands'] = profile['search_brands'][0] if profile['search_brands'] else 'hyundai'
        profile['preferred_model'] = profile['search_models'][0] if profile['search_models'] else None
        profile['preferred_body'] = profile['search_bodies'][0] if profile['search_bodies'] else 'sedan'
        profile['preferred_location'] = profile['search_locations'][0] if profile['search_locations'] else 'cairo'
        profile['avg_price'] = (
            sum(profile['search_prices']) / len(profile['search_prices'])
            if profile['search_prices'] else min(525000, self.data['carprice'].mean())
        )
        profile['search_price'] = bool(profile['search_prices'])
        profile['avg_year'] = (
            sum(y for y in profile['search_years']) / len(profile['search_years'])
            if profile['search_years'] else 2015
        )
        profile['recency_weight'] = recency_sum / len(user_searches) if user_searches else 1.0
        profile['price_weight'] = 0.2 + (len(profile['search_prices']) / len(user_searches)) * 0.5 if user_searches else 0.2

        return profile

    def cluster_users(self, searches: List[Tuple]) -> Dict[int, int]:
        """Cluster users based on their search patterns."""
        user_features = {}
        for search in searches:
            user_id, query = search[1], search[2]
            if not query:
                continue
            parsed = self.parse_search_query(query)
            features = user_features.setdefault(user_id, {
                'price_mentions': 0, 'brand_mentions': 0, 'model_mentions': 0,
                'location_mentions': 0, 'body_mentions': 0, 'total_searches': 0
            })
            features['total_searches'] += 1
            features['price_mentions'] += bool(parsed['max_price'])
            features['brand_mentions'] += bool(parsed['brand'])
            features['model_mentions'] += bool(parsed['model'])
            features['location_mentions'] += bool(parsed['location'])
            features['body_mentions'] += bool(parsed['body'])

        feature_matrix = []
        user_ids = []
        for user_id, feats in user_features.items():
            total = feats['total_searches']
            if total > 0:
                ratios = [
                    feats['price_mentions'] / total,
                    feats['brand_mentions'] / total,
                    feats['model_mentions'] / total,
                    feats['location_mentions'] / total,
                    feats['body_mentions'] / total
                ]
                feature_matrix.append(ratios)
                user_ids.append(user_id)

        if not feature_matrix:
            return {search[1]: 0 for search in searches if search[1]}

        kmeans = KMeans(n_clusters=3, random_state=42)
        clusters = kmeans.fit_predict(feature_matrix)
        return dict(zip(user_ids, clusters))

    def get_user_weights(self, user_id: int, searches: List[Tuple]) -> Dict[str, float]:
        """Compute dynamic weights for user preferences."""
        weights = {
            'Price': 0.15, 'Year': 0.1, 'Body': 0.1,
            'Brand': 0.35, 'Model': 0.35, 'Location': 0.1,
            'others': 0.05
        }
        user_searches = [s for s in searches if s[1] == user_id]
        if not user_searches:
            return weights

        search_queries = [s[2] for s in user_searches if s[2]]
        total_searches = len(search_queries)
        if total_searches == 0:
            return weights

        mentions = {
            'Price': sum('k' in q.lower() or 'm' in q.lower() for q in search_queries),
            'Year': sum(bool(re.search(r'\b20\d{2}\b', q.lower())) for q in search_queries),
            'Model': sum(any(fuzz.ratio(q.lower(), m) >= 80 for m in self.unique_models) for q in search_queries),
            'Brand': sum(any(fuzz.ratio(q.lower(), b) >= 80 for b in self.unique_brands) for q in search_queries),
            'Location': sum(any(fuzz.ratio(q.lower(), loc) >= 80 for loc in self.unique_locations) for q in search_queries),
            'Body': sum(any(fuzz.ratio(q.lower(), b) >= 80 for b in self.unique_bodies) for q in search_queries)
        }

        for key in ['Price', 'Year', 'Body', 'Location', 'Brand', 'Model']:
            base = weights[key]
            weights[key] = base + (mentions[key] / (total_searches + 1)) * (0.15 if key in ['Price', 'Year'] else 0.1 if key in ['Brand', 'Model'] else 0.05)

        user_clusters = self.cluster_users(searches)
        cluster = user_clusters.get(user_id, 0)
        if cluster == 0: 
            weights['Price'] = min(0.4, weights['Price'] + 0.15)
            weights['Brand'] = max(0.2, weights['Brand'] - 0.1)
            weights['Model'] = max(0.2, weights['Model'] - 0.1)
        elif cluster == 1:  
            weights['Brand'] = min(0.5, weights['Brand'] + 0.15)
            weights['Price'] = max(0.1, weights['Price'] - 0.05)
            weights['Model'] = max(0.2, weights['Model'] - 0.1)

        total_weight = sum(weights.values())
        return {key: value / total_weight for key, value in weights.items()}

    def apply_default_filters(self, cars: pd.DataFrame, profile: Dict) -> pd.DataFrame:
        """Apply default filters to recommendations based on user profile."""
        recs = cars.copy()
        avg_price = profile.get('avg_price', cars['carprice'].mean())
        avg_year = profile.get('avg_year', 2015)

        filters = {
            'price_lower': avg_price * 0.5 if profile.get('search_price', False) else max(50000, avg_price * 0.5),
            'price_upper': avg_price * 1.5 if profile.get('search_price', False) else min(2000000, avg_price * 1.5),
            'year_lower': max(1990, avg_year - 10),
            'year_upper': min(2025, avg_year + 10),
            'year_lower_strict': avg_year - 3,
            'year_upper_strict': avg_year + 3,
            'location': profile.get('preferred_location', 'cairo').lower(),
            'brand': [b.lower() for b in profile.get('search_brands', []) if b.lower() in self.unique_brands],
            'model': [m.lower() for m in profile.get('search_models', []) if m.lower() in self.unique_models],
            'body': profile.get('preferred_body', '').lower(),
            'max_km': profile.get('max_km'),
            'fuel_type': profile.get('fuel_types', [None])[0] if profile.get('fuel_types') else None,
            'transmission_type': profile.get('transmission_types', [None])[0] if profile.get('transmission_types') else None,
            'economic': profile.get('economic', False),
            'luxury': profile.get('luxury', False)
        }

        mask = pd.Series(True, index=recs.index)
        if filters['max_km']:
            mask &= recs['kilometers'] <= filters['max_km']
        if filters['brand']:
            mask &= recs['carmake_original'].str.lower().isin(filters['brand'])
        if filters['model']:
            mask &= recs['carmodel_original'].str.lower().isin(filters['model'])

        price_mask = recs['carprice'].between(
            filters['price_lower'],
            filters['price_lower'] * 1.2 if filters['economic'] else filters['price_upper']
        )
        location_mask = recs['ownerlocation_original'].str.lower() == filters['location']
        body_mask = recs['carbodytype_original'].str.lower() == filters['body'] if filters['body'] else True
        fuel_mask = recs['carfueltype'].str.lower() == filters['fuel_type'] if filters['fuel_type'] else True
        transmission_mask = recs['cartransmissiontype'].str.lower() == filters['transmission_type'] if filters['transmission_type'] else True
        luxury_mask = recs['carprice'] > filters['price_upper'] if filters['luxury'] else True

        year_mask = pd.Series(False, index=recs.index)
        search_brands = profile.get('search_brands', [])
        search_models = profile.get('search_models', [])
        search_years = profile.get('search_years', [])

        for idx, (brand, model, year) in enumerate(zip(recs['carmake_original'], recs['carmodel_original'], recs['carproductionyear'])):
            brand, model = brand.lower(), model.lower()
            matches_strict_year = False
            for i, (b, m) in enumerate(zip(search_brands, search_models)):
                if brand == b.lower() and model == m.lower() and i < len(search_years) and search_years[i]:
                    year_mask.iloc[idx] = filters['year_lower_strict'] <= year <= filters['year_upper_strict']
                    matches_strict_year = True
                    break
            if not matches_strict_year:
                year_mask.iloc[idx] = filters['year_lower'] <= year <= filters['year_upper']

        mask &= (price_mask | location_mask | body_mask | fuel_mask | transmission_mask | luxury_mask) & year_mask
        filtered_recs = recs[mask].copy() 

        matches_mask = (
            (recs['carprice'].between(filters['price_lower'], filters['price_upper'])) &
            (recs['ownerlocation_original'].str.lower() == filters['location']) &
            (recs['carbodytype_original'].str.lower() == filters['body'] if filters['body'] else True)
        ) & year_mask

        if filters['brand']:
            matches_mask |= recs['carmake_original'].str.lower().isin(filters['brand'])
        if filters['model']:
            matches_mask |= recs['carmodel_original'].str.lower().isin(filters['model'])

        filtered_recs.loc[:, 'matches_original_filters'] = matches_mask.loc[filtered_recs.index].astype(int)
        return filtered_recs

    def diversify_recommendations(self, recs: pd.DataFrame, profile: Dict) -> pd.DataFrame:
        """Diversify recommendations to ensure variety."""
        if recs.empty or not profile.get('search_brands'):
            return recs

        original_matches = recs[recs['matches_original_filters'] >= 1].sort_values(by='score', ascending=False)
        remaining_recs = recs[recs['matches_original_filters'] == 0].sort_values(by='score', ascending=False)
        return pd.concat([original_matches, remaining_recs]).drop_duplicates()

    def recommend_cars(self, user_id: int, searches: List[Tuple]) -> pd.DataFrame:
        """Generate car recommendations for a user."""
        profile = self.update_user_profile(user_id, searches)
        weights = self.get_user_weights(user_id, searches)

        user_item_matrix, user_ids, item_ids, user_id_to_idx, item_id_to_idx = self.build_user_item_matrix(searches)
        user_similarity = self.compute_user_similarity(user_item_matrix)
        cf_recs = self.get_cf_recommendations(
            user_id, user_item_matrix, user_similarity, user_ids, item_ids, user_id_to_idx, item_id_to_idx
        )

        if not searches:
            initial_prefs = self.update_user_profile(user_id, searches)
            locations = initial_prefs['locations'].copy()
            brands = initial_prefs['brands'].copy()
            bodies = initial_prefs['bodies'].copy()
            random.shuffle(locations)
            random.shuffle(brands)
            random.shuffle(bodies)

            recommendations = pd.DataFrame()
            for location, brand, body in zip(locations, brands, bodies):
                temp_recs = self.data[
                    (self.data['ownerlocation_original'].str.lower() == location.lower()) &
                    (self.data['carmake_original'].str.lower() == brand.lower()) &
                    (self.data['carbodytype_original'].str.lower() == body.lower()) &
                    (self.data['carprice'] <= initial_prefs['avg_price'])
                ]
                recommendations = pd.concat([recommendations, temp_recs]).drop_duplicates()

            recommendations['score'] = 0.0
            recommendations['matches_original_filters'] = 1
            return recommendations.sort_values(by='carproductionyear', ascending=False)

        recommendations = self.data.copy()
        recommendations['score'] = 0.0

        user_vector = self.cars_scaled.mean().values.astype(np.float32).reshape(1, -1)
        distances, indices = self.faiss_index.search(user_vector, len(self.cars_scaled))
        similarities = 1 / (1 + distances[0])
        recommendations['score'] += similarities * weights.get('others', 0.05)

        if not cf_recs.empty:
            recommendations['cf_score'] = recommendations['advertisementid'].map(
                cf_recs.set_index('advertisementid')['cf_score']
            ).fillna(0)
            recommendations['score'] += recommendations['cf_score'] * 0.3
            recommendations = recommendations.drop(columns=['cf_score'])

        search_brands = profile.get('search_brands', [])
        search_models = profile.get('search_models', [])
        search_years = profile.get('search_years', [])

        if search_brands:
            brand_match = recommendations['carmake_original'].str.lower().isin(
                [b.lower() for b in search_brands]
            ).astype(int)
            recommendations['score'] += brand_match * weights.get('Brand', 0.35)

        if search_models:
            model_match = recommendations['carmodel_original'].str.lower().isin(
                [m.lower() for m in search_models]
            ).astype(int)
            recommendations['score'] += model_match * weights.get('Model', 0.35)

        if search_brands and search_models:
            for i, (brand, model) in enumerate(zip(search_brands, search_models)):
                exact_match = (
                    (recommendations['carmake_original'].str.lower() == brand.lower()) &
                    (recommendations['carmodel_original'].str.lower() == model.lower())
                )
                recommendations.loc[exact_match, 'score'] += 0.2
                if i < len(search_years) and search_years[i]:
                    year = search_years[i]
                    year_match = exact_match & (recommendations['carproductionyear'] == year)
                    year_close_match = exact_match & (recommendations['carproductionyear'].between(year - 1, year + 1))
                    recommendations.loc[year_match, 'score'] += 0.15
                    recommendations.loc[year_close_match, 'score'] += 0.05

        if profile.get('preferred_location'):
            location_match = recommendations['ownerlocation_original'].str.lower() == profile['preferred_location'].lower()
            recommendations.loc[location_match, 'score'] += weights.get('Location', 0.1)

        if profile.get('avg_price'):
            price_diff = abs(recommendations['carprice'] - profile['avg_price'])
            price_score = np.clip(1 - (price_diff / profile['avg_price']), 0, 1)
            recommendations['score'] += price_score * weights.get('Price', 0.15)

        if profile.get('preferred_body'):
            body_match = recommendations['carbodytype_original'].str.lower() == profile['preferred_body'].lower()
            recommendations['score'] += body_match * weights.get('Body', 0.1)

        if profile.get('fuel_types'):
            fuel_match = recommendations['carfueltype'].str.lower() == profile['fuel_types'][0]
            recommendations.loc[fuel_match, 'score'] += 0.1

        if profile.get('transmission_types'):
            transmission_match = recommendations['cartransmissiontype'].str.lower() == profile['transmission_types'][0]
            recommendations.loc[transmission_match, 'score'] += 0.1

        if profile.get('economic'):
            economic_match = recommendations['carprice'] <= profile['avg_price'] * 0.8
            recommendations.loc[economic_match, 'score'] += 0.15

        if profile.get('luxury'):
            luxury_match = recommendations['carprice'] >= profile['avg_price'] * 1.5
            recommendations.loc[luxury_match, 'score'] += 0.15

        sentiments = profile.get('sentiments', [])
        dominant_sentiment = pd.Series(sentiments).mode()[0] if sentiments else 'neutral'
        if dominant_sentiment == 'positive' and profile.get('positive_words'):
            for word in profile['positive_words']:
                try:
                    word_translit = translit(word, 'ar', reversed=True).lower()
                except Exception:
                    word_translit = word.lower()
                description_match = recommendations['cardescription'].str.lower().str.contains(word.lower(), na=False) | \
                                   recommendations['cardescription'].str.lower().str.contains(word_translit, na=False)
                recommendations.loc[description_match, 'score'] += 0.1

        if dominant_sentiment == 'negative' and any(word in profile.get('negative_words', []) for word in ['قديمة', 'old']):
            recommendations.loc[recommendations['Age'] > 10, 'score'] -= 0.2

        recommendations = recommendations.sort_values(by='score', ascending=False)
        filtered_recommendations = self.apply_default_filters(recommendations, profile)

        if filtered_recommendations.empty and search_brands:
            filtered_recs = self.data[
                self.data['carmake_original'].str.lower().isin([b.lower() for b in search_brands])
            ].copy()
            filtered_recs['score'] = 1.0
            filtered_recs['matches_original_filters'] = 0
            filtered_recommendations = filtered_recs

        return self.diversify_recommendations(filtered_recommendations, profile)

    def close(self):
        """Close database connection."""
        self.cursor.close()
        self.conn.close()