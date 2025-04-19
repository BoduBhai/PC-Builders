import express from "express";
import { sendContactMessage } from "../controllers/contact.controller.js";

const router = express.Router();

// POST route to handle contact form submissions
router.post("/send", sendContactMessage);

export default router;
