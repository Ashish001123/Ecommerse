import { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import SignupPage from "./pages/SignupPage.jsx";
import Navbar from "./components/Navbar.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import HomePage from "./pages/HomePage.jsx";
import AdminPage from "./pages/AdminPage.jsx";
import CategoryPage from "./pages/CategoryPage.jsx";
import PurchaseCancelPage from "./pages/PurchaseCancelPage.jsx";
import PurchaseSuccessPage from "./pages/PurchaseSuccessPage.jsx";
import CartPage from "./pages/CartPage.jsx";
import { Navigate } from "react-router-dom";
import "./index.css";
import { Toaster } from "react-hot-toast";
import { useAuthStore } from "./store/useAuthStore.js";
import LoadingSpinner from "./components/LoadingSpinner.jsx";
import { useCartStore } from "./store/useCartStore.js";
function App() {
  const { authUser, isCheckingAuth, checkAuthStatus } = useAuthStore();
  const { getCartItems } = useCartStore();

  useEffect(() => {
    checkAuthStatus();
  }, [checkAuthStatus]);

  useEffect(() => {
    if (authUser) {
      getCartItems();
    }
  }, [authUser, getCartItems]);

  if (isCheckingAuth) return <LoadingSpinner />;

  return (
    <div className="min-h-screen bg-gray-900 text-white relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(ellipse_at_top,rgba(16,185,129,0.3)_0%,rgba(10,80,60,0.2)_45%,rgba(0,0,0,0.1)_100%)]"></div>
        </div>
      </div>
      <Toaster />
      <div className="relative z-50 pt-20">
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route
            path="/signup"
            element={!authUser ? <SignupPage /> : <HomePage />}
          />
          <Route
            path="/login"
            element={!authUser ? <LoginPage /> : <HomePage />}
          />
          <Route path="/secret-dashboard" element={authUser?.role === "admin" ? <AdminPage /> : <Navigate to="/login" />} />
          <Route path="/category/:category/" element={<CategoryPage />} />
          <Route path="/cart" element={authUser ? <CartPage /> : <Navigate to="/login" />} />
          <Route
						path='/purchase_success'
						element={authUser ? <PurchaseSuccessPage /> : <Navigate to='/login' />}
					/>
          <Route path='/purchase_cancel' element={authUser ? <PurchaseCancelPage /> : <Navigate to='/login' />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
