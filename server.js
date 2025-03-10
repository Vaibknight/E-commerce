const express = require("express");
const app = express();

const PORT = process.env.PORT || 3000;

console.log("Server script started...");

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
