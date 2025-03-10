const cartService = require("../services/cartService");

const findUserCart = async (req, res) => {
  const user = req.user;
  console.log(req.user);

  try {
    const cart = await cartService.findUserCart(user._id);
    return res.status(200).send(cart);
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
};

const addItemToCart = async (req, res) => {
  const user = req.user; // Ensure req.user is correctly set
  // console.log(user);

  try {
    const cartItem = await cartService.addCartItem(user._id, req.body);

    return res.status(200).send(cartItem);
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
};

const clearCart = async (req, res) => {
  const user = req.user; // Extract user from request (assumed to be set via authentication middleware)

  try {
    const result = await cartService.clearUserCart(user._id);

    if (result.success) {
      return res.status(200).send(result);
    } else {
      return res.status(400).send(result);
    }
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
};

module.exports = {
  findUserCart,
  addItemToCart,
  clearCart,
};
