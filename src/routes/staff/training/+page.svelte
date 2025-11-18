<script lang="ts">
  import { onMount } from 'svelte'
  import { supabase } from '$lib/utils/supabase'
  import type { PageData } from './$types'

  export let data: PageData // data is used in the template

  let courses: any[] = []
  let assignments: any[] = []
  let completions: any[] = []
  let compliance: any[] = []
  let notifications: any[] = []
  let loading = true
  let activeTab = 'overview'

  // Training assignment form
  let selectedCourseId = ''
  let selectedUsers: string[] = []
  let assignmentDueDate = ''
  let assignmentPriority = 'normal'

  onMount(async () => {
    await loadTrainingData()
  })

  async function loadTrainingData() {
    try {
      loading = true

      // Load training courses
      const { data: coursesData } = await supabase
        .from('training_courses')
        .select('*')
        .eq('is_active', true)
        .order('course_name')

      courses = coursesData || []

      // Load assignments
      const { data: assignmentsData } = await supabase
        .from('training_assignments')
        .select(
          `
          *,
          training_courses (course_name, course_type),
          profiles (full_name, email)
        `
        )
        .order('assigned_at', { ascending: false })
        .limit(50)

      assignments = assignmentsData || []

      // Load completions
      const { data: completionsData } = await supabase
        .from('training_completions')
        .select(
          `
          *,
          training_courses (course_name),
          profiles (full_name, email)
        `
        )
        .order('completed_at', { ascending: false })
        .limit(50)

      completions = completionsData || []

      // Get compliance status
      const { data: complianceData } = await supabase.rpc('get_training_compliance')
      compliance = complianceData || []

      // Load notifications
      const { data: notificationsData } = await supabase
        .from('training_notifications')
        .select(
          `
          *,
          profiles (full_name),
          training_assignments (
            training_courses (course_name)
          )
        `
        )
        .order('sent_at', { ascending: false })
        .limit(20)

      notifications = notificationsData || []
    } catch (error) {
      console.error('Error loading training data:', error)
    } finally {
      loading = false
    }
  }

  async function assignTraining(event: Event) {
    event.preventDefault();
    if (!selectedCourseId || selectedUsers.length === 0) return

    try {
      const { data, error } = await supabase.rpc('assign_training', {
        p_user_ids: selectedUsers,
        p_course_id: selectedCourseId,
        p_due_date: assignmentDueDate || null,
        p_priority: assignmentPriority
      })

      if (error) throw error

      // Reset form
      selectedUsers = []
      assignmentDueDate = ''
      selectedCourseId = ''

      // Reload data
      await loadTrainingData()

      alert('Training assigned successfully!')
    } catch (error) {
      console.error('Error assigning training:', error)
      alert('Error assigning training: ' + (error instanceof Error ? error.message : 'Unknown error'))
    }
  }

  async function sendReminders() {
    try {
      const { data, error } = await supabase.rpc('send_training_reminders')

      if (error) throw error

      alert(`${data[0].notifications_sent} reminders sent successfully!`)
      await loadTrainingData()
    } catch (error) {
      console.error('Error sending reminders:', error)
      alert('Error sending reminders: ' + (error instanceof Error ? error.message : 'Unknown error'))
    }
  }

  function getStatusColor(status: string) {
    switch (status) {
      case 'completed':
        return 'text-green-600 bg-green-100'
      case 'in_progress':
        return 'text-blue-600 bg-blue-100'
      case 'assigned':
        return 'text-yellow-600 bg-yellow-100'
      case 'overdue':
        return 'text-red-600 bg-red-100'
      default:
        return 'text-gray-600 bg-gray-100'
    }
  }

  function getComplianceColor(status: string) {
    switch (status) {
      case 'Compliant':
        return 'text-green-600 bg-green-100'
      case 'Not Trained':
        return 'text-red-600 bg-red-100'
      case 'Training Expired':
        return 'text-orange-600 bg-orange-100'
      case 'Overdue Training':
        return 'text-red-600 bg-red-100'
      default:
        return 'text-gray-600 bg-gray-100'
    }
  }
