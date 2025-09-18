import { z } from 'zod'

export const classSchema = z.object({
  id: z.union([z.string(), z.number()]),
  name: z.string().min(1, 'Name is required'),
  year: z.number().min(2000, 'Year must be at least 2000').max(2100, 'Year must be at most 2100'),
  createdAt: z.string().datetime().optional(),
  updatedAt: z.string().datetime().optional(),
})

export type IClass = z.infer<typeof classSchema>
