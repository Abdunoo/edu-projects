import { z } from 'zod';

export const createGradeSchema = z.object({
  studentId: z.number().int().positive('studentId is required'),
  subject: z
    .string()
    .min(1, 'subject is required')
    .max(100, 'subject too long'),
  term: z.string().min(1, 'term is required').max(50, 'term too long'),
  score: z.number().min(0, 'score >= 0').max(100, 'score <= 100'),
});

export const updateGradeSchema = createGradeSchema.partial();

export type CreateGradeDto = z.infer<typeof createGradeSchema>;
export type UpdateGradeDto = z.infer<typeof updateGradeSchema>;
