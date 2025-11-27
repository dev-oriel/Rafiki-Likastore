import Product from "../models/product.model.js";
import User from "../models/user.model.js"; // 1. Import User model

// @desc    Fetch all products (with filtering, search, pagination)
// @route   GET /api/products
// @access  Public
const getAllProducts = async (req, res, next) => {
  try {
    const pageSize = 12;
    const page = Number(req.query.pageNumber) || 1;

    const filter = {};

    // 1. Keyword Search
    if (req.query.keyword) {
      filter.$or = [
        { name: { $regex: req.query.keyword, $options: "i" } },
        { category: { $regex: req.query.keyword, $options: "i" } },
      ];
    }

    // --- THIS IS THE FIX ---
    // 2. Category Filter (Must match frontend 'category' param)
    if (req.query.category) {
      filter.category = { $in: req.query.category.split(",") };
    }
    // --- END OF FIX ---

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

    const count = await Product.countDocuments(filter);

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

// @desc    Get product metadata
// @route   GET /api/products/meta
// @access  Public
const getProductMeta = async (req, res, next) => {
  try {
    const categories = await Product.find().distinct("category");
    const maxPriceProduct = await Product.find()
      .sort({ price: -1 })
      .limit(1)
      .select("price");

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

// --- MISSING FUNCTION 1 ---
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

// --- MISSING FUNCTION 2 ---
// @desc    Get 4 most favorited products
// @route   GET /api/products/favorites
// @access  Public
const getStudentFavorites = async (req, res, next) => {
  try {
    const favoriteProducts = await User.aggregate([
      { $unwind: "$favorites" },
      {
        $group: {
          _id: "$favorites",
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
      { $limit: 4 },
      {
        $lookup: {
          from: "products",
          localField: "_id",
          foreignField: "_id",
          as: "productDetails",
        },
      },
      { $unwind: "$productDetails" },
      { $replaceRoot: { newRoot: "$productDetails" } },
    ]);
    res.json(favoriteProducts);
  } catch (error) {
    next(error);
  }
};

export {
  getAllProducts,
  getProductById,
  getProductMeta,
  getOnSaleProducts,
  getPopularProducts, // Exporting missing function
  getStudentFavorites, // Exporting missing function
};
