import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Package,
  Plus,
  Edit2,
  Trash2,
  X,
  Save,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';
import Loader from '../components/Loader';
import Message from '../components/Message';
import {
  listProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from '../actions/productActions';
import {
  PRODUCT_CREATE_RESET,
  PRODUCT_UPDATE_RESET,
} from '../constants/productConstants';

const AdminProductListScreen = () => {
  const dispatch = useDispatch();

  const productList = useSelector((state) => state.productList);
  const { loading, error, products } = productList;

  const productCreate = useSelector((state) => state.productCreate);
  const {
    loading: loadingCreate,
    error: errorCreate,
    success: successCreate,
  } = productCreate;

  const productUpdate = useSelector((state) => state.productUpdate);
  const {
    loading: loadingUpdate,
    error: errorUpdate,
    success: successUpdate,
  } = productUpdate;

  const productDelete = useSelector((state) => state.productDelete);
  const {
    loading: loadingDelete,
    error: errorDelete,
    success: successDelete,
  } = productDelete;

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);

  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [brand, setBrand] = useState('');
  const [countInStock, setCountInStock] = useState('');
  const [image, setImage] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (successCreate) {
      dispatch({ type: PRODUCT_CREATE_RESET });
      setModalOpen(false);
      resetForm();
    }
    if (successUpdate) {
      dispatch({ type: PRODUCT_UPDATE_RESET });
      setModalOpen(false);
      resetForm();
    }
    dispatch(listProducts());
  }, [dispatch, successCreate, successUpdate, successDelete]);

  const resetForm = () => {
    setName('');
    setPrice('');
    setCategory('Electronics');
    setBrand('');
    setCountInStock('');
    setImage('');
    setDescription('');
    setIsEditing(false);
    setEditId(null);
  };

  const openCreateModal = () => {
    resetForm();
    setCategory('Electronics');
    setImage('https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80');
    setModalOpen(true);
  };

  const openEditModal = (prod) => {
    setIsEditing(true);
    setEditId(prod.id);
    setName(prod.name);
    setPrice(prod.price);
    setCategory(prod.category);
    setBrand(prod.brand);
    setCountInStock(prod.count_in_stock);
    setImage(prod.image);
    setDescription(prod.description);
    setModalOpen(true);
  };

  const handleDelete = (id, prodName) => {
    if (window.confirm(`Are you sure you want to delete "${prodName}"?`)) {
      dispatch(deleteProduct(id));
    }
  };

  const submitHandler = (e) => {
    e.preventDefault();
    if (isEditing) {
      dispatch(
        updateProduct({
          id: editId,
          name,
          price: Number(price),
          category,
          brand,
          count_in_stock: Number(countInStock),
          image,
          description,
        })
      );
    } else {
      dispatch(
        createProduct({
          name,
          price: Number(price),
          category,
          brand,
          count_in_stock: Number(countInStock),
          image,
          description,
        })
      );
    }
  };

  return (
    <div className="container" style={{ paddingTop: '28px' }}>
      <div className="page-header">
        <div>
          <h1 className="page-title">Product Inventory Management</h1>
          <p className="page-subtitle">
            Manage catalog, pricing, and stock levels ({products?.length || 0} total products)
          </p>
        </div>

        <button onClick={openCreateModal} className="btn btn-primary btn-sm">
          <Plus size={16} />
          <span>Add New Product</span>
        </button>
      </div>

      {errorDelete && <Message variant="danger">{errorDelete}</Message>}
      {errorCreate && <Message variant="danger">{errorCreate}</Message>}
      {errorUpdate && <Message variant="danger">{errorUpdate}</Message>}
      {(loadingDelete || loadingCreate || loadingUpdate) && <Loader text="Processing..." />}

      {loading ? (
        <Loader text="Loading products table..." />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <div className="card" style={{ padding: '24px', borderRadius: 'var(--radius-xl)' }}>
          <div className="table-responsive">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Category</th>
                  <th>Brand</th>
                  <th>Price</th>
                  <th>In Stock</th>
                  <th>Rating</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products &&
                  products.map((prod) => (
                    <tr key={prod.id}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <img
                            src={prod.image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100&auto=format&fit=crop&q=80'}
                            alt={prod.name}
                            style={{
                              width: '44px',
                              height: '44px',
                              borderRadius: '8px',
                              objectFit: 'cover',
                            }}
                          />
                          <div>
                            <strong style={{ fontSize: '0.925rem', color: 'var(--text-main)', display: 'block' }}>
                              {prod.name}
                            </strong>
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                              ID: #{prod.id}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className="badge badge-primary">{prod.category}</span>
                      </td>
                      <td>{prod.brand || '-'}</td>
                      <td>
                        <strong>₹{Number(prod.price).toLocaleString('en-IN')}</strong>
                      </td>
                      <td>
                        {prod.count_in_stock > 0 ? (
                          <span className="badge badge-success">{prod.count_in_stock} Units</span>
                        ) : (
                          <span className="badge badge-danger">Out of Stock</span>
                        )}
                      </td>
                      <td>
                        ⭐ {prod.rating} ({prod.num_reviews})
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button
                            onClick={() => openEditModal(prod)}
                            className="btn btn-secondary btn-sm"
                            title="Edit Product"
                          >
                            <Edit2 size={14} />
                          </button>
                          <button
                            onClick={() => handleDelete(prod.id, prod.name)}
                            className="btn btn-secondary btn-sm"
                            style={{ color: 'var(--danger)', borderColor: 'var(--danger-border)' }}
                            title="Delete Product"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Create / Edit Modal Dialog */}
      {modalOpen && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.6)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 2000,
            padding: '20px',
          }}
        >
          <div
            className="card"
            style={{
              width: '100%',
              maxWidth: '600px',
              maxHeight: '90vh',
              overflowY: 'auto',
              padding: '32px',
              borderRadius: 'var(--radius-xl)',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '20px',
              }}
            >
              <h2 style={{ fontSize: '1.35rem', fontWeight: 800 }}>
                {isEditing ? `Edit Product #${editId}` : 'Add New Product'}
              </h2>
              <button
                onClick={() => setModalOpen(false)}
                className="btn btn-secondary btn-sm"
                style={{ padding: '6px' }}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={submitHandler}>
              <div className="form-group">
                <label className="form-label">Product Name</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. Sony Wireless Noise Cancelling Headphones"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div className="form-group">
                  <label className="form-label">Price (INR ₹)</label>
                  <input
                    type="number"
                    step="0.01"
                    className="form-control"
                    placeholder="e.g. 24999.00"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Stock Quantity</label>
                  <input
                    type="number"
                    className="form-control"
                    placeholder="e.g. 15"
                    value={countInStock}
                    onChange={(e) => setCountInStock(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div className="form-group">
                  <label className="form-label">Category</label>
                  <select
                    className="form-select"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    required
                  >
                    <option value="Electronics">Electronics</option>
                    <option value="Fashion">Fashion</option>
                    <option value="Books">Books</option>
                    <option value="Accessories">Accessories</option>
                    <option value="Home">Home</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Brand</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. Sony, Apple, Nike"
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Product Image URL</label>
                <input
                  type="url"
                  className="form-control"
                  placeholder="https://images.unsplash.com/..."
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea
                  className="form-control"
                  rows="3"
                  placeholder="Detailed product features, specifications..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                />
              </div>

              <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
                <button type="button" onClick={() => setModalOpen(false)} className="btn btn-secondary btn-block">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary btn-block">
                  <Save size={16} />
                  <span>{isEditing ? 'Save Updates' : 'Create Product'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProductListScreen;
