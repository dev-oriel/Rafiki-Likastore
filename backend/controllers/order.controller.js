import Order from "../models/order.model.js";

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const createOrder = async (req, res, next) => {
  try {
    const { orderItems, deliveryLocation, totalPrice } = req.body;

    if (orderItems && orderItems.length === 0) {
      res.status(400);
      throw new Error("No order items");
    } else {
      const order = new Order({
        orderItems,
        user: req.user._id,
        deliveryLocation,
        totalPrice,
      });

      const createdOrder = await order.save();
      res.status(201).json(createdOrder);
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id).populate(
      "user",
      "name email phone"
    );

    if (order) {
      // Ensure only the user who made the order or an admin can see it
      if (order.user._id.equals(req.user._id) || req.user.isAdmin) {
        res.json(order);
      } else {
        res.status(401);
        throw new Error("Not authorized to view this order");
      }
    } else {
      res.status(404);
      throw new Error("Order not found");
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Get logged in user's orders
// @route   GET /api/orders/myorders
// @access  Private
const getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user._id });
    res.json(orders);
  } catch (error) {
    next(error);
  }
};

// @desc    Update order to paid
// @route   PUT /api/orders/:id/pay
// @access  Private (will be called by payment controller)
const updateOrderToPaid = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);

    if (order) {
      order.isPaid = true;
      order.paidAt = Date.now();
      order.paymentResult = {
        id: req.body.id, // M-Pesa transaction ID
        status: req.body.status,
        update_time: req.body.update_time,
      };

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

// @desc    Get order payment status
// @route   GET /api/orders/:id/status
// @access  Private
const getOrderPaymentStatus = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);

    if (order) {
      // Ensure only the user who made the order or an admin can see it
      if (order.user._id.equals(req.user._id) || req.user.isAdmin) {
        // --- THIS IS THE FIX ---
        res.json({
          isPaid: order.isPaid,
          isDelivered: order.isDelivered,
          // Send the payment status, or 'Pending' if no result yet
          paymentStatus: order.paymentResult?.status || "Pending",
        });
        // --- END OF FIX ---
      } else {
        res.status(401);
        throw new Error("Not authorized to view this order");
      }
    } else {
      res.status(404);
      throw new Error("Order not found");
    }
  } catch (error) {
    next(error);
  }
};

export {
  createOrder,
  getOrderById,
  getMyOrders,
  updateOrderToPaid,
  getOrderPaymentStatus,
};
