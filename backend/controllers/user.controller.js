import User from "../models/user.model.js";
import generateToken from "../utils/generateToken.js";

// Helper function to set the cookie
const sendTokenResponse = async (res, user, statusCode) => {
  const token = generateToken(user._id);

  const options = {
    expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
    httpOnly: true, // Prevents client-side JS from accessing it
    secure: process.env.NODE_ENV !== "development", // Only send over HTTPS in production
    sameSite: "strict", // Mitigates CSRF attacks
  };

  // Populate favorites before sending
  await user.populate("favorites");

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
      favorites: user.favorites, // Send populated favorites
    });
};

// @desc    Register a new user
// @route   POST /api/users/register
// @access  Public
const registerUser = async (req, res, next) => {
  try {
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
    const user = await User.create({
      name,
      email,
      password,
      phone,
      dob,
    });
    if (user) {
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
    const user = await User.findOne({ email });
    if (user && (await user.matchPassword(password))) {
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
    expires: new Date(0),
  });
  res.status(200).json({ message: "Logged out successfully" });
};

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = async (req, res, next) => {
  try {
    // Re-fetch user and populate favorites
    const user = await User.findById(req.user._id).populate("favorites");

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
        favorites: user.favorites, // Send populated favorites
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
      await updatedUser.populate("favorites"); // Re-populate

      res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        phone: updatedUser.phone,
        isAdmin: updatedUser.isAdmin,
        avatar: updatedUser.avatar,
        addresses: updatedUser.addresses,
        paymentMethods: updatedUser.paymentMethods,
        favorites: updatedUser.favorites,
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
      user.addresses = addresses;
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
      user.paymentMethods = paymentMethods;
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

// @desc    Add/Remove a favorite product
// @route   PUT /api/users/profile/favorites
// @access  Private
const toggleFavorite = async (req, res, next) => {
  try {
    const { productId } = req.body;
    if (!productId) {
      res.status(400);
      throw new Error("Product ID is required");
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      res.status(404);
      throw new Error("User not found");
    }

    const isFavorited = user.favorites.includes(productId);

    if (isFavorited) {
      user.favorites.pull(productId);
    } else {
      user.favorites.push(productId);
    }

    await user.save();
    await user.populate("favorites"); // Re-populate to send back full objects

    res.json(user.favorites); // Send back the updated list
  } catch (error) {
    next(error);
  }
};

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
  toggleFavorite, // <-- Added missing function
};
