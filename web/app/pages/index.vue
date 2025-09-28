<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold text-gray-900">Dashboard</h1>
      <div class="flex items-center space-x-2">
        <div v-if="lastUpdate" class="text-sm text-gray-500 mr-3">
          Last updated: {{ formatLastUpdate(lastUpdate) }}
          <span
            v-if="isConnected"
            class="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800"
          >
            <span class="h-2 w-2 mr-1 bg-green-400 rounded-full"></span>
            Live
          </span>
          <span
            v-else
            class="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
          >
            <span class="h-2 w-2 mr-1 bg-gray-400 rounded-full"></span>
            Offline
          </span>
        </div>
        <button
          class="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          @click="refreshData"
        >
          <i class="i-lucide-refresh-cw mr-2" />
          Refresh
        </button>
      </div>
    </div>

    <!-- Loading state -->
    <div v-if="loading" class="flex justify-center items-center h-64">
      <div
        class="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-gray-900"
      ></div>
    </div>

    <div v-else>
      <!-- Stats Cards -->
      <div class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div
          v-for="stat in stats"
          :key="stat.id"
          class="bg-white overflow-hidden shadow rounded-xl border border-gray-100 transition-all duration-200 hover:shadow-md"
        >
          <div class="p-5">
            <div class="flex items-center">
              <div
                :class="[stat.iconBackground, 'flex-shrink-0 p-3 rounded-md']"
              >
                <i :class="[stat.icon, 'h-6 w-6 text-white']" />
              </div>
              <div class="ml-5 w-0 flex-1">
                <dl>
                  <dt class="text-sm font-medium text-gray-500 truncate">
                    {{ stat.name }}
                  </dt>
                  <dd>
                    <div class="text-lg font-medium text-gray-900">
                      {{ stat.value }}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Charts Section -->
      <div class="grid grid-cols-1 gap-5 mt-6 lg:grid-cols-2">
        <!-- Grade Distribution Chart -->
        <div class="bg-white p-6 rounded-xl shadow border border-gray-100">
          <h2 class="text-lg font-medium text-gray-900 mb-4">
            Grade Distribution
          </h2>
          <div class="h-64">
            <BarChart
              v-if="
                chartData.gradeDistribution.datasets[0] &&
                chartData.gradeDistribution.datasets[0].data.length > 0
              "
              :data="chartData.gradeDistribution"
              :options="chartOptions.gradeDistribution"
            />
            <div
              v-else
              class="flex h-full items-center justify-center text-gray-500"
            >
              No grade data available
            </div>
          </div>
        </div>

        <!-- Class Enrollment Chart -->
        <div class="bg-white p-6 rounded-xl shadow border border-gray-100">
          <h2 class="text-lg font-medium text-gray-900 mb-4">
            Class Enrollment
          </h2>
          <div class="h-64">
            <DoughnutChart
              v-if="
                chartData.classEnrollment.datasets[0] &&
                chartData.classEnrollment.datasets[0].data.length > 0
              "
              :data="chartData.classEnrollment"
              :options="chartOptions.classEnrollment"
            />
            <div
              v-else
              class="flex h-full items-center justify-center text-gray-500"
            >
              No enrollment data available
            </div>
          </div>
        </div>
      </div>

      <!-- Recent Activity -->
      <div class="mt-8">
        <h2 class="text-lg font-medium text-gray-900 mb-4">Recent Activity</h2>
        <div
          class="bg-white shadow overflow-hidden rounded-xl border border-gray-100"
        >
          <ul
            v-if="recentActivities.length > 0"
            role="list"
            class="divide-y divide-gray-200"
          >
            <li
              v-for="activity in recentActivities"
              :key="activity.id"
              class="hover:bg-gray-50"
            >
              <div class="px-4 py-4 flex items-center sm:px-6">
                <div
                  class="min-w-0 flex-1 sm:flex sm:items-center sm:justify-between"
                >
                  <div class="truncate">
                    <div class="flex text-sm">
                      <p class="font-medium text-indigo-600 truncate">
                        {{ activity.title }}
                      </p>
                      <p class="ml-1 flex-shrink-0 font-normal text-gray-500">
                        {{ activity.description }}
                      </p>
                    </div>
                    <div class="mt-2 flex">
                      <div class="flex items-center text-sm text-gray-500">
                        <i
                          class="i-lucide-clock mr-1.5 h-5 w-5 text-gray-400"
                        />
                        <p>
                          {{ activity.date }}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="ml-5 flex-shrink-0">
                  <i class="i-lucide-chevron-right h-5 w-5 text-gray-400" />
                </div>
              </div>
            </li>
          </ul>
          <div v-else class="p-6 text-center text-gray-500">
            No recent activities found
          </div>
        </div>
      </div>

      <!-- Student Performance Table -->
      <div class="mt-8">
        <h2 class="text-lg font-medium text-gray-900 mb-4">
          Top Student Performance
        </h2>
        <div
          class="bg-white shadow overflow-hidden rounded-xl border border-gray-100"
        >
          <div class="overflow-x-auto">
            <table
              v-if="topStudents.length > 0"
              class="min-w-full divide-y divide-gray-200"
            >
              <thead class="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Student
                  </th>
                  <th
                    scope="col"
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Average Score
                  </th>
                  <th
                    scope="col"
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Classes
                  </th>
                  <th
                    scope="col"
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Status
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr
                  v-for="student in topStudents"
                  :key="student.id"
                  class="hover:bg-gray-50"
                >
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex items-center">
                      <div
                        class="flex-shrink-0 h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center"
                      >
                        <i class="i-lucide-user text-gray-500" />
                      </div>
                      <div class="ml-4">
                        <div class="text-sm font-medium text-gray-900">
                          {{ student.name }}
                        </div>
                        <div class="text-sm text-gray-500">
                          {{ student.nisn }}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-900">
                      {{ student.avgScore.toFixed(1) }}
                    </div>
                    <div class="w-full bg-gray-200 rounded-full h-2.5">
                      <div
                        class="bg-green-600 h-2.5 rounded-full"
                        :style="{ width: `${student.avgScore}%` }"
                      ></div>
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {{ student.classCount }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span
                      v-if="student.isActive"
                      class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800"
                    >
                      Active
                    </span>
                    <span
                      v-else
                      class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800"
                    >
                      Inactive
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
            <div v-else class="p-6 text-center text-gray-500">
              No student performance data available
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, onBeforeUnmount } from "vue";
import { Bar as BarChart, Doughnut as DoughnutChart } from "vue-chartjs";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import type { IBaseApiResponse } from "~~/types/api";
import type { IStudent } from "~~/schemas/student.schema";
import type { IClass } from "~~/schemas/class.schema";
import type { IGrade } from "~~/schemas/grade.schema";
import type { IUser } from "~~/schemas/user.schema";
import type { IEnrollment } from "~~/schemas/enrollment.schema";
import type { IDashboardData, IDashboardUpdate } from "~~/types/dashboard";
import { ENDPOINTS } from "~~/utils/constant";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
);

