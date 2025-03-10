const mongoose = require("mongoose");

const mongodbUrl =
  "mongodb+srv://vaibhav:vaibhav@cluster0.dcpye.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

const connectDB = () => {
  return mongoose.connect(mongodbUrl);
};

module.exports = { connectDB };
