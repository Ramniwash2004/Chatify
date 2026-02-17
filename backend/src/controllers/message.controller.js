import cloudinary from "../lib/cloudinary.js";
import { getReceiverSocketId } from "../lib/socket.js";
import Message from "../models/Message.js";
import User from "../models/User.js";
import { io } from "../lib/socket.js";


export const getAllContacts=async(req,res)=>{
    try{
        const loggedInUserId=req.user._id;//from protectedRoute middleware
        const filteredUsers=await User.find({_id:{$ne:loggedInUserId}}).select("-password"); //logged in user should not be in contacts list  (ne=not equal to) 
        res.status(200).json(filteredUsers);

    }catch(error){
        console.error("Error in getAllContacts:", error);
        res.status(500).json({ message: "Server Error" });
    }
}

export const getMessagesByUserId=async(req,res)=>{
    try{
        const myId=req.user._id;
        const {id:userToChatId}=req.params; //id of the user with whom logged in user wants to chat from frontend url
        const messages=await Message.find({
             //to get messages where either logged in user is sender and other user is receiver or vice versa
            $or:[
                {senderId:myId,receiverId:userToChatId},
                {senderId:userToChatId,receiverId:myId}
            ],
        });
        res.status(200).json(messages);
    }catch(error){
        console.error("Error in getMessagesByUserId:", error);
        res.status(500).json({ message: "Server Error" });
    }
}

export const sendMessage=async(req,res)=>{
    try{
        const senderId=req.user._id; //logged in user id
        const {id:receiverId}=req.params; //id of the user to whom logged in user wants to send message 
        const {text,image}=req.body; //image is base64 string

        let imageUrl;
        if(image){
            //upload base64 image to cloudinary
            const uploadResponse=await cloudinary.uploader.upload(image);
            imageUrl=uploadResponse.secure_url;
        }
        //create new message document
        const newMessage=new Message({
            senderId,
            receiverId,
            text,
            imageUrl:imageUrl || undefined
        });
        await newMessage.save();
        
        const receiverSocketId=getReceiverSocketId(receiverId);
        if(receiverSocketId){
            //send the new message to the receiver in real-time using socket.io
            io.to(receiverSocketId).emit("newMessage", newMessage);
        }
        
        res.status(201).json(newMessage);
    }catch(error){
        console.error("Error in sendMessage:", error);
        res.status(500).json({ message: "Server Error" });
    }
}

export const getChatPartners = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;

    // find all the messages where the logged-in user is either sender or receiver
    const messages = await Message.find({
      $or: [{ senderId: loggedInUserId }, { receiverId: loggedInUserId }],
    });

    const chatPartnerIds = [
      ...new Set(
        messages.map((msg) =>
          msg.senderId.toString() === loggedInUserId.toString()
            ? msg.receiverId.toString()
            : msg.senderId.toString()
        )
      ),
    ];

    const chatPartners = await User.find({ _id: { $in: chatPartnerIds } }).select("-password");

    res.status(200).json(chatPartners);
  } catch (error) {
    console.error("Error in getChatPartners: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};