const loading = ref(true);
const students = ref<IStudent[]>([]);
const classes = ref<IClass[]>([]);
const grades = ref<IGrade[]>([]);
const users = ref<IUser[]>([]);
const enrollments = ref<IEnrollment[]>([]);
const recentActivities = ref<
  Array<{
    id: number | string;
    title: string;
    description: string;
    date: string;
    type?: string;
  }>
>([]);

const stats = computed(() => [
  {
    id: 1,
    name: "Students",
    value: students.value.length.toString(),
    icon: "i-lucide-graduation-cap",
    iconBackground: "bg-indigo-500",
  },
  {
    id: 2,
    name: "Classes",
    value: classes.value.length.toString(),
    icon: "i-lucide-book-open",
    iconBackground: "bg-green-500",
  },
  {
    id: 3,
    name: "Enrollments",
    value: enrollments.value.length.toString(),
    icon: "i-lucide-users",
    iconBackground: "bg-yellow-500",
  },
  {
    id: 4,
    name: "Avg. Grade",
    value: calculateAverageGrade(),
    icon: "i-lucide-bar-chart-2",
    iconBackground: "bg-blue-500",
  },
]);

const chartData = ref({
  gradeDistribution: {
    labels: ["0-20", "21-40", "41-60", "61-80", "81-100"],
    datasets: [
      {
        label: "Students",
        data: [] as number[],
        backgroundColor: [
          "rgba(54, 162, 235, 0.6)",
          "rgba(75, 192, 192, 0.6)",
          "rgba(255, 206, 86, 0.6)",
          "rgba(255, 159, 64, 0.6)",
          "rgba(75, 192, 192, 0.6)",
        ],
        borderColor: [
          "rgba(54, 162, 235, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(255, 159, 64, 1)",
          "rgba(75, 192, 192, 1)",
        ],
        borderWidth: 1,
      },
    ],
  },
  classEnrollment: {
    labels: [] as string[],
    datasets: [
      {
        label: "Enrollments",
        data: [] as number[],
        backgroundColor: [
          "rgba(255, 99, 132, 0.6)",
          "rgba(54, 162, 235, 0.6)",
          "rgba(255, 206, 86, 0.6)",
          "rgba(75, 192, 192, 0.6)",
          "rgba(153, 102, 255, 0.6)",
          "rgba(255, 159, 64, 0.6)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
          "rgba(255, 159, 64, 1)",
        ],
        borderWidth: 1,
      },
    ],
  },
});

