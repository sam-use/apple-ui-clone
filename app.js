const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsmate = require("ejs-mate");
const Chat = require("./model/form"); // your Mongoose model

require("dotenv").config(); // only needed locally

const app = express();

// Middleware
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

// EJS Setup
app.engine("ejs", ejsmate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// MongoDB Connection
async function main() {
  await mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  console.log("✅ Connected to MongoDB Atlas");
}
main().catch((err) => console.error("❌ MongoDB Error:", err));

// Routes
app.get("/", (req, res) => res.render("home"));
app.get("/iphone", (req, res) => res.render("iphone"));
app.get("/learnmore", (req, res) => res.render("learnmore"));
app.get("/buy", (req, res) => res.render("buy"));

app.get("/support", async (req, res) => {
  try {
    const chats = await Chat.find({});
    res.render("support", { chats });
  } catch (err) {
    console.error("Error fetching chats:", err);
    res.send("Support page failed.");
  }
});

app.post("/support", async (req, res) => {
  try {
    const { from, help } = req.body;
    await Chat.create({ from, help });
    res.redirect("/support");
  } catch (err) {
    console.error("Error submitting chat:", err);
    res.send("Something went wrong.");
  }
});

app.delete("/support/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await Chat.findByIdAndDelete(id);
    res.redirect("/support");
  } catch (err) {
    console.error("Error deleting chat:", err);
    res.send("Failed to delete.");
  }
});

// Start Server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
