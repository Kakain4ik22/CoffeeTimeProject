// pages/AboutPage.jsx
import React from 'react';

const AboutPage = () => {
  return (
    <div style={{
      padding: '2rem',
      maxWidth: '1200px',
      margin: '0 auto',
      lineHeight: '1.6'
    }}>
      <h1 style={{ color: '#8B4513', marginBottom: '1rem' }}>О CoffeeTime</h1>
      <p>
        Добро пожаловать в CoffeeTime — уютную кофейню, где каждый гость 
        найдет напиток по душе. Мы работаем с 2015 года и гордимся тем, 
        что создаем атмосферу тепла и уюта.
      </p>
      
      <h2 style={{ color: '#8B4513', marginTop: '2rem' }}>Наша миссия</h2>
      <p>
        Сделать каждый день наших гостей немного лучше с помощью 
        вкусного кофе и дружеской атмосферы.
      </p>
      
      <h2 style={{ color: '#8B4513', marginTop: '2rem' }}>Часы работы</h2>
      <ul>
        <li>Пн-Пт: 8:00 - 22:00</li>
        <li>Сб-Вс: 9:00 - 23:00</li>
      </ul>
    </div>
  );
};

export default AboutPage;