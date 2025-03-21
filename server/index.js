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
app.use(express.urlencoded({ extended: true }));

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
    password: String,
    profileImage: String,
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
        { id: existingUser._id, email: existingUser.email, user: existingUser.username}, 
        SECRET_KEY, 
        { expiresIn: "1h" }
    );
    
    const requestOrigin = req.headers.origin;
    if (allowedOrigins.includes(requestOrigin)) {
        res.setHeader("Access-Control-Allow-Origin", requestOrigin);
    }

    res.json({ message: "Login successful!", "token": token, "user": email });
});

app.get("/api/profile", async (req, res) => {
    try {
        const user = jwt.verify(req.header("Authorization").split(" ")[1], SECRET_KEY);
        const userData = await User.findOne({ email: user.email });

        if (!userData) {
            return res.status(404).json({ error: "User not found" });
        }

        res.json({
            message: "User verified",
            user: userData,
            imageUrl: userData.profileImage,
        });
    } catch (error) {
        console.error("JWT Verification Error:", error.message);
        return res.status(403).json({ error: "Invalid or expired token" });
    }
});


const expenseSchema = new mongoose.Schema({
    email: String,
    collection: String,
    value: Number,
    category: String,
    person: String,
    date: String,
});
const Expense = finances.model("Expense", expenseSchema);

const collectionSchema = new mongoose.Schema({
    email: String,
    collectionName: String,
});
const Collection = accounts.model("Collection", collectionSchema);

app.post("/api/addcollection", async (req, res) => {
    try {
        const { collectionName, email} = req.body;

        const newCollection = new Collection({collectionName, email});
        await newCollection.save();
        
        res.json({ message: `Collection '${collectionName}' created successfully!`, collection:newCollection});
    } catch (error) {
        console.error("Error saving expense:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});


app.post("/api/addexpense", async (req, res) => {
    try {
        const { email, collection, value, category, gain, person, formattedTimestamp } = req.body;
        

        let new_value = value.replace(/,/g, "");
        new_value = parseInt(new_value);
        if (!gain) {
            new_value = new_value * -1;
        }

        const newExpense = new Expense({ email, collection, value: new_value, category, person, date:formattedTimestamp});
        await newExpense.save();

        res.status(201).json({ message: "Expense saved successfully", expense: newExpense });
    } catch (error) {
        console.error("Error saving expense:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

app.put("/api/expense", async (req, res) => {
    try {
        const {savedID, savedCategory, savedValue, savedPerson} = req.body;

        const updatedExpense = await Expense.findByIdAndUpdate(savedID, {category:savedCategory, value:savedValue, person:savedPerson}, { new: true });
        res.status(201).json({ message: "Expense updated successfully", expense: updatedExpense});
    } catch (error) {
        console.error("Error saving expense:", error);
        res.status(500).json({ error: "Internal server error" });
    }
})

app.delete("/api/expense", async(req, res) => {
    try {
        const {_id} = req.body;
         
        const deletedExpense = await Expense.deleteOne({_id});
        res.status(201).json({ message: "Expense deleted successfully", expense: deletedExpense});
    } catch (error) {
        console.error("Error saving expense:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

app.post("/api/collections", async (req, res) => {
    try {
        const {email} = req.body;

        const allCollections = await Collection.find({email})
        res.status(201).json({ message: "Collections found successfully", collections: allCollections });
    } catch (error) {
        console.error("Error saving expense:", error);
        res.status(500).json({ error: "Internal server error" });
    }
})

app.post("/api/expenses", async (req, res) => {
    try {
        const {email, collection} = req.body;

        const allExpenses = await Expense.find({email, collection});
        res.status(201).json({ message: "Collections found successfully", expenses: allExpenses });
    } catch (error) {
        console.error("Error saving expense:", error);
        res.status(500).json({ error: "Internal server error" });
    }
})

app.get("/", (req, res) => {
    res.json({ message: "Backend is working!" });
});

app.get("/api/register", (req, res) => {
    res.json({ message: "Register page successful!" });
});



require("dotenv").config();
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = new CloudinaryStorage({
    cloudinary,
    params: async (req, file) => {
      if (!req.body || !req.body.email) {
        throw new Error("Missing email in request body");
      }
      
      return {
        folder: "profile_pics",
        public_id: req.body.email.replace(/[@.]/g, "_"),
        transformation: [{ width: 300, height: 300, crop: "fill" }],
      };
    },
  });
  

const upload = multer({ storage });

app.post("/api/upload", upload.single("image"), async (req, res) => {
    try {
        console.log("Request Body:", req.body); // Debugging log

        if (!req.file) {
            return res.status(400).json({ error: "No image uploaded" });
        }

        const { email } = req.body;

        if (!email) {
            console.error("Email is missing in request body");
            return res.status(400).json({ error: "Email is required" });
        }

        const imageUrl = req.file.path;
        await User.findOneAndUpdate({ email }, { profileImage: imageUrl });

        res.json({ message: "Image uploaded successfully", imageUrl });
    } catch (error) {
        console.error("Upload error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});



module.exports = app;
