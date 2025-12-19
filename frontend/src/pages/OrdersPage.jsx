import React, { useState, useEffect } from 'react';
import { orderService } from '../services/api';
import { useAuth } from '../context/AuthContext';

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      console.log('Loading orders for user:', user?.username);
      const data = await orderService.getAll();
      console.log('Orders loaded:', data);
      setOrders(data);
    } catch (error) {
      console.error('Error loading orders:', error);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  // Функции formatDate и getStatusLabel остаются те же...
  const getStatusLabel = (status) => {
    const statuses = {
      'new': { label: 'Новый', color: '#3498db' },
      'preparing': { label: 'Готовится', color: '#f39c12' },
      'done': { label: 'Выполнен', color: '#2ecc71' },
      'cancelled': { label: 'Отменен', color: '#e74c3c' },
    };
    return statuses[status] || { label: status, color: '#95a5a6' };
  };

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('ru-RU', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return 'Дата не указана';
    }
  };

 
const handleCancelOrder = async (orderId) => {
  const order = orders.find(o => o.id === orderId);
  if (!order) return;
  
  const statusLabel = getStatusLabel(order.status).label;
  
  if (!window.confirm(`Вы уверены, что хотите отменить заказ #${orderId}?\nТекущий статус: ${statusLabel}`)) {
    return;
  }
  
  try {
    console.log(`Cancelling order ${orderId}...`);
    const result = await orderService.cancelOrder(orderId);
    alert(result.message || 'Заказ отменен');
    
    // Обновляем список заказов
    await fetchOrders();
  } catch (error) {
    console.error('Cancel error:', error);
    const errorMessage = error.response?.data?.error || 'Ошибка при отмене заказа';
    alert(`Не удалось отменить заказ:\n${errorMessage}`);
  }
};

const handleDeleteOrder = async (orderId) => {
  const order = orders.find(o => o.id === orderId);
  if (!order) return;
  
  const statusLabel = getStatusLabel(order.status).label;
  
  if (!window.confirm(`Вы уверены, что хотите удалить заказ #${orderId}?\nСтатус: ${statusLabel}\nЭто действие нельзя отменить.`)) {
    return;
  }
  
  try {
    console.log(`Deleting order ${orderId}...`);
    const result = await orderService.delete(orderId);
    alert(result.message || 'Заказ удален');
    
    // Обновляем список заказов
    await fetchOrders();
  } catch (error) {
    console.error('Delete error:', error);
    const errorMessage = error.response?.data?.error || 'Ошибка при удалении заказа';
    
    // Проверяем, если ошибка связана с правами
    if (errorMessage.includes('Можно удалять только новые заказы')) {
      alert(`Удаление невозможно:\n${errorMessage}\n\nПожалуйста, свяжитесь с администратором для удаления этого заказа.`);
    } else {
      alert(`Не удалось удалить заказ:\n${errorMessage}`);
    }
  }
};

