const Rating = require("../models/Ratingmodel");

const productService = require("./productService");

async function createRating(req, user) {
  const product = await productService.findProductById(req.productId);

  const review = new Review({
    user: user._id,
    product: product._id,
    review: reqData.review,
    createdAt: new Date(),
  });

  return await rating.save();
}

async function getProductRating(productId) {
  return await Rating.find({ product: productId });
}

module.exports = { createRating, getProductRating };
