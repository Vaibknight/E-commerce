const express = require("express");

const router = express.Router();

const cartController = require("../controller/cart");

const authenticate = require("../middleware/authenticate");

router.get("/", authenticate, cartController.findUserCart);
router.put("/add", authenticate, cartController.addItemToCart);

router.delete("/", authenticate, cartController.clearCart);

module.exports = router;
