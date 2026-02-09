const express=require("express");

const authRouter=express.Router();
const bcrypt=require("bcrypt");


const{validateSignUpData}=require("../utils/validation");

authRouter.post("/signup",async (req,res)=>{
    
    });



authRouter.post("/login",async(req,res)=>{

});



 authRouter.post("/logout", async(req,res)=>{
    res.cookie("token",null,{
        expires:new Date(Date.now()),

 });
 res.send("Logout Successful !!");
});

module.exports=authRouter;