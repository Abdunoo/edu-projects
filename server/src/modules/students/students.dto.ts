import { z } from 'zod';

export const createStudentSchema = z.object({
  nisn: z.string().min(3).max(30),
  name: z.string().min(1).max(120),
  dob: z.string(), // ISO date string
  guardianContact: z.string().max(120).optional().nullable(),
  isActive: z.boolean().optional().default(true),
});

export const updateStudentSchema = createStudentSchema.partial();

export type CreateStudentDto = z.infer<typeof createStudentSchema>;
export type UpdateStudentDto = z.infer<typeof updateStudentSchema>;
