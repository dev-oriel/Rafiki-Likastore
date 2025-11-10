import User from "../models/user.model.js";
import Product from "../models/product.model.js";
import Order from "../models/order.model.js";
import Review from "../models/review.model.js";

// --- Stats Function ---

// @desc    Get dashboard stats
// @route   GET /api/admin/stats
// @access  Private/Admin
const getDashboardStats = async (req, res, next) => {
  try {
    // 1. Get total revenue from paid orders
    const paidOrders = await Order.find({ isPaid: true });
    const totalRevenue = paidOrders.reduce(
      (acc, order) => acc + order.totalPrice,
      0
    );

    // 2. Get counts
    const totalOrders = await Order.countDocuments();
    const totalProducts = await Product.countDocuments();
    const totalUsers = await User.countDocuments({ isAdmin: false }); // Only count non-admin users

    // 3. Get recent orders (for dashboard widget)
    const recentOrders = await Order.find({
      "paymentResult.status": { $ne: "Failed" },
    })
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("user", "name");

    res.json({
      totalRevenue,
      totalOrders,
      totalProducts,
      totalUsers,
      recentOrders,
    });
  } catch (error) {
    next(error);
  }
};

// --- User Management ---

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find({});
    res.json(users);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a user
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (user) {
      if (user.isAdmin) {
        res.status(400);
        throw new Error("Cannot delete admin user");
      }
      await user.deleteOne();
      res.json({ message: "User removed" });
    } else {
      res.status(404);
      throw new Error("User not found");
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Get user by ID
// @route   GET /api/admin/users/:id
// @access  Private/Admin
const getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (user) {
      res.json(user);
    } else {
      res.status(404);
      throw new Error("User not found");
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Update user (e.g., make admin)
// @route   PUT /api/admin/users/:id
// @access  Private/Admin
const updateUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      user.isAdmin = Boolean(req.body.isAdmin);

      const updatedUser = await user.save();
      res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        isAdmin: updatedUser.isAdmin,
      });
    } else {
      res.status(404);
      throw new Error("User not found");
    }
  } catch (error) {
    next(error);
  }
};

// --- Product Management ---

// @desc    Get all products (for admin list, no pagination)
// @route   GET /api/admin/products
// @access  Private/Admin
const getAllProductsForAdmin = async (req, res, next) => {
  try {
    // Find all products, sort by newest
    const products = await Product.find({}).sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    next(error);
  }
};

// @desc    Create a product
// @route   POST /api/admin/products
// @access  Private/Admin
const createProduct = async (req, res, next) => {
  try {
    const {
      name,
      price,
      description,
      image,
      category,
      countInStock,
      isOnSale,
      discountedPrice,
      isPopular,
    } = req.body;

    const product = new Product({
      name,
      price,
      description,
      image,
      category,
      countInStock,
      user: req.user._id,
      isOnSale: Boolean(isOnSale),
      discountedPrice: Number(discountedPrice) || 0,
      isPopular: Boolean(isPopular),
    });

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error) {
    next(error);
  }
};

// @desc    Update a product
// @route   PUT /api/admin/products/:id
// @access  Private/Admin
const updateProduct = async (req, res, next) => {
  try {
    const {
      name,
      price,
      description,
      image,
      category,
      countInStock,
      isOnSale,
      discountedPrice,
      isPopular,
    } = req.body;

    const product = await Product.findById(req.params.id);

    if (product) {
      product.name = name;
      product.price = price;
      product.description = description;
      product.image = image;
      product.category = category;
      product.countInStock = countInStock;
      product.isOnSale = Boolean(isOnSale);
      product.discountedPrice = Number(discountedPrice) || 0;
      product.isPopular = Boolean(isPopular);

      const updatedProduct = await product.save();
      res.json(updatedProduct);
    } else {
      res.status(404);
      throw new Error("Product not found");
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a product
// @route   DELETE /api/admin/products/:id
// @access  Private/Admin
const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      await product.deleteOne();
      res.json({ message: "Product removed" });
    } else {
      res.status(404);
      throw new Error("Product not found");
    }
  } catch (error) {
    next(error);
  }
};

// --- Order Management ---

// @desc    Get all orders
// @route   GET /api/admin/orders
// @access  Private/Admin
const getAllOrders = async (req, res, next) => {
  try {
    const filter = {};

    if (req.query.isPaid) {
      filter.isPaid = true;
    }

    const query = Order.find(filter)
      .populate("user", "id name")
      .sort({ createdAt: -1 });

    if (req.query.limit) {
      query.limit(parseInt(req.query.limit, 10));
    }

    const orders = await query;
    res.json(orders);
  } catch (error) {
    next(error);
  }
};

// @desc    Update order to delivered
// @route   PUT /api/admin/orders/:id/deliver
// @access  Private/Admin
const updateOrderToDelivered = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);
    if (order) {
      order.isDelivered = true;
      order.deliveredAt = Date.now();
      const updatedOrder = await order.save();
      res.json(updatedOrder);
    } else {
      res.status(404);
      throw new Error("Order not found");
    }
  } catch (error) {
    next(error);
  }
};

// --- NEW SECTION: Review Management ---

// @desc    Get all reviews
// @route   GET /api/admin/reviews
// @access  Private/Admin
const getAllReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find({})
      .populate("user", "name email")
      // --- THIS IS THE FIX ---
      // .populate('order', '_id') // This line was removed
      // --- END OF FIX ---
      .sort({ createdAt: -1 });
    res.json(reviews);
  } catch (error) {
    next(error);
  }
};

// @desc    Update a review (e.g., feature it)
// @route   PUT /api/admin/reviews/:id
// @access  Private/Admin
const updateReview = async (req, res, next) => {
  try {
    const { isFeatured } = req.body;
    const review = await Review.findById(req.params.id);

    if (review) {
      review.isFeatured = Boolean(isFeatured);
      const updatedReview = await review.save();
      res.json(updatedReview);
    } else {
      res.status(404);
      throw new Error("Review not found");
    }
  } catch (error) {
    next(error);
  }
};

// --- END NEW SECTION ---

export {
  getDashboardStats,
  getAllUsers,
  deleteUser,
  getUserById,
  updateUser,
  getAllProductsForAdmin,
  createProduct,
  updateProduct,
  deleteProduct,
  getAllOrders,
  updateOrderToDelivered,
  getAllReviews,
  updateReview,
};
