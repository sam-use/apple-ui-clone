const express = require("express");
const app = express();
const mongoose =require("mongoose");
const path = require("path");
const Chat = require("./model/form");
const ejsmate= require("ejs-mate"); 
const methodOverride = require('method-override');
app.use(methodOverride('_method'));

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));




app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.engine('ejs',ejsmate);

main()
.then(()=>{
    console.log("connected to db");
}).catch((err)=>{
    console.log(err);
});

async function main(){
    await mongoose.connect("mongodb://127.0.0.1:27017/apple");

}

app.get("/learnmore",(req,res)=>{
    res.render("learnmore.ejs")
})
app.get("/buy",(req,res)=>{
    res.render("buy.ejs")
})

app.get("/iphone",(req,res)=>{
    res.render("iphone.ejs")
})
app.get("/",(req,res)=>{
    res.render("home.ejs");
});
app.get("/support", async (req, res) => {
    try {
        const chats = await Chat.find({});
        res.render("support.ejs", { chats });
    } catch (err) {
        console.error("Error fetching chats:", err);
        res.send("Error loading support page");
    }
});

app.post("/support", async (req, res) => {
    try {
        const { from, help } = req.body;
        await Chat.create({ from, help });
        res.redirect("/support");
    } catch (err) {
        console.error("Error saving chat:", err);
        res.send("Something went wrong");
    }
});
app.delete("/support/:id", async (req, res) => {
    try {
        const { id } = req.params;
        await Chat.findByIdAndDelete(id);
        res.redirect("/support");
    } catch (err) {
        console.error("Error deleting chat:", err);
        res.send("Error deleting review");
    }
});


const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

