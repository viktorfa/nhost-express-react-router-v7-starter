import type { Request, Response, NextFunction, Router as ExpressRouter } from "express";

export interface ApiError extends Error {
  status?: number;
}

export type ApiRequest = Request;
export type ApiResponse = Response;
export type ApiNextFunction = NextFunction;
export type ApiRouter = ExpressRouter;

export interface ApiHandler {
  (req: ApiRequest, res: ApiResponse, next: ApiNextFunction): Promise<Response>;
}

export interface ErrorHandler {
  (err: ApiError, req: ApiRequest, res: ApiResponse, next: ApiNextFunction): void;
}
