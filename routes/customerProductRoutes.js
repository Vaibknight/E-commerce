const express = require("express");

const router = express.Router();

const productController = require("../controller/product");

const authenticate = require("../middleware/authenticate");

router.get("/", authenticate, productController.getAllProdcuts);
router.get("/Allproducts", productController.fetchAllProducts);

router.get("/id/:id", productController.findProductById);

module.exports = router;
