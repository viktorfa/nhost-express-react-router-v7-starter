INSERT INTO "auth"."roles"("role") VALUES (E'user_with_inherit') ON CONFLICT DO NOTHING;
INSERT INTO "auth"."roles"("role") VALUES (E'user') ON CONFLICT DO NOTHING;
INSERT INTO "auth"."roles"("role") VALUES (E'me') ON CONFLICT DO NOTHING;
INSERT INTO "auth"."roles"("role") VALUES (E'public') ON CONFLICT DO NOTHING;
INSERT INTO "auth"."roles"("role") VALUES (E'anonymous') ON CONFLICT DO NOTHING;
