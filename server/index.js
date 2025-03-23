const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

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

const friendSchema = new mongoose.Schema({
    sender: String,
    recipient: String,
    added: Boolean,
});
const Friend = accounts.model("Friends", friendSchema);

// generating a friends request
app.post("/api/friend", async (req, res) => {
    try {
        const {sender, recipient} = req.body;

        const existingUser = await User.findOne({email:recipient});
        if (!existingUser) {
            res.json({ message: "User does not exist!" });
            return;
        }

        const sent = await Friend.findOne({$or:[ {sender, recipient}, {sender:recipient, recipient:sender}]});
        if (!sent) {
            const new_friend = new Friend({sender, recipient, added: false});
            await new_friend.save();
            res.json({ message: "Friend added successfully!" });
            return;
        } else if (sent.added) {
            res.json({ message: "Friend is already added!" });
            return;
        } else if (!sent.added) {
            if (sent.recipient === sender) {
                res.json({ message: "They already sent a friend request!" });
                const acceptedRequest = await Friend.findOneAndUpdate({sender:recipient, recipient:sender}, { added: true }, { new: true });
                res.json({ message: "They already sent a friend request!", acceptedRequest });
            } else {
                res.json({ message: "Friend request already sent" });
            }
            return;
        }
    } catch (error) {
        console.error("Error saving:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// generating users friends list
app.post("/api/friends", async (req, res) => {
    try {
        const {email} = req.body;

        const recipients = await Friend.find({ $or: [ {sender:email}, {recipient:email}]});
        let friendsList = [];
        for (let friend of recipients) {
            if (friend.added === true) {
                let addedUser;
                if (friend.recipient === email) {
                    const sender = friend.sender;
                    addedUser = await User.findOne({email: sender});
                } else if (friend.sender === email) {
                    const recipient = friend.recipient;
                    addedUser = await User.findOne({email: recipient});
                }
                friendsList.push(addedUser);
            }
        }
        res.json({message:"Friends list grabbed", listFriends: friendsList});
    } catch (error) {
        console.error("Error grabbing friends:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// grab all received requests to the user
app.post("/api/requests", async (req, res) => {
    try {
        const {email} = req.body;

        const senders = await Friend.find({recipient: email});
        let friendsList = [];
        for (let friend of senders) {
            if (friend.added === false) {
                const sender = friend.sender;

                const requestedUser = await User.findOne({email: sender});
                friendsList.push(requestedUser);
            }
        }
        res.json({message:"Requests list grabbed", listRequests: friendsList});
    } catch (error) {
        console.error("Error grabbing requests:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// grab all sent requests to the user
app.post("/api/sents", async (req, res) => {
    try {
        const {email} = req.body;

        const recipients = await Friend.find({sender: email});
        let friendsList = [];
        for (let friend of recipients) {
            if (friend.added === false) {
                const recipient = friend.recipient;

                const requestedUser = await User.findOne({email: recipient});
                friendsList.push(requestedUser);
            }
        }
        res.json({message:"Sents list grabbed", listSents: friendsList});
    } catch (error) {
        console.error("Error grabbing sent requests:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// accept friend requests
app.put("/api/friend", async (req, res) => {
    try {
        const {recipient, sender} = req.body;
        const acceptedRequest = await Friend.findOneAndUpdate({recipient, sender}, { added: true }, { new: true });

        res.json({message:"Friend request accepted", acceptedRequest});
    } catch (error) {
        console.error("Error accepting friend:", error);
        res.status(500).json({ error: "Internal server error" });
    }
})

// reject/cancel friend requests
app.delete("/api/friend", async (req, res) => {
    try {
        const {recipient, sender} = req.body;
        const deletedRequest = await Friend.deleteOne({recipient, sender});

        res.json({message:"Friend request deleted/canceled:", deletedRequest});
    } catch (error) {
        console.error("Error rejecting/canceling friend:", error);
        res.status(500).json({ error: "Internal server error" });
    }
})

// deleting a friend from a users list
app.delete("/api/friends", async (req, res) => {
    try {
        const {recipient, sender} = req.body;
        const deletedFriend = await Friend.findOneAndDelete({$or : [{recipient, sender, added:true}, {recipient:sender, sender:recipient, added:true}]});

        res.json({message:"Friend deleted:", deletedFriend});
    } catch (error) {
        console.error("Error deleted friend:", error);
        res.status(500).json({ error: "Internal server error" });
    }
})

// register a user
app.post("/api/register", async (req, res) => {
    const { username, email, password } = req.body;

    const existingUsers = await User.find( {$or :[{email}, {username}]});
    for (let user of existingUsers) {
        if ( user.username === username ) {
            return res.status(400).json({ error: "Username is already taken" });
        } else if ( user.email === email ) {
            return res.status(400).json({ error: "Account already linked with this Email" });
        }
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();

    res.json({ message: "User registered successfully!" });
});

// log a user in with a verified token
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

// get the user's information and user data
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
        return res.json({error:"jwt verify"});
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
    netGain: Number,
    netLoss: Number,
    totalBalance: Number,
    indices: Number,
});
const Collection = accounts.model("Collection", collectionSchema);

// make an expense to the current collection
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

        // update collection values
        const allExpenses = await Expense.find({collection, email})
        let netGain = 0;
        let netLoss = 0;
        let totalBalance = 0;
        let indices = 0;
        for (let expense of allExpenses) {
            if (expense.value < 0) {
                netLoss = netLoss - expense.value;
            } else {
                netGain = netGain + expense.value;
            }
            totalBalance += expense.value;
            indices += 1;
        }

        await Collection.findOneAndUpdate({collectionName:collection, email} , {$set: {netGain, netLoss, totalBalance, indices}})


        res.status(201).json({ message: "Expense saved successfully", expense: newExpense });
    } catch (error) {
        console.error("Error saving expense:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// edit an expense
app.put("/api/expense", async (req, res) => {
    try {
        const {savedID, savedCategory, savedValue, savedPerson, email} = req.body;

        const updatedExpense = await Expense.findByIdAndUpdate(savedID, {category:savedCategory, value:savedValue, person:savedPerson}, { new: true });
        
        // update collection values
        const allExpenses = await Expense.find({collection:updatedExpense.collection, email})
        let netGain = 0;
        let netLoss = 0;
        let totalBalance = 0;
        let indices = 0;
        for (let expense of allExpenses) {
            if (expense.value < 0) {
                netLoss -= expense.value;
            } else {
                netGain += expense.value;
            }
            totalBalance += expense.value;
            indices += 1;
        }

        await Collection.findOneAndUpdate({collectionName:updatedExpense.collection, email} , {$set: {netGain, netLoss, totalBalance, indices}})

        res.status(201).json({ message: "Expense updated successfully", expense: updatedExpense});
    } catch (error) {
        console.error("Error editing expense:", error);
        res.status(500).json({ error: "Internal server error" });
    }
})

// delete an expense
app.delete("/api/expense", async(req, res) => {
    try {
        const {_id, email} = req.body;
         
        const deletedExpense = await Expense.findOneAndDelete({_id});

        const allExpenses = await Expense.find({collection:deletedExpense.collection, email})
        let netGain = 0;
        let netLoss = 0;
        let totalBalance = 0;
        let indices = 0;
        for (let expense of allExpenses) {
            if (expense.value < 0) {
                netLoss -= expense.value;
            } else {
                netGain += expense.value;
            }
            totalBalance += expense.value;
            indices += 1;
        }

        await Collection.findOneAndUpdate({collectionName:deletedExpense.collection, email} , {$set: {netGain, netLoss, totalBalance, indices}})
        res.status(201).json({ message: "Expense deleted successfully", expense: deletedExpense});
    } catch (error) {
        console.error("Error saving expense:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// generating all the user's collections in the database
app.post("/api/collections", async (req, res) => {
    try {
        const {email} = req.body;

        const allCollections = await Collection.find({email})
        res.status(201).json({ message: "Collections found successfully", collections: allCollections });
    } catch (error) {
        console.error("Error making collection:", error);
        res.status(500).json({ error: "Internal server error" });
    }
})

// make a new collection
app.post("/api/addcollection", async (req, res) => {
    try {
        const { collectionName, email} = req.body;

        const existingCollection = await Collection.findOne({collectionName, email});
        if (existingCollection) {
            res.json({ message: "Collection with that name already exists"});
            return;
        }

        const newCollection = new Collection({collectionName, email, netGain:0, netLoss:0, totalBalance:0, indices: 0});
        await newCollection.save();
        
        res.json({ message: `Collection '${collectionName}' created successfully!`, collection:newCollection});
    } catch (error) {
        console.error("Error saving:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// editing a users collection name
app.put("/api/collection", async (req,res) => {
    try {
        const {_id, name, email} = req.body;

        const existingCollection = await Collection.findOne({collectionName:name, email});
        if (existingCollection) {
            res.json({ message: "Collection with that name already exists"});
            return;
        }

        const oldCollection = await Collection.findById(_id);
        await Expense.updateMany({collection:oldCollection.collectionName, email} , {$set: {collection:name}});

        const editedCollection = await Collection.findByIdAndUpdate(_id, {collectionName:name}, {new:true});

        res.json({message:"Collection list edited:", editedCollection});

    } catch (error) {
        console.error("Error editing collection:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// deleting a user's collection and all its expenses
app.delete("/api/collections", async(req, res) => {
    try {
        const {_id} = req.body;
         
        const deletedCollection = await Collection.findOneAndDelete({_id});
        await Expense.deleteMany({collection:deletedCollection.collectionName, email:deletedCollection.email})
        res.status(201).json({ message: "Collection deleted successfully", collection: deletedCollection});
    } catch (error) {
        console.error("Error deleting collection:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// generating all expenses found in that collection's database
app.post("/api/expenses", async (req, res) => {
    try {
        const {email, collection} = req.body;

        const allExpenses = await Expense.find({email, collection});
        res.status(201).json({ message: "Collections found successfully", expenses: allExpenses });
    } catch (error) {
        console.error("Error generating expenses:", error);
        res.status(500).json({ error: "Internal server error" });
    }
})

app.get("/", (req, res) => {
    res.json({ message: "Backend is working!" });
});

app.get("/api/register", (req, res) => {
    res.json({ message: "Register page successful!" });
});


// all stuff below is to upload profile pictures and grab them from the database (cloudinary)
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
      const emailToUse = req.query.email || req.body.email;
      if (!emailToUse) {
        throw new Error("Missing email in request");
      }
      return {
        folder: "profile_pics",
        public_id: emailToUse.replace(/[@.]/g, "_"),
        transformation: [{ width: 300, height: 300, crop: "fill" }],
      };
    },
  });
  

const upload = multer({ storage });

app.post("/api/upload", upload.single("image"), async (req, res) => {
    try {
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
