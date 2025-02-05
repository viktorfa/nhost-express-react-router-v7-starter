import { Router } from "express";
import type { ApiHandler, ApiRouter } from "../types";
import { checkWebhookSecretMiddleware } from "../security";

export const healthRouter: ApiRouter = Router();

const getHealthStatus: ApiHandler = async (req, res) => {
  return res.json({
    status: "healthy",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
};

const getHealthStatusWebhook: ApiHandler = async (req, res) => {
  return res.json({
    status: "healthy",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
};

healthRouter.get("/", getHealthStatus);
healthRouter.get("/webhook", checkWebhookSecretMiddleware, getHealthStatusWebhook);
