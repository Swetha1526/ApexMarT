import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  MapPin,
  CreditCard,
  PackageCheck,
  ArrowRight,
  ShieldCheck,
  CheckCircle,
} from 'lucide-react';
import CheckoutSteps from '../components/CheckoutSteps';
import Message from '../components/Message';
import Loader from '../components/Loader';
import { createOrder } from '../actions/orderActions';
import { ORDER_CREATE_RESET } from '../constants/orderConstants';

const PlaceOrderScreen = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const cart = useSelector((state) => state.cart);
  const { cartItems, shippingAddress, paymentMethod } = cart;

  // Calculate prices
  const itemsPrice = cartItems.reduce(
    (acc, item) => acc + item.price * item.qty,
    0
  );
  const shippingPrice = itemsPrice > 1000 ? 0 : 150;
  const taxPrice = Number((0.18 * itemsPrice).toFixed(2));
  const totalPrice = Number((itemsPrice + shippingPrice + taxPrice).toFixed(2));

  const orderCreate = useSelector((state) => state.orderCreate);
  const { order, success, error, loading } = orderCreate;

  useEffect(() => {
    if (!shippingAddress.address) {
      navigate('/shipping');
    }
  }, [shippingAddress, navigate]);

  useEffect(() => {
    if (success && order) {
      navigate(`/order/${order.id}`);
      dispatch({ type: ORDER_CREATE_RESET });
    }
  }, [navigate, success, order, dispatch]);

  const placeOrderHandler = () => {
    dispatch(
      createOrder({
        orderItems: cartItems,
        shippingAddress: shippingAddress,
        paymentMethod: paymentMethod || 'Credit Card / UPI (Simulated)',
        itemsPrice: itemsPrice,
        shippingPrice: shippingPrice,
        taxPrice: taxPrice,
        totalPrice: totalPrice,
        isPaid: true, // Simulated instant payment completion
      })
    );
  };

  return (
    <div className="container" style={{ paddingTop: '20px' }}>
      <CheckoutSteps step1 step2 step3 />

      <div className="page-header">
        <div>
          <h1 className="page-title">Review & Place Your Order</h1>
          <p className="page-subtitle">
            Please verify your delivery address and items before placing your order
          </p>
        </div>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '32px',
          alignItems: 'start',
        }}
      >
        {/* Left Column: Details */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Shipping Address */}
          <div className="card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
              <MapPin size={20} color="var(--primary)" />
              <h2 style={{ fontSize: '1.15rem', fontWeight: 700 }}>Shipping Destination</h2>
            </div>
            <p style={{ fontSize: '0.95rem', color: 'var(--text-main)', lineHeight: '1.6' }}>
              <strong>Address:</strong> {shippingAddress.address}, {shippingAddress.city},{' '}
              {shippingAddress.postalCode}, {shippingAddress.country}
            </p>
          </div>

          {/* Payment Method */}
          <div className="card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
              <CreditCard size={20} color="var(--primary)" />
              <h2 style={{ fontSize: '1.15rem', fontWeight: 700 }}>Payment Method</h2>
            </div>
            <p style={{ fontSize: '0.95rem', color: 'var(--text-main)' }}>
              <strong>Method:</strong> {paymentMethod || 'Credit Card / Net Banking (Simulated Instant Payment)'}
            </p>
          </div>

          {/* Order Items */}
          <div className="card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <PackageCheck size={20} color="var(--primary)" />
              <h2 style={{ fontSize: '1.15rem', fontWeight: 700 }}>Ordered Items ({cartItems.length})</h2>
            </div>

            {cartItems.length === 0 ? (
              <Message variant="info">Your cart is empty</Message>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {cartItems.map((item, index) => (
                  <div
                    key={index}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '16px',
                      padding: '10px 0',
                      borderBottom:
                        index !== cartItems.length - 1
                          ? '1px solid var(--border-color)'
                          : 'none',
                    }}
                  >
                    <img
                      src={item.image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100&auto=format&fit=crop&q=80'}
                      alt={item.name}
                      style={{
                        width: '56px',
                        height: '56px',
                        objectFit: 'cover',
                        borderRadius: 'var(--radius-sm)',
                      }}
                    />
                    <div style={{ flex: 1 }}>
                      <Link
                        to={`/product/${item.product}`}
                        style={{ fontWeight: 600, fontSize: '0.95rem', color: 'var(--text-main)' }}
                      >
                        {item.name}
                      </Link>
                      <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                        {item.qty} x ₹{Number(item.price).toLocaleString('en-IN')} ={' '}
                        <strong>₹{(item.qty * item.price).toLocaleString('en-IN')}</strong>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Order Summary */}
        <div
          className="card"
          style={{
            padding: '28px',
            borderRadius: 'var(--radius-xl)',
            background: 'white',
            boxShadow: 'var(--shadow-md)',
          }}
        >
          <h2 style={{ fontSize: '1.35rem', fontWeight: 800, marginBottom: '20px' }}>
            Payment Summary
          </h2>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', fontSize: '0.95rem' }}>
            <span style={{ color: 'var(--text-muted)' }}>Items Subtotal:</span>
            <span>₹{itemsPrice.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', fontSize: '0.95rem' }}>
            <span style={{ color: 'var(--text-muted)' }}>Shipping Cost:</span>
            <span>{shippingPrice === 0 ? <strong style={{ color: 'var(--success)' }}>FREE</strong> : `₹${shippingPrice.toFixed(2)}`}</span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', fontSize: '0.95rem' }}>
            <span style={{ color: 'var(--text-muted)' }}>GST Tax (18%):</span>
            <span>₹{taxPrice.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
          </div>

          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              paddingTop: '16px',
              marginTop: '16px',
              borderTop: '2px dashed var(--border-color)',
              fontSize: '1.35rem',
              fontWeight: 800,
            }}
          >
            <span>Total Payable:</span>
            <span style={{ color: 'var(--primary)' }}>
              ₹{totalPrice.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </span>
          </div>

          {error && <Message variant="danger">{error}</Message>}
          {loading && <Loader text="Submitting order to backend..." />}

          <button
            type="button"
            className="btn btn-primary btn-lg btn-block"
            disabled={cartItems.length === 0 || loading}
            onClick={placeOrderHandler}
            style={{ marginTop: '24px', gap: '8px' }}
          >
            <span>Place Order</span>
            <ArrowRight size={18} />
          </button>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              justifyContent: 'center',
              marginTop: '16px',
              fontSize: '0.825rem',
              color: 'var(--text-muted)',
            }}
          >
            <ShieldCheck size={16} color="var(--success)" />
            <span>Simulated instant transaction with zero fees</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlaceOrderScreen;
