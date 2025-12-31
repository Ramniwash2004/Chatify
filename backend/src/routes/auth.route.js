import express from 'express';

const router=express.Router();

router.get("/signup",(req,res)=>{
    res.send("Hello from signup route");
});

router.get("/login",(req,res)=>{
    res.send("Hello from login route");
});

router.get("/logout",(req,res)=>{
    res.send("Hello from logout route");
});


export default router;