const chartOptions = {
  gradeDistribution: {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: false,
      },
    },
  },
  classEnrollment: {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: false,
      },
    },
  },
};

const topStudents = computed(() => {
  const studentGrades = new Map();
  const studentClasses = new Map();

  grades.value.forEach((grade) => {
    if (!studentGrades.has(grade.studentId)) {
      studentGrades.set(grade.studentId, {
        total: 0,
        count: 0,
      });
    }

    const current = studentGrades.get(grade.studentId);
    current.total += grade.score;
    current.count += 1;
  });

  enrollments.value.forEach((enrollment) => {
    if (!studentClasses.has(enrollment.studentId)) {
      studentClasses.set(enrollment.studentId, 0);
    }
    studentClasses.set(
      enrollment.studentId,
      studentClasses.get(enrollment.studentId) + 1,
    );
  });

  const studentsWithScores = students.value
    .filter((student) => studentGrades.has(student.id))
    .map((student) => {
      const gradeData = studentGrades.get(student.id);
      const avgScore =
        gradeData.count > 0 ? gradeData.total / gradeData.count : 0;
      return {
        ...student,
        avgScore,
        classCount: studentClasses.get(student.id) || 0,
      };
    })
    .sort((a, b) => b.avgScore - a.avgScore)
    .slice(0, 5);

  return studentsWithScores;
});

function calculateAverageGrade() {
  if (grades.value.length === 0) return "N/A";

  const total = grades.value.reduce((sum, grade) => sum + grade.score, 0);
  const average = total / grades.value.length;

  return `${average.toFixed(1)}`;
}

const { $socket } = useNuxtApp();
const isConnected = ref(false);
const lastUpdate = ref<Date | null>(null);
const connectionCheckInterval = ref<NodeJS.Timeout | null>(null);

