import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Trash2, ShoppingBag, ArrowRight, ArrowLeft, ShieldCheck } from 'lucide-react';
import Message from '../components/Message';
import { addToCart, removeFromCart } from '../actions/cartActions';

const CartScreen = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const cart = useSelector((state) => state.cart);
  const { cartItems } = cart;

  const removeFromCartHandler = (id) => {
    dispatch(removeFromCart(id));
  };

  const checkoutHandler = () => {
    navigate('/login?redirect=/shipping');
  };

  const totalItems = cartItems.reduce((acc, item) => acc + item.qty, 0);
  const subtotalPrice = cartItems.reduce((acc, item) => acc + item.qty * item.price, 0);
  const formattedSubtotal = Number(subtotalPrice).toLocaleString('en-IN', {
    maximumFractionDigits: 2,
  });

  return (
    <div className="container" style={{ paddingTop: '24px' }}>
      <div className="page-header">
        <div>
          <h1 className="page-title">Shopping Cart</h1>
          <p className="page-subtitle">
            {totalItems} item{totalItems !== 1 ? 's' : ''} in your bag
          </p>
        </div>
        <Link to="/products" className="btn btn-secondary btn-sm">
          <ArrowLeft size={16} />
          <span>Continue Shopping</span>
        </Link>
      </div>

      {cartItems.length === 0 ? (
        <div
          className="card"
          style={{
            textAlign: 'center',
            padding: '60px 20px',
            borderRadius: 'var(--radius-xl)',
          }}
        >
          <div
            style={{
              width: '72px',
              height: '72px',
              borderRadius: '50%',
              background: 'var(--primary-light)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px',
              color: 'var(--primary)',
            }}
          >
            <ShoppingBag size={36} />
          </div>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '8px' }}>Your Cart is Empty</h2>
          <p style={{ color: 'var(--text-muted)', maxWidth: '400px', margin: '0 auto 24px' }}>
            Looks like you haven't added any items to your shopping cart yet. Discover our top collection and find what you love!
          </p>
          <Link to="/products" className="btn btn-primary btn-lg">
            Start Shopping Now
          </Link>
        </div>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '32px',
            alignItems: 'start',
          }}
        >
          {/* Cart Items List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {cartItems.map((item) => (
              <div
                key={item.product}
                className="card"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '20px',
                  padding: '16px 20px',
                  flexWrap: 'wrap',
                }}
              >
                <img
                  src={item.image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200&auto=format&fit=crop&q=80'}
                  alt={item.name}
                  style={{
                    width: '80px',
                    height: '80px',
                    objectFit: 'cover',
                    borderRadius: 'var(--radius-md)',
                  }}
                />

                <div style={{ flex: 1, minWidth: '180px' }}>
                  <Link
                    to={`/product/${item.product}`}
                    style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text-main)' }}
                  >
                    {item.name}
                  </Link>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '4px' }}>
                    Unit Price: ₹{Number(item.price).toLocaleString('en-IN')}
                  </div>
                </div>

                {/* Quantity select */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <select
                    className="form-select"
                    style={{ width: '80px', padding: '6px 10px' }}
                    value={item.qty}
                    onChange={(e) =>
                      dispatch(addToCart(item.product, Number(e.target.value)))
                    }
                  >
                    {[...Array(Math.min(item.countInStock || 10, 10)).keys()].map((x) => (
                      <option key={x + 1} value={x + 1}>
                        {x + 1}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Item total */}
                <div style={{ fontWeight: 800, fontSize: '1.1rem', minWidth: '100px', textAlign: 'right' }}>
                  ₹{(item.qty * item.price).toLocaleString('en-IN')}
                </div>

                {/* Remove button */}
                <button
                  onClick={() => removeFromCartHandler(item.product)}
                  className="btn btn-secondary btn-sm"
                  style={{ color: 'var(--danger)', borderColor: 'var(--danger-border)' }}
                  title="Remove Item"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>

          {/* Cart Summary Card */}
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
              Order Summary
            </h2>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', fontSize: '0.95rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>Items Subtotal ({totalItems} items):</span>
              <strong>₹{formattedSubtotal}</strong>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', fontSize: '0.95rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>Estimated Shipping:</span>
              <span style={{ color: subtotalPrice > 1000 ? 'var(--success)' : 'var(--text-main)', fontWeight: 600 }}>
                {subtotalPrice > 1000 ? 'FREE' : '₹150.00'}
              </span>
            </div>

            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                paddingTop: '16px',
                marginTop: '16px',
                borderTop: '2px dashed var(--border-color)',
                fontSize: '1.25rem',
                fontWeight: 800,
              }}
            >
              <span>Subtotal:</span>
              <span style={{ color: 'var(--primary)' }}>₹{formattedSubtotal}</span>
            </div>

            <button
              onClick={checkoutHandler}
              className="btn btn-primary btn-lg btn-block"
              style={{ marginTop: '24px', gap: '8px' }}
            >
              <span>Proceed to Checkout</span>
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
              <span>Safe & Secure 256-bit Encrypted Checkout</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartScreen;
