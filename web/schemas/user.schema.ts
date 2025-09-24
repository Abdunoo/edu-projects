import { z } from "zod";

export const roleSchema = z.object({
  id: z.union([z.string(), z.number()]),
  name: z.string(),
});

export const userSchema = z.object({
  id: z.union([z.string(), z.number()]),
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  roleId: z.union([z.string(), z.number()]),
  role: roleSchema.optional(),
  password: z.string().min(8, "Password must be at least 8 characters long"),
  isActive: z.boolean().default(true),
  createdAt: z.string().datetime().optional(),
  updatedAt: z.string().datetime().optional(),
});

// export const userListResponseSchema = z.object({
//   data: z.object({
//     data: z.array(userSchema),
//     meta: z.object({
//       current_page: z.number(),
//       from: z.number().nullable(),
//       last_page: z.number(),
//       per_page: z.number(),
//       to: z.number().nullable(),
//       total: z.number()
//     })
//   })
// });

export type IUser = z.infer<typeof userSchema>;
export type IRole = z.infer<typeof roleSchema>;
// export type IUserListResponse = z.infer<typeof userListResponseSchema>;
// export type IUserListResponse = z.infer<typeof userListResponseSchema>;
