const razorpay = require("../config/razorpayClient");

const orderService = require("../services/OrderService");

const createPaymentLink = async (orderId) => {
  try {
    const order = await orderService.findOrderById(orderId);

    const paymentLinkRequest = {
      amount: order.discounte * 100, // Amount should be in paise
      currency: "INR",
      customer: {
        name: order.user.firstName + " " + order.user.lastName,
        contact: order.user.mobile,
        email: order.user.email,
      },
      notify: {
        sms: true,
        email: true,
      },
      reminder_enable: true,
      callback_url: `https://e-commerce-8uqv.onrender.com/payment/${orderId}`,
      callback_method: "get",
    };

    const paymentLink = await razorpay.paymentLink.create(paymentLinkRequest); // ✅ Corrected method

    return {
      paymentLinkId: paymentLink.id,
      payment_link_url: paymentLink.short_url,
    };
  } catch (error) {
    console.error("Razorpay Error:", error);
    throw new Error(error.message);
  }
};

const updatePayInfo = async (reqData) => {
  const paymentId = reqData.payment_id;

  const orderId = reqData.order_id;

  try {
    const order = await orderService.findOrderById(orderId);

    const payment = await razorpay.payments.fetch(paymentId);

    if (payment.status == "captured") {
      order.paymentDetails.paymentId = paymentId;

      order.paymentDetails.status = "COMPLETED";

      order.orderStatus = "PLACED";

      await order.save();
    }

    const resData = { message: "Your order is placed", success: true };

    return resData;
  } catch (error) {
    throw new Error(error.message);
  }
};

module.exports = {
  createPaymentLink,
  updatePayInfo,
};
