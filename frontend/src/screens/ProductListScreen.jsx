import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Filter, SlidersHorizontal, PackageX, Search } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import Loader from '../components/Loader';
import Message from '../components/Message';
import { listProducts, listCategories } from '../actions/productActions';

const ProductListScreen = () => {
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();

  const keyword = searchParams.get('keyword') || '';
  const category = searchParams.get('category') || 'All';
  const sort = searchParams.get('sort') || 'newest';

  const [searchInput, setSearchInput] = useState(keyword);

  const productList = useSelector((state) => state.productList);
  const { loading, error, products, count } = productList;

  const productCategories = useSelector((state) => state.productCategories);
  const { categories } = productCategories;

  useEffect(() => {
    dispatch(listCategories());
  }, [dispatch]);

  useEffect(() => {
    dispatch(listProducts(keyword, category === 'All' ? '' : category, sort));
  }, [dispatch, keyword, category, sort]);

  const handleCategoryChange = (cat) => {
    const params = new URLSearchParams(searchParams);
    if (cat === 'All') {
      params.delete('category');
    } else {
      params.set('category', cat);
    }
    setSearchParams(params);
  };

  const handleSortChange = (e) => {
    const params = new URLSearchParams(searchParams);
    params.set('sort', e.target.value);
    setSearchParams(params);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams);
    if (searchInput.trim()) {
      params.set('keyword', searchInput.trim());
    } else {
      params.delete('keyword');
    }
    setSearchParams(params);
  };

  const allCategories = ['All', ...(categories && categories.length > 0 ? categories : ['Electronics', 'Fashion', 'Books', 'Accessories', 'Home'])];

  return (
    <div className="container" style={{ paddingTop: '24px' }}>
      <div className="page-header">
        <div>
          <h1 className="page-title">
            {keyword ? `Search Results for "${keyword}"` : category !== 'All' ? `${category} Catalog` : 'Complete Catalog'}
          </h1>
          <p className="page-subtitle">
            Showing {count || (products ? products.length : 0)} premium products
          </p>
        </div>

        {/* Search & Sort Controls */}
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
          <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '6px' }}>
            <input
              type="text"
              className="form-control"
              style={{ width: '220px', padding: '8px 12px', fontSize: '0.875rem' }}
              placeholder="Search catalog..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
            <button type="submit" className="btn btn-primary btn-sm">
              <Search size={15} />
            </button>
          </form>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <SlidersHorizontal size={16} color="var(--text-muted)" />
            <select
              className="form-select"
              style={{ width: '180px', padding: '8px 12px', fontSize: '0.875rem' }}
              value={sort}
              onChange={handleSortChange}
            >
              <option value="newest">Newest Arrivals</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
            </select>
          </div>
        </div>
      </div>

      {/* Category Chips Bar */}
      <div className="category-chips">
        {allCategories.map((cat) => (
          <button
            key={cat}
            onClick={() => handleCategoryChange(cat)}
            className={`category-chip ${category.toLowerCase() === cat.toLowerCase() ? 'active' : ''}`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Products Grid / Status */}
      {loading ? (
        <Loader text="Fetching product catalog..." />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : products && products.length === 0 ? (
        <div
          className="card"
          style={{
            textAlign: 'center',
            padding: '60px 20px',
            borderRadius: 'var(--radius-xl)',
          }}
        >
          <div
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              background: 'var(--bg-subtle)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px',
              color: 'var(--text-muted)',
            }}
          >
            <PackageX size={32} />
          </div>
          <h3 style={{ fontSize: '1.25rem', marginBottom: '8px' }}>No products found</h3>
          <p style={{ color: 'var(--text-muted)', maxWidth: '400px', margin: '0 auto 20px' }}>
            We couldn't find any products matching your active filters. Try searching for another keyword or clearing filters.
          </p>
          <button
            onClick={() => {
              setSearchInput('');
              setSearchParams({});
            }}
            className="btn btn-primary"
          >
            Reset All Filters
          </button>
        </div>
      ) : (
        <div className="product-grid">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductListScreen;
