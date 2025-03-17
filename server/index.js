const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");

const app = express();
const PORT = 8000;

app.use(cors());
app.use(express.json());

const accounts = mongoose.createConnection("mongodb+srv://justinhnguyen1:Lambda19891989!@lambda-phinance.4ilv4.mongodb.net/?retryWrites=true&w=majority&appName=lambda-phinance/accounts", {
    dbName:"accounts",
    useNewUrlParser: true,
    useUnifiedTopology: true
})
accounts.on("connected", () => {
    console.log("Connected to MongoDB (accounts)");
});

accounts.on("error", (err) => {
    console.error("MongoDB connection error:", err);
});

const userSchema = new mongoose.Schema({
    username: String,
    email: String,
    password: String
});
const User = accounts.model("User", userSchema);

app.post("/api/register", async (req, res) => {
    const { username, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
        return res.status(400).json({ error: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();

    res.json({ message: "User registered successfully!" });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
