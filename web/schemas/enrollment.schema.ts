import { z } from 'zod'

export const enrollmentSchema = z.object({
  id: z.union([z.string(), z.number()]),
  studentId: z.union([z.string(), z.number()]),
  classId: z.union([z.string(), z.number()]),
  createdAt: z.string().datetime().optional(),
  updatedAt: z.string().datetime().optional(),
})

export type IEnrollment = z.infer<typeof enrollmentSchema>
