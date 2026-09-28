import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { ArrowRight, Sparkles, TrendingUp, Zap, Shield, Award } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import Loader from '../components/Loader';
import Message from '../components/Message';
import { listProducts, listTopProducts } from '../actions/productActions';

const HomeScreen = () => {
  const dispatch = useDispatch();

  const productList = useSelector((state) => state.productList);
  const { loading, error, products } = productList;

  const productTopRated = useSelector((state) => state.productTopRated);
  const { loading: loadingTop, error: errorTop, products: topProducts } = productTopRated;

  useEffect(() => {
    dispatch(listProducts());
    dispatch(listTopProducts());
  }, [dispatch]);

  const categories = [
    { name: 'Electronics', icon: '💻', count: 'Laptops, Audio & Gadgets' },
    { name: 'Fashion', icon: '👕', count: 'Hoodies & Apparel' },
    { name: 'Books', icon: '📚', count: 'Bestsellers & Fiction' },
    { name: 'Accessories', icon: '⌚', count: 'Watches & Sunglasses' },
    { name: 'Home', icon: '🪑', count: 'Chairs & Kitchen' },
  ];

  return (
    <div className="container">
      {/* Hero Banner */}
      <section className="hero-section">
        <div className="hero-badge">
          <Sparkles size={16} />
          <span>Major Project Demo • 2026 Edition</span>
        </div>
        <h1 className="hero-title">
          Discover Next-Gen Products <br />
          <span>Engineered for Excellence.</span>
        </h1>
        <p className="hero-desc">
          Experience seamless online shopping powered by Django REST Framework and React. Ultra-responsive, fully secure, and integrated with MySQL database.
        </p>
        <div className="hero-actions">
          <Link to="/products" className="btn btn-primary btn-lg">
            <span>Explore All Products</span>
            <ArrowRight size={18} />
          </Link>
          <Link to="/products?category=Electronics" className="btn btn-secondary btn-lg">
            <span>Top Electronics</span>
          </Link>
        </div>
      </section>

      {/* Categories Grid */}
      <section style={{ marginBottom: '48px' }}>
        <div className="page-header">
          <div>
            <h2 className="page-title">Featured Categories</h2>
            <p className="page-subtitle">Browse curated collections across all major departments</p>
          </div>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '16px',
          }}
        >
          {categories.map((cat) => (
            <Link
              key={cat.name}
              to={`/products?category=${cat.name}`}
              className="card"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                padding: '20px',
                borderRadius: 'var(--radius-lg)',
                transition: 'var(--transition)',
              }}
            >
              <div
                style={{
                  fontSize: '2rem',
                  background: 'var(--bg-subtle)',
                  width: '54px',
                  height: '54px',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {cat.icon}
              </div>
              <div>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-main)' }}>
                  {cat.name}
                </h3>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  {cat.count}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Top Rated / Best Sellers */}
      <section style={{ marginBottom: '48px' }}>
        <div className="page-header">
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <TrendingUp size={22} color="var(--primary)" />
              <h2 className="page-title">Top Rated Products</h2>
            </div>
            <p className="page-subtitle">Customer favorites with highest ratings and reviews</p>
          </div>
          <Link to="/products?sort=rating" className="btn btn-outline btn-sm">
            View Highest Rated
          </Link>
        </div>

        {loadingTop ? (
          <Loader text="Loading top rated items..." />
        ) : errorTop ? (
          <Message variant="danger">{errorTop}</Message>
        ) : (
          <div className="product-grid">
            {topProducts &&
              topProducts.slice(0, 4).map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
          </div>
        )}
      </section>

      {/* Latest Arrivals */}
      <section style={{ marginBottom: '48px' }}>
        <div className="page-header">
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Zap size={22} color="var(--accent)" />
              <h2 className="page-title">Latest Arrivals</h2>
            </div>
            <p className="page-subtitle">Freshly added inventory ready to ship</p>
          </div>
          <Link to="/products" className="btn btn-outline btn-sm">
            View All ({products ? products.length : 0})
          </Link>
        </div>

        {loading ? (
          <Loader text="Loading catalog..." />
        ) : error ? (
          <Message variant="danger">{error}</Message>
        ) : (
          <div className="product-grid">
            {products &&
              products.slice(0, 8).map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default HomeScreen;
