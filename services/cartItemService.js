const userService = require("../services/userService");
const CartItem = require("../models/CartItemModel");

async function updateCartItem(userId, cartItemId, cartItemData) {
  try {
    // Find cart item and populate 'product' to get product details
    const item = await CartItem.findById(cartItemId).populate("product");

    if (!item) {
      throw new Error(`Cart item not found: ${cartItemId}`);
    }

    // Check if user exists
    const user = await userService.findUserById(userId);

    if (!user) {
      throw new Error(`User not found: ${userId}`);
    }

    // Ensure the user owns the cart item
    if (item.userId.toString() !== userId.toString()) {
      throw new Error("You can't update this cart item.");
    }

    // Ensure product exists in the cart item
    if (!item.product) {
      throw new Error("Product not found for this cart item.");
    }

    // Extract product details and ensure they are numbers
    const productPrice = Number(item.product.price);
    const productDiscountedPrice = Number(item.product.discountedPrice);
    const quantity = Number(cartItemData.quantity);

    if (isNaN(productPrice) || isNaN(productDiscountedPrice)) {
      throw new Error("Invalid product price or discounted price.");
    }

    if (isNaN(quantity) || quantity < 1) {
      throw new Error("Invalid quantity value.");
    }

    // Update values
    item.quantity = quantity;
    item.price = item.quantity * productPrice;
    item.discountedPrice = item.quantity * productDiscountedPrice;

    console.log("Quantity:", item.quantity);
    console.log("Price:", item.price);
    console.log("Discounted Price:", item.discountedPrice);

    // Save the updated item to the database
    const updatedCartItem = await item.save();

    return updatedCartItem;
  } catch (error) {
    throw new Error(error.message);
  }
}

module.exports = { updateCartItem };

async function removeCartItem(userId, cartItemId) {
  const cartItem = await findCartItemById(cartItemId);
  const user = await userService.findUserById(userId);

  if (user._id.toString() === cartItem.userId.toString()) {
    await CartItem.findByIdAndDelete(cartItemId);
    return; // Exit function after successful deletion
  }

  throw new Error("You can't remove another user's item");
}

async function findCartItemById(cartItemId) {
  const cartItem = await CartItem.findById(cartItemId);

  if (cartItem) {
    return cartItem;
  } else {
    throw new Error("cartitem not found with id", cartItemId);
  }
}

module.exports = {
  updateCartItem,
  removeCartItem,
  findCartItemById,
};
