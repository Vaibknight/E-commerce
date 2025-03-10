const express = require("express");

const cors = require("cors");

const app = express();
const mongoose = require("mongoose");

const auth = require("./routes/auth");

const user = require("./routes/user");

const productRoutes = require("./routes/customerProductRoutes");
const adminProductRoutes = require("./routes/adminProductRoutes");
const cardRoutes = require("./routes/cartRoutes");
const cardItemRoutes = require("./routes/cartItemRoutes");
const orderRoutes = require("./routes/orderRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
const ratingRoutes = require("./routes/ratingRoutes");

require("dotenv").config();

const paymentRouter = require("./routes/paymentRoutes");
const adminOrderRoutes = require("./routes/adminRoutes");
app.use(express.json());
app.use(cors());
app.get("/", (req, res) => {
  return res
    .status(300)
    .send({ message: "welcome to ecommerce api ", status: true });
});

const mongodbUrl = process.env.DBURL;

main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(mongodbUrl);
}

app.use("/auth", auth);
app.use("/api/users", user);
app.use("/api/products", productRoutes);
app.use("/api/admin/products", adminProductRoutes);
app.use("/api/cart", cardRoutes);
app.use("/api/cart_items", cardItemRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/ratings", ratingRoutes);
app.use("/api/admin/orders", adminOrderRoutes);
app.use("/api/payments", paymentRouter);

const PORT = 5454;

app.listen(PORT, async () => {
  console.log(`Listening on port ${PORT}`);
});
