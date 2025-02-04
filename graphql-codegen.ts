import type { CodegenConfig } from "@graphql-codegen/cli";
import { constantCase } from "change-case-all";
import dotenv from "dotenv-safe";
import path from "path";

dotenv.config({
  allowEmptyValues: true,
  path: path.join(__dirname, ".env.local"),
  example: path.join(__dirname, ".env.local"),
});

const config: CodegenConfig = {
  schema: [
    {
      [process.env.GENERATE_GQL_TYPES_URL || "https://local.graphql.nhost.run/v1"]: {
        headers: {
          "x-hasura-admin-secret": process.env.NHOST_ADMIN_SECRET || "nhost-admin-secret",
        },
      },
    },
  ],
  documents: ["./src/**/*.tsx", "./src/**/*.ts"],
  overwrite: true,
  ignoreNoDocuments: true, // for better experience with the watcher
  generates: {
    "./src/generated/graphql.d.ts": {
      plugins: ["typescript-operations", "typescript"],
      config: {
        avoidOptionals: true,
        useTypeImports: true,
        noExport: true,
        scalars: {
          uuid: "string",
          numeric: "number",
          date: "string",
          timestamptz: "string",
          jsonb: "Record<string, any> | Array<any>",
        },
        namingConvention: constantCase,
        typesPrefix: "GQL_",
      },
    },
  },
};

export default config;
