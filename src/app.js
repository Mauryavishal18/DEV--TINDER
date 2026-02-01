const express=require('express');
const connectDB=require("./config/database");
const app=express();

// const userSchema=require("./models/user");
const User=require("./models/user");


app.post("/signup",async (req,res)=>{
    const user=new User({
        firstName:"Rohit",
        lastName:"Sharma",
        emailId:"rohit.sharma@example.com",
        age:37,
        gender:"Male",
    });
    try{
    await user.save();
    res.send("User Added successfully!");




}catch(err){
    res.status(400).send("Error signing up user: " + err.message);
}

});




connectDB()
.then(() => {
    console.log('Database connected successfully');
    app.listen(3000,()=>{
    console.log('Server is running on port 3000');
});
}).catch((err) => {
    console.error('Database connection error:', err);
});


















