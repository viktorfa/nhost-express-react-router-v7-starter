import "react-router";
import { createRequestHandler } from "@react-router/express";
import express, { type Express } from "express";
import type { Request, Response, NextFunction } from "express";
import morgan from "morgan";
import { apiRouter } from "./api/api-router";
import { healthRouter } from "./api/routes/health";

declare module "react-router" {
  interface AppLoadContext {
    VALUE_FROM_EXPRESS: string;
  }
}

export const expressApp: Express = express();

// Setup request logging
if (process.env.NODE_ENV === "development") {
  expressApp.use(morgan("dev")); // Colored output for development
} else {
  expressApp.use(morgan("combined")); // Detailed logs for production
}

// Parse JSON payloads
expressApp.use(express.json());

// Mount API routes before the React Router handler
expressApp.use("/api/v1", apiRouter);
expressApp.use("/api/healthz", healthRouter);

expressApp.use(
  createRequestHandler({
    // @ts-expect-error - virtual module provided by React Router at build time
    build: () => import("virtual:react-router/server-build"),
    getLoadContext() {
      return {
        VALUE_FROM_EXPRESS: "Hello from Express",
      };
    },
  }),
);

export const expressAppHandler = (req: Request, res: Response, next: NextFunction) => {
  next();
};
