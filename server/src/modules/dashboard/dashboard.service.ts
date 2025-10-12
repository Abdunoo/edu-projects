import { Injectable, Inject } from '@nestjs/common';
import {
  IDashboardData,
  IDashboardStats,
  IGradeDistribution,
  IClassEnrollment,
  IRecentActivity,
  ITopStudent,
  IDashboardUpdate,
  IStudent,
  IClass,
  IGrade,
  IUser,
  IEnrollment,
} from './dashboard.dto';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { DATABASE_CONNECTION } from '../../database/database.module';
import { DbSchema } from '../../database/schema';
import { students } from '../../database/schema/students';
import { classes } from '../../database/schema/classes';
import { grades } from '../../database/schema/grades';
import { enrollments } from '../../database/schema/enrollments';
import { users } from '../../database/schema/users';
import { auditLog } from '../../database/schema/audit-log';
import { count, desc, eq, sql } from 'drizzle-orm';
import { Logger } from 'winston';
import { handleServiceErrors } from '../../common/utils/error-handler';

@Injectable()
export class DashboardService {
  private dashboardData: IDashboardData;
  private lastUpdated: Date;

  constructor(
    @Inject(DATABASE_CONNECTION)
    private readonly db: NodePgDatabase<DbSchema>,
    @Inject('winston')
    private readonly logger: Logger,
  ) {
    // Initialize with data
    this.refreshDashboardData().catch((err) => {
      handleServiceErrors(
        err,
        this.logger,
        'DashboardService',
        'Failed to initialize dashboard data',
      );
    });
  }

  /**
   * Get the current dashboard data
   */
  async getDashboardData(): Promise<IDashboardData> {
    if (!this.dashboardData) {
      await this.refreshDashboardData();
    }
    return this.dashboardData;
  }

  /**
   * Refresh the dashboard data
   */
  async refreshDashboardData(): Promise<IDashboardData> {
    this.logger.info('Refreshing dashboard data');

    try {
      // In a real application, this would fetch data from various services/repositories
      // For now, we'll generate mock data
      this.dashboardData = await this.generateDashboardData();
      this.lastUpdated = new Date();
      return this.dashboardData;
    } catch (error) {
      handleServiceErrors(
        error,
        this.logger,
        'DashboardService',
        'Failed to refresh dashboard data',
      );
    }
  }

