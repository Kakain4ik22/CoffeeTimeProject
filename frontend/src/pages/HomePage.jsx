// pages/HomePage.jsx - с исправленными цветами
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { productService } from '../services/api';

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const data = await productService.getAll();
      setProducts(data.slice(0, 6));
    } catch (error) {
      console.error('Ошибка загрузки товаров:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      {/* Герой-секция */}
      <section style={styles.hero}>
        <div style={styles.heroContent}>
          <h1 style={styles.heroTitle}>Добро пожаловать в CoffeeTime</h1>
          <p style={styles.heroSubtitle}>Уютная кофейня рядом с вами</p>
          <Link to="/menu" style={styles.heroButton}>
            Посмотреть меню
          </Link>
        </div>
      </section>

      {/* Популярные напитки */}
      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>Популярные напитки</h2>
        
        {loading ? (
          <div style={styles.loading}>Загрузка напитков...</div>
        ) : (
          <>
            <div style={styles.productsGrid}>
              {products.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
            <div style={styles.seeAll}>
              <Link to="/menu" style={styles.seeAllLink}>
                Посмотреть всё меню →
              </Link>
            </div>
          </>
        )}
      </section>

      {/* Преимущества */}
      <section style={styles.features}>
        <div style={styles.feature}>
          <div style={styles.featureIcon}>☕</div>
          <h3 style={styles.featureTitle}>Свежий кофе</h3>
          <p style={styles.featureText}>Каждый день мы готовим свежий кофе из отборных зерен</p>
        </div>
        <div style={styles.feature}>
          <div style={styles.featureIcon}>🏠</div>
          <h3 style={styles.featureTitle}>Уютная атмосфера</h3>
          <p style={styles.featureText}>Идеальное место для работы, встреч и отдыха</p>
        </div>
        <div style={styles.feature}>
          <div style={styles.featureIcon}>🚚</div>
          <h3 style={styles.featureTitle}>Быстрая доставка</h3>
          <p style={styles.featureText}>Доставка заказов в течение 30 минут</p>
        </div>
      </section>

      {/* Отзывы (заглушка) */}
      <section style={styles.testimonials}>
        <h2 style={styles.sectionTitle}>Что говорят наши гости</h2>
        <div style={styles.testimonial}>
          <p style={styles.testimonialText}>
            "Лучший кофе в городе! Атмосфера просто волшебная."
          </p>
          <p style={styles.testimonialAuthor}>— Анна</p>
        </div>
      </section>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 1rem',
  },
  hero: {
    background: 'linear-gradient(135deg, #8B4513 0%, #A0522D 100%)',
    borderRadius: '12px',
    padding: '4rem 2rem',
    margin: '2rem 0',
    textAlign: 'center',
    color: 'white',
  },
  heroContent: {
    maxWidth: '800px',
    margin: '0 auto',
  },
  heroTitle: {
    fontSize: '3rem',
    marginBottom: '1rem',
    textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
  },
  heroSubtitle: {
    fontSize: '1.5rem',
    marginBottom: '2rem',
    opacity: '0.9',
  },
  heroButton: {
    display: 'inline-block',
    backgroundColor: '#FFD700',
    color: '#8B4513',
    padding: '1rem 2rem',
    borderRadius: '50px',
    textDecoration: 'none',
    fontSize: '1.1rem',
    fontWeight: 'bold',
    transition: 'all 0.3s ease',
    ':hover': {
      backgroundColor: '#FFE4C4',
      transform: 'translateY(-2px)',
    },
  },
  section: {
    margin: '4rem 0',
  },
  sectionTitle: {
    fontSize: '2.5rem',
    color: '#8B4513',
    marginBottom: '2rem',
    textAlign: 'center',
  },
  productsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '2rem',
    marginBottom: '2rem',
  },
  loading: {
    textAlign: 'center',
    padding: '3rem',
    fontSize: '1.2rem',
    color: '#666',
  },
  seeAll: {
    textAlign: 'center',
    marginTop: '2rem',
  },
  seeAllLink: {
    color: '#8B4513',
    fontSize: '1.1rem',
    fontWeight: 'bold',
    textDecoration: 'none',
    ':hover': {
      textDecoration: 'underline',
    },
  },
  features: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '2rem',
    margin: '4rem 0',
  },
  feature: {
    backgroundColor: 'white',
    padding: '2rem',
    borderRadius: '12px',
    textAlign: 'center',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    transition: 'transform 0.3s ease',
    ':hover': {
      transform: 'translateY(-5px)',
    },
  },
  featureIcon: {
    fontSize: '3rem',
    marginBottom: '1rem',
  },
  featureTitle: {
    fontSize: '1.5rem',
    color: '#8B4513',
    marginBottom: '1rem',
  },
  featureText: {
    color: '#666',
    lineHeight: '1.6',
  },
  testimonials: {
    backgroundColor: '#f5f0e6',
    padding: '3rem',
    borderRadius: '12px',
    margin: '4rem 0',
    textAlign: 'center',
  },
  testimonial: {
    maxWidth: '600px',
    margin: '0 auto',
  },
  testimonialText: {
    fontSize: '1.2rem',
    fontStyle: 'italic',
    color: '#555',
    marginBottom: '1rem',
    lineHeight: '1.6',
  },
  testimonialAuthor: {
    color: '#8B4513',
    fontWeight: 'bold',
  },
};

export default HomePage;