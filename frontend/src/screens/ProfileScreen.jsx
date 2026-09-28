import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  User,
  Package,
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  Save,
  MapPin,
  Calendar,
  CreditCard,
} from 'lucide-react';
import Message from '../components/Message';
import Loader from '../components/Loader';
import { getUserDetails, updateUserProfile } from '../actions/userActions';
import { listMyOrders } from '../actions/orderActions';
import { USER_UPDATE_PROFILE_RESET } from '../constants/userConstants';

const ProfileScreen = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [country, setCountry] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [message, setMessage] = useState(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const userDetails = useSelector((state) => state.userDetails);
  const { loading, error, user } = userDetails;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const userUpdateProfile = useSelector((state) => state.userUpdateProfile);
  const { success: successUpdate, error: errorUpdate } = userUpdateProfile;

  const orderListMy = useSelector((state) => state.orderListMy);
  const { loading: loadingOrders, error: errorOrders, orders } = orderListMy;

  useEffect(() => {
    if (!userInfo) {
      navigate('/login');
    } else {
      if (!user || !user.name || successUpdate) {
        dispatch({ type: USER_UPDATE_PROFILE_RESET });
        dispatch(getUserDetails('profile'));
        dispatch(listMyOrders());
      } else {
        setName(user.name || '');
        setEmail(user.email || '');
        setAddress(user.address || '');
        setCity(user.city || '');
        setPostalCode(user.postal_code || '');
        setCountry(user.country || '');
        setPhoneNumber(user.phone_number || '');
      }
    }
  }, [dispatch, navigate, userInfo, user, successUpdate]);

  const submitHandler = (e) => {
    e.preventDefault();
    if (password && password !== confirmPassword) {
      setMessage('Passwords do not match');
      return;
    }
    setMessage(null);
    dispatch(
      updateUserProfile({
        id: user.id,
        name,
        email,
        password: password || undefined,
        address,
        city,
        postal_code: postalCode,
        country,
        phone_number: phoneNumber,
      })
    );
  };

  return (
    <div className="container" style={{ paddingTop: '28px' }}>
      <div className="page-header">
        <div>
          <h1 className="page-title">My Account & Order History</h1>
          <p className="page-subtitle">
            Manage your personal profile and view your past orders
          </p>
        </div>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '36px',
          alignItems: 'start',
        }}
      >
        {/* Left Column: User Profile Settings Form */}
        <div className="card" style={{ padding: '28px', borderRadius: 'var(--radius-xl)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '10px',
                background: 'var(--primary-light)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--primary)',
              }}
            >
              <User size={22} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Profile Details</h2>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Update your contact and delivery address
              </span>
            </div>
          </div>

          {message && <Message variant="danger">{message}</Message>}
          {error && <Message variant="danger">{error}</Message>}
          {errorUpdate && <Message variant="danger">{errorUpdate}</Message>}
          {successUpdate && <Message variant="success">Profile Updated Successfully!</Message>}
          {loading && <Loader text="Loading profile details..." />}

          <form onSubmit={submitHandler}>
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input
                type="text"
                className="form-control"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input
                type="email"
                className="form-control"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Street Address</label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. 123 MG Road, Indiranagar"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <div className="form-group">
                <label className="form-label">City</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. Bengaluru"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Postal Code</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. 560038"
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <div className="form-group">
                <label className="form-label">Country</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. India"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Phone Number</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. +91 9876543210"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                />
              </div>
            </div>

            <div className="form-group" style={{ marginTop: '10px' }}>
              <label className="form-label">Change Password (leave blank to keep current)</label>
              <input
                type="password"
                className="form-control"
                placeholder="New password (optional)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {password && (
              <div className="form-group">
                <label className="form-label">Confirm New Password</label>
                <input
                  type="password"
                  className="form-control"
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
            )}

            <button type="submit" className="btn btn-primary btn-block" style={{ marginTop: '12px' }}>
              <Save size={16} />
              <span>Save Profile Changes</span>
            </button>
          </form>
        </div>

        {/* Right Column: My Orders Section (CRITICAL WORKFLOW) */}
        <div style={{ flex: 2 }}>
          <div
            className="card"
            style={{ padding: '28px', borderRadius: 'var(--radius-xl)' }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '20px',
                flexWrap: 'wrap',
                gap: '12px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div
                  style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '10px',
                    background: 'var(--success-bg)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--success)',
                  }}
                >
                  <Package size={22} />
                </div>
                <div>
                  <h2 style={{ fontSize: '1.25rem', fontWeight: 800 }}>My Orders</h2>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    Track purchases, payment, and delivery status
                  </span>
                </div>
              </div>
              {orders && (
                <span className="badge badge-primary">
                  {orders.length} Order{orders.length !== 1 ? 's' : ''} Placed
                </span>
              )}
            </div>

            {loadingOrders ? (
              <Loader text="Loading your orders..." />
            ) : errorOrders ? (
              <Message variant="danger">{errorOrders}</Message>
            ) : !orders || orders.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px 20px' }}>
                <Package size={48} color="var(--text-muted)" style={{ margin: '0 auto 12px' }} />
                <h3 style={{ fontSize: '1.1rem', marginBottom: '6px' }}>No Orders Found</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '16px' }}>
                  You haven't placed any orders yet. Explore our catalog and place your first order!
                </p>
                <Link to="/products" className="btn btn-primary btn-sm">
                  Shop Now
                </Link>
              </div>
            ) : (
              <div className="table-responsive">
                <table className="custom-table">
                  <thead>
                    <tr>
                      <th>Order ID</th>
                      <th>Date</th>
                      <th>Total</th>
                      <th>Paid Status</th>
                      <th>Delivered</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order) => (
                      <tr key={order.id}>
                        <td>
                          <strong>#{order.id}</strong>
                        </td>
                        <td style={{ whiteSpace: 'nowrap' }}>
                          {new Date(order.created_at).toLocaleDateString('en-IN', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                          })}
                        </td>
                        <td>
                          <strong style={{ color: 'var(--text-main)' }}>
                            ₹{Number(order.total_price).toLocaleString('en-IN')}
                          </strong>
                        </td>
                        <td>
                          {order.is_paid ? (
                            <span className="badge badge-success" title={`Paid on ${order.paid_at}`}>
                              <CheckCircle size={13} />
                              <span>YES</span>
                            </span>
                          ) : (
                            <span className="badge badge-warning">
                              <Clock size={13} />
                              <span>PENDING</span>
                            </span>
                          )}
                        </td>
                        <td>
                          {order.is_delivered ? (
                            <span className="badge badge-success" title={`Delivered on ${order.delivered_at}`}>
                              <CheckCircle size={13} />
                              <span>YES</span>
                            </span>
                          ) : (
                            <span className="badge badge-danger">
                              <XCircle size={13} />
                              <span>NO</span>
                            </span>
                          )}
                        </td>
                        <td>
                          <Link
                            to={`/order/${order.id}`}
                            className="btn btn-secondary btn-sm"
                            style={{ gap: '4px' }}
                          >
                            <Eye size={14} />
                            <span>View</span>
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileScreen;
