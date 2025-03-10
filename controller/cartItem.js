const cartItemService = require("../services/cartItemService");

const updateCartItem = async (req, res) => {
  const user = req.user;

  try {
    const updatedCartItem = await cartItemService.updateCartItem(
      user._id,
      req.params.id,
      req.body
    );
    console.log(updatedCartItem);

    return res.status(200).send(updatedCartItem);
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
};

const removeCartItem = async (req, res) => {
  const user = await req.user;

  // console.log(user._id);

  // console.log(req.params.id);

  try {
    const deletedItem = await cartItemService.removeCartItem(
      user._id,
      req.params.id
    );
    // console.log(deletedItem);

    return res.status(200).send({ message: "cart item removed successfully" });
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
};

module.exports = { updateCartItem, removeCartItem };
