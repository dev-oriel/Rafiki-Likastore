import User from "../models/user.model.js";
import generateToken from "../utils/generateToken.js";

// Helper function to set the cookie
const sendTokenResponse = (res, user, statusCode) => {
  const token = generateToken(user._id);

  const options = {
    expires: new Date(
      Date.now() + 30 * 24 * 60 * 60 * 1000 // 30 days
    ),
    httpOnly: true, // Prevents client-side JS from accessing it
    secure: process.env.NODE_ENV !== "development", // Only send over HTTPS in production
    sameSite: "strict", // Mitigates CSRF attacks
  };

  res
    .status(statusCode)
    .cookie("jwt", token, options) // Set the cookie
    .json({
      // Send back user data *without* the token
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      isAdmin: user.isAdmin,
      avatar: user.avatar,
      addresses: user.addresses,
      paymentMethods: user.paymentMethods,
    });
};

// @desc    Register a new user
// @route   POST /api/users/register
// @access  Public
const registerUser = async (req, res, next) => {
  try {
    // 1. Get all fields from the body
    const { name, email, password, phone, dob } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      res.status(400);
      throw new Error("User already exists");
    }

    const phoneExists = await User.findOne({ phone });
    if (phoneExists) {
      res.status(400);
      throw new Error("Phone number already in use");
    }

    // 2. Create user with all fields
    const user = await User.create({
      name,
      email,
      password,
      phone,
      dob, // Save the date of birth
    });

    if (user) {
      // 3. Send response (which logs them in and sets cookie)
      sendTokenResponse(res, user, 201);
    } else {
      res.status(400);
      throw new Error("Invalid user data");
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Auth user & get token (Login)
// @route   POST /api/users/login
// @access  Public
const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Find user and include all profile fields
    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      // 1. Send response (sets cookie and sends user data)
      sendTokenResponse(res, user, 200);
    } else {
      res.status(401);
      throw new Error("Invalid email or password");
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Logout user / clear cookie
// @route   POST /api/users/logout
// @access  Public
const logoutUser = (req, res, next) => {
  res.cookie("jwt", "", {
    httpOnly: true,
    expires: new Date(0), // Expire the cookie immediately
  });
  res.status(200).json({ message: "Logged out successfully" });
};

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = async (req, res, next) => {
  try {
    // req.user is set by 'protect' middleware
    // We re-fetch by ID to get the most current data
    const user = await User.findById(req.user._id);

    if (user) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        isAdmin: user.isAdmin,
        avatar: user.avatar,
        addresses: user.addresses,
        paymentMethods: user.paymentMethods,
      });
    } else {
      res.status(404);
      throw new Error("User not found");
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Update user profile (name, email, phone, avatar)
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      user.phone = req.body.phone || user.phone;
      if (req.body.avatar) {
        user.avatar = req.body.avatar;
      }

      const updatedUser = await user.save();

      // Send back updated data
      res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        phone: updatedUser.phone,
        isAdmin: updatedUser.isAdmin,
        avatar: updatedUser.avatar,
        addresses: updatedUser.addresses,
        paymentMethods: updatedUser.paymentMethods,
      });
    } else {
      res.status(404);
      throw new Error("User not found");
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Update user addresses
// @route   PUT /api/users/profile/addresses
// @access  Private
const updateUserAddresses = async (req, res, next) => {
  try {
    const { addresses } = req.body;
    const user = await User.findById(req.user._id);

    if (user) {
      user.addresses = addresses; // Completely replace the array
      await user.save();
      res.status(200).json({ message: "Addresses updated" });
    } else {
      res.status(404);
      throw new Error("User not found");
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Update user payment methods
// @route   PUT /api/users/profile/payment-methods
// @access  Private
const updateUserPaymentMethods = async (req, res, next) => {
  try {
    const { paymentMethods } = req.body;
    const user = await User.findById(req.user._id);

    if (user) {
      user.paymentMethods = paymentMethods; // Completely replace
      await user.save();
      res.status(200).json({ message: "Payment methods updated" });
    } else {
      res.status(404);
      throw new Error("User not found");
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Get all users (Admin only)
// @route   GET /api/users
// @access  Private/Admin
const getUSers = async (req, res) => {
  try {
    const users = await User.find();
    if (users) {
      res.status(200).json({ sucess: true, message: users });
    }
  } catch (error) {
    res.status(404);
    throw new Error("Users not found");
  }
};

export {
  getUSers,
  registerUser,
  loginUser,
  logoutUser,
  getUserProfile,
  updateUserProfile,
  updateUserAddresses,
  updateUserPaymentMethods,
};
