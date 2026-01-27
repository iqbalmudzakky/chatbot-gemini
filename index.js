import "dotenv/config";

import express from "express";
import multer from "multer";

import { AIController } from "./controllers/aiController.js";

const app = express();
const port = 3000;
const upload = multer();

app.use(express.json());

app.post("/generate-text", AIController.generateText);
app.post(
  "/file-processing",
  upload.single("fileUpload"), // fileUpload is the name of the form field
  AIController.processingFileUpload,
);

app.listen(port, () => {
  console.log(`Gemini Flash API server running at http://localhost:${port}`);
});
