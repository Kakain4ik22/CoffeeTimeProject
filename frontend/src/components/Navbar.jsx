// components/Navbar.jsx - с улучшенными стилями
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const Navbar = () => {
  const { user, logout, isAuthenticated, isAdmin } = useAuth();
  const { itemCount } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav style={styles.navbar}>
      <div style={styles.logo}>
        <Link to="/" style={styles.logoLink}>☕ CoffeeTime</Link>
      </div>
      
      <div style={styles.navLinks}>
        <Link to="/" style={styles.link}>Главная</Link>
        <Link to="/menu" style={styles.link}>Меню</Link>
        <Link to="/about" style={styles.link}>О нас</Link>
        <Link to="/promotions" style={styles.link}>Акции</Link>
        
        {isAuthenticated && (
          <>
            <Link to="/orders" style={styles.link}>Мои заказы</Link>
            {isAdmin && (
              <Link to="/admin" style={styles.adminLink}>Админ-панель</Link>
            )}
          </>
        )}
      </div>
      
      <div style={styles.userSection}>
        <Link to="/cart" style={styles.cartLink}>
          🛒 Корзина {itemCount > 0 && `(${itemCount})`}
        </Link>
        
        {isAuthenticated ? (
          <div style={styles.userMenu}>
            <span style={styles.userName}>
              👤 {user?.username || 'Пользователь'}
            </span>
            <button onClick={handleLogout} style={styles.logoutBtn}>
              Выйти
            </button>
          </div>
        ) : (
          <div style={styles.authLinks}>
            <Link to="/login" style={styles.authLink}>Вход</Link>
            <span style={styles.divider}>|</span>
            <Link to="/register" style={styles.authLink}>Регистрация</Link>
          </div>
        )}
      </div>
    </nav>
  );
};

const styles = {
  navbar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1rem 2rem',
    backgroundColor: '#A0522D', /* Более светлый коричневый */
    color: 'white',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
  },
  logo: {
    fontSize: '1.8rem',
    fontWeight: 'bold',
  },
  logoLink: {
    color: '#FFE4C4', /* Светлый бежевый */
    textDecoration: 'none',
    ':hover': {
      color: '#FFD700',
    },
  },
  navLinks: {
    display: 'flex',
    gap: '2rem',
  },
  link: {
    color: 'white',
    textDecoration: 'none',
    padding: '0.5rem 0',
    fontSize: '1.1rem',
    borderBottom: '2px solid transparent',
    ':hover': {
      borderBottom: '2px solid #FFD700',
    },
  },
  adminLink: {
    color: '#FFD700',
    textDecoration: 'none',
    fontWeight: 'bold',
  },
  userSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '1.5rem',
  },
  cartLink: {
    color: 'white',
    textDecoration: 'none',
    backgroundColor: '#8B4513',
    padding: '0.5rem 1rem',
    borderRadius: '20px',
    fontSize: '1rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    ':hover': {
      backgroundColor: '#A0522D',
    },
  },
  userMenu: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
  },
  userName: {
    fontSize: '1rem',
    color: '#FFE4C4',
  },
  logoutBtn: {
    backgroundColor: 'transparent',
    color: 'white',
    border: '1px solid white',
    padding: '0.5rem 1rem',
    borderRadius: '4px',
    fontSize: '0.9rem',
    cursor: 'pointer',
    ':hover': {
      backgroundColor: 'rgba(255,255,255,0.1)',
    },
  },
  authLinks: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
  },
  authLink: {
    color: 'white',
    textDecoration: 'none',
    fontSize: '1rem',
    ':hover': {
      color: '#FFD700',
    },
  },
  divider: {
    color: 'rgba(255,255,255,0.5)',
  },
};

export default Navbar;