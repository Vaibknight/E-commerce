const express = require("express");

const router = express.Router();

const authenticate = require("../middleware/authenticate");

const paymentController = require("../controller/paymentController");

router.post("/:id", authenticate, paymentController.createPaymentLink);

router.post("/", authenticate, paymentController.updatePayInfo);

module.exports = router;
