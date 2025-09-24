<template>
  <div>
    <h1 class="text-2xl font-bold text-gray-900 mb-6">Help & Support</h1>

    <!-- Help Page Tabs -->
    <UTabs :items="tabs" variant="link" :ui="{ trigger: 'grow' }" class="mb-8">
      <!-- FAQ Section -->
      <template #faq="{}">
        <h2 class="text-lg font-medium text-gray-900 mb-4">
          Frequently Asked Questions
        </h2>
        <UAccordion :items="faqItems" />
      </template>

      <!-- Contact Support Section -->
      <template #contact="{}">
        <h2 class="text-lg font-medium text-gray-900 mb-4">Contact Support</h2>
        <div class="bg-white shadow overflow-hidden sm:rounded-lg p-6">
          <form @submit.prevent="submitSupportRequest">
            <div class="space-y-6">
              <div>
                <UFormField label="Subject" name="subject">
                  <UInput
                    v-model="supportForm.subject"
                    placeholder="Brief description of your issue"
                  />
                </UFormField>
              </div>
              <div>
                <UFormField label="Category" name="category">
                  <USelect
                    v-model="supportForm.category"
                    :items="supportCategories"
                    placeholder="Select a category"
                  />
                </UFormField>
              </div>
              <div>
                <UFormField label="Priority" name="priority">
                  <URadioGroup
                    v-model="supportForm.priority"
                    :items="priorityOptions"
                  />
                </UFormField>
              </div>
              <div>
                <UFormField label="Description" name="description">
                  <UTextarea
                    v-model="supportForm.description"
                    placeholder="Please provide details about your issue"
                    :rows="5"
                  />
                </UFormField>
              </div>
              <div>
                <UFormField label="Attachments" name="attachments">
                  <UInput type="file" multiple />
                </UFormField>
              </div>
              <div class="flex justify-end">
                <UButton type="submit" color="primary">Submit Request</UButton>
              </div>
            </div>
          </form>
        </div>
      </template>

      <!-- Documentation Section -->
      <template #docs="{}">
        <h2 class="text-lg font-medium text-gray-900 mb-4">
          Documentation & Resources
        </h2>

        <!-- Quick Start Guide -->
        <div class="bg-white shadow overflow-hidden sm:rounded-lg mb-6">
          <div class="px-4 py-5 sm:px-6">
            <h3 class="text-lg leading-6 font-medium text-gray-900">
              Quick Start Guide
            </h3>
            <p class="mt-1 max-w-2xl text-sm text-gray-500">
              Get up and running with EduManagePro in minutes
            </p>
          </div>
          <div class="border-t border-gray-200 px-4 py-5 sm:p-6">
            <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <UCard>
                <template #header>
                  <div class="flex items-center">
                    <Icon
                      name="i-lucide-book-open"
                      class="mr-2 h-5 w-5 text-primary-600"
                    />
                    <h3 class="text-base font-semibold text-gray-900">
                      User Guides
                    </h3>
                  </div>
                </template>
                <p class="text-sm text-gray-600">
                  Step-by-step guides for all major features and workflows.
                </p>
                <template #footer>
                  <UButton color="neutral" variant="ghost" size="sm"
                    >View Guides</UButton
                  >
                </template>
              </UCard>

              <UCard>
                <template #header>
                  <div class="flex items-center">
                    <Icon
                      name="i-lucide-video"
                      class="mr-2 h-5 w-5 text-primary-600"
                    />
                    <h3 class="text-base font-semibold text-gray-900">
                      Video Tutorials
                    </h3>
                  </div>
                </template>
                <p class="text-sm text-gray-600">
                  Watch video demonstrations of key features and processes.
                </p>
                <template #footer>
                  <UButton color="neutral" variant="ghost" size="sm"
                    >Watch Videos</UButton
                  >
                </template>
              </UCard>
            </div>
          </div>
        </div>

        <!-- Documentation Links -->
        <div class="bg-white shadow overflow-hidden sm:rounded-lg">
          <div class="px-4 py-5 sm:px-6">
            <h3 class="text-lg leading-6 font-medium text-gray-900">
              Documentation Library
            </h3>
            <p class="mt-1 max-w-2xl text-sm text-gray-500">
              Comprehensive documentation for all system features
            </p>
          </div>
          <div class="border-t border-gray-200">
            <ul role="list" class="divide-y divide-gray-200">
              <li
                v-for="doc in documentationLinks"
                :key="doc.id"
                class="px-4 py-4 sm:px-6"
              >
                <div class="flex items-center justify-between">
                  <div class="flex items-center">
                    <Icon :name="doc.icon" class="h-5 w-5 text-gray-400 mr-3" />
                    <p class="text-sm font-medium text-primary-600 truncate">
                      {{ doc.title }}
                    </p>
                  </div>
                  <div class="ml-2 flex-shrink-0">
                    <UButton
                      color="neutral"
                      variant="ghost"
                      size="xs"
                      icon="i-lucide-external-link"
                    >
                      Open
                    </UButton>
                  </div>
                </div>
                <div class="mt-2 sm:flex sm:justify-between">
                  <div class="sm:flex">
                    <p class="flex items-center text-sm text-gray-500">
                      {{ doc.description }}
                    </p>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </template>
    </UTabs>

    <!-- Support Info Card -->
    <div class="bg-white shadow overflow-hidden sm:rounded-lg mt-8">
      <div class="px-4 py-5 sm:p-6">
        <h3 class="text-lg leading-6 font-medium text-gray-900">
          Need Additional Help?
        </h3>
        <div class="mt-2 max-w-xl text-sm text-gray-500">
          <p>Our support team is available Monday through Friday, 9AM - 5PM.</p>
        </div>
        <div class="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div class="flex items-center">
            <Icon name="i-lucide-phone" class="h-5 w-5 text-gray-400 mr-2" />
            <span class="text-sm text-gray-700">+1 (555) 123-4567</span>
          </div>
          <div class="flex items-center">
            <Icon name="i-lucide-mail" class="h-5 w-5 text-gray-400 mr-2" />
            <span class="text-sm text-gray-700">support@edumanagepro.com</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
