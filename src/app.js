const express = require('express');
const connectDB = require("./config/database");
const app = express();
const bcrypt = require("bcrypt");
const cookieParser = require('cookie-parser');
const jwt = require("jsonwebtoken");

require("dotenv").config();

const User = require("./models/user");
const { validateSignUpData } = require('./utils/validation');

app.use(express.json());
app.use(cookieParser());

/* ---------- SIGNUP ---------- */
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

/* ---------- LOGIN ---------- */
app.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;

    const user = await User.findOne({ emailId });
    if (!user) throw new Error("Invalid credentials");

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) throw new Error("Invalid credentials");

    const token = jwt.sign(
      { _id: user._id },
      process.env.JWT_SECRET
    );

    res.cookie("token", token, { httpOnly: true });
    res.send("Login Successful");

  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
});

/* ---------- PROFILE ---------- */
app.get("/profile", async (req, res) => {
  try {
    const { token } = req.cookies;
    if (!token) throw new Error("Invalid Token");

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded._id);

    if (!user) throw new Error("User does not exist");

    res.send(user);
  } catch (err) {
    res.status(400).send("Error: " + err.message);
  }
});

/* ---------- UPDATE USER ---------- */
app.patch("/user", async (req, res) => {
  try {
    const userId = req.body.userId;
    const data = req.body;

    const ALLOWED_UPDATES = ["photoUrl","about","gender","age","skills"];
    const isUpdateAllowed = Object.keys(data)
      .every(k => ALLOWED_UPDATES.includes(k));

    if (!isUpdateAllowed) throw new Error("Update not allowed");

    if (data.skills && data.skills.length > 10) {
      throw new Error("Skills cannot be more than 10");
    }

    const user = await User.findByIdAndUpdate(userId, data, { new: true });
    if (!user) return res.status(404).send("User not found");

    res.send("User Updated Successfully");
  } catch (err) {
    res.status(400).send(err.message);
  }
});



/* ---------- DB ---------- */
connectDB().then(() => {
  app.listen(3000, () => console.log("Server running on 3000"));
});
