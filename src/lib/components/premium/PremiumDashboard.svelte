<script lang="ts">
  import { onMount } from 'svelte';
  import { fade, slide } from 'svelte/transition';
  import PremiumCard from './PremiumCard.svelte';
  import PremiumButton from './PremiumButton.svelte';

  export let userName = "Guest";
  export let userProgress = {
    daysSober: 45,
    totalDays: 90,
    milestones: 3,
    nextMilestone: 60
  };
  export let upcomingAppointments: Array<{
    id: string;
    type: string;
    date: Date;
    time: string;
    provider: string;
    location?: string;
    virtual?: boolean;
  }> = [];
  export let recentActivities: Array<{
    id: string;
    type: 'milestone' | 'appointment' | 'medication' | 'journal' | 'exercise' | 'support-group';
    title: string;
    date: Date;
    status: 'completed' | 'upcoming' | 'missed';
  }> = [];
  export let goals: Array<{
    id: string;
    title: string;
    progress: number;
    target: number;
    unit: string;
    category: string;
  }> = [];

  let currentTime = new Date();
  let motivationalQuote = "";
  let encouragementMessage = "";

  const motivationalQuotes = [
    "Every day sober is a victory. Keep building your strength.",
    "Your journey inspires others. You're making a difference.",
    "Progress, not perfection. You're doing amazing.",
    "One day at a time. You've got this.",
    "Your courage to change is your superpower.",
    "Recovery is a journey, not a destination. Enjoy the ride."
  ];

  const encouragementMessages = [
    "You're 45 days into your transformation!",
    "Your dedication is paying off - keep going!",
    "Today is another opportunity to grow stronger.",
    "Your story is still being written - make it amazing."
  ];

  onMount(() => {
    // Set initial motivational content
    motivationalQuote = motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)];
    encouragementMessage = encouragementMessages[Math.floor(Math.random() * encouragementMessages.length)];

    // Update time every minute
    const timeInterval = setInterval(() => {
      currentTime = new Date();
    }, 60000);

    return () => clearInterval(timeInterval);
  });

  function formatDate(date: Date) {
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    });
  }

  function formatTime(date: Date) {
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  }

  function getActivityIcon(type: string) {
    const icons = {
      'milestone': '🎯',
      'appointment': '📅',
      'medication': '💊',
      'journal': '📝',
      'exercise': '🏃',
      'support-group': '🤝'
    };
    return icons[type as keyof typeof icons] || '📋';
  }

  function getStatusColor(status: string) {
    switch (status) {
      case 'completed': return 'text-mountain-blue';
      case 'upcoming': return 'text-sunset-orange';
      case 'missed': return 'text-red-500';
      default: return 'text-forest-green';
    }
  }

  function getProgressPercentage(progress: number, target: number) {
    return Math.min((progress / target) * 100, 100);
  }

  // Mock data for demonstration
  $: if (upcomingAppointments.length === 0) {
    upcomingAppointments = [
      {
        id: '1',
        type: 'Individual Therapy',
        date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
        time: '2:00 PM',
        provider: 'Dr. Sarah Johnson',
        location: 'Virtual',
        virtual: true
      },
      {
        id: '2',
        type: 'Group Session',
        date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
        time: '6:00 PM',
        provider: 'Mike Chen, LCSW',
        location: 'Denver Recovery Center'
      }
    ];
  }

  $: if (recentActivities.length === 0) {
    recentActivities = [
      {
        id: '1',
        type: 'milestone',
        title: '30 Days Sober Milestone',
        date: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
        status: 'completed'
      },
      {
        id: '2',
        type: 'appointment',
        title: 'Therapy Session',
        date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        status: 'completed'
      },
      {
        id: '3',
        type: 'journal',
        title: 'Daily Reflection',
        date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        status: 'completed'
      }
    ];
  }

  $: if (goals.length === 0) {
    goals = [
      {
        id: '1',
        title: 'Days Sober',
        progress: 45,
        target: 90,
        unit: 'days',
        category: 'Recovery'
      },
      {
        id: '2',
        title: 'Therapy Sessions',
        progress: 8,
        target: 12,
        unit: 'sessions',
        category: 'Treatment'
      },
      {
        id: '3',
        title: 'Support Group Meetings',
        progress: 12,
        target: 16,
        unit: 'meetings',
        category: 'Support'
      }
    ];
  }
