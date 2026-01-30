import { z } from "zod";

// Shared Zod schemas (e.g. for API responses or common types)
export const BaseResponse = z.object({
  status: z.string(),
  error: z.string().optional(),
});

export const UserSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
});
