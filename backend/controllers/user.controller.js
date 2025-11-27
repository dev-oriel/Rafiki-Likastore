import User from "../models/user.model.js";
import generateToken from "../utils/generateToken.js";
import { OAuth2Client } from "google-auth-library";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Helper function to set the cookie
const sendTokenResponse = async (res, user, statusCode) => {
  const token = generateToken(user._id);

  // --- CRITICAL FIX FOR DEPLOYMENT ---
  const isProduction = process.env.NODE_ENV === "production";

  const options = {
    expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
    httpOnly: true, // Prevents client-side JS from accessing it
    // When on Render (production), we MUST allow cross-site cookies
    sameSite: isProduction ? "none" : "lax",
    secure: isProduction, // Must be true if sameSite is 'none'
  };
  // -----------------------------------

  await user.populate("favorites");

  res
    .status(statusCode)
    .cookie("jwt", token, options) // Set the cookie
    .json({
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      isAdmin: user.isAdmin,
      avatar: user.avatar,
      addresses: user.addresses,
      paymentMethods: user.paymentMethods,
      favorites: user.favorites,
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
  const isProduction = process.env.NODE_ENV === "production";

  res.cookie("jwt", "", {
    httpOnly: true,
    expires: new Date(0),
    // Must match the settings used to set the cookie to successfully delete it
    sameSite: isProduction ? "none" : "lax",
    secure: isProduction,
  });
  res.status(200).json({ message: "Logged out successfully" });
};

// ... (Rest of the file: getUserProfile, updateUserProfile, etc. keep as is)
// Just copy the functions from your existing file for the rest,
// but make sure you export everything at the bottom.

// @desc    Get user profile
const getUserProfile = async (req, res, next) => {
  try {
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
        favorites: user.favorites,
      });
    } else {
      res.status(404);
      throw new Error("User not found");
    }
  } catch (error) {
    next(error);
  }
};

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
      await updatedUser.populate("favorites");
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
    await user.populate("favorites");
    res.json(user.favorites);
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

const googleLogin = async (req, res, next) => {
  try {
    const { credential } = req.body;
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    const { email, name, picture } = payload;
    let user = await User.findOne({ email: email });
    if (user) {
      sendTokenResponse(res, user, 200);
    } else {
      user = await User.create({ name: name, email: email, avatar: picture });
      if (user) {
        sendTokenResponse(res, user, 201);
      } else {
        res.status(400);
        throw new Error("Invalid user data");
      }
    }
  } catch (error) {
    next(error);
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
  toggleFavorite,
  googleLogin,
};
