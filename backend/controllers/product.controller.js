import Product from "../models/product.model.js";
import User from "../models/user.model.js"; // 1. Import User model

// @desc    Fetch all products (with filtering, search, pagination)
// @route   GET /api/products
// @access  Public
const getAllProducts = async (req, res, next) => {
  try {
    const pageSize = 12; // Number of products per page
    const page = Number(req.query.pageNumber) || 1;

    // --- Build Filter Object ---
    const filter = {};

    // 1. Keyword Search
    if (req.query.keyword) {
      filter.$or = [
        { name: { $regex: req.query.keyword, $options: "i" } },
        { category: { $regex: req.query.keyword, $options: "i" } },
      ];
    }

    // 2. Category Filter
    if (req.query.type) {
      filter.category = { $in: req.query.type.split(",") };
    }

    // 3. Price Filter
    const priceFilter = {};
    if (req.query["price[gte]"]) {
      priceFilter.$gte = Number(req.query["price[gte]"]);
    }
    if (req.query["price[lte]"]) {
      priceFilter.$lte = Number(req.query["price[lte]"]);
    }

    if (priceFilter.$gte || priceFilter.$lte) {
      filter.price = priceFilter;
    }

    // 4. Count total matching documents
    const count = await Product.countDocuments(filter);

    // 5. Find products with filter, sort, pagination
    const products = await Product.find(filter)
      .sort({ createdAt: -1 })
      .limit(pageSize)
      .skip(pageSize * (page - 1));

    res.json({
      products,
      page,
      pages: Math.ceil(count / pageSize),
      count,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Fetch single product
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      res.json(product);
    } else {
      res.status(404);
      throw new Error("Product not found");
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Get product metadata (categories, max price)
// @route   GET /api/products/meta
// @access  Public
const getProductMeta = async (req, res, next) => {
  try {
    // Get all unique categories
    const categories = await Product.find().distinct("category");

    // Find the single most expensive product
    const maxPriceProduct = await Product.find()
      .sort({ price: -1 })
      .limit(1)
      .select("price");

    // Set maxPrice, rounding up to the nearest 100, default to 5000
    const maxPrice =
      maxPriceProduct.length > 0
        ? Math.ceil(maxPriceProduct[0].price / 100) * 100
        : 5000;

    res.json({ categories, maxPrice });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all products on sale
// @route   GET /api/products/offers
// @access  Public
const getOnSaleProducts = async (req, res, next) => {
  try {
    const products = await Product.find({ isOnSale: true });
    res.json(products);
  } catch (error) {
    next(error);
  }
};

// @desc    Get all products marked as popular
// @route   GET /api/products/popular
// @access  Public
const getPopularProducts = async (req, res, next) => {
  try {
    const products = await Product.find({ isPopular: true }).limit(4);
    res.json(products);
  } catch (error) {
    next(error);
  }
};

// --- NEW FUNCTION ---
// @desc    Get 4 most favorited products
// @route   GET /api/products/favorites
// @access  Public
const getStudentFavorites = async (req, res, next) => {
  try {
    const favoriteProducts = await User.aggregate([
      // 1. Deconstruct the favorites array from all users
      { $unwind: "$favorites" },
      // 2. Group by the product ID and count how many times it appears
      {
        $group: {
          _id: "$favorites",
          count: { $sum: 1 },
        },
      },
      // 3. Sort by the highest count
      { $sort: { count: -1 } },
      // 4. Get the top 4
      { $limit: 4 },
      // 5. Look up the full product details from the 'products' collection
      {
        $lookup: {
          from: "products",
          localField: "_id",
          foreignField: "_id",
          as: "productDetails",
        },
      },
      // 6. Unwind the productDetails array (since $lookup returns an array)
      { $unwind: "$productDetails" },
      // 7. Replace the root to return the product object itself
      { $replaceRoot: { newRoot: "$productDetails" } },
    ]);
    res.json(favoriteProducts);
  } catch (error) {
    next(error);
  }
};
// --- END NEW FUNCTION ---

export {
  getAllProducts,
  getProductById,
  getProductMeta,
  getOnSaleProducts,
  getPopularProducts,
  getStudentFavorites, // 3. Export the new function
};
