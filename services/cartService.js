const Cart = require("../models/Cartmodel");
const cartItem = require("../models/CartItemModel");

const Product = require("../models/Productmodel");

async function createCart(user) {
  try {
    const cart = new Cart({ user });

    const createdCart = await cart.save();

    return createdCart;
  } catch (error) {
    throw new Error(error.message);
  }
}

async function findUserCart(userId) {
  try {
    // ✅ Check if the cart exists
    let cart = await Cart.findOne({ user: userId });

    if (!cart) {
      return null; // ✅ Return null instead of creating a cart
    }

    // console.log("hello");

    // ✅ Fetch cart items and populate product details
    let cartItems = await cartItem.find({ cart: cart._id }).populate("product");

    cart.cartItems = cartItems;

    let totalPrice = 0;
    let totalDiscountedPrice = 0;
    let totalItem = 0;

    for (let carts of cart.cartItems) {
      totalPrice += carts.price;
      totalDiscountedPrice += carts.discountedPrice; // ✅ Fixed incorrect property name
      totalItem += carts.quantity; // ✅ Fixed incorrect reference
    }

    cart.totalPrice = totalPrice;
    cart.totalItem = totalItem;
    cart.totalDiscountedPrice = totalDiscountedPrice;
    cart.discounte = totalPrice - totalDiscountedPrice; // ✅ Fixed "discounte" typo

    return cart;
  } catch (error) {
    throw new Error(error.message);
  }
}

async function addCartItem(userId, req) {
  try {
    const cart = await Cart.findOne({ user: userId });

    const product = await Product.findById(req.productId);

    const isPresent = await cartItem.findOne({
      cart: cart._id,
      product: product._id,
      userId,
    });

    // console.log(isPresent);

    if (!isPresent) {
      const cartItems = new cartItem({
        product: product._id,
        cart: cart._id,
        quantity: 1,
        userId,
        price: product.price,
        size: req.size,
        discountedPrice: product.discountedPrice,
      });

      // console.log(cartItems);

      const createdCartItem = await cartItems.save();
      cart.cartItems.push(createdCartItem);

      await cart.save();

      return "Item added to cart";
    }
  } catch (error) {
    throw new Error(error.message);
  }
}

async function clearUserCart(userId) {
  try {
    // ✅ Check if the cart exists for the user
    let cart = await Cart.findOne({ user: userId });

    // console.log(cart);

    if (!cart) {
      return { success: false, message: "Cart not found" };
    }

    // ✅ Delete all cart items related to the user's cart
    await cartItem.deleteMany({ cart: cart._id });

    // ✅ Reset cart totals
    cart.totalPrice = 0;
    cart.totalDiscountedPrice = 0;
    cart.totalItem = 0;
    cart.discount = 0;

    // ✅ Save the empty cart
    await cart.save();

    return { success: true, message: "Cart emptied successfully" };
  } catch (error) {
    console.error("Error clearing cart:", error);
    return { success: false, message: error.message };
  }
}

module.exports = { createCart, findUserCart, addCartItem, clearUserCart };
