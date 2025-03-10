const productService = require("../services/productService");

const createProduct = async (req, res) => {
  try {
    const product = await productService.createProduct(req.body);
    return res.status(201).send(product);
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
};

const deleteProduct = async (req, res) => {
  const productId = req.params.id;
  try {
    const product = await productService.deleteProduct(productId);
    return res.status(201).send(product);
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
};

const updateProduct = async (req, res) => {
  const productId = req.params.id;
  try {
    const product = await productService.updateProduct(productId, req.body);
    return res.status(201).send(product);
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
};

const findProductById = async (req, res) => {
  const productId = req.params.id;
  try {
    const product = await productService.findProductById(productId);
    return res.status(201).send(product);
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
};

const getAllProdcuts = async (req, res) => {
  const productId = req.params.id;
  try {
    const products = await productService.getAllProdcuts(req.query);
    return res.status(201).send(products);
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
};

const createMultipleProduct = async (req, res) => {
  const productId = req.params.id;

  // console.log(req.body);

  try {
    const products = await productService.createMultipleProduct(req.body);
    return res.status(201).send({ message: "Prodcuts Created Successfully" });
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
};

const fetchAllProducts = async (req, res) => {
  try {
    const products = await productService.fetchAllProducts();
    return res.status(200).json(products);
  } catch (error) {
    console.error("❌ Error fetching products:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch products",
      error: error.message,
    });
  }
};

module.exports = {
  createProduct,
  deleteProduct,
  updateProduct,
  findProductById,
  getAllProdcuts,
  createMultipleProduct,
  fetchAllProducts,
};
