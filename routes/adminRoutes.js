const express = require("express");

const router = express.Router();

const adminController = require("../controller/admin");
const authenticate = require("../middleware/authenticate");

router.get("/", authenticate, adminController.getAllOrder);
router.put("/:orderId/confirmed", authenticate, adminController.confirmedOrder);
router.put("/:orderId/ship", authenticate, adminController.shippOrders);
router.put("/:orderId/deliver", authenticate, adminController.deliverOrders);
router.put("/:orderId/cancel", authenticate, adminController.cancelledOrders);
router.put("/:orderId/delete", authenticate, adminController.deleteOrders);

module.exports = router;
