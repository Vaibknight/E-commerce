const express = require("express");

const router = express.Router();

const authenticate = require("../middleware/authenticate");
const reviewController = require("../controller/review");

router.post("/create", authenticate, reviewController.createReview);
router.get("/product/:productId", authenticate, reviewController.getAllReview);

module.exports = router;
