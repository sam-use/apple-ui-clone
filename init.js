const mongoose = require("mongoose");
const Chat = require("./model/form.js");


async function main() {
    await mongoose.connect("mongodb://127.0.0.1:27017/apple");
    console.log("Connection successful");

    // Creating a chat entry after connection is established
    let allchats = [
        { from: "netu", help: "send me notes", },
        { from: "brou", help: "exam is coming",  },
        { from: "mayank", help: "give extra notes",  }
    ];

    try {
        await Chat.insertMany(allchats);
        console.log("Sample chats added!");
    } catch (err) {
        console.error("Error inserting chats:", err);
    } finally {
        mongoose.connection.close(); // Close connection after insertion
    }
}

// Call main function
main().catch(err => console.log("Database connection error:", err));