import jwt from "jsonwebtoken";
import {ENV} from "../lib/env.js";
import User from "../models/User.js";

export const protectedRoute=async(req,res,next)=>{
    try{
        const token=req.cookies.jwt; // token browser cookies se lege
        if(!token){
            return res.status(401).json({message:"Unauthorized: No token provided"});
        }
        //agar token mil jata hai to verify karte hain
        const decoded=jwt.verify(token,ENV.JWT_SECRET);
        if(!decoded) res.status(401).json({message:"Unauthorized: Invalid token"});

        const user=await User.findById(decoded.userId).select("-password");
        if(!user){
            return res.status(404).json({message:"Unauthorized: User not found"});
        }
        req.user=user; //req object me user info attach kar dete hain

        next(); //next middleware ya controller pe jao
    }
    catch(error){
        console.log("Error in protectedRoute middleware:",error);
        res.status(500).json({message:"Internal server error"});
    }
};