</script>

<svelte:head>
  <title>HIPAA Training Management - Metzler Foundations</title>
  <meta
    name="description"
    content="Manage HIPAA training assignments, track compliance, and monitor training completions."
  />
</svelte:head>

<div class="min-h-screen bg-cream text-navy">
  <!-- Header -->
  <header class="bg-white border-b border-navy border-opacity-10">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
      <div class="flex justify-between items-center">
        <div>
          <h1 class="text-2xl font-serif font-medium text-navy">HIPAA Training Management</h1>
          <p class="text-sm text-navy text-opacity-60">Manage training assignments and compliance</p>
        </div>
        <button on:click={sendReminders} class="btn-secondary text-sm"> Send Reminders </button>
      </div>
    </div>
  </header>

  <!-- Main Content -->
  <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    {#if loading}
      <div class="flex justify-center items-center py-16">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-navy"></div>
        <span class="ml-3 text-navy">Loading training data...</span>
      </div>
    {:else}
      <!-- Tab Navigation -->
      <div class="mb-8">
        <nav class="flex space-x-8 border-b border-navy border-opacity-10">
          <button
            class="py-2 px-1 border-b-2 font-medium text-sm {activeTab === 'overview'
              ? 'border-olive text-olive'
              : 'border-transparent text-navy text-opacity-60 hover:text-navy'}"
            on:click={() => (activeTab = 'overview')}
          >
            Overview
          </button>
          <button
            class="py-2 px-1 border-b-2 font-medium text-sm {activeTab === 'assignments'
              ? 'border-olive text-olive'
              : 'border-transparent text-navy text-opacity-60 hover:text-navy'}"
            on:click={() => (activeTab = 'assignments')}
          >
            Assignments
          </button>
          <button
            class="py-2 px-1 border-b-2 font-medium text-sm {activeTab === 'compliance'
              ? 'border-olive text-olive'
              : 'border-transparent text-navy text-opacity-60 hover:text-navy'}"
            on:click={() => (activeTab = 'compliance')}
          >
            Compliance
          </button>
          <button
            class="py-2 px-1 border-b-2 font-medium text-sm {activeTab === 'courses'
              ? 'border-olive text-olive'
              : 'border-transparent text-navy text-opacity-60 hover:text-navy'}"
            on:click={() => (activeTab = 'courses')}
          >
            Courses
          </button>
        </nav>
      </div>

      <!-- Tab Content -->
      {#if activeTab === 'overview'}
        <!-- Overview Dashboard -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div class="bg-white rounded-lg shadow-sm border border-navy border-opacity-10 p-6">
            <div class="flex items-center">
              <div class="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <svg class="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  />
                </svg>
              </div>
              <div class="ml-4">
                <p class="text-sm font-medium text-navy text-opacity-60">Active Courses</p>
                <p class="text-2xl font-bold text-navy">{courses.length}</p>
              </div>
            </div>
          </div>

          <div class="bg-white rounded-lg shadow-sm border border-navy border-opacity-10 p-6">
            <div class="flex items-center">
              <div class="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                <svg class="w-5 h-5 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                  />
                </svg>
              </div>
              <div class="ml-4">
                <p class="text-sm font-medium text-navy text-opacity-60">Pending Assignments</p>
                <p class="text-2xl font-bold text-navy">{assignments.filter(a => a.status === 'assigned').length}</p>
              </div>
            </div>
          </div>

          <div class="bg-white rounded-lg shadow-sm border border-navy border-opacity-10 p-6">
            <div class="flex items-center">
              <div class="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <svg class="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div class="ml-4">
                <p class="text-sm font-medium text-navy text-opacity-60">Completions</p>
                <p class="text-2xl font-bold text-navy">{completions.length}</p>
              </div>
            </div>
          </div>

          <div class="bg-white rounded-lg shadow-sm border border-navy border-opacity-10 p-6">
            <div class="flex items-center">
              <div class="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                <svg class="w-5 h-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16c-.77.833.192 2.5 1.732 2.5z"
                  />
                </svg>
              </div>
              <div class="ml-4">
                <p class="text-sm font-medium text-navy text-opacity-60">Non-Compliant</p>
                <p class="text-2xl font-bold text-navy">
                  {compliance.filter(c => c.compliance_status !== 'Compliant').length}
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Recent Activity -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <!-- Recent Assignments -->
          <div class="bg-white rounded-lg shadow-sm border border-navy border-opacity-10 p-6">
            <h3 class="text-lg font-medium text-navy mb-4">Recent Assignments</h3>
            <div class="space-y-3">
              {#each assignments.slice(0, 5) as assignment}
                <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p class="font-medium text-navy text-sm">{assignment.training_courses?.course_name}</p>
                    <p class="text-xs text-navy text-opacity-60">Assigned to {assignment.profiles?.full_name}</p>
                  </div>
                  <span class={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(assignment.status)}`}>
                    {assignment.status}
                  </span>
                </div>
              {/each}
            </div>
          </div>

          <!-- Recent Notifications -->
          <div class="bg-white rounded-lg shadow-sm border border-navy border-opacity-10 p-6">
            <h3 class="text-lg font-medium text-navy mb-4">Recent Notifications</h3>
            <div class="space-y-3">
              {#each notifications.slice(0, 5) as notification}
                <div class="p-3 bg-gray-50 rounded-lg">
                  <p class="font-medium text-navy text-sm">{notification.message}</p>
                  <p class="text-xs text-navy text-opacity-60">
                    {notification.profiles?.full_name} • {new Date(notification.sent_at).toLocaleDateString()}
                  </p>
                </div>
              {/each}
            </div>
          </div>
        </div>
      {:else if activeTab === 'assignments'}
        <!-- Assignments Management -->
        <div class="space-y-6">
          <!-- Assign Training Form -->
          <div class="bg-white rounded-lg shadow-sm border border-navy border-opacity-10 p-6">
            <h3 class="text-lg font-medium text-navy mb-4">Assign Training</h3>
              <form on:submit={assignTraining} class="space-y-4">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label for="course-select" class="block text-sm font-medium text-navy mb-2">Course</label>
                  <select id="course-select" bind:value={selectedCourseId} class="form-input w-full" required>
                    <option value="">Select a course...</option>
                    {#each courses as course}
                      <option value={course.id}>{course.course_name}</option>
                    {/each}
                  </select>
                </div>
                <div>
                  <label for="due-date-input" class="block text-sm font-medium text-navy mb-2">Due Date</label>
                  <input id="due-date-input" type="date" bind:value={assignmentDueDate} class="form-input w-full" />
                </div>
              </div>
              <div>
                <label for="priority-select" class="block text-sm font-medium text-navy mb-2">Priority</label>
                <select id="priority-select" bind:value={assignmentPriority} class="form-input w-full">
                  <option value="low">Low</option>
                  <option value="normal">Normal</option>
                  <option value="high">High</option>
                  <option value="critical">Critical</option>
                </select>
              </div>
              <button type="submit" class="btn-primary">Assign Training</button>
            </form>
          </div>

          <!-- Assignments List -->
          <div class="bg-white rounded-lg shadow-sm border border-navy border-opacity-10 p-6">
            <h3 class="text-lg font-medium text-navy mb-4">Training Assignments</h3>
            <div class="overflow-x-auto">
              <table class="min-w-full divide-y divide-navy divide-opacity-10">
                <thead>
                  <tr>
                    <th
                      class="px-6 py-3 text-left text-xs font-medium text-navy text-opacity-60 uppercase tracking-wider"
                      >Course</th
                    >
                    <th
                      class="px-6 py-3 text-left text-xs font-medium text-navy text-opacity-60 uppercase tracking-wider"
                      >User</th
                    >
                    <th
                      class="px-6 py-3 text-left text-xs font-medium text-navy text-opacity-60 uppercase tracking-wider"
                      >Status</th
                    >
                    <th
                      class="px-6 py-3 text-left text-xs font-medium text-navy text-opacity-60 uppercase tracking-wider"
                      >Due Date</th
                    >
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-navy divide-opacity-10">
                  {#each assignments as assignment}
                    <tr>
                      <td class="px-6 py-4 whitespace-nowrap text-sm text-navy">
                        {assignment.training_courses?.course_name}
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm text-navy">
                        {assignment.profiles?.full_name}
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap">
                        <span class={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(assignment.status)}`}>
                          {assignment.status}
                        </span>
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm text-navy text-opacity-60">
                        {assignment.due_date ? new Date(assignment.due_date).toLocaleDateString() : 'No due date'}
                      </td>
                    </tr>
                  {/each}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      {:else if activeTab === 'compliance'}
        <!-- Compliance Dashboard -->
        <div class="bg-white rounded-lg shadow-sm border border-navy border-opacity-10 p-6">
          <h3 class="text-lg font-medium text-navy mb-4">Training Compliance Status</h3>
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-navy divide-opacity-10">
              <thead>
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-navy text-opacity-60 uppercase tracking-wider"
                    >User</th
                  >
                  <th class="px-6 py-3 text-left text-xs font-medium text-navy text-opacity-60 uppercase tracking-wider"
                    >Role</th
                  >
                  <th class="px-6 py-3 text-left text-xs font-medium text-navy text-opacity-60 uppercase tracking-wider"
                    >HIPAA Trained</th
                  >
                  <th class="px-6 py-3 text-left text-xs font-medium text-navy text-opacity-60 uppercase tracking-wider"
                    >Status</th
                  >
                  <th class="px-6 py-3 text-left text-xs font-medium text-navy text-opacity-60 uppercase tracking-wider"
                    >Assigned</th
                  >
                  <th class="px-6 py-3 text-left text-xs font-medium text-navy text-opacity-60 uppercase tracking-wider"
                    >Completed</th
                  >
                  <th class="px-6 py-3 text-left text-xs font-medium text-navy text-opacity-60 uppercase tracking-wider"
                    >Overdue</th
                  >
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-navy divide-opacity-10">
                {#each compliance as user}
                  <tr>
                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-navy">
                      {user.full_name}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-navy text-opacity-60">
                      {user.role}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-navy">
                      {#if user.hipaa_trained}
                        <span class="text-green-600">✓ Yes</span>
                        {#if user.hipaa_training_expires}
                          <br /><span class="text-xs text-navy text-opacity-60"
                            >Expires: {new Date(user.hipaa_training_expires).toLocaleDateString()}</span
                          >
                        {/if}
                      {:else}
                        <span class="text-red-600">✗ No</span>
                      {/if}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <span
                        class={`px-2 py-1 text-xs font-medium rounded-full ${getComplianceColor(user.compliance_status)}`}
                      >
                        {user.compliance_status}
                      </span>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-navy text-opacity-60">
                      {user.assigned_trainings}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-navy text-opacity-60">
                      {user.completed_trainings}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-navy text-opacity-60">
                      {user.overdue_trainings}
                    </td>
                  </tr>
                {/each}
              </tbody>
            </table>
          </div>
        </div>
      {:else if activeTab === 'courses'}
        <!-- Courses Management -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {#each courses as course}
            <div class="bg-white rounded-lg shadow-sm border border-navy border-opacity-10 p-6">
              <h4 class="text-lg font-medium text-navy mb-2">{course.course_name}</h4>
              <p class="text-sm text-navy text-opacity-60 mb-3">{course.course_description}</p>
              <div class="flex items-center justify-between text-xs text-navy text-opacity-60">
                <span>Type: {course.course_type.replace('_', ' ')}</span>
                <span>{course.estimated_duration_minutes} min</span>
              </div>
              <div class="mt-3 pt-3 border-t border-navy border-opacity-10">
                <div class="flex items-center justify-between text-sm">
                  <span>Passing Score: {course.passing_score_percentage}%</span>
                  <span class="text-xs bg-olive bg-opacity-10 text-olive px-2 py-1 rounded">v{course.version}</span>
                </div>
              </div>
            </div>
          {/each}
        </div>
      {/if}
    {/if}
  </main>
</div>
