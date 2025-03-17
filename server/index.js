const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const app = express();

const allowedOrigins = [
    "http://localhost:3000",
    "https://lambdaphinance.netlify.app"
];

app.use((req, res, next) => {
    const allowedOrigins = [
        "http://localhost:3000",
        "https://lambdaphinance.netlify.app"
    ];
    
    const origin = req.headers.origin;
    if (allowedOrigins.includes(origin)) {
        res.setHeader("Access-Control-Allow-Origin", origin);
    }
    
    res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type,Authorization");
    res.setHeader("Access-Control-Allow-Credentials", "true");
    
    if (req.method === "OPTIONS") {
        return res.status(200).end();
    }
    
    next();
});


app.use(express.json());
app.options("*", cors());

const accounts = mongoose.connect("mongodb+srv://justinhnguyen1:Lambda19891989!@lambda-phinance.4ilv4.mongodb.net/?retryWrites=true&w=majority&appName=lambda-phinance", {
    dbName:"accounts",
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log("Connected to MongoDB"))
.catch(err => console.error("MongoDB connection error:", err));

const userSchema = new mongoose.Schema({
    username: String,
    email: String,
    password: String
});
const User = mongoose.model("User", userSchema);

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

const SECRET_KEY=process.env.SECRET_KEY;
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


app.get("/", (req, res) => {
    res.json({ message: "Backend is working!" });
});

app.post("/api/register", (req, res) => {
    res.json({ message: "User registered page successful!" });
});

module.exports = app;