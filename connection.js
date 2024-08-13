const mongoose = require("mongoose");
const connectToMongoDB = (url) => {
  mongoose
    .connect(url)
    .then(() => console.log("MongoDB Connected Successfully!"))
    .catch((err) => console.log("MongoDB Error", err));
};

module.exports = {
  connectToMongoDB,
};
