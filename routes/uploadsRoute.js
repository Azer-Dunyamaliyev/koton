import express from "express";
import uploadMiddleware from "../middleware/uploadMiddelware.js";
import { uploadImage } from "../controller/controller.js";

const router = express.Router();

router.post("/", uploadMiddleware.single("image"), uploadImage);

export default router;
