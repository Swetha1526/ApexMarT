import React, { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  PackageCheck,
  MapPin,
  CreditCard,
  CheckCircle,
  Clock,
  Truck,
  ShieldCheck,
  User,
  ArrowLeft,
} from 'lucide-react';
import Message from '../components/Message';
import Loader from '../components/Loader';
import {
  getOrderDetails,
  payOrder,
  deliverOrder,
} from '../actions/orderActions';
import {
  ORDER_PAY_RESET,
  ORDER_DELIVER_RESET,
} from '../constants/orderConstants';

const OrderScreen = () => {
  const { id } = useParams();
  const dispatch = useDispatch();

  const orderDetails = useSelector((state) => state.orderDetails);
  const { order, loading, error } = orderDetails;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const orderPay = useSelector((state) => state.orderPay);
  const { loading: loadingPay, success: successPay } = orderPay;

  const orderDeliver = useSelector((state) => state.orderDeliver);
  const { loading: loadingDeliver, success: successDeliver } = orderDeliver;

  useEffect(() => {
    if (!order || successPay || successDeliver || order.id !== Number(id)) {
      dispatch({ type: ORDER_PAY_RESET });
      dispatch({ type: ORDER_DELIVER_RESET });
      dispatch(getOrderDetails(id));
    }
  }, [dispatch, id, successPay, successDeliver, order]);

  const paymentHandler = () => {
    dispatch(payOrder(id));
  };

  const deliverHandler = () => {
    dispatch(deliverOrder(id));
  };

  return loading ? (
    <div className="container" style={{ paddingTop: '40px' }}>
      <Loader text="Retrieving order details..." />
    </div>
  ) : error ? (
    <div className="container" style={{ paddingTop: '40px' }}>
      <Message variant="danger">{error}</Message>
      <Link to="/profile" className="btn btn-secondary btn-sm" style={{ marginTop: '16px' }}>
        <ArrowLeft size={16} />
        <span>Return to My Orders</span>
      </Link>
    </div>
  ) : (
    <div className="container" style={{ paddingTop: '24px' }}>
      <div className="page-header">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Link to="/profile" className="btn btn-secondary btn-sm">
              <ArrowLeft size={14} />
            </Link>
            <h1 className="page-title">Order #{order.id}</h1>
          </div>
          <p className="page-subtitle">
            Placed on{' '}
            {new Date(order.created_at).toLocaleDateString('en-IN', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })}
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
        {/* Left Column: Delivery & Items Details */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Customer & Shipping Details */}
          <div className="card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <User size={20} color="var(--primary)" />
              <h2 style={{ fontSize: '1.15rem', fontWeight: 700 }}>Customer & Delivery Info</h2>
            </div>

            <div style={{ fontSize: '0.95rem', lineHeight: '1.6', marginBottom: '14px' }}>
              <div><strong>Name:</strong> {order.user ? order.user.name : 'Customer'}</div>
              <div><strong>Email:</strong> {order.user ? order.user.email : 'N/A'}</div>
              {order.shippingAddress && (
                <div>
                  <strong>Address:</strong> {order.shippingAddress.address}, {order.shippingAddress.city},{' '}
                  {order.shippingAddress.postal_code}, {order.shippingAddress.country}
                </div>
              )}
            </div>

            {/* Delivery Status Alert */}
            {order.is_delivered ? (
              <Message variant="success">
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Truck size={18} />
                  <span>
                    <strong>Delivered</strong> on{' '}
                    {new Date(order.delivered_at || order.created_at).toLocaleString('en-IN')}
                  </span>
                </div>
              </Message>
            ) : (
              <Message variant="warning">
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Clock size={18} />
                  <span>
                    <strong>Delivery Status:</strong> In Transit / Preparing for Dispatch
                  </span>
                </div>
              </Message>
            )}
          </div>

          {/* Payment Method & Status */}
          <div className="card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <CreditCard size={20} color="var(--primary)" />
              <h2 style={{ fontSize: '1.15rem', fontWeight: 700 }}>Payment Details</h2>
            </div>

            <p style={{ fontSize: '0.95rem', marginBottom: '14px' }}>
              <strong>Payment Method:</strong> {order.payment_method}
            </p>

            {/* Payment Status Alert */}
            {order.is_paid ? (
              <Message variant="success">
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <CheckCircle size={18} />
                  <span>
                    <strong>Payment Completed</strong> on{' '}
                    {new Date(order.paid_at || order.created_at).toLocaleString('en-IN')}
                  </span>
                </div>
              </Message>
            ) : (
              <Message variant="danger">
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Clock size={18} />
                  <span>
                    <strong>Payment Pending:</strong> Please complete payment below
                  </span>
                </div>
              </Message>
            )}
          </div>

          {/* Ordered Products */}
          <div className="card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <PackageCheck size={20} color="var(--primary)" />
              <h2 style={{ fontSize: '1.15rem', fontWeight: 700 }}>
                Purchased Items ({order.orderItems?.length || 0})
              </h2>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {order.orderItems &&
                order.orderItems.map((item, index) => (
                  <div
                    key={index}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '16px',
                      padding: '10px 0',
                      borderBottom:
                        index !== order.orderItems.length - 1
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
                        to={item.product ? `/product/${item.product}` : '#'}
                        style={{ fontWeight: 600, fontSize: '0.95rem', color: 'var(--text-main)' }}
                      >
                        {item.name}
                      </Link>
                      <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                        {item.quantity} x ₹{Number(item.price).toLocaleString('en-IN')} ={' '}
                        <strong>₹{(item.quantity * item.price).toLocaleString('en-IN')}</strong>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>

        {/* Right Column: Order Summary & Actions */}
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
            Invoice Summary
          </h2>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', fontSize: '0.95rem' }}>
            <span style={{ color: 'var(--text-muted)' }}>Items Subtotal:</span>
            <span>
              ₹{(
                Number(order.total_price) -
                Number(order.shipping_price) -
                Number(order.tax_price)
              ).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', fontSize: '0.95rem' }}>
            <span style={{ color: 'var(--text-muted)' }}>Shipping Fee:</span>
            <span>
              {Number(order.shipping_price) === 0 ? (
                <strong style={{ color: 'var(--success)' }}>FREE</strong>
              ) : (
                `₹${Number(order.shipping_price).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`
              )}
            </span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', fontSize: '0.95rem' }}>
            <span style={{ color: 'var(--text-muted)' }}>GST Tax (18%):</span>
            <span>₹{Number(order.tax_price).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
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
            <span>Grand Total:</span>
            <span style={{ color: 'var(--primary)' }}>
              ₹{Number(order.total_price).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </span>
          </div>

          {/* Action: Pay Order (if unpaid) */}
          {!order.is_paid && (
            <div style={{ marginTop: '24px' }}>
              {loadingPay && <Loader text="Processing simulated payment..." />}
              <button
                type="button"
                className="btn btn-primary btn-lg btn-block"
                onClick={paymentHandler}
                disabled={loadingPay}
              >
                <CreditCard size={18} />
                <span>Simulate Instant Payment (₹{Number(order.total_price).toLocaleString('en-IN')})</span>
              </button>
            </div>
          )}

          {/* Action: Mark as Delivered (if Admin) */}
          {userInfo && userInfo.isAdmin && !order.is_delivered && (
            <div style={{ marginTop: '20px' }}>
              {loadingDeliver && <Loader text="Updating delivery status..." />}
              <button
                type="button"
                className="btn btn-success btn-block"
                onClick={deliverHandler}
                disabled={loadingDeliver}
              >
                <Truck size={18} />
                <span>Mark Order As Delivered</span>
              </button>
            </div>
          )}

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              justifyContent: 'center',
              marginTop: '20px',
              fontSize: '0.825rem',
              color: 'var(--text-muted)',
            }}
          >
            <ShieldCheck size={16} color="var(--success)" />
            <span>Official E-Commerce Order Invoice</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderScreen;