function setupWebSocketListeners() {
  console.log("Setting up WebSocket listeners");

  if (!$socket) {
    console.error("Socket instance not available");
    return;
  }

  console.log("Socket instance:", $socket);

  cleanupSocketListeners();

  isConnected.value = $socket.connected;
  console.log("Initial connection status:", isConnected.value);

  if (connectionCheckInterval.value) {
    clearInterval(connectionCheckInterval.value);
  }

  connectionCheckInterval.value = setInterval(() => {
    if ($socket) {
      const currentStatus = $socket.connected;
      if (isConnected.value !== currentStatus) {
        console.log(
          `Connection status changed: ${isConnected.value} -> ${currentStatus}`,
        );
        isConnected.value = currentStatus;
      }
    }
  }, 2000);

  $socket.on("connect", () => {
    isConnected.value = true;
    console.log("Connected to dashboard WebSocket");
    $socket.emit("dashboard:subscribe");
    if (loading.value) {
      fetchData();
    }
  });

  $socket.on("disconnect", () => {
    isConnected.value = false;
    console.log("Disconnected from dashboard WebSocket");
  });

  $socket.on("reconnect", () => {
    console.log("Reconnected to dashboard WebSocket");
    $socket.emit("dashboard:subscribe");
    fetchData();
  });

  $socket.on("dashboard:data", (data: IDashboardData) => {
    console.log("Received full dashboard data:", data);
    lastUpdate.value = new Date();

    if (data.rawData) {
      students.value = data.rawData.students ?? [];
      classes.value = data.rawData.classes ?? [];
      grades.value = data.rawData.grades ?? [];
      users.value = data.rawData.users ?? [];
      enrollments.value = data.rawData.enrollments ?? [];
    }

    processChartData();

    if (data.recentActivities) {
      recentActivities.value = data.recentActivities.map((activity) => ({
        ...activity,
        id: activity.id,
      }));
    } else {
      generateRecentActivities();
    }

    loading.value = false;
  });

  $socket.on("dashboard:update", (update: IDashboardUpdate) => {
    console.log(`Received dashboard update (${update.type}):`, update);
    lastUpdate.value = new Date(update.timestamp);

    // Handle different types of updates
    switch (update.type) {
      case "full":
        if (update.data.rawData) {
          students.value = update.data.rawData.students ?? students.value;
          classes.value = update.data.rawData.classes ?? classes.value;
          grades.value = update.data.rawData.grades ?? grades.value;
          users.value = update.data.rawData.users ?? users.value;
          enrollments.value =
            update.data.rawData.enrollments ?? enrollments.value;
        }
        processChartData();
        if (update.data.recentActivities) {
          recentActivities.value = update.data.recentActivities;
        } else {
          generateRecentActivities();
        }
        break;

      case "stats":
        // Stats will be automatically updated through computed properties
        break;

      case "grades":
        if (update.data.rawData && update.data.rawData.grades) {
          grades.value = update.data.rawData.grades;
          processChartData();
        }
        break;

      case "enrollments":
        if (update.data.rawData && update.data.rawData.enrollments) {
          enrollments.value = update.data.rawData.enrollments;
          processChartData();
        }
        break;

      case "activities":
        if (update.data.recentActivities) {
          recentActivities.value = update.data.recentActivities.map(
            (activity) => ({
              ...activity,
              id: activity.id,
            }),
          );
        }
        break;

      case "students":
        if (update.data.rawData && update.data.rawData.students) {
          students.value = update.data.rawData.students;
          generateRecentActivities();
        }
        break;
    }
  });

  $socket.on("error", (error: any) => {
    console.error("Dashboard WebSocket error:", error);
  });
}

// Clean up socket listeners to prevent duplicates
function cleanupSocketListeners() {
  if (!$socket) return;

  $socket.off("connect");
  $socket.off("disconnect");
  $socket.off("reconnect");
  $socket.off("dashboard:data");
  $socket.off("dashboard:update");
  $socket.off("error");
}

