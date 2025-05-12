let mongoose = require("mongoose");

let userSchema = new mongoose.Schema({
  fullname: String,
  email: String,
  password: String,
});

module.exports = mongoose.model("users", userSchema, "users");