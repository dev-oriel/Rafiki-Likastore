import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path"; // 1. Import path
import { fileURLToPath } from "url"; // 2. Import url
import connectDB from "./config/db.js";
import { notFound, errorHandler } from "./middleware/error.middleware.js";

// Import Routes
import productRoutes from "./routes/product.routes.js";
import userRoutes from "./routes/user.routes.js";
import orderRoutes from "./routes/order.routes.js";
import paymentRoutes from "./routes/payment.routes.js";
import uploadRoutes from "./routes/upload.routes.js"; // 3. Import upload route

dotenv.config();

// --- Get directory name in ES Modules ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// --- End ---

const app = express();

// --- START CORS CONFIGURATION ---
app.use(
  cors({
    origin: process.env.FRONTEND_URL, // Must be exactly 'http://localhost:5173'
    credentials: true, // This allows cookies to be sent
  })
);
// --- END CORS CONFIGURATION ---

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser()); // Make sure this is used

// API Routes
app.get("/api", (req, res) => {
  res.send("Rafiki Likastore API is running...");
});

// Use Routes
app.use("/api/products", productRoutes);
app.use("/api/users", userRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/upload", uploadRoutes); // 4. Use the new upload route

// 5. Serve static files from the 'uploads' directory
app.use("/uploads", express.static(path.join(__dirname, "/uploads")));

// Error Handling Middleware
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(
        `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`
      );
    });
  } catch (err) {
    console.error(`Error: ${err.message}`);
    process.exit(1);
  }
};

startServer();
export default app;
