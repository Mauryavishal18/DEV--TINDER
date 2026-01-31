const express=require('express');

const app=express();

// const {adminAuth,userAuth}=require('./middleware/auth'); 
// app.use("/admin",adminAuth);
// app.use("/user",userAuth);


// app.get("/user",userAuth,(req,res)=>{
//     res.send('User Information Sent');
// });

// app.get("/admin/getAllData",(req,res)=>{
//     res.send('All Data Sent');
// });



// app.get("/admin/deleteUser",(req,res)=>{
//     res.send('Deleted a User');
// });



// app.use("/test",(req,res)=>{
//     res.send('Hello From Test Route');
// });

// app.use("/hello",(req,res)=>{
//     res.send('Hello World');
// });

// app.get('/status',(req,res)=>{
//     res.send('Server is running');
// });

// app.post('/data',(req,res)=>{
//     res.send('Data received');
// });



// app.delete('/delete',(req,res)=>{
//     res.send('Delete route');
// });

// app.get("/user",(req,res,next)=>{
//     console.log('User route accessed');
//     next();
// },
// (req,res,next)=>{
//     console.log('This is the second middleware');
//     // res.send('User Information 2');
//     next();
// },
// (req,res,next)=>{
//     console.log('This is the third middleware');
//     next();
// },
// (req,res,next)=>{
//     console.log('This is the fourth middleware');
//     next();
// },
// (req,res,next)=>{
//     console.log('This is the fifth middleware');
//     // next();
//     res.send('User Information Final');
    
// });

app.get("/getUserData",(req,res)=>{
    try{
    throw new Error('Simulated Server Error');
    res.send('User Data Sent');
}
catch(err){
    res.status(500).send('Something went Wrong! ');

}
});
app.use("/",(err,req,res,next)=>{
    if(err){
        res.status(500).send('Something went Wrong! ');
    }
});














app.listen(3000,()=>{
    console.log('Server is running on port 3000');
});