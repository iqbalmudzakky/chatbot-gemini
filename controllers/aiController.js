import { responseForFile, responseForText } from "../helpers/ai.js";

export class AIController {
  static async generateText(req, res) {
    const { prompt } = req.body;

    try {
      const text = await responseForText(prompt);
      res.status(200).json({ message: "Success", data: text });
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }

  static async processingFileUpload(req, res) {
    const { prompt } = req.body;
    const fileUpload = req.file;

    try {
      const text = await responseForFile(prompt, fileUpload);
      res.status(200).json({ message: "Success", data: text });
    } catch (err) {
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
}
