import {
  responseForChat,
  responseForFile,
  responseForText,
} from "../helpers/ai.js";

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
      console.log("🚀 ~ AIController ~ processingFileUpload ~ err:", err);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }

  static async responseForChat(req, res) {
    const { conversation } = req.body;

    try {
      if (!Array.isArray(conversation))
        throw new Error({
          status: 400,
          message: "Conversation must be an array of messages",
        });
      const chatResponse = await responseForChat(conversation);
      res.status(200).json({ message: "Success", data: chatResponse });
    } catch (err) {
      console.log(err);
      if (err.status && err.message) {
        return res.status(err.status).json({ message: err.message });
      } else {
        res.status(500).json({ message: "Internal Server Error" });
      }
    }
  }
}
