import mongoose from "mongoose";
import bcrypt from "bcryptjs";

// (addressSchema and paymentMethodSchema are unchanged)
const addressSchema = new mongoose.Schema({
  label: { type: String, required: true },
  details: { type: String, required: true },
  isPrimary: { type: Boolean, default: false },
});

const paymentMethodSchema = new mongoose.Schema({
  type: { type: String, default: "M-Pesa" },
  number: { type: String, required: true },
  primary: { type: Boolean, default: false },
});

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: false, // 1. Make password optional
    },
    dob: {
      type: Date,
      required: false, // 2. Make dob optional
    },
    phone: {
      type: String,
      required: false, // 3. Make phone optional
      unique: true,
      sparse: true, // Allows multiple null/empty values
    },
    isAdmin: {
      type: Boolean,
      required: true,
      default: false,
    },
    avatar: {
      type: String,
    },
    addresses: [addressSchema],
    paymentMethods: [paymentMethodSchema],
    favorites: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
    ],
  },
  {
    timestamps: true,
  }
);

userSchema.methods.matchPassword = async function (enteredPassword) {
  // If user has no password (Google-only login), return false
  if (!this.password) {
    return false;
  }
  return await bcrypt.compare(enteredPassword, this.password);
};

// Middleware to hash password ONLY if it's provided/modified
userSchema.pre("save", async function (next) {
  if (!this.isModified("password") || !this.password) {
    next();
    return; // 4. Don't try to hash a null password
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

const User = mongoose.model("User", userSchema);

export default User;
