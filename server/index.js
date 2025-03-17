const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const app = express();

app.use(cors({
    origin: "http://localhost:3000",
    methods: "GET,POST,PUT,DELETE",
    allowedHeaders: "Content-Type,Authorization"
}));

app.use(express.json());
app.options("*", cors());

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

const SECRET_KEY="4bfa5f8c2bcdcb4e98a6a8eb2a2a8e2e5a3a4d6b8c7d4f6e9f7a9e8b2b7c6d5f";
app.post("/api/login", async (req,res) => {
    const {email, password} = req.body;

    const existingUser = await User.findOne({ email });

    if (!existingUser) {
        return res.status(400).json({ error: "User does not exist"});
    }

    const found = await bcrypt.compare(password, existingUser.password);
    if(found === false) {
        return res.status(400).json({ error: "Username/Password does not match"});
    }

    const token = jwt.sign(
        { id: existingUser._id, email: existingUser.email }, 
        SECRET_KEY, 
        { expiresIn: "1h" }
    );

    res.json({ message: "Login successful!", token });
});

const PORT = process.env.PORT || 8000;
const API_BASE_URL = process.env.API_BASE_URL || "http://localhost:8000";

app.listen(PORT, () => {
    console.log(`Server running on ${API_BASE_URL}`);
});