const handleRemoveOrder = async (orderId) => {
  if (!window.confirm('Удалить этот заказ из списка?')) {
    return;
  }
  
  try {
    // Пытаемся удалить через API
    await orderService.delete(orderId);
    
    // Также удаляем из localStorage если есть
    const localOrders = JSON.parse(localStorage.getItem('temp_orders') || '[]');
    const updatedLocalOrders = localOrders.filter(order => order.id !== orderId);
    localStorage.setItem('temp_orders', JSON.stringify(updatedLocalOrders));
    
    alert('Заказ удален');
    await fetchOrders(); // Обновляем список
  } catch (error) {
    console.error('Remove error:', error);
    
    // Если API не работает, удаляем только из localStorage
    const localOrders = JSON.parse(localStorage.getItem('temp_orders') || '[]');
    const updatedLocalOrders = localOrders.filter(order => order.id !== orderId);
    localStorage.setItem('temp_orders', JSON.stringify(updatedLocalOrders));
    
    alert('Заказ удален из локального списка');
    await fetchOrders();
  }
};



  
  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.loading}>Загрузка заказов...</div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Мои заказы</h1>
      
      {orders.length === 0 ? (
        <div style={styles.emptyOrders}>
          <div style={styles.emptyIcon}>📋</div>
          <p style={styles.emptyText}>У вас еще нет заказов</p>
          <p style={styles.emptySubtext}>
            Перейдите в <a href="/menu" style={styles.emptyLink}>меню</a>, чтобы сделать первый заказ
          </p>
        </div>
      ) : (
        <div style={styles.ordersList}>
          {orders.map(order => {
            const status = getStatusLabel(order.status);
            return (
              <div key={order.id} style={styles.orderCard}>
                <div style={styles.orderHeader}>
                  <div style={styles.orderId}>
                    Заказ #{order.id}
                    <span style={styles.orderDate}>
                      от {formatDate(order.created_at)}
                    </span>
                  </div>
                  <div 
                    style={{
                      ...styles.orderStatus,
                      backgroundColor: status.color
                    }}
                  >
                    {status.label}
                  </div>
                </div>
                
                <div style={styles.orderInfo}>
                  
                  {order.address && (
                    <div style={styles.infoRow}>
                      <span style={styles.infoLabel}>Адрес:</span>
                      <span style={styles.infoValue}>{order.address}</span>
                    </div>
                  )}
                  {order.phone && (
                    <div style={styles.infoRow}>
                      <span style={styles.infoLabel}>Телефон:</span>
                      <span style={styles.infoValue}>{order.phone}</span>
                    </div>
                  )}

                  {order.comment && (
                    <div style={styles.infoRow}>
                      <span style={styles.infoLabel}>Комментарий:</span>
                      <span style={styles.infoValue}>{order.comment}</span>
                    </div>
                  )}
                  
                 
                  {order.order_items && order.order_items.length > 0 && (
                    <div style={styles.orderItems}>
                      <div style={styles.itemsTitle}>Товары:</div>
                      {order.order_items.map((item, index) => (
                        <div key={index} style={styles.orderItem}>
                          <span style={styles.itemName}>
                            {item.product?.name || `Товар #${item.product_id}`} × {item.quantity}
                          </span>
                          <span style={styles.itemPrice}>
                            {item.price * item.quantity} руб.
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                
                <div style={styles.orderFooter}>
                  <div style={styles.orderTotal}>
                    Итого: <span style={styles.totalPrice}>{order.total_price} руб.</span>
                  </div>
                  
                  <div style={styles.orderActions}>
                    {/* Кнопка "Отменить" показывается только для новых заказов и тех, что готовятся */}
                    {(order.status === 'new' || order.status === 'preparing') && (
                      <button 
                        onClick={() => handleCancelOrder(order.id)}
                        style={styles.cancelButton}
                      >
                        Отменить заказ
                      </button>
                    )}
                    
                    {(order.status === 'new' || order.status === 'cancelled' || order.status === 'done') && (
                      <button 
                        onClick={() => handleDeleteOrder(order.id)}
                        style={{
                          ...styles.deleteButton,
                          // Меняем стиль для не-новых заказов
                          ...(order.status !== 'new' && {
                            backgroundColor: 'transparent',
                            color: '#95a5a6',
                            border: '1px solid #95a5a6'
                          })
                        }}
                      >
                        {/* Меняем текст в зависимости от статуса */}
                        {order.status === 'new' ? 'Удалить' : 
                        order.status === 'cancelled' ? 'Удалить (отменен)' : 
                        'Удалить (выполнен)'}
                      </button>
                    )}
                    
                    {/* Альтернативная кнопка "Убрать из списка" для завершенных заказов */}
                    {/* Можно убрать если не нужна */}
                    {false && (order.status === 'cancelled' || order.status === 'done') && (
                      <button 
                        onClick={() => handleRemoveOrder(order.id)}
                        style={styles.removeButton}
                      >
                        Убрать из списка
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
      
      {/* Кнопка обновления для отладки */}
      <div style={{ textAlign: 'center', marginTop: '2rem' }}>
        <button 
          onClick={fetchOrders}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: '#8B4513',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Обновить список заказов
        </button>
      </div>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '800px',
    margin: '0 auto',
    padding: '2rem 1rem',
  },
  title: {
    fontSize: '2.5rem',
    color: '#8B4513',
    marginBottom: '2rem',
    textAlign: 'center',
  },
  loading: {
    textAlign: 'center',
    padding: '3rem',
    fontSize: '1.2rem',
    color: '#666',
  },
  emptyOrders: {
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
    fontSize: '1.5rem',
    color: '#666',
    marginBottom: '0.5rem',
  },
  emptySubtext: {
    fontSize: '1rem',
    color: '#888',
  },
  emptyLink: {
    color: '#8B4513',
    textDecoration: 'none',
    fontWeight: 'bold',
  },
  ordersList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
  },
  orderCard: {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '1.5rem',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    border: '1px solid #eee',
  },
  orderHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1.5rem',
    paddingBottom: '1rem',
    borderBottom: '1px solid #eee',
  },
  orderId: {
    fontSize: '1.3rem',
    fontWeight: 'bold',
    color: '#333',
  },
  orderDate: {
    fontSize: '0.9rem',
    color: '#888',
    marginLeft: '1rem',
    fontWeight: 'normal',
  },
  orderStatus: {
    padding: '0.5rem 1rem',
    borderRadius: '20px',
    color: 'white',
    fontSize: '0.9rem',
    fontWeight: 'bold',
  },
  orderItems: {
    marginBottom: '1.5rem',
  },
  itemsTitle: {
    fontSize: '1.1rem',
    color: '#555',
    marginBottom: '1rem',
  },

  infoRow: {
  marginBottom: '0.5rem',
  display: 'flex',
  alignItems: 'flex-start',
  },
  infoLabel: {
    minWidth: '100px',
    color: '#666',
    fontSize: '0.9rem',
  },
  infoValue: {
    flex: 1,
    color: '#333',
    fontSize: '1rem',
  },

  orderItem: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '0.5rem 0',
    borderBottom: '1px solid #f5f5f5',
  },
  itemName: {
    color: '#333',
  },
  itemPrice: {
    color: '#8B4513',
    fontWeight: 'bold',
  },
  orderFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: '1rem',
    borderTop: '1px solid #eee',
  },
  orderTotal: {
    fontSize: '1.2rem',
    color: '#333',
  },
  totalPrice: {
    fontSize: '1.3rem',
    fontWeight: 'bold',
    color: '#8B4513',
  },

  cancelButton: {
    backgroundColor: 'transparent',
    color: '#e74c3c',
    border: '1px solid #e74c3c',
    padding: '0.5rem 1rem',
    borderRadius: '4px',
    cursor: 'pointer',
    ':hover': {
      backgroundColor: '#ffeaea',
    },
  },

  // Добавьте в styles объекта:
orderActions: {
  display: 'flex',
  gap: '0.5rem',
  marginTop: '0.5rem',
},


deleteButton: {
  backgroundColor: 'transparent',
  color: '#e74c3c',
  border: '1px solid #e74c3c',
  padding: '0.4rem 0.8rem',
  borderRadius: '4px',
  fontSize: '0.9rem',
  cursor: 'pointer',
  ':hover': {
    backgroundColor: '#ffeaea',
  },
},

removeButton: {
  backgroundColor: 'transparent',
  color: '#95a5a6',
  border: '1px solid #95a5a6',
  padding: '0.4rem 0.8rem',
  borderRadius: '4px',
  fontSize: '0.9rem',
  cursor: 'pointer',
  ':hover': {
    backgroundColor: '#f8f9fa',
  },
},
};

export default OrdersPage;