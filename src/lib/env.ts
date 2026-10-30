import { z } from "zod";

const schema = z.object({
  DATABASE_URL: z.string().min(1),
  OWNER_USER_ID: z.string().min(10, "OWNER_USER_ID must be a long permanent id"),
  SESSION_COOKIE: z.string().default("horns_session"),
});

// Server-only. Never import this file from a client component.
export const env = schema.parse(process.env);
