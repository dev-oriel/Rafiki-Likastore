import mongoose from "mongoose";
import bcrypt from "bcryptjs";

// --- New Schemas for Profile ---
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
// --- End New Schemas ---

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
      required: true,
    },
    dob: {
      type: Date,
      required: true,
    },
    phone: {
      type: String,
      required: true,
      unique: true,
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
  },
  {
    timestamps: true,
  }
);

// Method to compare entered password with hashed password
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Middleware to hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

const User = mongoose.model("User", userSchema);

export default User;
