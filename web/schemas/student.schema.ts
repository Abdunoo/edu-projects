import z, { date } from "zod"

export const studentSchema = z.object({
  id: z.union([z.string(), z.number()]),
  nisn: z.string().min(1, 'NISN is required'),
  name: z.string().min(1, 'Name is required'),
  dob: date(),
  guardianContact: z.string().min(1, 'Guardian contact is required'),
  isActive: z.boolean().default(true),
  createdAt: z.string().datetime().optional(),
  updatedAt: z.string().datetime().optional(),
});

export type IStudent = z.infer<typeof studentSchema>;
