import { z } from 'zod';

export const createEnrollmentSchema = z.object({
  studentId: z.number().int().positive('studentId is required'),
  classId: z.number().int().positive('classId is required'),
});

export const updateEnrollmentSchema = createEnrollmentSchema.partial();

export type CreateEnrollmentDto = z.infer<typeof createEnrollmentSchema>;
export type UpdateEnrollmentDto = z.infer<typeof updateEnrollmentSchema>;
