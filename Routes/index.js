import { Router } from "express";
import multer from "multer";

import { AIController } from "../controllers/aiController.js";

const router = Router();
const upload = multer();

router.post("/generate-text", AIController.generateText);
router.post(
  "/file-processing",
  upload.single("fileUpload"), // fileUpload is the name of the form field
  AIController.processingFileUpload,
);

router.post("/chat", AIController.responseForChat);

export default router;
