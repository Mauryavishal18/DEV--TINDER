const mongoose = require('mongoose');

const connectDB=async()=>{
    await mongoose.connect("mongodb+srv://Vishal_12356:z4OtxW15wt6JQzX7@devtinder.eqpxfvm.mongodb.net/"

    );
};


module.exports=connectDB;




