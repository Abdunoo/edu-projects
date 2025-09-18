import { z } from 'zod';

export const createClassSchema = z.object({
  name: z.string().min(1, 'Name is required').max(50, 'Name too long'),
  year: z.number().min(1, 'Year is required').max(4, 'Year too long'),
});

export const updateClassSchema = createClassSchema.partial();

export type CreateClassDto = z.infer<typeof createClassSchema>;
export type UpdateClassDto = z.infer<typeof updateClassSchema>;
