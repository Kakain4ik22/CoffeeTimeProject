import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { orderService } from '../services/api';

const CartPage = () => {
  const { cartItems, removeFromCart, updateQuantity, totalPrice, clearCart } = useCart();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = React.useState(false);
  const [address, setAddress] = React.useState('');
  const [phone, setPhone] = React.useState(user?.phone || '');

const handleCreateOrder = async () => {
  if (!isAuthenticated) {
    alert('Для оформления заказа необходимо войти в систему');
    navigate('/login');
    return;
  }

  if (cartItems.length === 0) {
    alert('Корзина пуста');
    return;
  }

  setLoading(true);
  try {
    // Подготавливаем данные
    const orderData = {
      total_price: totalPrice,
      address: address || 'Самовывоз',
      phone: phone || 'Не указан',
      comment: '', // Можно добавить textarea для комментария
    };

    console.log('Creating order with data:', orderData);
    
    // Отправляем заказ
    const newOrder = await orderService.create(orderData);
    console.log('Order created successfully:', newOrder);
    
    // Показываем успешное сообщение
    alert(`✅ Заказ #${newOrder.id} успешно оформлен!`);
    
    // Очищаем корзину
    clearCart();
    
    // Переходим на страницу заказов
    navigate('/orders');
    
  } catch (error) {
    console.error('Order creation error:', error);
    alert(`❌ Ошибка при оформлении заказа: ${error.message || 'Неизвестная ошибка'}`);
  } finally {
    setLoading(false);
  }
};

  const handleIncrease = (itemId) => {
    const item = cartItems.find(item => item.id === itemId);
    if (item) {
      updateQuantity(itemId, item.quantity + 1);
    }
  };

  const handleDecrease = (itemId) => {
    const item = cartItems.find(item => item.id === itemId);
    if (item && item.quantity > 1) {
      updateQuantity(itemId, item.quantity - 1);
    } else {
      removeFromCart(itemId);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div style={styles.container}>
        <h1 style={styles.title}>Корзина</h1>
        <div style={styles.emptyCart}>
          <div style={styles.emptyIcon}>🛒</div>
          <p style={styles.emptyText}>Ваша корзина пуста</p>
          <button 
            onClick={() => navigate('/menu')}
            style={styles.continueButton}
          >
            Перейти к меню
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Корзина</h1>
      
      <div style={styles.cartContent}>
        {/* Список товаров */}
        <div style={styles.itemsList}>
          {cartItems.map(item => (
            <div key={item.id} style={styles.cartItem}>
              <div style={styles.itemInfo}>
                <h3 style={styles.itemName}>{item.name}</h3>
                <p style={styles.itemDescription}>{item.description}</p>
                <div style={styles.itemPrice}>
                  {item.price} руб. × {item.quantity} = {item.price * item.quantity} руб.
                </div>
              </div>
              
              <div style={styles.itemActions}>
                <div style={styles.quantityControl}>
                  <button 
                    onClick={() => handleDecrease(item.id)}
                    style={styles.quantityButton}
                  >
                    -
                  </button>
                  <span style={styles.quantity}>{item.quantity}</span>
                  <button 
                    onClick={() => handleIncrease(item.id)}
                    style={styles.quantityButton}
                  >
                    +
                  </button>
                </div>
                <button 
                  onClick={() => removeFromCart(item.id)}
                  style={styles.removeButton}
                >
                  Удалить
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Форма оформления заказа */}
        <div style={styles.orderForm}>
          <h2 style={styles.formTitle}>Оформление заказа</h2>
          
          {!isAuthenticated ? (
            <div style={styles.authWarning}>
              <p>Для оформления заказа необходимо войти в систему</p>
              <button 
                onClick={() => navigate('/login')}
                style={styles.authButton}
              >
                Войти
              </button>
            </div>
          ) : (
            <>
              <div style={styles.formGroup}>
                <label style={styles.label}>Адрес доставки *</label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  style={styles.input}
                  placeholder="ул. Примерная, д. 1, кв. 1"
                  required
                />
              </div>
              
              <div style={styles.formGroup}>
                <label style={styles.label}>Телефон для связи *</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  style={styles.input}
                  placeholder="+7 (999) 999-99-99"
                  required
                />
              </div>
              
              <div style={styles.formGroup}>
                <label style={styles.label}>Комментарий к заказу</label>
                <textarea
                  style={styles.textarea}
                  placeholder="Дополнительные пожелания..."
                  rows="3"
                />
              </div>
              
              <div style={styles.summary}>
                <div style={styles.summaryRow}>
                  <span>Товаров:</span>
                  <span>{cartItems.reduce((sum, item) => sum + item.quantity, 0)} шт.</span>
                </div>
                <div style={styles.summaryRow}>
                  <span>Общая стоимость:</span>
                  <span style={styles.totalPrice}>{totalPrice} руб.</span>
                </div>
              </div>
              
              <button 
                onClick={handleCreateOrder}
                disabled={loading || !address.trim() || !phone.trim()}
                style={styles.orderButton}
              >
                {loading ? 'Оформление...' : 'Оформить заказ'}
              </button>
              
              <button 
                onClick={clearCart}
                style={styles.clearButton}
              >
                Очистить корзину
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '2rem 1rem',
  },
  title: {
    fontSize: '2.5rem',
    color: '#8B4513',
    marginBottom: '2rem',
    textAlign: 'center',
  },
  emptyCart: {
    textAlign: 'center',
    padding: '4rem 2rem',
    backgroundColor: '#f9f3e9',
    borderRadius: '12px',
  },
  emptyIcon: {
    fontSize: '4rem',
    marginBottom: '1rem',
  },
  emptyText: {
    fontSize: '1.2rem',
    color: '#666',
    marginBottom: '2rem',
  },
  continueButton: {
    backgroundColor: '#8B4513',
    color: 'white',
    padding: '0.75rem 2rem',
    border: 'none',
    borderRadius: '8px',
    fontSize: '1rem',
    cursor: 'pointer',
  },
  cartContent: {
    display: 'grid',
    gridTemplateColumns: '1fr 400px',
    gap: '3rem',
    '@media (max-width: 900px)': {
      gridTemplateColumns: '1fr',
    },
  },
  itemsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  cartItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1.5rem',
    backgroundColor: 'white',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    borderLeft: '4px solid #8B4513',
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: '1.2rem',
    color: '#333',
    marginBottom: '0.5rem',
  },
  itemDescription: {
    fontSize: '0.9rem',
    color: '#666',
    marginBottom: '0.5rem',
  },
  itemPrice: {
    fontSize: '1.1rem',
    color: '#8B4513',
    fontWeight: 'bold',
  },
  itemActions: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '0.5rem',
  },
  quantityControl: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  },
  quantityButton: {
    width: '30px',
    height: '30px',
    borderRadius: '50%',
    border: '1px solid #ddd',
    backgroundColor: 'white',
    cursor: 'pointer',
    fontSize: '1rem',
  },
  quantity: {
    minWidth: '30px',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  removeButton: {
    backgroundColor: '#ff4444',
    color: 'white',
    border: 'none',
    padding: '0.5rem 1rem',
    borderRadius: '4px',
    fontSize: '0.9rem',
    cursor: 'pointer',
  },
  orderForm: {
    backgroundColor: 'white',
    padding: '2rem',
    borderRadius: '12px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    height: 'fit-content',
  },
  formTitle: {
    fontSize: '1.5rem',
    color: '#333',
    marginBottom: '1.5rem',
  },
  authWarning: {
    backgroundColor: '#fff3cd',
    border: '1px solid #ffeaa7',
    padding: '1rem',
    borderRadius: '4px',
    textAlign: 'center',
  },
  authButton: {
    backgroundColor: '#8B4513',
    color: 'white',
    border: 'none',
    padding: '0.5rem 1rem',
    borderRadius: '4px',
    marginTop: '1rem',
    cursor: 'pointer',
  },
  formGroup: {
    marginBottom: '1.5rem',
  },
  label: {
    display: 'block',
    marginBottom: '0.5rem',
    fontWeight: 'bold',
    color: '#555',
  },
  input: {
    width: '100%',
    padding: '0.75rem',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '1rem',
  },
  textarea: {
    width: '100%',
    padding: '0.75rem',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '1rem',
    fontFamily: 'inherit',
  },
  summary: {
    backgroundColor: '#f9f3e9',
    padding: '1rem',
    borderRadius: '8px',
    marginBottom: '1.5rem',
  },
  summaryRow: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '0.5rem',
    fontSize: '1.1rem',
  },
  totalPrice: {
    fontSize: '1.3rem',
    fontWeight: 'bold',
    color: '#8B4513',
  },
  orderButton: {
    width: '100%',
    backgroundColor: '#8B4513',
    color: 'white',
    border: 'none',
    padding: '1rem',
    borderRadius: '8px',
    fontSize: '1.1rem',
    fontWeight: 'bold',
    cursor: 'pointer',
    marginBottom: '1rem',
    ':disabled': {
      backgroundColor: '#ccc',
      cursor: 'not-allowed',
    },
  },
  clearButton: {
    width: '100%',
    backgroundColor: 'transparent',
    color: '#666',
    border: '1px solid #ddd',
    padding: '0.75rem',
    borderRadius: '8px',
    fontSize: '1rem',
    cursor: 'pointer',
  },
};

export default CartPage;