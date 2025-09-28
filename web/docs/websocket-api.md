# WebSocket API Documentation for Dashboard

This document outlines the WebSocket API endpoints and data formats required for the real-time dashboard functionality.

## Base Endpoint

The WebSocket connection is established at:

```
ws://[API_BASE_URL]/dashboard
```

Where `API_BASE_URL` is the same base URL used for REST API calls, with the protocol changed from `http` to `ws`.

## Events

### Client to Server Events

| Event                   | Description                        | Payload |
| ----------------------- | ---------------------------------- | ------- |
| `dashboard:subscribe`   | Subscribe to dashboard updates     | None    |
| `dashboard:unsubscribe` | Unsubscribe from dashboard updates | None    |
| `dashboard:getData`     | Request full dashboard data        | None    |
| `dashboard:refresh`     | Force refresh of dashboard data    | None    |

### Server to Client Events

| Event              | Description              | Payload            |
| ------------------ | ------------------------ | ------------------ |
| `dashboard:data`   | Full dashboard data      | `IDashboardData`   |
| `dashboard:update` | Partial dashboard update | `IDashboardUpdate` |
| `error`            | Error message            | Error object       |

## Data Structures

### IDashboardData

```typescript
interface IDashboardData {
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
```

### IDashboardStats

```typescript
interface IDashboardStats {
  studentCount: number;
  classCount: number;
  enrollmentCount: number;
  averageGrade: number | null;
}
```

### IGradeDistribution

```typescript
interface IGradeDistribution {
  labels: string[]; // e.g., ['0-20', '21-40', '41-60', '61-80', '81-100']
  data: number[]; // Count of students in each grade range
}
```

### IClassEnrollment

```typescript
interface IClassEnrollment {
  classId: string | number;
  className: string;
  enrollmentCount: number;
}
```

### IRecentActivity

```typescript
interface IRecentActivity {
  id: string | number;
  title: string;
  description: string;
  date: string;
  type: "student" | "grade" | "user" | "enrollment" | "class";
}
```

### ITopStudent

```typescript
interface ITopStudent {
  id: string | number;
  name: string;
  nisn: string;
  avgScore: number;
  classCount: number;
  isActive: boolean;
}
```

### IDashboardUpdate

```typescript
interface IDashboardUpdate {
  type: "full" | "stats" | "grades" | "enrollments" | "activities" | "students";
  data: Partial<IDashboardData>;
  timestamp: string;
}
```

## Update Types

The dashboard supports different types of updates to minimize data transfer:

1. `full`: Complete refresh of all dashboard data
2. `stats`: Update only the statistics (student count, class count, etc.)
3. `grades`: Update grade-related data
4. `enrollments`: Update enrollment-related data
5. `activities`: Update recent activities
6. `students`: Update student-related data

## Example Payloads

### Full Dashboard Data

```json
{
  "stats": {
    "studentCount": 150,
    "classCount": 8,
    "enrollmentCount": 320,
    "averageGrade": 78.5
  },
  "gradeDistribution": {
    "labels": ["0-20", "21-40", "41-60", "61-80", "81-100"],
    "data": [5, 15, 45, 65, 20]
  },
  "classEnrollments": [
    {
      "classId": 1,
      "className": "Mathematics 101",
      "enrollmentCount": 45
    },
    {
      "classId": 2,
      "className": "Physics 101",
      "enrollmentCount": 38
    }
  ],
  "recentActivities": [
    {
      "id": 1,
      "title": "New student enrolled",
      "description": "John Doe",
      "date": "2025-09-26T04:30:00Z",
      "type": "student"
    },
    {
      "id": 2,
      "title": "New grade added",
      "description": "Jane Smith - Mathematics",
      "date": "2025-09-26T04:15:00Z",
      "type": "grade"
    }
  ],
  "topStudents": [
    {
      "id": 42,
      "name": "Alice Johnson",
      "nisn": "1234567890",
      "avgScore": 95.5,
      "classCount": 4,
      "isActive": true
    }
  ]
}
```

### Partial Update (Activities)

```json
{
  "type": "activities",
  "data": {
    "recentActivities": [
      {
        "id": 3,
        "title": "New user registered",
        "description": "Teacher Smith",
        "date": "2025-09-26T05:10:00Z",
        "type": "user"
      }
    ]
  },
  "timestamp": "2025-09-26T05:10:00Z"
}
```

## Implementation Notes

1. The WebSocket connection should automatically reconnect if disconnected
2. Updates should be sent to all subscribed clients when data changes
3. The client can request a full data refresh at any time
4. The server should send minimal updates when possible to reduce bandwidth
5. All timestamps should be in ISO 8601 format