  /**
   * Generate a partial update for the dashboard
   */
  async generateDashboardUpdate(
    type: IDashboardUpdate['type'],
  ): Promise<IDashboardUpdate> {
    const partialData: Partial<IDashboardData> = {};

    switch (type) {
      case 'stats':
        partialData.stats = await this.fetchDashboardStats();
        break;
      case 'grades':
        partialData.gradeDistribution = await this.fetchGradeDistribution();
        break;
      case 'enrollments':
        partialData.classEnrollments = await this.fetchClassEnrollments();
        break;
      case 'activities':
        partialData.recentActivities = await this.fetchRecentActivities();
        break;
      case 'students':
        partialData.topStudents = await this.fetchTopStudents();
        break;
      case 'full':
        return {
          type: 'full',
          data: await this.refreshDashboardData(),
          timestamp: new Date().toISOString(),
        };
    }

    return {
      type,
      data: partialData,
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Generate dashboard data from real database with fallback to mock data
   */
  private async generateDashboardData(): Promise<IDashboardData> {
    try {
      this.logger.info('Generating dashboard data from database');

      // Fetch raw data from database
      const rawData = await this.fetchRawData();

      // Generate dashboard data from raw data
      const stats = await this.fetchDashboardStats(rawData);
      const gradeDistribution = await this.fetchGradeDistribution(rawData);
      const classEnrollments = await this.fetchClassEnrollments(rawData);
      const recentActivities = await this.fetchRecentActivities(rawData);
      const topStudents = await this.fetchTopStudents(rawData);

      return {
        stats,
        gradeDistribution,
        classEnrollments,
        recentActivities,
        topStudents,
        rawData, // Include raw data for client-side filtering/processing if needed
      };
    } catch (error) {
      handleServiceErrors(
        error,
        this.logger,
        'DashboardService',
        'Failed to generate dashboard data',
      );
    }
  }

  /**
   * Fetch raw data from database
   */
  private async fetchRawData(): Promise<{
    students: IStudent[];
    classes: IClass[];
    grades: IGrade[];
    users: IUser[];
    enrollments: IEnrollment[];
  }> {
    // Fetch students
    const studentsData = await this.db.query.students.findMany({
      orderBy: desc(students.updatedAt),
    });

    // Fetch classes
    const classesData = await this.db.query.classes.findMany({
      orderBy: desc(classes.updatedAt),
    });

    // Fetch grades with student information
    const gradesData = await this.db.query.grades.findMany({
      with: {
        student: true,
      },
      orderBy: desc(grades.updatedAt),
    });

    // Fetch enrollments with class and student information
    const enrollmentsData = await this.db.query.enrollments.findMany({
      with: {
        class: true,
        student: true,
      },
      orderBy: desc(enrollments.updatedAt),
    });

    // Fetch users
    const usersData = await this.db.query.users.findMany({
      with: {
        role: true,
      },
      orderBy: desc(users.updatedAt),
    });

    // Map database entities to interface types
    return {
      students: studentsData.map((student) => ({
        id: student.id,
        name: student.name,
        nisn: student.nisn,
        isActive: student.isActive,
      })),
      classes: classesData.map((cls) => ({
        id: cls.id,
        name: cls.name,
      })),
      grades: gradesData.map((grade) => ({
        id: grade.id,
        studentId: grade.studentId,
        classId: 0, // Note: The grades schema doesn't have classId, it has subject instead
        score: Number(grade.score),
      })),
      users: usersData.map((user) => ({
        id: user.id,
        name: user.name,
        role: user.role?.name || 'Unknown',
      })),
      enrollments: enrollmentsData.map((enrollment) => ({
        id: enrollment.id,
        studentId: enrollment.studentId,
        classId: enrollment.classId,
      })),
    };
  }

  /**
   * Fetch dashboard statistics
   */
  private async fetchDashboardStats(rawData?: {
    students: IStudent[];
    classes: IClass[];
    grades: IGrade[];
    enrollments: IEnrollment[];
  }): Promise<IDashboardStats> {
    if (rawData) {
      // Calculate statistics from raw data
      const studentCount = rawData.students.length;
      const classCount = rawData.classes.length;
      const enrollmentCount = rawData.enrollments.length;

      // Calculate average grade
      let averageGrade: number | null = null;
      if (rawData.grades.length > 0) {
        const totalScore = rawData.grades.reduce(
          (sum, grade) => sum + Number(grade.score),
          0,
        );
        averageGrade = parseFloat(
          (totalScore / rawData.grades.length).toFixed(2),
        );
      }

      return {
        studentCount,
        classCount,
        enrollmentCount,
        averageGrade,
      };
    } else {
      // Fallback to mock data
      try {
        // Try to get counts directly from database
        const [studentCountResult] = await this.db
          .select({ count: count() })
          .from(students);
        const [classCountResult] = await this.db
          .select({ count: count() })
          .from(classes);
        const [enrollmentCountResult] = await this.db
          .select({ count: count() })
          .from(enrollments);

        // Calculate average grade
        const [avgGradeResult] = await this.db
          .select({
            avg: sql<string>`AVG(${grades.score})::numeric(5,2)`,
          })
          .from(grades);

        return {
          studentCount: Number(studentCountResult?.count || 0),
          classCount: Number(classCountResult?.count || 0),
          enrollmentCount: Number(enrollmentCountResult?.count || 0),
          averageGrade: avgGradeResult?.avg
            ? parseFloat(avgGradeResult.avg)
            : null,
        };
      } catch (error) {
        handleServiceErrors(
          error,
          this.logger,
          'DashboardService',
          'Failed to fetch dashboard stats',
        );
      }
    }
  }

  /**
   * Fetch grade distribution data
   */
  private async fetchGradeDistribution(rawData?: {
    grades: IGrade[];
  }): Promise<IGradeDistribution> {
    // Define grade ranges
    const labels = ['0-20', '21-40', '41-60', '61-80', '81-100'];
    const ranges = [
      { min: 0, max: 20 },
      { min: 21, max: 40 },
      { min: 41, max: 60 },
      { min: 61, max: 80 },
      { min: 81, max: 100 },
    ];

    if (rawData && rawData.grades.length > 0) {
      // Initialize counts for each range
      const data = Array(ranges.length).fill(0);

      // Count grades in each range
      rawData.grades.forEach((grade) => {
        const score = Number(grade.score);
        for (let i = 0; i < ranges.length; i++) {
          if (score >= ranges[i].min && score <= ranges[i].max) {
            data[i]++;
            break;
          }
        }
      });

      return { labels, data };
    } else {
      try {
        // Try to get grade distribution directly from database
        const data = await Promise.all(
          ranges.map(async ({ min, max }) => {
            const [result] = await this.db
              .select({ count: count() })
              .from(grades)
              .where(
                sql`${grades.score}::numeric >= ${min} AND ${grades.score}::numeric <= ${max}`,
              );
            return Number(result?.count || 0);
          }),
        );

        return { labels, data };
      } catch (error) {
        handleServiceErrors(
          error,
          this.logger,
          'DashboardService',
          'Failed to fetch grade distribution',
        );
      }
    }
  }

  /**
   * Fetch class enrollment data
   */
  private async fetchClassEnrollments(rawData?: {
    classes: IClass[];
    enrollments: IEnrollment[];
  }): Promise<IClassEnrollment[]> {
    if (rawData && rawData.classes.length > 0) {
      // Calculate enrollment counts for each class
      const classEnrollments: Map<number | string, number> = new Map();

      // Count enrollments per class
      rawData.enrollments.forEach((enrollment) => {
        const classId = enrollment.classId;
        classEnrollments.set(classId, (classEnrollments.get(classId) || 0) + 1);
      });

      // Create class enrollment objects
      return rawData.classes.map((cls) => ({
        classId: cls.id,
        className: cls.name,
        enrollmentCount: classEnrollments.get(cls.id) || 0,
      }));
    } else {
      try {
        // Try to get class enrollments directly from database
        const result = await this.db
          .select({
            classId: classes.id,
            className: classes.name,
            enrollmentCount: sql<number>`COUNT(${enrollments.id})`,
          })
          .from(classes)
          .leftJoin(enrollments, eq(classes.id, enrollments.classId))
          .groupBy(classes.id, classes.name)
          .orderBy(desc(sql<number>`COUNT(${enrollments.id})`));

        if (result.length > 0) {
          return result.map((item) => ({
            classId: item.classId,
            className: item.className,
            enrollmentCount: Number(item.enrollmentCount),
          }));
        }

        // If no results, try to get just classes and return with zero enrollments
        const classesData = await this.db.query.classes.findMany();
        if (classesData.length > 0) {
          return classesData.map((cls) => ({
            classId: cls.id as number,
            className: cls.name as string,
            enrollmentCount: 0,
          }));
        }

        throw new Error('No classes found');
      } catch (error) {
        handleServiceErrors(
          error,
          this.logger,
          'DashboardService',
          'Failed to fetch class enrollments',
        );
      }
    }
  }

  /**
   * Fetch recent activities
   */
  private async fetchRecentActivities(rawData?: {
    students: IStudent[];
    grades: IGrade[];
    users: IUser[];
    enrollments: IEnrollment[];
    classes: IClass[];
  }): Promise<IRecentActivity[]> {
    try {
      // Try to get recent activities from audit log
      const auditLogs = await this.db.query.auditLog.findMany({
        orderBy: desc(auditLog.createdAt),
        limit: 10,
      });

      if (auditLogs.length > 0) {
        // Convert audit logs to activities
        return auditLogs.map((log) => {
          let title = 'Activity';
          let type: 'student' | 'grade' | 'user' | 'enrollment' | 'class' =
            'student';

          // Get description from after data if available
          const afterData = log.after as Record<string, any> | null;
          const description =
            afterData?.name || afterData?.description || log.entity;

          // Determine activity type based on entity name
          if (log.entity.includes('student')) {
            title =
              log.action === 'INSERT'
                ? 'New student added'
                : log.action === 'UPDATE'
                  ? 'Student updated'
                  : 'Student removed';
            type = 'student';
          } else if (log.entity.includes('grade')) {
            title =
              log.action === 'INSERT'
                ? 'New grade added'
                : log.action === 'UPDATE'
                  ? 'Grade updated'
                  : 'Grade removed';
            type = 'grade';
          } else if (log.entity.includes('user')) {
            title =
              log.action === 'INSERT'
                ? 'New user registered'
                : log.action === 'UPDATE'
                  ? 'User updated'
                  : 'User removed';
            type = 'user';
          } else if (log.entity.includes('enrollment')) {
            title =
              log.action === 'INSERT'
                ? 'New enrollment'
                : log.action === 'UPDATE'
                  ? 'Enrollment updated'
                  : 'Enrollment removed';
            type = 'enrollment';
          } else if (log.entity.includes('class')) {
            title =
              log.action === 'INSERT'
                ? 'New class created'
                : log.action === 'UPDATE'
                  ? 'Class updated'
                  : 'Class removed';
            type = 'class';
          }

          return {
            id: log.id,
            title,
            description,
            date: log.createdAt.toISOString(),
            type,
          };
        });
      }

      // If no audit logs, try to create activities from the most recent data
      if (rawData) {
        const activities: IRecentActivity[] = [];
        const now = Date.now();

        // Add recent students
        if (rawData.students.length > 0) {
          const recentStudents = rawData.students
            .slice(0, 2)
            .map((student, index) => ({
              id: `student-${student.id}`,
              title: 'New student enrolled',
              description: student.name,
              date: new Date(now - 1000 * 60 * (30 + index * 15)).toISOString(),
              type: 'student' as const,
            }));
          activities.push(...recentStudents);
        }

        // Add recent grades
        if (rawData.grades.length > 0) {
          const recentGrades = rawData.grades
            .slice(0, 2)
            .map((grade, index) => {
              const student = rawData.students.find(
                (s) => s.id === grade.studentId,
              );
              return {
                id: `grade-${grade.id}`,
                title: 'New grade added',
                description: `${student?.name || 'Student'} - Score: ${grade.score}`,
                date: new Date(
                  now - 1000 * 60 * (45 + index * 15),
                ).toISOString(),
                type: 'grade' as const,
              };
            });
          activities.push(...recentGrades);
        }

        // Add recent users
        if (rawData.users.length > 0) {
          const recentUsers = rawData.users.slice(0, 1).map((user, index) => ({
            id: `user-${user.id}`,
            title: 'New user registered',
            description: `${user.name} (${user.role})`,
            date: new Date(now - 1000 * 60 * (60 + index * 15)).toISOString(),
            type: 'user' as const,
          }));
          activities.push(...recentUsers);
        }

        // Add recent classes
        if (rawData.classes.length > 0) {
          const recentClasses = rawData.classes
            .slice(0, 1)
            .map((cls, index) => ({
              id: `class-${cls.id}`,
              title: 'New class created',
              description: cls.name,
              date: new Date(now - 1000 * 60 * (90 + index * 15)).toISOString(),
              type: 'class' as const,
            }));
          activities.push(...recentClasses);
        }

        // Sort by date (newest first)
        return activities
          .sort(
            (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
          )
          .slice(0, 10);
      }

      // Fallback to mock data if no real data available
      throw new Error('No activities data available');
    } catch (error) {
      handleServiceErrors(
        error,
        this.logger,
        'DashboardService',
        'Failed to fetch recent activities',
      );
    }
  }

  /**
   * Fetch top students
   */
  private async fetchTopStudents(rawData?: {
    students: IStudent[];
    grades: IGrade[];
    enrollments: IEnrollment[];
  }): Promise<ITopStudent[]> {
    try {
      if (rawData && rawData.students.length > 0 && rawData.grades.length > 0) {
        // Calculate average scores for each student
        const studentScores = new Map<
          number | string,
          { totalScore: number; count: number }
        >();

        // Calculate total scores and count for each student
        rawData.grades.forEach((grade) => {
          const studentId = grade.studentId;
          const score = Number(grade.score);

          if (!studentScores.has(studentId)) {
            studentScores.set(studentId, { totalScore: 0, count: 0 });
          }

          const current = studentScores.get(studentId)!;
          studentScores.set(studentId, {
            totalScore: current.totalScore + score,
            count: current.count + 1,
          });
        });

        // Count classes per student
        const studentClasses = new Map<number | string, number>();
        rawData.enrollments.forEach((enrollment) => {
          const studentId = enrollment.studentId;
          studentClasses.set(
            studentId,
            (studentClasses.get(studentId) || 0) + 1,
          );
        });

        // Create top students array
        const topStudents: ITopStudent[] = [];

        for (const student of rawData.students) {
          const scores = studentScores.get(student.id);
          if (scores) {
            const avgScore = parseFloat(
              (scores.totalScore / scores.count).toFixed(1),
            );
            topStudents.push({
              id: student.id,
              name: student.name,
              nisn: student.nisn,
              avgScore,
              classCount: studentClasses.get(student.id) || 0,
              isActive: student.isActive,
            });
          }
        }

        // Sort by average score (highest first) and return top 5
        return topStudents.sort((a, b) => b.avgScore - a.avgScore).slice(0, 5);
      } else {
        // Try to get top students directly from database
        const result = await this.db
          .select({
            id: students.id,
            name: students.name,
            nisn: students.nisn,
            isActive: students.isActive,
            avgScore: sql<string>`AVG(${grades.score}::numeric)`,
            classCount: sql<string>`COUNT(DISTINCT ${enrollments.classId})`,
          })
          .from(students)
          .leftJoin(grades, eq(grades.studentId, students.id))
          .leftJoin(enrollments, eq(enrollments.studentId, students.id))
          .groupBy(students.id, students.name, students.nisn, students.isActive)
          .orderBy(desc(sql<string>`AVG(${grades.score}::numeric)`))
          .limit(5);

        if (result.length > 0) {
          return result.map((item) => ({
            id: item.id,
            name: item.name,
            nisn: item.nisn,
            avgScore: parseFloat(item.avgScore || '0'),
            classCount: parseInt(item.classCount || '0'),
            isActive: item.isActive,
          }));
        }

        throw new Error('No student data found');
      }
    } catch (error) {
      handleServiceErrors(
        error,
        this.logger,
        'DashboardService',
        'Failed to fetch top students',
      );
    }
  }
}
