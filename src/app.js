const express=require('express');

const app=express();

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

app.get("/user",(req,res,next)=>{
    console.log('User route accessed');
    next();
},
(req,res,next)=>{
    console.log('This is the second middleware');
    // res.send('User Information 2');
    next();
},
(req,res,next)=>{
    console.log('This is the third middleware');
    next();
},
(req,res,next)=>{
    console.log('This is the fourth middleware');
    next();
},
(req,res,next)=>{
    console.log('This is the fifth middleware');
    // next();
    res.send('User Information Final');
    
});















app.listen(3000,()=>{
    console.log('Server is running on port 3000');
});