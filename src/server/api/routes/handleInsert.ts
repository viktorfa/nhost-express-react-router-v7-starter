import { Router } from "express";
import type { ApiHandler, ApiRouter } from "../types";
import zod from "zod";
import { handleInsertUser } from "../controllers/handleInsertUser";

export const handleInsertRouter: ApiRouter = Router();

const newRowBodySchema = zod.object({
  id: zod.string().uuid(),
  trigger: zod.object({
    name: zod.string(),
  }),
  table: zod.object({
    name: zod.string(),
    schema: zod.string(),
  }),
  event: zod.object({
    op: zod.enum(["INSERT"]),
    data: zod.object({
      new: zod.object({}),
    }),
  }),
});

const handleInsertSchemaTable: ApiHandler = async (req, res) => {
  const parseResult = newRowBodySchema.safeParse(req.body);
  if (!parseResult.success) {
    return res.status(400).json({ error: parseResult.error });
  }
  const newRow = parseResult.data.event.data.new;
  const { schema, name: table } = parseResult.data.table;

  switch (schema) {
    case "auth":
      switch (table) {
        case "users":
          return handleInsertUser(req, res);
      }
  }

  return res.status(400).json({ error: "Invalid schema or table" });
};

// Define routes
handleInsertRouter.post("/:schema/:table", handleInsertSchemaTable);
