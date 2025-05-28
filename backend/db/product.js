let mongoose = require("mongoose");

let ProductSchema = new mongoose.Schema({
  name: String,
  price: String,
  category: String,
  userid: String,
  company:String,
});

module.exports = mongoose.model("Product", ProductSchema, "Product");