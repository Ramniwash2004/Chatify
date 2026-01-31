import express from 'express';
import { getAllContacts, getChatPartners, getMessagesByUserId, sendMessage} from '../controllers/message.controller.js';
import { protectedRoute } from '../middleware/auth.middleware.js';
import {arcjetProtection} from "../middleware/arcjet.middleware.js";

const router=express.Router();

router.use(arcjetProtection,protectedRoute);//all routes defined below this line are protected


router.get("/contacts",getAllContacts);
router.get("/chats",getChatPartners);
//  /:id will come from frontend
router.get("/:id",getMessagesByUserId); 
router.post("/send/:id",sendMessage); 

export default router;