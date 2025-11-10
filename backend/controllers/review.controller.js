import Review from "../models/review.model.js";
import Order from "../models/order.model.js";

// @desc    Create a new review
// @route   POST /api/reviews
// @access  Private
const createReview = async (req, res, next) => {
  try {
    const { orderId, rating, comment } = req.body;
    const userId = req.user._id;

    // 1. Check if the order exists and belongs to the user
    const order = await Order.findById(orderId);
    if (!order) {
      res.status(404);
      throw new Error("Order not found");
    }
    if (!order.user.equals(userId)) {
      res.status(401);
      throw new Error("Not authorized to review this order");
    }

    // 2. Check if this order has already been reviewed
    const existingReview = await Review.findOne({ order: orderId });
    if (existingReview) {
      res.status(400);
      throw new Error("Order already reviewed");
    }

    // 3. Create and save the new review
    const review = new Review({
      user: userId,
      order: orderId,
      rating,
      comment,
    });

    await review.save();
    res.status(201).json({ message: "Review added" });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all featured reviews (for homepage testimonials)
// @route   GET /api/reviews/featured
// @access  Public
const getFeaturedReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find({ isFeatured: true })
      .populate("user", "name avatar") // Get user's name and avatar
      .sort({ createdAt: -1 })
      .limit(3); // Get the 3 most recent featured reviews

    res.json(reviews);
  } catch (error) {
    next(error);
  }
};

export { createReview, getFeaturedReviews };
