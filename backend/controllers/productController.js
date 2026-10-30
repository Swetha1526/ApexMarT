import Product from '../models/Product.js';
import asyncHandler from '../middleware/asyncHandler.js';

// @desc    Fetch all products with keyword, category, and sorting
// @route   GET /api/products/
// @access  Public
export const getProducts = asyncHandler(async (req, res) => {
  const keyword = req.query.keyword ? req.query.keyword.trim() : '';
  const category = req.query.category ? req.query.category.trim() : '';
  const sort = req.query.sort || '-created_at';

  const filter = {};

  if (keyword) {
    filter.$or = [
      { name: { $regex: keyword, $options: 'i' } },
      { description: { $regex: keyword, $options: 'i' } },
      { brand: { $regex: keyword, $options: 'i' } },
      { category: { $regex: keyword, $options: 'i' } },
    ];
  }

  if (category && category.toLowerCase() !== 'all') {
    filter.category = { $regex: `^${category}$`, $options: 'i' };
  }

  let sortCriteria = { createdAt: -1 };
  if (sort === 'price_asc') {
    sortCriteria = { price: 1 };
  } else if (sort === 'price_desc') {
    sortCriteria = { price: -1 };
  } else if (sort === 'rating') {
    sortCriteria = { rating: -1 };
  } else if (sort === 'newest') {
    sortCriteria = { createdAt: -1 };
  }

  const products = await Product.find(filter).sort(sortCriteria);
  const count = products.length;

  res.json({
    products,
    count,
  });
});

// @desc    Get distinct product categories
// @route   GET /api/products/categories/
// @access  Public
export const getCategories = asyncHandler(async (req, res) => {
  const categories = await Product.distinct('category');
  const filtered = categories.filter((c) => c && c.trim() !== '');
  res.json(filtered);
});

// @desc    Get top rated products
// @route   GET /api/products/top/
// @access  Public
export const getTopProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({ rating: { $gte: 4 } })
    .sort({ rating: -1 })
    .limit(5);

  res.json(products);
});

// @desc    Fetch single product by ID
// @route   GET /api/products/:id/
// @access  Public
export const getProductById = asyncHandler(async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ detail: 'Product not found.' });
    }
  } catch (error) {
    res.status(404).json({ detail: 'Product not found.' });
  }
});

// @desc    Create new review
// @route   POST /api/products/:id/reviews/
// @access  Private
export const createProductReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;

  const product = await Product.findById(req.params.id);

  if (!product) {
    return res.status(404).json({ detail: 'Product not found.' });
  }

  const alreadyReviewed = product.reviews.find(
    (r) => r.user.toString() === req.user._id.toString()
  );

  if (alreadyReviewed) {
    return res.status(400).json({ detail: 'Product already reviewed by you.' });
  }

  const ratingNum = Number(rating);
  if (!ratingNum || ratingNum <= 0) {
    return res.status(400).json({ detail: 'Please select a rating.' });
  }

  const review = {
    name: req.user.name || req.user.username,
    rating: ratingNum,
    comment: comment || '',
    user: req.user._id,
  };

  product.reviews.push(review);
  product.num_reviews = product.reviews.length;
  product.rating =
    product.reviews.reduce((acc, item) => item.rating + acc, 0) /
    product.reviews.length;
  product.rating = Math.round(product.rating * 100) / 100;

  await product.save();
  res.status(201).json({ detail: 'Review added successfully.' });
});

// @desc    Create a product (admin)
// @route   POST /api/products/create/
// @access  Private/Admin
export const createProduct = asyncHandler(async (req, res) => {
  const data = req.body || {};

  const product = new Product({
    user: req.user._id,
    name: data.name || 'Sample Product',
    price: data.price || 0.0,
    brand: data.brand || 'Sample Brand',
    count_in_stock: data.count_in_stock || 0,
    category: data.category || 'Sample Category',
    description: data.description || 'Sample Description',
    image:
      data.image ||
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80',
  });

  const createdProduct = await product.save();
  res.status(201).json(createdProduct);
});

// @desc    Update a product (admin)
// @route   PUT /api/products/:id/update/
// @access  Private/Admin
export const updateProduct = asyncHandler(async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ detail: 'Product not found.' });
    }

    const data = req.body;
    product.name = data.name !== undefined ? data.name : product.name;
    product.price = data.price !== undefined ? data.price : product.price;
    product.brand = data.brand !== undefined ? data.brand : product.brand;
    product.count_in_stock =
      data.count_in_stock !== undefined ? data.count_in_stock : product.count_in_stock;
    product.category = data.category !== undefined ? data.category : product.category;
    product.description =
      data.description !== undefined ? data.description : product.description;
    if (data.image) {
      product.image = data.image;
    }

    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } catch (error) {
    res.status(404).json({ detail: 'Product not found.' });
  }
});

// @desc    Delete a product (admin)
// @route   DELETE /api/products/:id/delete/
// @access  Private/Admin
export const deleteProduct = asyncHandler(async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ detail: 'Product not found.' });
    }

    await Product.deleteOne({ _id: product._id });
    res.json({ detail: 'Product deleted successfully.' });
  } catch (error) {
    res.status(404).json({ detail: 'Product not found.' });
  }
});
