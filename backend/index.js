import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import { notFound, errorHandler } from "./middleware/error.middleware.js";

// Import Routes
import productRoutes from "./routes/product.routes.js";
import userRoutes from "./routes/user.routes.js";
import orderRoutes from "./routes/order.routes.js";
import paymentRoutes from "./routes/payment.routes.js";

dotenv.config();

const app = express();

// Enable CORS
app.use(
  cors({
    origin: process.env.FRONTEND_URL, // Allow your frontend to connect
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes
app.get("/api", (req, res) => {
  res.send("Rafiki Likastore API is running...");
});

// Use Routes
app.use("/api/products", productRoutes);
app.use("/api/users", userRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/payments", paymentRoutes);

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
