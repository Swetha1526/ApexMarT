import User from '../models/User.js';
import generateToken from '../utils/generateToken.js';
import asyncHandler from '../middleware/asyncHandler.js';

// @desc    Auth user & get token (login)
// @route   POST /api/users/login/
// @access  Public
export const authUser = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;
  const loginIdentifier = (username || email || '').trim().toLowerCase();

  if (!loginIdentifier || !password) {
    return res.status(400).json({ detail: 'Please provide both email/username and password.' });
  }

  const user = await User.findOne({
    $or: [{ email: loginIdentifier }, { username: loginIdentifier }],
  });

  if (user && (await user.matchPassword(password))) {
    res.json({
      id: user._id,
      _id: user._id,
      username: user.username || user.email.split('@')[0],
      email: user.email,
      name: user.name,
      isAdmin: user.isAdmin,
      address: user.address || '',
      city: user.city || '',
      postal_code: user.postal_code || '',
      country: user.country || '',
      phone_number: user.phone_number || '',
      token: generateToken(user._id),
    });
  } else {
    res.status(401).json({ detail: 'Invalid email or password.' });
  }
});

// @desc    Register a new user
// @route   POST /api/users/register/
// @access  Public
export const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, confirm_password, address, city, postal_code, country, phone_number } = req.body;

  if (!email || !password) {
    return res.status(400).json({ detail: 'Email and password are required.' });
  }

  if (confirm_password && password !== confirm_password) {
    return res.status(400).json({ detail: 'Passwords do not match.' });
  }

  if (password.length < 6) {
    return res.status(400).json({ detail: 'Password must be at least 6 characters.' });
  }

  const cleanEmail = email.trim().toLowerCase();
  const userExists = await User.findOne({ email: cleanEmail });

  if (userExists) {
    return res.status(400).json({ detail: 'User with this email already exists.' });
  }

  const baseUsername = cleanEmail.split('@')[0];
  let username = baseUsername;
  let count = 1;
  while (await User.findOne({ username })) {
    username = `${baseUsername}${count}`;
    count++;
  }

  const user = await User.create({
    name: name || baseUsername,
    email: cleanEmail,
    username,
    password,
    address: address || '',
    city: city || '',
    postal_code: postal_code || '',
    country: country || '',
    phone_number: phone_number || '',
  });

  if (user) {
    res.status(201).json({
      id: user._id,
      _id: user._id,
      username: user.username,
      email: user.email,
      name: user.name,
      isAdmin: user.isAdmin,
      address: user.address,
      city: user.city,
      postal_code: user.postal_code,
      country: user.country,
      phone_number: user.phone_number,
      token: generateToken(user._id),
    });
  } else {
    res.status(400).json({ detail: 'Invalid user data provided.' });
  }
});

// @desc    Get user profile
// @route   GET /api/users/profile/
// @access  Private
export const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    res.json({
      id: user._id,
      _id: user._id,
      username: user.username,
      email: user.email,
      name: user.name,
      isAdmin: user.isAdmin,
      address: user.address || '',
      city: user.city || '',
      postal_code: user.postal_code || '',
      country: user.country || '',
      phone_number: user.phone_number || '',
    });
  } else {
    res.status(404).json({ detail: 'User not found.' });
  }
});

// @desc    Update user profile
// @route   PUT /api/users/profile/update/
// @access  Private
export const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.name = req.body.name || user.name;

    if (req.body.email && req.body.email.toLowerCase() !== user.email) {
      const emailTaken = await User.findOne({ email: req.body.email.toLowerCase() });
      if (emailTaken) {
        return res.status(400).json({ detail: 'Email is already taken by another account.' });
      }
      user.email = req.body.email.toLowerCase();
    }

    if (req.body.password) {
      if (req.body.password.length < 6) {
        return res.status(400).json({ detail: 'Password must be at least 6 characters.' });
      }
      user.password = req.body.password;
    }

    if (req.body.address !== undefined) user.address = req.body.address;
    if (req.body.city !== undefined) user.city = req.body.city;
    if (req.body.postal_code !== undefined) user.postal_code = req.body.postal_code;
    if (req.body.country !== undefined) user.country = req.body.country;
    if (req.body.phone_number !== undefined) user.phone_number = req.body.phone_number;

    const updatedUser = await user.save();

    res.json({
      id: updatedUser._id,
      _id: updatedUser._id,
      username: updatedUser.username,
      email: updatedUser.email,
      name: updatedUser.name,
      isAdmin: updatedUser.isAdmin,
      address: updatedUser.address,
      city: updatedUser.city,
      postal_code: updatedUser.postal_code,
      country: updatedUser.country,
      phone_number: updatedUser.phone_number,
      token: generateToken(updatedUser._id),
    });
  } else {
    res.status(404).json({ detail: 'User not found.' });
  }
});

// @desc    Get all users (admin)
// @route   GET /api/users/
// @access  Private/Admin
export const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find({}).sort({ createdAt: -1 });
  res.json(users);
});

// @desc    Get user by ID (admin)
// @route   GET /api/users/:id/
// @access  Private/Admin
export const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select('-password');
  if (user) {
    res.json(user);
  } else {
    res.status(404).json({ detail: 'User not found.' });
  }
});

// @desc    Update user (admin)
// @route   PUT /api/users/:id/update/
// @access  Private/Admin
export const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    if (req.body.isAdmin !== undefined) {
      user.isAdmin = Boolean(req.body.isAdmin);
    }

    const updatedUser = await user.save();
    res.json(updatedUser);
  } else {
    res.status(404).json({ detail: 'User not found.' });
  }
});

// @desc    Delete user (admin)
// @route   DELETE /api/users/:id/delete/
// @access  Private/Admin
export const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return res.status(404).json({ detail: 'User not found.' });
  }

  if (user._id.toString() === req.user._id.toString()) {
    return res.status(400).json({ detail: 'You cannot delete yourself.' });
  }

  await User.deleteOne({ _id: user._id });
  res.json({ detail: 'User was deleted successfully.' });
});
