const Razorpay = require("razorpay");

apiKey = "rzp_test_lclPjloTVTiQfn";
apiSecret = "BOu03bju0pXYzbCiuzepxqKi";

const razorpay = new Razorpay({
  key_id: apiKey,
  key_secret: apiSecret,
});

module.exports = razorpay;
