import express from "express"
import { protectRoute } from "../Middleware/auth.middleware.js";
import { getMessages, getUserForSidebar, sendMessage } from "../Controllers/message.controller.js";

const router = express.Router();

router.get("/user",protectRoute,getUserForSidebar);
router.get ("/:id",protectRoute,getMessages);
router.post("/send/:id", protectRoute,sendMessage)

export default router;