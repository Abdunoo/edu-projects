<template>
  <div>
    <h1 class="text-2xl font-bold text-gray-900 mb-6">Dashboard</h1>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 gap-5 mt-6 sm:grid-cols-2 lg:grid-cols-4">
      <div
        v-for="stat in stats"
        :key="stat.id"
        class="bg-white overflow-hidden shadow rounded-lg"
      >
        <div class="p-5">
          <div class="flex items-center">
            <div :class="[stat.iconBackground, 'flex-shrink-0 p-3 rounded-md']">
              <Icon :name="stat.icon" class="h-6 w-6 text-white" />
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

    <!-- Recent Activity -->
    <div class="mt-8">
      <h2 class="text-lg font-medium text-gray-900 mb-4">Recent Activity</h2>
      <div class="bg-white shadow overflow-hidden sm:rounded-md">
        <ul role="list" class="divide-y divide-gray-200">
          <li v-for="activity in activities" :key="activity.id">
            <div class="px-4 py-4 flex items-center sm:px-6">
              <div
                class="min-w-0 flex-1 sm:flex sm:items-center sm:justify-between"
              >
                <div class="truncate">
                  <div class="flex text-sm">
                    <p class="font-medium text-secondary truncate">
                      {{ activity.title }}
                    </p>
                    <p class="ml-1 flex-shrink-0 font-normal text-gray-500">
                      {{ activity.description }}
                    </p>
                  </div>
                  <div class="mt-2 flex">
                    <div class="flex items-center text-sm text-gray-500">
                      <Icon
                        name="heroicons:calendar"
                        class="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400"
                      />
                      <p>
                        {{ activity.date }}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div class="ml-5 flex-shrink-0">
                <Icon
                  name="heroicons:chevron-right"
                  class="h-5 w-5 text-gray-400"
                />
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const stats = [
  {
    id: 1,
    name: "Total Subscribers",
    value: "8,249",
    icon: "heroicons:users",
    iconBackground: "bg-indigo-500",
  },
  {
    id: 2,
    name: "Avg. Open Rate",
    value: "58.16%",
    icon: "heroicons:envelope-open",
    iconBackground: "bg-green-500",
  },
  {
    id: 3,
    name: "Avg. Click Rate",
    value: "24.57%",
    icon: "heroicons:cursor-click",
    iconBackground: "bg-yellow-500",
  },
  {
    id: 4,
    name: "Active Users",
    value: "1,234",
    icon: "heroicons:user-group",
    iconBackground: "bg-blue-500",
  },
];

const activities = [
  {
    id: 1,
    title: "New user registered",
    description: "John Doe",
    date: "1h ago",
  },
  {
    id: 2,
    title: "New project created",
    description: "Marketing Campaign",
    date: "2h ago",
  },
  {
    id: 3,
    title: "New message",
    description: "from Sarah",
    date: "3h ago",
  },
];
</script>
