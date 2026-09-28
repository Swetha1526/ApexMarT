import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  ListOrdered,
  Eye,
  Truck,
  CheckCircle,
  XCircle,
  Clock,
  Filter,
} from 'lucide-react';
import Loader from '../components/Loader';
import Message from '../components/Message';
import { listOrders, deliverOrder } from '../actions/orderActions';
import { ORDER_DELIVER_RESET } from '../constants/orderConstants';

const AdminOrderListScreen = () => {
  const dispatch = useDispatch();
  const [filter, setFilter] = useState('all');

  const orderList = useSelector((state) => state.orderList);
  const { loading, error, orders } = orderList;

  const orderDeliver = useSelector((state) => state.orderDeliver);
  const { loading: loadingDeliver, success: successDeliver } = orderDeliver;

  useEffect(() => {
    if (successDeliver) {
      dispatch({ type: ORDER_DELIVER_RESET });
    }
    dispatch(listOrders());
  }, [dispatch, successDeliver]);

  const deliverHandler = (id) => {
    dispatch(deliverOrder(id));
  };

  const filteredOrders = orders?.filter((order) => {
    if (filter === 'paid') return order.is_paid;
    if (filter === 'unpaid') return !order.is_paid;
    if (filter === 'delivered') return order.is_delivered;
    if (filter === 'intransit') return !order.is_delivered;
    return true;
  });

  return (
    <div className="container" style={{ paddingTop: '28px' }}>
      <div className="page-header">
        <div>
          <h1 className="page-title">Customer Order Management</h1>
          <p className="page-subtitle">
            Track customer orders, payments, and fulfill delivery updates ({orders?.length || 0} orders total)
          </p>
        </div>

        {/* Filter Chips */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {['all', 'paid', 'unpaid', 'delivered', 'intransit'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`category-chip ${filter === f ? 'active' : ''}`}
              style={{ textTransform: 'capitalize', padding: '6px 14px', fontSize: '0.825rem' }}
            >
              {f === 'intransit' ? 'In Transit' : f}
            </button>
          ))}
        </div>
      </div>

      {loadingDeliver && <Loader text="Updating delivery status..." />}

      {loading ? (
        <Loader text="Loading orders..." />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <div className="card" style={{ padding: '24px', borderRadius: 'var(--radius-xl)' }}>
          <div className="table-responsive">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Date</th>
                  <th>Total</th>
                  <th>Paid Status</th>
                  <th>Delivery Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders &&
                  filteredOrders.map((order) => (
                    <tr key={order.id}>
                      <td>
                        <strong>#{order.id}</strong>
                      </td>
                      <td>
                        <div>
                          <strong>{order.user ? order.user.name : 'Customer'}</strong>
                          <span style={{ fontSize: '0.775rem', color: 'var(--text-muted)', display: 'block' }}>
                            {order.user ? order.user.email : 'N/A'}
                          </span>
                        </div>
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
                          <span className="badge badge-success" title={`Paid at ${order.paid_at}`}>
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
                        {order.is_delivered ? (
                          <span className="badge badge-success" title={`Delivered at ${order.delivered_at}`}>
                            <CheckCircle size={12} />
                            <span>YES</span>
                          </span>
                        ) : (
                          <span className="badge badge-danger">
                            <XCircle size={12} />
                            <span>IN TRANSIT</span>
                          </span>
                        )}
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <Link to={`/order/${order.id}`} className="btn btn-secondary btn-sm">
                            <Eye size={14} />
                            <span>View</span>
                          </Link>

                          {!order.is_delivered && (
                            <button
                              onClick={() => deliverHandler(order.id)}
                              className="btn btn-success btn-sm"
                              title="Mark as Delivered"
                            >
                              <Truck size={14} />
                              <span>Deliver</span>
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrderListScreen;
