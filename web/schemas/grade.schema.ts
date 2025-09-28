import { z } from "zod";
import { studentSchema } from "./student.schema";

export const gradeSchema = z.object({
  id: z.union([z.string(), z.number()]),
  studentId: z.union([z.string(), z.number()]),
  student: z.object(studentSchema).optional(),
  subject: z.string().min(1, "Subject is required"),
  term: z.string().min(1, "Term is required"),
  score: z.number().min(0).max(100),
  createdAt: z.string().datetime().optional(),
  updatedAt: z.string().datetime().optional(),
});

export type IGrade = z.infer<typeof gradeSchema>;
