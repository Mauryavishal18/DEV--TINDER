const express = require("express");
const connectDB = require("./config/database");
const app = express();

const authRouter=require("../src/routes/auth");

const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const User = require("./models/user");
const { validateSignUpData } = require("./utils/validation");
const { userAuth } = require("./middleware/auth");

/* ---------- MIDDLEWARE ---------- */
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
    res.send("User Added Successfully");
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
});

/* ---------- LOGIN ---------- */
app.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;

    const user = await User.findOne({ emailId });
    if (!user) throw new Error("Invalid credentials");

    const isPasswordValid = await user.validatePassword(password);
    if (!isPasswordValid) throw new Error("Invalid credentials");


    const token = jwt.sign(
      { _id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: false, // true only in HTTPS
    });

    res.send("Login Successful");
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
});

/* ---------- PROFILE (PROTECTED) ---------- */
app.get("/profile", userAuth, async (req, res) => {
  try {
    res.send(req.user);
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
});

/* ---------- UPDATE USER ---------- */
app.patch("/user", userAuth, async (req, res) => {
  try {
    const data = req.body;

    const ALLOWED_UPDATES = [
      "photoUrl",
      "about",
      "gender",
      "age",
      "skills",
    ];

    const isUpdateAllowed = Object.keys(data).every((key) =>
      ALLOWED_UPDATES.includes(key)
    );

    if (!isUpdateAllowed) {
      throw new Error("Update not allowed");
    }

    if (data.skills && data.skills.length > 10) {
      throw new Error("Skills cannot be more than 10");
    }

    const user = await User.findByIdAndUpdate(req.user._id, data, {
      new: true,
    });

    res.send("User Updated Successfully");
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
});

/* ---------- SEND CONNECTION REQUEST (PROTECTED) ---------- */
app.post("/sendConnectionRequest", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send(user.firstName + " sent the connection request");
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
});

/* ---------- LOGOUT ---------- */
app.post("/logout", (req, res) => {
  res.cookie("token", null, { expires: new Date(0) });
  res.send("Logout Successful");
});

/* ---------- DB + SERVER ---------- */
connectDB()
  .then(() => {
    app.listen(3000, () => {
      console.log("Server running on port 3000");
    });
  })
  .catch((err) => {
    console.error("DB connection failed", err);
  });