// Fetch all data (fallback to REST API if WebSocket is not available)
async function fetchData() {
  loading.value = true;

  // If socket exists, check if it's connected
  if ($socket) {
    // Check the actual socket connection status instead of relying on the ref
    const socketConnected = $socket.connected;
    console.log("Socket connection status:", socketConnected);
    isConnected.value = socketConnected; // Update the reactive connection status

    if (socketConnected) {
      console.log("Requesting data through WebSocket");
      $socket.emit("dashboard:getData");

      // Set a timeout to fall back to REST API if no response after 5 seconds
      setTimeout(() => {
        if (loading.value) {
          console.log(
            "WebSocket data request timed out, falling back to REST API",
          );
          fetchDataFromRestApi();
        }
      }, 5000);

      return;
    } else {
      // If socket exists but not connected, try to connect it
      console.log("Socket exists but not connected, trying to connect");
      $socket.connect();

      // Wait a bit for the connection to establish
      setTimeout(() => {
        // Update connection status after connection attempt
        isConnected.value = $socket?.connected ?? false;
        console.log("Connection status after retry:", isConnected.value);

        if ($socket && $socket.connected) {
          console.log("Socket connected after retry, requesting data");
          $socket.emit("dashboard:getData");
          $socket.emit("dashboard:subscribe"); // Make sure we're subscribed

          // Set another timeout for fallback
          setTimeout(() => {
            if (loading.value) {
              console.log(
                "WebSocket data request timed out after retry, falling back to REST API",
              );
              fetchDataFromRestApi();
            }
          }, 5000);
        } else {
          console.log("Socket still not connected after retry, using REST API");
          fetchDataFromRestApi();
        }
      }, 1000);

      return;
    }
  }

  // If no socket is available, use REST API immediately
  console.log("No socket available, using REST API");
  isConnected.value = false; // Ensure connection status is updated
  await fetchDataFromRestApi();
}

// Fallback to REST API
async function fetchDataFromRestApi() {
  try {
    const { $api } = useNuxtApp();

    // Fetch students
    const studentsResponse = await $api<IBaseApiResponse<IStudent[]>>(
      ENDPOINTS.STUDENTS.BASE,
    );
    students.value = studentsResponse.data || [];

    // Fetch classes
    const classesResponse = await $api<IBaseApiResponse<IClass[]>>(
      ENDPOINTS.CLASSES.BASE,
    );
    classes.value = classesResponse.data || [];

    // Fetch grades
    const gradesResponse = await $api<IBaseApiResponse<IGrade[]>>(
      ENDPOINTS.GRADES.BASE,
    );
    grades.value = gradesResponse.data || [];

    // Fetch users
    const usersResponse = await $api<IBaseApiResponse<IUser[]>>(
      ENDPOINTS.USERS.BASE,
    );
    users.value = usersResponse.data || [];

    // Fetch enrollments
    const enrollmentsResponse = await $api<IBaseApiResponse<IEnrollment[]>>(
      ENDPOINTS.ENROLLMENTS.BASE,
    );
    enrollments.value = enrollmentsResponse.data || [];

    // Process data for charts
    processChartData();

    // Generate recent activities
    generateRecentActivities();

    console.log("Data fetched from REST API");
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
  } finally {
    loading.value = false;
  }
}

// Process data for charts
function processChartData() {
  // Process grade distribution data
  const gradeRanges = [0, 0, 0, 0, 0]; // 0-20, 21-40, 41-60, 61-80, 81-100

  grades.value.forEach((grade) => {
    // Make sure grade and score are defined
    if (!grade || typeof grade.score !== "number") return;

    const score = grade.score;
    // Use optional chaining and nullish coalescing to safely increment array values
    if (score <= 20) gradeRanges[0] = (gradeRanges[0] ?? 0) + 1;
    else if (score <= 40) gradeRanges[1] = (gradeRanges[1] ?? 0) + 1;
    else if (score <= 60) gradeRanges[2] = (gradeRanges[2] ?? 0) + 1;
    else if (score <= 80) gradeRanges[3] = (gradeRanges[3] ?? 0) + 1;
    else gradeRanges[4] = (gradeRanges[4] ?? 0) + 1;
  });

  // Safely update chart data
  if (
    chartData.value.gradeDistribution &&
    chartData.value.gradeDistribution.datasets &&
    chartData.value.gradeDistribution.datasets[0]
  ) {
    chartData.value.gradeDistribution.datasets[0].data = gradeRanges;
  }

  // Process class enrollment data
  const classEnrollments = new Map<string | number, number>();

  enrollments.value.forEach((enrollment) => {
    const classId = enrollment.classId;
    if (classId) {
      if (!classEnrollments.has(classId)) {
        classEnrollments.set(classId, 0);
      }
      const currentCount = classEnrollments.get(classId) ?? 0;
      classEnrollments.set(classId, currentCount + 1);
    }
  });

  const classLabels: string[] = [];
  const classData: number[] = [];

  // Get class names and enrollment counts
  Array.from(classEnrollments.entries()).forEach(([classId, count]) => {
    const classObj = classes.value.find((c) => c.id === classId);
    if (classObj && classObj.name) {
      classLabels.push(classObj.name);
      classData.push(count);
    }
  });

  // Update chart data safely
  chartData.value.classEnrollment.labels = classLabels;

  // Make sure datasets[0] exists before updating its data
  if (
    chartData.value.classEnrollment.datasets &&
    chartData.value.classEnrollment.datasets[0]
  ) {
    chartData.value.classEnrollment.datasets[0].data = classData;
  }
}

