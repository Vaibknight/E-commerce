const userService = require("../services/userService");
const jwtProvider = require("../config/jwtProvider");
const bcrypt = require("bcrypt");
const cartService = require("../services/cartService");

const register = async (req, res) => {
  try {
    const user = await userService.createUser(req.body);

    const jwt = jwtProvider.generateToken(user._id);

    await cartService.createCart(user);

    return res.status(200).send({ jwt, message: "register success" });
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await userService.findUserByEmail(email);

    if (!user) {
      return res
        .status(404)
        .send({ message: "user not found with email : ", email });
    }

    const isPasswwordValid = await bcrypt.compare(password, user.password);

    if (!isPasswwordValid) {
      return res.status(401).send({ message: "Invalid Password..." });
    }

    const jwt = jwtProvider.generateToken(user._id);

    let cart = await cartService.findUserCart(user._id); // Add a function in cartService
    console.log(cart);

    if (!cart) {
      cart = await cartService.createCart(user); // ✅ Create cart if it doesn't exist
    }

    return res.status(200).send({ jwt, message: "login success" });
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
};

module.exports = { register, login };
