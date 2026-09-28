import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { LogIn, UserCheck, ShieldCheck, Mail, Lock } from 'lucide-react';
import Message from '../components/Message';
import Loader from '../components/Loader';
import { login } from '../actions/userActions';

const LoginScreen = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const redirect = location.search ? location.search.split('=')[1] : '/';

  const userLogin = useSelector((state) => state.userLogin);
  const { loading, error, userInfo } = userLogin;

  useEffect(() => {
    if (userInfo) {
      navigate(decodeURIComponent(redirect));
    }
  }, [navigate, userInfo, redirect]);

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(login(username, password));
  };

  const handleQuickFill = (u, p) => {
    setUsername(u);
    setPassword(p);
  };

  return (
    <div className="container" style={{ maxWidth: '520px', paddingTop: '40px' }}>
      <div className="card" style={{ padding: '36px', borderRadius: 'var(--radius-xl)' }}>
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div
            style={{
              width: '56px',
              height: '56px',
              borderRadius: '16px',
              background: 'var(--primary-light)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 12px',
              color: 'var(--primary)',
            }}
          >
            <LogIn size={28} />
          </div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Welcome Back</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '4px' }}>
            Sign in to access your cart, orders, and profile
          </p>
        </div>

        {error && <Message variant="danger">{error}</Message>}
        {loading && <Loader text="Authenticating..." />}

        <form onSubmit={submitHandler}>
          <div className="form-group">
            <label className="form-label">Email or Username</label>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. john@example.com or admin"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-control"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary btn-lg btn-block"
            style={{ marginTop: '8px' }}
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        {/* Demo Credentials Quick Fill */}
        <div
          style={{
            marginTop: '28px',
            padding: '16px',
            background: 'var(--bg-subtle)',
            borderRadius: 'var(--radius-md)',
            border: '1px dashed var(--border-color)',
          }}
        >
          <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Quick Demo Accounts (1-Click Fill)
          </div>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={() => handleQuickFill('admin@example.com', 'admin123')}
              className="btn btn-secondary btn-sm"
              style={{ fontSize: '0.8rem', gap: '4px' }}
            >
              <ShieldCheck size={14} color="var(--primary)" />
              <span>Admin (admin123)</span>
            </button>
            <button
              type="button"
              onClick={() => handleQuickFill('john@example.com', 'password123')}
              className="btn btn-secondary btn-sm"
              style={{ fontSize: '0.8rem', gap: '4px' }}
            >
              <UserCheck size={14} color="var(--success)" />
              <span>User: John Doe</span>
            </button>
            <button
              type="button"
              onClick={() => handleQuickFill('jane@example.com', 'password123')}
              className="btn btn-secondary btn-sm"
              style={{ fontSize: '0.8rem', gap: '4px' }}
            >
              <UserCheck size={14} color="var(--info)" />
              <span>User: Jane Smith</span>
            </button>
          </div>
        </div>

        <div style={{ textAlign: 'center', marginTop: '24px', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
          Don't have an account?{' '}
          <Link
            to={redirect ? `/register?redirect=${redirect}` : '/register'}
            style={{ color: 'var(--primary)', fontWeight: 700 }}
          >
            Register Here
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;
