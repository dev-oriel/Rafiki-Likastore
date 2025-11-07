import Product from "../models/product.model.js";

// @desc    Fetch all products (with filtering, search, pagination)
// @route   GET /api/products
// @access  Public
const getAllProducts = async (req, res, next) => {
  try {
    const pageSize = 12; // Number of products per page
    const page = Number(req.query.pageNumber) || 1;

    // 1. Keyword Search (for name, description, category)
    const keyword = req.query.keyword
      ? {
          $or: [
            { name: { $regex: req.query.keyword, $options: "i" } },
            { category: { $regex: req.query.keyword, $options: "i" } },
            { description: { $regex: req.query.keyword, $options: "i" } },
          ],
        }
      : {};

    // 2. Category Filter
    const category = req.query.category ? { category: req.query.category } : {};

    // 3. Price Filter (e.g., ?price[gte]=100&price[lte]=500)
    const price = req.query.price
      ? {
          price: {
            $gte: Number(req.query.price.gte) || 0,
            $lte: Number(req.query.price.lte) || 100000,
          },
        }
      : {};

    // 4. Type Filter (e.g., ?type=Whiskey,Gin)
    // Note: Your model uses 'category', so we'll filter on that.
    const type = req.query.type
      ? { category: { $in: req.query.type.split(",") } }
      : {};

    // Combine all filters
    const filter = { ...keyword, ...category, ...price, ...type };

    const count = await Product.countDocuments(filter);
    const products = await Product.find(filter)
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

export { getAllProducts, getProductById };
