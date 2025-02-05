import { kyselyDb } from "@@/server/config/kysely";
import type { Request, Response } from "express";
import zod from "zod";
import { v7 as uuidv7 } from "uuid";

const newUserBodySchema = zod.object({
  event: zod.object({
    data: zod.object({
      new: zod.object({
        id: zod.string().uuid(),
        email: zod.string().email(),
      }),
    }),
  }),
});

export const handleInsertUser = async (req: Request, res: Response) => {
  const parseResult = newUserBodySchema.safeParse(req.body);
  if (!parseResult.success) {
    return res.status(400).json({ error: parseResult.error });
  }
  const newUser = parseResult.data.event.data.new;

  const defaultOrgTitle = "My Organization";

  try {
    const orgId = uuidv7();
    const orgUserId = uuidv7();

    const result = await kyselyDb.transaction().execute(async (trx) => {
      // Insert organization
      const org = await trx
        .insertInto("orgs.organizations")
        .values({
          id: orgId,
          owner_id: newUser.id,
          title: defaultOrgTitle,
        })
        .returning("id")
        .executeTakeFirstOrThrow();

      // Insert org user
      const orgUser = await trx
        .insertInto("orgs.org_users")
        .values({
          id: orgUserId,
          org_id: orgId,
          user_id: newUser.id,
          role: "OWNER",
        })
        .returning("id")
        .executeTakeFirstOrThrow();

      // Insert user profile
      const userProfile = await trx
        .insertInto("orgs.user_profiles")
        .values({
          user_id: newUser.id,
          current_org_user_id: orgUserId,
        })
        .returning("id")
        .executeTakeFirstOrThrow();

      return {
        organizationId: org.id,
        orgUserId: orgUser.id,
        userProfileId: userProfile.id,
      };
    });

    return res.status(201).json(result);
  } catch (error) {
    console.error("Error in handleInsertUser:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
