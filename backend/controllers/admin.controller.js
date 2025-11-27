import User from "../models/user.model.js";
import Product from "../models/product.model.js";
import Order from "../models/order.model.js";
import Review from "../models/review.model.js";

// --- Stats Function ---
const getDashboardStats = async (req, res, next) => {
  try {
    const paidOrders = await Order.find({ isPaid: true });
    const totalRevenue = paidOrders.reduce(
      (acc, order) => acc + order.totalPrice,
      0
    );
    const totalOrders = await Order.countDocuments();
    const totalProducts = await Product.countDocuments();
    const totalUsers = await User.countDocuments({ isAdmin: false });
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
const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find({});
    res.json(users);
  } catch (error) {
    next(error);
  }
};

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
const getAllProductsForAdmin = async (req, res, next) => {
  try {
    const products = await Product.find({}).sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    next(error);
  }
};

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

// --- Review Management ---
const getAllReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find({})
      .populate("user", "name email")
      .sort({ createdAt: -1 });
    res.json(reviews);
  } catch (error) {
    next(error);
  }
};

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
