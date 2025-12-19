// App.jsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import AboutPage from './pages/AboutPage';
import PromotionsPage from './pages/PromotionsPage';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import MenuPage from './pages/MenuPage';
import CartPage from './pages/CartPage';
import OrdersPage from './pages/OrdersPage';
import AdminPage from './pages/AdminPage';
import './App.css';

// Компонент для защищенных маршрутов
const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const { user, loading } = useAuth();
  
  if (loading) return <div style={styles.loading}>Загрузка...</div>;
  
  if (!user) return <Navigate to="/login" />;
  
  if (requireAdmin && user.role !== 'admin') {
    return <Navigate to="/" />;
  }
  
  return children;
};

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <div className="App">
          <Navbar />
          <main style={styles.main}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/menu" element={<MenuPage />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/promotions" element={<PromotionsPage />} />
              
              {/* Защищенные маршруты */}
              <Route 
                path="/orders" 
                element={
                  <ProtectedRoute>
                    <OrdersPage />
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="/admin/*" 
                element={
                  <ProtectedRoute requireAdmin={true}>
                    <AdminPage />
                  </ProtectedRoute>
                } 
              />
            </Routes>
          </main>
          
          <footer style={styles.footer}>
            <p>© 2024 CoffeeTime. Все права защищены.</p>
            <div style={styles.footerLinks}>
              <a href="/about" style={styles.footerLink}>О нас</a>
              <a href="/contact" style={styles.footerLink}>Контакты</a>
              <a href="/privacy" style={styles.footerLink}>Политика конфиденциальности</a>
            </div>
          </footer>
        </div>
      </CartProvider>
    </AuthProvider>
  );
}

const styles = {
  main: {
    minHeight: '70vh',
  },
  page: {
    padding: '2rem',
    maxWidth: '1200px',
    margin: '0 auto',
  },
  loading: {
    textAlign: 'center',
    padding: '3rem',
    fontSize: '1.2rem',
    color: '#666',
  },
  footer: {
    backgroundColor: '#8B4513',
    color: 'white',
    padding: '2rem',
    textAlign: 'center',
    marginTop: '3rem',
  },
  footerLinks: {
    marginTop: '1rem',
    display: 'flex',
    justifyContent: 'center',
    gap: '2rem',
  },
  footerLink: {
    color: 'white',
    textDecoration: 'none',
    ':hover': {
      textDecoration: 'underline',
    },
  },
};

export default App;