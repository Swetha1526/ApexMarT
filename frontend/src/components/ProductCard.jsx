import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { ShoppingBag, Eye } from 'lucide-react';
import Rating from './Rating';
import { addToCart } from '../actions/cartActions';

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (product.count_in_stock > 0) {
      dispatch(addToCart(product.id, 1));
      navigate('/cart');
    }
  };

  const formattedPrice = Number(product.price).toLocaleString('en-IN', {
    maximumFractionDigits: 2,
  });

  return (
    <div className="product-card">
      <Link to={`/product/${product.id}`} className="product-img-wrapper">
        <img
          src={product.image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80'}
          alt={product.name}
          className="product-img"
          loading="lazy"
        />
        {product.count_in_stock === 0 ? (
          <span
            className="badge badge-danger"
            style={{ position: 'absolute', top: '12px', left: '12px' }}
          >
            Out of Stock
          </span>
        ) : (
          <span
            className="badge badge-success"
            style={{ position: 'absolute', top: '12px', left: '12px' }}
          >
            In Stock
          </span>
        )}
      </Link>

      <div className="product-card-body">
        {product.category && (
          <span className="product-category-tag">{product.category}</span>
        )}

        <Link to={`/product/${product.id}`}>
          <h3 className="product-title" title={product.name}>
            {product.name}
          </h3>
        </Link>

        <Rating
          value={product.rating}
          text={`(${product.num_reviews})`}
        />

        <div className="product-card-footer">
          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>Price</span>
            <div className="product-price">₹{formattedPrice}</div>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <Link
              to={`/product/${product.id}`}
              className="btn btn-secondary btn-sm"
              title="View Details"
            >
              <Eye size={15} />
            </Link>
            <button
              onClick={handleAddToCart}
              disabled={product.count_in_stock === 0}
              className="btn btn-primary btn-sm"
              title="Add to Cart"
            >
              <ShoppingBag size={15} />
              <span>Add</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
