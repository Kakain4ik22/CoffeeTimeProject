// components/ProductCard.jsx
import React from 'react';
import { useCart } from '../context/CartContext';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();

  return (
    <div style={styles.card}>
      <div style={styles.imageContainer}>
        {product.image ? (
          <img 
            src={`http://localhost:8000${product.image}`} 
            alt={product.name}
            style={styles.image}
          />
        ) : (
          <div style={styles.placeholder}>☕</div>
        )}
      </div>
      
      <div style={styles.content}>
        <h3 style={styles.name}>{product.name}</h3>
        <p style={styles.description}>{product.description}</p>
        <div style={styles.footer}>
          <span style={styles.price}>{product.price} руб.</span>
          <button 
            onClick={() => addToCart(product)}
            style={styles.addButton}
          >
            Добавить
          </button>
        </div>
      </div>
    </div>
  );
};

const styles = {
  card: {
    border: '1px solid #ddd',
    borderRadius: '8px',
    overflow: 'hidden',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    backgroundColor: 'white',
    transition: 'transform 0.2s',
    ':hover': {
      transform: 'translateY(-2px)',
    },
  },
  imageContainer: {
    height: '200px',
    backgroundColor: '#f5f5f5',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  placeholder: {
    fontSize: '3rem',
    color: '#8B4513',
  },
  content: {
    padding: '1rem',
  },
  name: {
    margin: '0 0 0.5rem 0',
    fontSize: '1.2rem',
    color: '#333',
  },
  description: {
    margin: '0 0 1rem 0',
    fontSize: '0.9rem',
    color: '#666',
    height: '60px',
    overflow: 'hidden',
  },
  footer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  price: {
    fontSize: '1.2rem',
    fontWeight: 'bold',
    color: '#8B4513',
  },
  addButton: {
    backgroundColor: '#8B4513',
    color: 'white',
    border: 'none',
    padding: '0.5rem 1rem',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '0.9rem',
  },
};

export default ProductCard;