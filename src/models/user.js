const mongoose = require("mongoose");
const validator = require("validator");


const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      minLength: 5,
      maxLength: 20,
    },

    lastName: {
      type: String,
      minLength:5,
      maxLength:20,
    },

    emailId: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      lowercase: true,
      validate(value){
        if(!validator.isEmail(value)){
          throw new Error("Invalid email address:"+value);
        }
      }
    },

    password: {
      type: String,
      required: true,
      validate(value){
        if(!validator.isStrongPassword(value)){
          throw new Error("Enter a Strong Password:" + value);
        }
    },
  },

    age: {
      type: Number,
      required: true,
      min: 18,
    },

    gender: {
      type: String,
      validate(value) {
        if (!["male", "female", "others"].includes(value)) {
          throw new Error("Gender data is not valid");
        }
      },
    },

    about: {
      type: String,
    },

    photoUrl: {
      type: String,
      default:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTF6gewyuH5x0zDsIgOT1pobbHtgp0EZngcggfjQfE55Q&s&ec=121528417",
    },

    skills: {
      type: [String],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("users", userSchema);
