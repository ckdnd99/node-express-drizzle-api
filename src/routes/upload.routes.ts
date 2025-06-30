import express from "express";
import type { Request, Response } from "express";
import { upload } from "../config/multer";

const router = express.Router();

router.post("/upload", upload.single("image"), (req: Request, res: Response): void => {
  if (!req.file) {
    res.status(400).json({ error: "No file uploaded" });
    return;
  }

  res.json({
    message: "File uploaded successfully",
    file: req.file.filename,
  });
});

export default router;
