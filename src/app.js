const express = require('express');
const connectDB = require("./config/database");
const app = express();

// const userSchema=require("./models/user");
const User = require("./models/user");
const { ReturnDocument } = require('mongodb');

app.use(express.json());

/* ---------- SIGNUP API ---------- */
app.post("/signup", async (req, res) => {
    try {
        const user = new User(req.body);
        await user.save();
        res.send("User Added successfully!");
    } catch (err) {
        res.status(400).send("Error signing up user: " + err.message);
    }
});

/* ---------- GET USER API ---------- */
app.get("/user", async (req, res) => {
    const userEmail = req.query.emailId;   // ✅ fixed

    try {
        const users = await User.find({ emailId: userEmail });

        if (users.length === 0) {
            res.status(404).send("User not Found!");
        } else {
            res.send(users);
        }
    } catch (err) {
        res.status(400).send("Something went wrong");
    }
});

/* ---------- DELETE USER API ---------- */
app.delete("/user", async (req, res) => {
    const userId = req.body.userId;

    try {
        const user = await User.findByIdAndDelete(
            { _id: userId },
            {
                returnDocument: "before",   // ✅ fixed
            }
        );

        res.send("User Deleted Successfully");
    } catch (err) {
        res.status(400).send("Something went wrong");
    }
});


app.patch("/user", async (req, res) => {
    const userId = req.body.userId;

    try {
        const user = await User.findByIdAndUpdate(
            { _id: userId },
            req.body,
            {
                new: true,
            }
        );

        if (!user) {
            return res.status(404).send("User not found");
        }

        res.send("User Updated Successfully");
    } catch (err) {
        res.status(400).send("Something went wrong");
    }
});


/* ---------- DB CONNECTION ---------- */
connectDB()
    .then(() => {
        console.log('Database connected successfully');
        app.listen(3000, () => {
            console.log('Server is running on port 3000');
        });
    })
    .catch((err) => {
        console.error('Database connection error:', err);
    });
