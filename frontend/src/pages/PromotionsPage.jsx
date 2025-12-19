// pages/PromotionsPage.jsx
import React from 'react';

const PromotionsPage = () => {
  const promotions = [
    { title: 'Скидка 20% на первый заказ', description: 'Для новых клиентов' },
    { title: 'Кофе + десерт = 350 руб.', description: 'Комбо предложение' },
    { title: 'Бесплатная доставка', description: 'При заказе от 1000 руб.' },
  ];

  return (
    <div style={{
      padding: '2rem',
      maxWidth: '1200px',
      margin: '0 auto'
    }}>
      <h1 style={{ color: '#8B4513', marginBottom: '2rem' }}>Акции и спецпредложения</h1>
      
      <div style={{
        display: 'grid',
        gap: '1.5rem',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))'
      }}>
        {promotions.map((promo, index) => (
          <div key={index} style={{
            border: '1px solid #ddd',
            borderRadius: '8px',
            padding: '1.5rem',
            backgroundColor: '#f9f3e9'
          }}>
            <h3 style={{ color: '#8B4513', marginBottom: '0.5rem' }}>
              {promo.title}
            </h3>
            <p>{promo.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PromotionsPage;