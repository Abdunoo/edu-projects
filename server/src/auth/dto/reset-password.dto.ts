import z from 'zod';

// reset password dto
export const resetPasswordSchema = z.object({
  userId: z.number(),
  updatedAt: z.date().optional().nullable(),
  password: z.string().optional().nullable(),
});

export type ResetPasswordDto = z.infer<typeof resetPasswordSchema>;
