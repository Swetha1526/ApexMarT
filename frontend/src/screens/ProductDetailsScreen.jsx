import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  ArrowLeft,
  ShoppingBag,
  CheckCircle,
  XCircle,
  Truck,
  ShieldCheck,
  RotateCcw,
  Star,
  MessageSquare,
} from 'lucide-react';
import Rating from '../components/Rating';
import Loader from '../components/Loader';
import Message from '../components/Message';
import {
  listProductDetails,
  createProductReview,
} from '../actions/productActions';
import { addToCart } from '../actions/cartActions';
import { PRODUCT_CREATE_REVIEW_RESET } from '../constants/productConstants';

const ProductDetailsScreen = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [qty, setQty] = useState(1);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');

  const productDetails = useSelector((state) => state.productDetails);
  const { loading, error, product } = productDetails;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const productReviewCreate = useSelector((state) => state.productReviewCreate);
  const {
    loading: loadingReview,
    error: errorReview,
    success: successReview,
  } = productReviewCreate;

  useEffect(() => {
    if (successReview) {
      alert('Review submitted successfully!');
      setRating(5);
      setComment('');
      dispatch({ type: PRODUCT_CREATE_REVIEW_RESET });
    }
    dispatch(listProductDetails(id));
  }, [dispatch, id, successReview]);

  const handleAddToCart = () => {
    dispatch(addToCart(id, qty));
    navigate('/cart');
  };

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    dispatch(
      createProductReview(id, {
        rating,
        comment,
      })
    );
  };

  const formattedPrice = Number(product?.price || 0).toLocaleString('en-IN', {
    maximumFractionDigits: 2,
  });

  return (
    <div className="container" style={{ paddingTop: '24px' }}>
      {/* Back button */}
      <Link
        to="/products"
        className="btn btn-secondary btn-sm"
        style={{ marginBottom: '24px', display: 'inline-flex', width: 'fit-content' }}
      >
        <ArrowLeft size={16} />
        <span>Back to Products</span>
      </Link>

      {loading ? (
        <Loader text="Loading product details..." />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <>
          {/* Main Product Section */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '40px',
              marginBottom: '48px',
            }}
          >
            {/* Left: Product Image */}
            <div
              className="card"
              style={{
                padding: '16px',
                borderRadius: 'var(--radius-xl)',
                background: '#ffffff',
                overflow: 'hidden',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '400px',
              }}
            >
              <img
                src={product.image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80'}
                alt={product.name}
                style={{
                  width: '100%',
                  maxHeight: '480px',
                  objectFit: 'contain',
                  borderRadius: 'var(--radius-lg)',
                }}
              />
            </div>

            {/* Right: Product Info & Purchase Box */}
            <div>
              {product.category && (
                <span className="badge badge-primary" style={{ marginBottom: '10px' }}>
                  {product.category}
                </span>
              )}

              <h1
                style={{
                  fontSize: '2rem',
                  fontWeight: 800,
                  marginBottom: '12px',
                  lineHeight: 1.25,
                }}
              >
                {product.name}
              </h1>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                  marginBottom: '20px',
                  paddingBottom: '16px',
                  borderBottom: '1px solid var(--border-color)',
                }}
              >
                <Rating
                  value={product.rating}
                  text={`${product.rating} (${product.num_reviews} customer reviews)`}
                />
                {product.brand && (
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                    Brand: <strong>{product.brand}</strong>
                  </span>
                )}
              </div>

              {/* Price & Stock Card */}
              <div
                className="card"
                style={{
                  background: 'var(--bg-subtle)',
                  padding: '24px',
                  borderRadius: 'var(--radius-lg)',
                  marginBottom: '24px',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '16px',
                  }}
                >
                  <span style={{ fontSize: '1.1rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                    Special Price
                  </span>
                  <div style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--primary)' }}>
                    ₹{formattedPrice}
                  </div>
                </div>

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '20px',
                    paddingTop: '12px',
                    borderTop: '1px solid var(--border-color)',
                  }}
                >
                  <span style={{ fontWeight: 600 }}>Availability:</span>
                  {product.count_in_stock > 0 ? (
                    <span className="badge badge-success">
                      <CheckCircle size={14} />
                      <span>In Stock ({product.count_in_stock} available)</span>
                    </span>
                  ) : (
                    <span className="badge badge-danger">
                      <XCircle size={14} />
                      <span>Currently Out of Stock</span>
                    </span>
                  )}
                </div>

                {product.count_in_stock > 0 && (
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '16px',
                      marginBottom: '20px',
                    }}
                  >
                    <label style={{ fontWeight: 600, fontSize: '0.95rem' }}>Quantity:</label>
                    <select
                      className="form-select"
                      style={{ width: '100px' }}
                      value={qty}
                      onChange={(e) => setQty(Number(e.target.value))}
                    >
                      {[...Array(Math.min(product.count_in_stock, 10)).keys()].map((x) => (
                        <option key={x + 1} value={x + 1}>
                          {x + 1}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                <button
                  onClick={handleAddToCart}
                  disabled={product.count_in_stock === 0}
                  className="btn btn-primary btn-lg btn-block"
                  style={{ gap: '10px' }}
                >
                  <ShoppingBag size={20} />
                  <span>{product.count_in_stock > 0 ? 'Add to Shopping Cart' : 'Out of Stock'}</span>
                </button>
              </div>

              {/* Description */}
              <div style={{ marginBottom: '24px' }}>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '8px' }}>
                  Product Overview
                </h3>
                <p style={{ color: 'var(--text-muted)', lineHeight: '1.7', fontSize: '0.95rem' }}>
                  {product.description || 'No detailed description available.'}
                </p>
              </div>

              {/* Guarantees */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '12px',
                  padding: '16px',
                  background: 'white',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-color)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem' }}>
                  <Truck size={18} color="var(--primary)" />
                  <span>Free Express Shipping</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem' }}>
                  <ShieldCheck size={18} color="var(--success)" />
                  <span>1 Year Warranty</span>
                </div>
              </div>
            </div>
          </div>

          {/* Customer Reviews Section */}
          <section className="card" style={{ marginTop: '40px', padding: '32px' }}>
            <div className="page-header" style={{ marginBottom: '24px' }}>
              <div>
                <h2 className="page-title" style={{ fontSize: '1.5rem' }}>Customer Reviews & Ratings</h2>
                <p className="page-subtitle">Verified feedback from registered customers</p>
              </div>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '32px',
              }}
            >
              {/* Existing Reviews List */}
              <div>
                {(!product.reviews || product.reviews.length === 0) ? (
                  <Message variant="info">No customer reviews yet. Be the first to review this product!</Message>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {product.reviews.map((rev) => (
                      <div
                        key={rev.id}
                        style={{
                          padding: '16px',
                          borderRadius: 'var(--radius-md)',
                          background: 'var(--bg-subtle)',
                          border: '1px solid var(--border-color)',
                        }}
                      >
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            marginBottom: '6px',
                          }}
                        >
                          <strong style={{ fontSize: '0.95rem' }}>{rev.name}</strong>
                          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                            {new Date(rev.created_at).toLocaleDateString()}
                          </span>
                        </div>
                        <Rating value={rev.rating} />
                        <p style={{ marginTop: '8px', fontSize: '0.9rem', color: 'var(--text-main)' }}>
                          {rev.comment}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Add Review Form */}
              <div
                style={{
                  background: 'white',
                  padding: '24px',
                  borderRadius: 'var(--radius-lg)',
                  border: '1px solid var(--border-color)',
                }}
              >
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '16px' }}>
                  Write a Customer Review
                </h3>

                {errorReview && <Message variant="danger">{errorReview}</Message>}

                {userInfo ? (
                  <form onSubmit={handleReviewSubmit}>
                    <div className="form-group">
                      <label className="form-label">Rating</label>
                      <select
                        className="form-select"
                        value={rating}
                        onChange={(e) => setRating(Number(e.target.value))}
                      >
                        <option value="5">5 - Excellent ★★★★★</option>
                        <option value="4">4 - Very Good ★★★★☆</option>
                        <option value="3">3 - Good ★★★☆☆</option>
                        <option value="2">2 - Fair ★★☆☆☆</option>
                        <option value="1">1 - Poor ★☆☆☆☆</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Comment</label>
                      <textarea
                        className="form-control"
                        rows="4"
                        placeholder="Write your honest thoughts about this item..."
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        required
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={loadingReview}
                      className="btn btn-primary btn-block"
                    >
                      {loadingReview ? 'Submitting...' : 'Submit Review'}
                    </button>
                  </form>
                ) : (
                  <Message variant="info">
                    Please <Link to={`/login?redirect=/product/${id}`} style={{ fontWeight: 700, textDecoration: 'underline' }}>Sign In</Link> to write a review.
                  </Message>
                )}
              </div>
            </div>
          </section>
        </>
      )}
    </div>
  );
};

export default ProductDetailsScreen;
