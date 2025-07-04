const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema({
  from: String,
  help: String
});

module.exports = mongoose.model("Chat", chatSchema);