</script>

<div class="w-full max-w-6xl mx-auto p-4">
  <!-- Welcome Header -->
  <div class="mb-8" transition:fade={{ duration: 600 }}>
    <div class="bg-gradient-to-r from-forest-green/10 to-mountain-blue/10 rounded-2xl p-6 mb-6">
      <h1 class="font-primary text-3xl font-bold text-forest-green mb-2">
        Welcome back, {userName}
      </h1>
      <p class="text-lg text-mountain-blue">{encouragementMessage}</p>
      <p class="text-sm text-forest-green/80 italic mt-2">"{motivationalQuote}"</p>
    </div>
  </div>

  <!-- Progress Overview -->
  <div class="grid lg:grid-cols-3 gap-6 mb-8">
    <!-- Sobriety Counter -->
    <PremiumCard
      variant="highlighted"
      glow={true}
      class="p-6 text-center"
    >
      <div class="text-5xl mb-4">🎯</div>
      <h3 class="font-semibold text-forest-green mb-2">Sobriety Progress</h3>
      <div class="text-4xl font-bold text-forest-green mb-2">
        {userProgress.daysSober}
      </div>
      <p class="text-sm text-mountain-blue mb-4">Days Strong</p>
      <div class="w-full bg-forest-green/10 rounded-full h-3 mb-2">
        <div 
          class="bg-gradient-to-r from-sunset-orange to-forest-green h-3 rounded-full transition-all duration-1000"
          style="width: {getProgressPercentage(userProgress.daysSober, userProgress.totalDays)}%"
        ></div>
      </div>
      <p class="text-xs text-mountain-blue">
        {userProgress.totalDays - userProgress.daysSober} days to next milestone
      </p>
    </PremiumCard>

    <!-- Next Appointment -->
    <PremiumCard
      variant="highlighted"
      glow={true}
      class="p-6"
    >
      <div class="text-3xl mb-4">📅</div>
      <h3 class="font-semibold text-forest-green mb-4">Next Appointment</h3>
      {#if upcomingAppointments.length > 0}
        {@const nextAppt = upcomingAppointments[0]}
        <div class="space-y-2">
          <p class="font-medium text-forest-green">{nextAppt.type}</p>
          <p class="text-sm text-mountain-blue">{formatDate(nextAppt.date)} at {nextAppt.time}</p>
          <p class="text-sm text-forest-green/80">{nextAppt.provider}</p>
          <p class="text-xs text-mountain-blue">
            {nextAppt.virtual ? '🌐 Virtual' : `📍 ${nextAppt.location}`}
          </p>
          <div class="mt-3">
            <PremiumButton variant="secondary" size="sm">
              Join Session
            </PremiumButton>
          </div>
        </div>
      {:else}
        <p class="text-mountain-blue text-sm">No upcoming appointments</p>
        <div class="mt-3">
          <PremiumButton variant="secondary" size="sm">
            Schedule Now
          </PremiumButton>
        </div>
      {/if}
    </PremiumCard>

    <!-- Quick Actions -->
    <PremiumCard
      variant="highlighted"
      glow={true}
      class="p-6"
    >
      <div class="text-3xl mb-4">⚡</div>
      <h3 class="font-semibold text-forest-green mb-4">Quick Actions</h3>
      <div class="space-y-2">
        <div class="w-full">
        <PremiumButton variant="secondary" size="sm">
          📝 Daily Check-in
        </PremiumButton>
        </div>
        <div class="w-full">
        <PremiumButton variant="secondary" size="sm">
          💊 Medication Reminder
        </PremiumButton>
        </div>
        <div class="w-full">
        <PremiumButton variant="secondary" size="sm">
          🤝 Find Support Group
        </PremiumButton>
        </div>
        <div class="w-full">
        <PremiumButton variant="secondary" size="sm">
          📞 24/7 Crisis Support
        </PremiumButton>
        </div>
      </div>
    </PremiumCard>
  </div>

  <!-- Goals Progress -->
  <div class="mb-8">
    <h2 class="font-primary text-2xl font-bold text-forest-green mb-6">Your Recovery Goals</h2>
    <div class="grid md:grid-cols-3 gap-6">
      {#each goals as goal, i}
        <PremiumCard
          variant="minimal"
          class="p-6"
        >
          <div class="flex justify-between items-center mb-4">
            <h3 class="font-semibold text-forest-green">{goal.title}</h3>
            <span class="text-sm text-mountain-blue">{goal.category}</span>
          </div>
          <div class="mb-4">
            <div class="flex justify-between text-sm mb-2">
              <span class="text-forest-green">{goal.progress} {goal.unit}</span>
              <span class="text-mountain-blue">of {goal.target} {goal.unit}</span>
            </div>
            <div class="w-full bg-forest-green/10 rounded-full h-2">
              <div 
                class="bg-gradient-to-r from-sunset-orange to-forest-green h-2 rounded-full transition-all duration-1000"
                style="width: {getProgressPercentage(goal.progress, goal.target)}%"
              ></div>
            </div>
          </div>
          <div class="text-center">
            <span class="text-2xl font-bold text-forest-green">
              {Math.round(getProgressPercentage(goal.progress, goal.target))}%
            </span>
            <span class="text-sm text-mountain-blue ml-2">Complete</span>
          </div>
        </PremiumCard>
      {/each}
    </div>
  </div>

  <!-- Recent Activity -->
  <div class="grid lg:grid-cols-2 gap-8">
    <!-- Recent Activities -->
    <div>
      <h2 class="font-primary text-2xl font-bold text-forest-green mb-6">Recent Activity</h2>
      <PremiumCard variant="highlighted" class="p-6">
        <div class="space-y-4">
          {#each recentActivities.slice(0, 5) as activity, i}
            <div 
              class="flex items-center space-x-4 p-3 rounded-lg bg-forest-green/5 hover:bg-forest-green/10 transition-colors"
              transition:fade={{ duration: 400, delay: 1000 + i * 100 }}
            >
              <div class="text-2xl">{getActivityIcon(activity.type)}</div>
              <div class="flex-1">
                <p class="font-medium text-forest-green">{activity.title}</p>
                <p class="text-sm text-mountain-blue">{formatDate(activity.date)}</p>
              </div>
              <div class="text-right">
                <span class="text-xs {getStatusColor(activity.status)}">
                  {activity.status}
                </span>
              </div>
            </div>
          {/each}
        </div>
        <div class="w-full mt-4">
          <PremiumButton variant="ghost" size="sm">
            View All Activity
          </PremiumButton>
        </div>
      </PremiumCard>
    </div>

    <!-- Upcoming Schedule -->
    <div>
      <h2 class="font-primary text-2xl font-bold text-forest-green mb-6">Upcoming Schedule</h2>
      <PremiumCard variant="highlighted" class="p-6">
        <div class="space-y-4">
          {#each upcomingAppointments as appointment, i}
            <div 
              class="flex items-center justify-between p-3 rounded-lg bg-forest-green/5 hover:bg-forest-green/10 transition-colors"
              transition:fade={{ duration: 400, delay: 1200 + i * 100 }}
            >
              <div class="flex items-center space-x-3">
                <div class="text-2xl">
                  {appointment.virtual ? '🌐' : '🏢'}
                </div>
                <div>
                  <p class="font-medium text-forest-green">{appointment.type}</p>
                  <p class="text-sm text-mountain-blue">
                    {formatDate(appointment.date)} at {appointment.time}
                  </p>
                </div>
              </div>
              <PremiumButton variant="secondary" size="xs">
                Join
              </PremiumButton>
            </div>
          {/each}
        </div>
        <div class="w-full mt-4">
          <PremiumButton variant="ghost" size="sm">
            View Full Calendar
          </PremiumButton>
        </div>
      </PremiumCard>
    </div>
  </div>
</div>