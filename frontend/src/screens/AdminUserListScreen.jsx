import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Users, Trash2, CheckCircle, XCircle, ShieldCheck } from 'lucide-react';
import Loader from '../components/Loader';
import Message from '../components/Message';
import { listUsers, deleteUser } from '../actions/userActions';

const AdminUserListScreen = () => {
  const dispatch = useDispatch();

  const userList = useSelector((state) => state.userList);
  const { loading, error, users } = userList;

  const userDelete = useSelector((state) => state.userDelete);
  const { success: successDelete } = userDelete;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  useEffect(() => {
    dispatch(listUsers());
  }, [dispatch, successDelete]);

  const deleteHandler = (id, name) => {
    if (window.confirm(`Are you sure you want to remove user "${name}"?`)) {
      dispatch(deleteUser(id));
    }
  };

  return (
    <div className="container" style={{ paddingTop: '28px' }}>
      <div className="page-header">
        <div>
          <h1 className="page-title">User Accounts</h1>
          <p className="page-subtitle">
            Manage registered accounts and role privileges ({users?.length || 0} registered users)
          </p>
        </div>
      </div>

      {loading ? (
        <Loader text="Loading users..." />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <div className="card" style={{ padding: '24px', borderRadius: 'var(--radius-xl)' }}>
          <div className="table-responsive">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>User ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Location</th>
                  <th>Role</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {users &&
                  users.map((u) => (
                    <tr key={u.id}>
                      <td><strong>#{u.id}</strong></td>
                      <td><strong>{u.name}</strong></td>
                      <td>{u.email}</td>
                      <td>{u.city ? `${u.city}, ${u.country || ''}` : '-'}</td>
                      <td>
                        {u.isAdmin ? (
                          <span className="badge badge-primary">
                            <ShieldCheck size={12} />
                            <span>ADMIN</span>
                          </span>
                        ) : (
                          <span className="badge badge-warning">CUSTOMER</span>
                        )}
                      </td>
                      <td>
                        {userInfo && userInfo.id !== u.id && (
                          <button
                            onClick={() => deleteHandler(u.id, u.name)}
                            className="btn btn-secondary btn-sm"
                            style={{ color: 'var(--danger)', borderColor: 'var(--danger-border)' }}
                            title="Delete User"
                          >
                            <Trash2 size={14} />
                          </button>
                        )}
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

export default AdminUserListScreen;
