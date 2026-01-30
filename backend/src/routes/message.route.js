import express from 'express';
import { getAllContacts, getMessagesByUserId, sendMessage} from '../controllers/message.controller.js';
import { protectedRoute } from '../middleware/auth.middleware.js';

const router=express.Router();

router.get("/contacts",protectedRoute,getAllContacts); //protected routed because only logged in users can access their contacts
router.get("/:id",protectedRoute,getMessagesByUserId); //send the id from frontend
router.post("/send/:id",protectedRoute,sendMessage); //send the id from frontend

export default router;