useHead({ title: "Help & Support" });

// Tab configuration
const tabs = [
  { key: "faq", label: "FAQs", icon: "i-lucide-help-circle", slot: "faq" },
  {
    key: "contact",
    label: "Contact Support",
    icon: "i-lucide-mail",
    slot: "contact",
  },
  { key: "docs", label: "Documentation", icon: "i-lucide-book", slot: "docs" },
];

// FAQ items
const faqItems = [
  {
    label: "How do I reset my password?",
    content:
      'To reset your password, click on the "Forgot Password" link on the login page. You will receive an email with instructions to reset your password. Follow the link in the email to create a new password.',
    icon: "i-lucide-lock",
  },
  {
    label: "How do I add a new student?",
    content:
      'To add a new student, navigate to the Students page from the sidebar, then click the "Add Student" button in the top-right corner. Fill out the required information in the form and click "Save" to create the new student record.',
    icon: "i-lucide-user-plus",
  },
  {
    label: "How do I create a new class?",
    content:
      'To create a new class, go to the Classes page from the sidebar and click on the "Create Class" button. Fill in the class details including name, description, schedule, and assign a teacher. Click "Save" to create the class.',
    icon: "i-lucide-presentation",
  },
  {
    label: "How do I enroll students in a class?",
    content:
      'To enroll students in a class, navigate to the Enrollments page, click "New Enrollment", then select the class and the students you want to enroll. You can select multiple students at once. Click "Enroll" to complete the process.',
    icon: "i-lucide-book-open",
  },
  {
    label: "How do I view and manage grades?",
    content:
      "To view and manage grades, go to the Grades section from the sidebar. You can filter by class, student, or grading period. To add or edit grades, click on the edit icon next to the relevant entry.",
    icon: "i-lucide-award",
  },
  {
    label: "How do I generate reports?",
    content:
      'Reports can be generated from various sections of the application. Look for the "Generate Report" or "Export" button in the section you\'re interested in. You can typically choose between PDF, Excel, or CSV formats.',
    icon: "i-lucide-file-text",
  },
  {
    label: "How do I manage user permissions?",
    content:
      'User permissions are managed in the Users & Roles section. Navigate there from the sidebar, select the user you want to modify, and click "Edit Permissions". You can assign or remove roles and specific permissions as needed.',
    icon: "i-lucide-shield",
  },
];

// Support form
const supportForm = reactive({
  subject: "",
  category: "",
  priority: "medium",
  description: "",
});

// Support categories
const supportCategories = [
  { label: "Technical Issue", value: "technical" },
  { label: "Account Access", value: "account" },
  { label: "Billing Question", value: "billing" },
  { label: "Feature Request", value: "feature" },
  { label: "General Inquiry", value: "general" },
];

// Priority options
const priorityOptions = [
  { label: "Low", value: "low" },
  { label: "Medium", value: "medium" },
  { label: "High", value: "high" },
];

// Documentation links
const documentationLinks = [
  {
    id: 1,
    title: "Administrator Guide",
    description: "Complete guide for system administrators",
    icon: "i-lucide-settings",
  },
  {
    id: 2,
    title: "Teacher Manual",
    description: "Instructions for managing classes and grades",
    icon: "i-lucide-graduation-cap",
  },
  {
    id: 3,
    title: "Student Portal Guide",
    description: "Help for students accessing the system",
    icon: "i-lucide-users",
  },
  {
    id: 4,
    title: "API Documentation",
    description: "Technical documentation for developers",
    icon: "i-lucide-code",
  },
  {
    id: 5,
    title: "Data Import/Export Guide",
    description: "Instructions for bulk data operations",
    icon: "i-lucide-database",
  },
];

// Submit support request
const submitSupportRequest = () => {
  // In a real application, this would send the form data to a backend API
  alert("Support request submitted! Our team will contact you shortly.");

  // Reset form after submission
  supportForm.subject = "";
  supportForm.category = "";
  supportForm.priority = "medium";
  supportForm.description = "";
};
</script>
