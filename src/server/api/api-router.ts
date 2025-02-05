import { Router } from "express";
import type { ApiRouter, ApiError, ApiRequest, ApiResponse, ApiNextFunction } from "./types";
import { checkWebhookSecretMiddleware } from "./security";
import { handleInsertRouter } from "./routes/handleInsert";

export const apiRouter: ApiRouter = Router();

// Mount API routes
apiRouter.use("/handleInsert", checkWebhookSecretMiddleware, handleInsertRouter);

// Global API error handler
apiRouter.use((err: ApiError, req: ApiRequest, res: ApiResponse, next: ApiNextFunction) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    error: {
      message: err.message || "Internal Server Error",
      ...(process.env.NODE_ENV === "development" ? { stack: err.stack } : {}),
    },
  });
});
