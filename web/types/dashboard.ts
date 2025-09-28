import type { IStudent } from "../schemas/student.schema";
import type { IClass } from "../schemas/class.schema";
import type { IGrade } from "../schemas/grade.schema";
import type { IUser } from "../schemas/user.schema";
import type { IEnrollment } from "../schemas/enrollment.schema";

export interface IDashboardStats {
  studentCount: number;
  classCount: number;
  enrollmentCount: number;
  averageGrade: number | null;
}

export interface IGradeDistribution {
  labels: string[];
  data: number[];
}

export interface IClassEnrollment {
  classId: string | number;
  className: string;
  enrollmentCount: number;
}

export interface IRecentActivity {
  id: string | number;
  title: string;
  description: string;
  date: string;
  type: "student" | "grade" | "user" | "enrollment" | "class";
}

export interface ITopStudent {
  id: string | number;
  name: string;
  nisn: string;
  avgScore: number;
  classCount: number;
  isActive: boolean;
}

export interface IDashboardData {
  stats: IDashboardStats;
  gradeDistribution: IGradeDistribution;
  classEnrollments: IClassEnrollment[];
  recentActivities: IRecentActivity[];
  topStudents: ITopStudent[];
  rawData?: {
    students: IStudent[];
    classes: IClass[];
    grades: IGrade[];
    users: IUser[];
    enrollments: IEnrollment[];
  };
}

export interface IDashboardUpdate {
  type: "full" | "stats" | "grades" | "enrollments" | "activities" | "students";
  data: Partial<IDashboardData>;
  timestamp: string;
}
