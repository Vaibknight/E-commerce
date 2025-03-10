const express = require("express");

const router = express.Router();

const user = require("../controller/user");

router.get("/profile", user.getUserProfile);

router.get("/", user.getAllUsers);

module.exports = router;
