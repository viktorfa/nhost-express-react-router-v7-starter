import { type Request, type Response, type NextFunction } from "express";

export const checkWebhookSecretMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const requestNhostWebhookSecret = req.get("nhost-webhook-secret");
  if (!requestNhostWebhookSecret) {
    return res.status(400).send("No webhook secret");
  }
  if (requestNhostWebhookSecret !== process.env.NHOST_WEBHOOK_SECRET) {
    return res.status(400).send("Incorrect webhook secret");
  }
  next();
};
