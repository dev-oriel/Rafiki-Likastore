import Product from "../models/product.model.js";

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

    // --- THIS IS THE FIX ---
    // 2. Category Filter (changed to look for 'type' from req.query)
    if (req.query.type) {
      filter.category = { $in: req.query.type.split(",") };
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

export { getAllProducts, getProductById, getProductMeta };
