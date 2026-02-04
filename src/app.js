const express = require('express');
const connectDB = require("./config/database");
const app = express();
const bcrypt=require("bcrypt");

require("dotenv").config();

const User = require("./models/user");
const { ReturnDocument } = require('mongodb');
const { validateSignUpData } = require('./utils/validation');

app.use(express.json());

/* ---------- SIGNUP API ---------- */
app.post("/signup", async (req, res) => {
  try {
    validateSignUpData(req);

    const { firstName, lastName, emailId, password, age } = req.body;

    const passwordHash = await bcrypt.hash(password, 10);

    const user = new User({
      firstName,
      lastName,
      emailId,
      password: passwordHash,
      age,
    });

    await user.save();
    res.send("User Added successfully!");
  } catch (err) {
    res.status(400).send("Error signing up user: " + err.message);
  }
});



app.post("/login",async(req,res)=>{
    try{
        const {emailId,password}=req.body;
        const user=await User.findOne({emailId:emailId});
        if(!user){
            throw new Error ("Invalid credentials");
        }
        const isPasswordValid=await bcrypt.compare(password,user.password);

        if(isPasswordValid){
            res.send("Login Successful");
        }else{
            throw new Error("Invalid credential");
        }
    }
    catch(err){
        res.status(400).send("ERROR:" +err.message);


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
        const ALLOWED_UPDATES=["photoUrl","about","gender","age","skills"];
        const isUpdateAllowed=Object.keys(data).every((k)=>
        ALLOWED_UPDATES.includes(k));
        if(!isUpdateAllowed){
            throw new Error("Update not allowed");
        }
        if(data?.skills.length>10){
            throw new Error("Skills cannot be more than 10 ");
        }
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
