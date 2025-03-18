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

app.use(cors({
    origin: allowedOrigins,
    methods: "GET,POST,PUT,DELETE,OPTIONS",
    credentials: true,
    allowedHeaders: "Content-Type,Authorization"
}));

app.use(express.json());

const accounts = mongoose.createConnection("mongodb+srv://justinhnguyen1:Lambda19891989!@lambda-phinance.4ilv4.mongodb.net/?retryWrites=true&w=majority&appName=lambda-phinance", {
    dbName:"accounts",
    useNewUrlParser: true,
    useUnifiedTopology: true
});
accounts.on("error", (err) => console.error("accounts connection error:", err));
accounts.once("open", () => console.log("Connected to accounts"));

const finances = mongoose.createConnection("mongodb+srv://justinhnguyen1:Lambda19891989!@lambda-phinance.4ilv4.mongodb.net/?retryWrites=true&w=majority&appName=lambda-phinance", {
    dbName:"finances",
    useNewUrlParser: true,
    useUnifiedTopology: true
});
finances.on("error", (err) => console.error("finances connection error:", err));
finances.once("open", () => console.log("Connected to finances"));

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

require("dotenv").config();
const SECRET_KEY = process.env.SECRET_KEY || "failsafe";
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
    
    const requestOrigin = req.headers.origin;
    if (allowedOrigins.includes(requestOrigin)) {
        res.setHeader("Access-Control-Allow-Origin", requestOrigin);
    }

    res.json({ message: "Login successful!", "token": token, "user": email });
});

app.get("/api/profile", (req,res) => {
    const user = jwt.verify(req.header("Authorization").split(" ")[1], SECRET_KEY);

    if (!user) {
        return res.status(400).json({ error: "Invalid or expired token"});
    }
    
    res.json(user)
});


app.get("/", (req, res) => {
    res.json({ message: "Backend is working!" });
});

app.get("/api/register", (req, res) => {
    res.json({ message: "Register page successful!" });
});


module.exports = app;