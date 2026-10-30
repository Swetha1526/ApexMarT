import Order from '../models/Order.js';
import Product from '../models/Product.js';
import User from '../models/User.js';
import asyncHandler from '../middleware/asyncHandler.js';

// @desc    Create new order
// @route   POST /api/orders/add/
// @access  Private
export const addOrderItems = asyncHandler(async (req, res) => {
  const {
    orderItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    isPaid,
  } = req.body;

  if (!orderItems || orderItems.length === 0) {
    return res.status(400).json({ detail: 'No order items provided.' });
  }

  const formattedItems = [];
  for (const item of orderItems) {
    const prodId = item.product || item.id || item._id;
    const qty = Number(item.qty || item.quantity || 1);

    if (prodId) {
      try {
        const prod = await Product.findById(prodId);
        if (prod) {
          prod.count_in_stock = Math.max(0, prod.count_in_stock - qty);
          await prod.save();
        }
      } catch (err) {
        console.error('[Stock Adjustment Error]', err.message);
      }
    }

    formattedItems.push({
      name: item.name,
      quantity: qty,
      qty: qty,
      image: item.image || '',
      price: Number(item.price || 0),
      product: prodId,
    });
  }

  const order = new Order({
    user: req.user._id,
    orderItems: formattedItems,
    shippingAddress: {
      address: shippingAddress?.address || '',
      city: shippingAddress?.city || '',
      postal_code: shippingAddress?.postalCode || shippingAddress?.postal_code || '',
      postalCode: shippingAddress?.postalCode || shippingAddress?.postal_code || '',
      country: shippingAddress?.country || '',
      shipping_price: Number(shippingPrice || 0),
    },
    payment_method: paymentMethod || 'Simulated Payment',
    tax_price: Number(taxPrice || 0),
    shipping_price: Number(shippingPrice || 0),
    total_price: Number(totalPrice || 0),
    is_paid: Boolean(isPaid),
    paid_at: isPaid ? new Date() : null,
  });

  const createdOrder = await order.save();
  await createdOrder.populate('user', 'id name email');

  res.status(201).json(createdOrder);
});

// @desc    Get logged in user's orders
// @route   GET /api/orders/myorders/
// @access  Private
export const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id })
    .populate('user', 'id name email')
    .sort({ createdAt: -1 });

  res.json(orders);
});

// @desc    Get order by ID
// @route   GET /api/orders/:id/
// @access  Private
export const getOrderById = asyncHandler(async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('user', 'id name email');

    if (!order) {
      return res.status(404).json({ detail: 'Order does not exist.' });
    }

    const orderUserId = order.user?._id?.toString() || order.user?.toString();
    const currentUserId = req.user._id.toString();

    if (req.user.isAdmin || orderUserId === currentUserId) {
      res.json(order);
    } else {
      res.status(403).json({ detail: 'Not authorized to view this order.' });
    }
  } catch (error) {
    res.status(404).json({ detail: 'Order does not exist.' });
  }
});

// @desc    Update order to paid
// @route   PUT /api/orders/:id/pay/
// @access  Private
export const updateOrderToPaid = asyncHandler(async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ detail: 'Order does not exist.' });
    }

    const orderUserId = order.user?._id?.toString() || order.user?.toString();
    if (!req.user.isAdmin && orderUserId !== req.user._id.toString()) {
      return res.status(403).json({ detail: 'Not authorized to modify this order.' });
    }

    order.is_paid = true;
    order.paid_at = new Date();

    const updatedOrder = await order.save();
    await updatedOrder.populate('user', 'id name email');

    res.json(updatedOrder);
  } catch (error) {
    res.status(404).json({ detail: 'Order does not exist.' });
  }
});

// @desc    Update order to delivered (admin)
// @route   PUT /api/orders/:id/deliver/
// @access  Private/Admin
export const updateOrderToDelivered = asyncHandler(async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ detail: 'Order does not exist.' });
    }

    order.is_delivered = true;
    order.delivered_at = new Date();

    const updatedOrder = await order.save();
    await updatedOrder.populate('user', 'id name email');

    res.json(updatedOrder);
  } catch (error) {
    res.status(404).json({ detail: 'Order does not exist.' });
  }
});

// @desc    Get all orders (admin)
// @route   GET /api/orders/
// @access  Private/Admin
export const getOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({})
    .populate('user', 'id name email')
    .sort({ createdAt: -1 });

  res.json(orders);
});

// @desc    Get admin dashboard summary metrics
// @route   GET /api/orders/summary/
// @access  Private/Admin
export const getAdminSummary = asyncHandler(async (req, res) => {
  const total_users = await User.countDocuments();
  const total_products = await Product.countDocuments();
  const total_orders = await Order.countDocuments();

  const revenueResult = await Order.aggregate([
    { $match: { is_paid: true } },
    { $group: { _id: null, total: { $sum: '$total_price' } } },
  ]);

  const total_revenue =
    revenueResult.length > 0 ? Math.round(revenueResult[0].total * 100) / 100 : 0.0;

  const recent_orders = await Order.find({})
    .populate('user', 'id name email')
    .sort({ createdAt: -1 })
    .limit(5);

  res.json({
    total_users,
    total_products,
    total_orders,
    total_revenue,
    recent_orders,
  });
});