// Generate recent activities based on data
function generateRecentActivities() {
  const activities: Array<{
    id: number | string;
    title: string;
    description: string;
    date: string;
    type?: string;
  }> = [];

  // Add recent students
  const recentStudents = [...students.value]
    .sort(
      (a, b) =>
        new Date(b.createdAt || "").getTime() -
        new Date(a.createdAt || "").getTime(),
    )
    .slice(0, 2);

  recentStudents.forEach((student, index) => {
    activities.push({
      id: index + 1,
      title: "New student enrolled",
      description: student.name,
      date: formatDate(student.createdAt),
    });
  });

  // Add recent grades
  const recentGrades = [...grades.value]
    .sort(
      (a, b) =>
        new Date(b.createdAt || "").getTime() -
        new Date(a.createdAt || "").getTime(),
    )
    .slice(0, 2);

  recentGrades.forEach((grade, index) => {
    const student = students.value.find((s) => s.id === grade.studentId);
    activities.push({
      id: recentStudents.length + index + 1,
      title: "New grade added",
      description: `${student?.name || "Unknown"} - ${grade.subject}`,
      date: formatDate(grade.createdAt),
    });
  });

  // Add recent users
  const recentUsers = [...users.value]
    .sort(
      (a, b) =>
        new Date(b.createdAt || "").getTime() -
        new Date(a.createdAt || "").getTime(),
    )
    .slice(0, 1);

  recentUsers.forEach((user, index) => {
    activities.push({
      id: recentStudents.length + recentGrades.length + index + 1,
      title: "New user registered",
      description: user.name,
      date: formatDate(user.createdAt),
    });
  });

  // Sort by date
  recentActivities.value = activities.sort((a, b) => {
    return a.date.localeCompare(b.date);
  });
}

// Format date for display
function formatDate(dateString?: string): string {
  if (!dateString) return "Recently";

  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;

  return date.toLocaleDateString();
}

// Format last update time
function formatLastUpdate(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSecs = Math.floor(diffMs / 1000);

  if (diffSecs < 10) return "Just now";
  if (diffSecs < 60) return `${diffSecs}s ago`;

  const diffMins = Math.floor(diffSecs / 60);
  if (diffMins < 60) return `${diffMins}m ago`;

  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;

  return date.toLocaleTimeString();
}

// Refresh data
function refreshData() {
  if ($socket && isConnected.value) {
    $socket.emit("dashboard:refresh");
    loading.value = true;
  } else {
    fetchData();
  }
}

// Fetch data on component mount
onMounted(() => {
  setupWebSocketListeners();
  fetchData();
});

// Clean up WebSocket listeners when component is unmounted
onBeforeUnmount(() => {
  if ($socket) {
    // Unsubscribe from dashboard updates
    $socket.emit("dashboard:unsubscribe");

    // Clean up all event listeners
    cleanupSocketListeners();
  }

  // Clear the connection check interval
  if (connectionCheckInterval.value) {
    clearInterval(connectionCheckInterval.value);
    connectionCheckInterval.value = null;
  }
});
</script>
