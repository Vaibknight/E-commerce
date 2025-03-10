const cartService = require("../services/cartService");
const Address = require("../models/Addressmodel");
const Order = require("../models/Ordermodel");

const OrderItem = require("../models/OrderItemModel");

async function createOrder(user, shippAddress) {
  let address;

  // console.log(shippAddress);

  // console.log(user);

  if (shippAddress._id) {
    let existAddress = await Address.findById(shippAddress._id);
    address = existAddress;
  } else {
    address = new Address(shippAddress);
    address.user = user;

    await address.save();

    user.address.push(address);
    await user.save();
  }

  const cart = await cartService.findUserCart(user._id);

  // console.log(cart.cartItems);
  const orderItems = [];

  for (let item of cart.cartItems) {
    const orderItem = new OrderItem({
      price: item.price,
      product: item.product._id, // Save only the ObjectId reference
      quantity: item.quantity,
      size: item.size,
      userId: item.userId,
      discountedPrice: item.discountedPrice,
    });

    // console.log(orderItem);

    const createdOrderItem = await orderItem.save();

    // console.log(createdOrderItem);

    orderItems.push(createdOrderItem._id); // Push only the _id to orderItems
  }

  // console.log(orderItems);

  const createdOrder = new Order({
    user,
    orderItems,
    totalPrice: cart.totalPrice,
    totalDiscountPrice: cart.totalDiscountedPrice,
    discounte: cart.discounte,
    totalItem: cart.totalItem,
    shippingAddress: address,
  });

  const savedOrder = await createdOrder.save();

  return savedOrder;
}

async function placeOrder(orderId) {
  const order = await findOrderById(orderId);

  order.orderStatus = "PLACED";

  order.paymentDetails.status = "COMPLETED";

  return await order.save();
}

async function confirmedOrder(orderId) {
  const order = await findOrderById(orderId);

  order.orderStatus = "CONFIRMED";

  return await order.save();
}

async function shipOrder(orderId) {
  const order = await findOrderById(orderId);

  order.orderStatus = "SHIPPED";

  return await order.save();
}

async function deliverOrder(orderId) {
  const order = await findOrderById(orderId);

  order.orderStatus = "DELIVERED";

  return await order.save();
}

async function cancelledOrder(orderId) {
  const order = await findOrderById(orderId);

  order.orderStatus = "CANCELLED";

  return await order.save();
}

async function findOrderById(orderId) {
  const order = await Order.findById(orderId)
    .populate("user")
    .populate({
      path: "orderItems",
      populate: { path: "product" },
    })
    .populate("shippingAddress");

  return order;
}

async function usersOrderHistory(userId) {
  try {
    const orders = await Order.find({
      user: userId,
      orderStatus: "PLACED",
    })
      .populate({ path: "orderItems", populate: { path: "prdouct" } })
      .lean();
  } catch (error) {
    throw new Error(error.message);
  }
}

async function getAllOrders() {
  return await Order.find()
    .populate({ path: "orderItems", populate: { path: "prdouct" } })
    .lean();
}

async function deleteOrder(orderId) {
  const order = await findOrderById(orderId);

  await Order.findByIdAndDelete(order._id);
}

module.exports = {
  createOrder,
  placeOrder,
  confirmedOrder,
  shipOrder,
  deliverOrder,
  cancelledOrder,
  findOrderById,
  usersOrderHistory,
  getAllOrders,
  deleteOrder,
};
