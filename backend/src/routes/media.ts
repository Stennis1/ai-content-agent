import { Router } from "express";
import multer from "multer";
import { v4 as uuidv4 } from "uuid";
import { saveMedia } from "../storage/mediaStore";

const upload = multer({ dest: "uploads/" });

export const mediaRouter = Router();

mediaRouter.post("/upload", upload.single("file"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  const asset = {
    id: uuidv4(),
    filename: req.file.filename,
    originalName: req.file.originalname,
    type: req.file.mimetype,
    description: req.body?.description || "Client-provided image",
    uploadedAt: new Date().toISOString()
  };

  saveMedia(asset);

  res.json(asset);
});

mediaRouter.get("/", (_req, res) => {
  res.json({ status: "media service running" });
});
