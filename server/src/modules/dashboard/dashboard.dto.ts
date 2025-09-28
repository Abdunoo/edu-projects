// Dashboard Data Interfaces
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

export interface IDashboardStats {
  studentCount: number;
  classCount: number;
  enrollmentCount: number;
  averageGrade: number | null;
}

export interface IGradeDistribution {
  labels: string[]; // e.g., ['0-20', '21-40', '41-60', '61-80', '81-100']
  data: number[]; // Count of students in each grade range
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
  type: 'student' | 'grade' | 'user' | 'enrollment' | 'class';
}

export interface ITopStudent {
  id: string | number;
  name: string;
  nisn: string;
  avgScore: number;
  classCount: number;
  isActive: boolean;
}

export interface IDashboardUpdate {
  type: 'full' | 'stats' | 'grades' | 'enrollments' | 'activities' | 'students';
  data: Partial<IDashboardData>;
  timestamp: string;
}

// Base entities interfaces (simplified for dashboard use)
export interface IStudent {
  id: string | number;
  name: string;
  nisn: string;
  isActive: boolean;
  // Other student properties as needed
}

export interface IClass {
  id: string | number;
  name: string;
  // Other class properties as needed
}

export interface IGrade {
  id: string | number;
  studentId: string | number;
  classId: string | number;
  score: number;
  // Other grade properties as needed
}

export interface IUser {
  id: string | number;
  name: string;
  role: string;
  // Other user properties as needed
}

export interface IEnrollment {
  id: string | number;
  studentId: string | number;
  classId: string | number;
  // Other enrollment properties as needed
}
