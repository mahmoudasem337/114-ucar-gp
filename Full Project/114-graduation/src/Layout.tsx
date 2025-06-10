import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home"; 
import Login from "./pages/Login";
import ResetPassword from "./pages/ResetPassword"
import FAQPage from "./components/FAQ"
import Reviews from "./pages/Reviews"
import PredictPrice from "./pages/PredictPrice"
import AdvPredictPrice from "./pages/advprediction"
import './index.css'; // 
import WriteReview from "./pages/WriteReview";
import SellCar from "./pages/SellCar";
import CarListings from "./pages/CarListings.tsx";
import Details from "./pages/Details.tsx";
import Profile from "./pages/profile.tsx";
import Buycar from "./pages/Buycar.tsx";
import { Dashboard } from "./pages/Dashboard.tsx";

function admindashboard() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/ResetPassword" element={<ResetPassword />} />
        <Route path="/FAQ" element={<FAQPage />} />
        <Route path="/PredictPrice" element={<PredictPrice />} />
        <Route path="/advprediction" element={<AdvPredictPrice />} />
        <Route path="/reviews" element={<Reviews />} />
        <Route path="/write-review" element={<WriteReview />} />
        <Route path="/sell-car" element={<SellCar />} />
        <Route path="/details/:id" element={<Details />} />
        <Route path="/cars" element={<CarListings />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/buy-car" element={<Buycar />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
  );
} 

export default admindashboard;
