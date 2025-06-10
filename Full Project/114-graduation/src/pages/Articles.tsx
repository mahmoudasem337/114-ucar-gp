import { useState } from 'react';
import { Header } from '../components/layout/Header';
import { mockArticles } from '../data/mockData';
import { Article } from '../types/article';
import './Articles.css'; // استدعاء ملف CSS

export function Articles() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [articles, setArticles] = useState<Article[]>(mockArticles);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newArticle: Article = {
      id: (articles.length + 1).toString(),
      title,
      content,
      createdAt: new Date().toISOString().split('T')[0],
      author: 'Olivia Williams'
    };
    setArticles([newArticle, ...articles]);
    setTitle('');
    setContent('');
  };

  return (
    <div className="articles-container">
      <Header title="Articles" />
      
      <div className="article-form-container">
        <h2>Write a New Article</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="title" className="block">Title</label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Article Title"
              required
            />
          </div>
          <div>
            <label htmlFor="content" className="block">Content</label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={6}
              placeholder="Write your article here..."
              required
            />
          </div>
          <button type="submit">
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}
