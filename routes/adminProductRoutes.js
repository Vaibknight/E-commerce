const express = require("express");

const router = express.Router();

const productController = require("../controller/product");
const authenticate = require("../middleware/authenticate");

router.post("/", authenticate, productController.createProduct);
router.post(
  "/multiple/",
  authenticate,
  productController.createMultipleProduct
);
router.delete("/:id", authenticate, productController.deleteProduct);
router.put("/:id", authenticate, productController.updateProduct);

module.exports = router;
