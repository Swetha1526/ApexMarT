import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  DollarSign,
  ShoppingCart,
  Package,
  Users,
  Eye,
  PlusCircle,
  ArrowRight,
  TrendingUp,
  CheckCircle,
  Clock,
} from 'lucide-react';
import Loader from '../components/Loader';
import Message from '../components/Message';
import { getOrderSummary } from '../actions/orderActions';

const AdminDashboardScreen = () => {
  const dispatch = useDispatch();

  const orderSummary = useSelector((state) => state.orderSummary);
  const { loading, error, summary } = orderSummary;

  useEffect(() => {
    dispatch(getOrderSummary());
  }, [dispatch]);

  const {
    total_users = 0,
    total_products = 0,
    total_orders = 0,
    total_revenue = 0,
    recent_orders = [],
  } = summary || {};

  return (
    <div className="container" style={{ paddingTop: '28px' }}>
      <div className="page-header">
        <div>
          <h1 className="page-title">Admin Dashboard</h1>
          <p className="page-subtitle">
            Overview of store performance, sales metrics, and recent orders
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <Link to="/admin/products" className="btn btn-primary btn-sm">
            <PlusCircle size={15} />
            <span>Manage Products</span>
          </Link>
          <Link to="/admin/orders" className="btn btn-secondary btn-sm">
            <span>All Orders</span>
          </Link>
        </div>
      </div>

      {loading ? (
        <Loader text="Loading dashboard metrics..." />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <>
          {/* Summary Stat Cards */}
          <div className="stats-grid">
            <div className="stat-card">
              <div
                className="stat-icon"
                style={{ background: 'var(--primary-light)', color: 'var(--primary)' }}
              >
                <DollarSign size={26} />
              </div>
              <div>
                <div className="stat-val">₹{Number(total_revenue).toLocaleString('en-IN')}</div>
                <div className="stat-label">Total Paid Revenue</div>
              </div>
            </div>

            <div className="stat-card">
              <div
                className="stat-icon"
                style={{ background: 'var(--success-bg)', color: 'var(--success)' }}
              >
                <ShoppingCart size={26} />
              </div>
              <div>
                <div className="stat-val">{total_orders}</div>
                <div className="stat-label">Total Customer Orders</div>
              </div>
            </div>

            <div className="stat-card">
              <div
                className="stat-icon"
                style={{ background: 'var(--info-bg)', color: 'var(--info)' }}
              >
                <Package size={26} />
              </div>
              <div>
                <div className="stat-val">{total_products}</div>
                <div className="stat-label">Active Products</div>
              </div>
            </div>

            <div className="stat-card">
              <div
                className="stat-icon"
                style={{ background: 'var(--warning-bg)', color: 'var(--warning)' }}
              >
                <Users size={26} />
              </div>
              <div>
                <div className="stat-val">{total_users}</div>
                <div className="stat-label">Registered Users</div>
              </div>
            </div>
          </div>

          {/* Quick Shortcuts */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '20px',
              marginBottom: '36px',
            }}
          >
            <Link
              to="/admin/products"
              className="card"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '20px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <Package size={24} color="var(--primary)" />
                <div>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 700 }}>Products Catalog</h3>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    Add, edit, or adjust inventory
                  </p>
                </div>
              </div>
              <ArrowRight size={18} color="var(--text-muted)" />
            </Link>

            <Link
              to="/admin/orders"
              className="card"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '20px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <ShoppingCart size={24} color="var(--success)" />
                <div>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 700 }}>Customer Orders</h3>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    Track payments & update delivery
                  </p>
                </div>
              </div>
              <ArrowRight size={18} color="var(--text-muted)" />
            </Link>

            <Link
              to="/admin/users"
              className="card"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '20px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <Users size={24} color="var(--warning)" />
                <div>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 700 }}>User Accounts</h3>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    View registered users & permissions
                  </p>
                </div>
              </div>
              <ArrowRight size={18} color="var(--text-muted)" />
            </Link>
          </div>

          {/* Recent Orders Table */}
          <div className="card" style={{ padding: '28px', borderRadius: 'var(--radius-xl)' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '20px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <TrendingUp size={22} color="var(--primary)" />
                <h2 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Recent Customer Orders</h2>
              </div>
              <Link to="/admin/orders" className="btn btn-outline btn-sm">
                View All Orders
              </Link>
            </div>

            {recent_orders.length === 0 ? (
              <Message variant="info">No orders found.</Message>
            ) : (
              <div className="table-responsive">
                <table className="custom-table">
                  <thead>
                    <tr>
                      <th>Order ID</th>
                      <th>Customer</th>
                      <th>Date</th>
                      <th>Total</th>
                      <th>Paid</th>
                      <th>Delivered</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recent_orders.map((ord) => (
                      <tr key={ord.id}>
                        <td><strong>#{ord.id}</strong></td>
                        <td>{ord.user ? ord.user.name : 'Customer'}</td>
                        <td>{new Date(ord.created_at).toLocaleDateString()}</td>
                        <td><strong>₹{Number(ord.total_price).toLocaleString('en-IN')}</strong></td>
                        <td>
                          {ord.is_paid ? (
                            <span className="badge badge-success">
                              <CheckCircle size={12} />
                              <span>YES</span>
                            </span>
                          ) : (
                            <span className="badge badge-warning">
                              <Clock size={12} />
                              <span>PENDING</span>
                            </span>
                          )}
                        </td>
                        <td>
                          {ord.is_delivered ? (
                            <span className="badge badge-success">
                              <CheckCircle size={12} />
                              <span>YES</span>
                            </span>
                          ) : (
                            <span className="badge badge-danger">
                              <span>NO</span>
                            </span>
                          )}
                        </td>
                        <td>
                          <Link to={`/order/${ord.id}`} className="btn btn-secondary btn-sm">
                            <Eye size={14} />
                            <span>Inspect</span>
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default AdminDashboardScreen;
