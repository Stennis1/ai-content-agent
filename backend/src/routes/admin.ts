import { Router } from "express";
import { systemConfig } from "../config/systemConfig";

export const adminRouter = Router();

adminRouter.post("/pause", (_req, res) => {
  systemConfig.SYSTEM_STATUS = "PAUSED";
  res.json(systemConfig);
});

adminRouter.post("/resume", (_req, res) => {
  systemConfig.SYSTEM_STATUS = "ACTIVE";
  res.json(systemConfig);
});

adminRouter.post("/crisis", (_req, res) => {
  systemConfig.CRISIS_MODE = true;
  res.json(systemConfig);
});

adminRouter.post("/crisis/resolve", (_req, res) => {
  systemConfig.CRISIS_MODE = false;
  res.json(systemConfig);
});

adminRouter.get("/status", (_req, res) => {
  res.json(systemConfig);
});

export default adminRouter;