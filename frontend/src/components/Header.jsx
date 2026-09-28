import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  ShoppingBag,
  ShoppingCart,
  User,
  LogOut,
  Search,
  ShieldCheck,
  ChevronDown,
  Menu,
  X,
  Package,
  ListOrdered,
  Users,
  LayoutDashboard,
} from 'lucide-react';
import { logout } from '../actions/userActions';

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const [keyword, setKeyword] = useState('');
  const [userDropdown, setUserDropdown] = useState(false);
  const [adminDropdown, setAdminDropdown] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const userDropdownRef = useRef(null);
  const adminDropdownRef = useRef(null);

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const cart = useSelector((state) => state.cart);
  const { cartItems } = cart;

  const totalCartCount = cartItems.reduce((acc, item) => acc + item.qty, 0);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userDropdownRef.current && !userDropdownRef.current.contains(event.target)) {
        setUserDropdown(false);
      }
      if (adminDropdownRef.current && !adminDropdownRef.current.contains(event.target)) {
        setAdminDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setUserDropdown(false);
    setAdminDropdown(false);
  }, [location]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (keyword.trim()) {
      navigate(`/products?keyword=${encodeURIComponent(keyword.trim())}`);
    } else {
      navigate('/products');
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <header className="header">
      <div className="container">
        <div className="navbar">
          {/* Logo */}
          <Link to="/" className="brand-logo">
            <div className="brand-icon">
              <ShoppingBag size={22} />
            </div>
            <span>Apex<span style={{ color: 'var(--text-main)' }}>Mart</span></span>
          </Link>

          {/* Search bar */}
          <form onSubmit={handleSearchSubmit} className="search-box">
            <Search size={18} className="search-icon" />
            <input
              type="text"
              className="search-input"
              placeholder="Search products, brands, categories..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
          </form>

          {/* Desktop Navigation Links */}
          <nav className="nav-links">
            <Link
              to="/"
              className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
            >
              Home
            </Link>

            <Link
              to="/products"
              className={`nav-link ${location.pathname === '/products' ? 'active' : ''}`}
            >
              Catalog
            </Link>

            <Link
              to="/cart"
              className={`nav-link cart-link ${location.pathname === '/cart' ? 'active' : ''}`}
            >
              <ShoppingCart size={19} />
              <span>Cart</span>
              {totalCartCount > 0 && (
                <span className="cart-count">{totalCartCount}</span>
              )}
            </Link>

            {/* User Dropdown */}
            {userInfo ? (
              <div className="nav-dropdown" ref={userDropdownRef}>
                <button
                  className="dropdown-trigger"
                  onClick={() => {
                    setUserDropdown(!userDropdown);
                    setAdminDropdown(false);
                  }}
                >
                  <User size={18} color="var(--primary)" />
                  <span>{userInfo.name.split(' ')[0]}</span>
                  <ChevronDown size={14} />
                </button>

                {userDropdown && (
                  <div className="dropdown-menu">
                    <div style={{ padding: '8px 14px 4px' }}>
                      <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{userInfo.name}</div>
                      <div style={{ fontSize: '0.775rem', color: 'var(--text-muted)' }}>{userInfo.email}</div>
                    </div>
                    <div className="dropdown-divider" />
                    <Link to="/profile" className="dropdown-item">
                      <ListOrdered size={16} />
                      <span>Profile & My Orders</span>
                    </Link>
                    <div className="dropdown-divider" />
                    <button onClick={handleLogout} className="dropdown-item" style={{ color: 'var(--danger)' }}>
                      <LogOut size={16} />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <Link to="/login" className="btn btn-secondary btn-sm">
                  Sign In
                </Link>
                <Link to="/register" className="btn btn-primary btn-sm">
                  Register
                </Link>
              </div>
            )}

            {/* Admin Menu Dropdown */}
            {userInfo && userInfo.isAdmin && (
              <div className="nav-dropdown" ref={adminDropdownRef}>
                <button
                  className="dropdown-trigger"
                  style={{ borderColor: 'var(--primary)', background: 'var(--primary-light)' }}
                  onClick={() => {
                    setAdminDropdown(!adminDropdown);
                    setUserDropdown(false);
                  }}
                >
                  <ShieldCheck size={18} color="var(--primary)" />
                  <span style={{ color: 'var(--primary)', fontWeight: 700 }}>Admin</span>
                  <ChevronDown size={14} />
                </button>

                {adminDropdown && (
                  <div className="dropdown-menu">
                    <Link to="/admin" className="dropdown-item">
                      <LayoutDashboard size={16} />
                      <span>Dashboard</span>
                    </Link>
                    <Link to="/admin/products" className="dropdown-item">
                      <Package size={16} />
                      <span>Manage Products</span>
                    </Link>
                    <Link to="/admin/orders" className="dropdown-item">
                      <ListOrdered size={16} />
                      <span>Manage Orders</span>
                    </Link>
                    <Link to="/admin/users" className="dropdown-item">
                      <Users size={16} />
                      <span>Manage Users</span>
                    </Link>
                  </div>
                )}
              </div>
            )}
          </nav>

          {/* Mobile hamburger toggle */}
          <button
            className="mobile-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>

        {/* Mobile Navigation Menu */}
        {mobileMenuOpen && (
          <div className="mobile-menu">
            <form onSubmit={handleSearchSubmit} style={{ marginBottom: '12px' }}>
              <input
                type="text"
                className="form-control"
                placeholder="Search products..."
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
              />
            </form>

            <Link to="/" className="nav-link">Home</Link>
            <Link to="/products" className="nav-link">Catalog</Link>
            <Link to="/cart" className="nav-link" style={{ justifyContent: 'space-between' }}>
              <span>Cart</span>
              {totalCartCount > 0 && <span className="badge badge-primary">{totalCartCount} items</span>}
            </Link>

            {userInfo ? (
              <>
                <div className="dropdown-divider" />
                <div style={{ padding: '6px 14px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  Signed in as <strong>{userInfo.name}</strong>
                </div>
                <Link to="/profile" className="nav-link">Profile & My Orders</Link>
                {userInfo.isAdmin && (
                  <>
                    <div className="dropdown-divider" />
                    <div style={{ padding: '6px 14px', fontSize: '0.8rem', fontWeight: 700, color: 'var(--primary)' }}>
                      ADMIN PANEL
                    </div>
                    <Link to="/admin" className="nav-link">Dashboard</Link>
                    <Link to="/admin/products" className="nav-link">Manage Products</Link>
                    <Link to="/admin/orders" className="nav-link">Manage Orders</Link>
                    <Link to="/admin/users" className="nav-link">Manage Users</Link>
                  </>
                )}
                <div className="dropdown-divider" />
                <button onClick={handleLogout} className="nav-link" style={{ border: 'none', background: 'transparent', color: 'var(--danger)', width: '100%', textAlign: 'left' }}>
                  Sign Out
                </button>
              </>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '8px' }}>
                <Link to="/login" className="btn btn-secondary btn-block">Sign In</Link>
                <Link to="/register" className="btn btn-primary btn-block">Register</Link>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
