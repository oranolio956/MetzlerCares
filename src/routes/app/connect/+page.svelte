<script lang="ts">
  import { onMount } from 'svelte'
  import { fade, slide } from 'svelte/transition'

  let activeTab = 'home'
  let showChat = false

  const goals = [
    { title: 'Attend AA Meeting', completed: true, time: '10:00 AM' },
    { title: 'Daily Check-in', completed: true, time: '12:30 PM' },
    { title: 'Call Sponsor', completed: false, time: '5:00 PM' },
    { title: 'Meditation', completed: false, time: '8:00 PM' }
  ]

  const messages = [
    { sender: 'coach', text: 'Hey Alex! Just checking in. How are you feeling about the meeting tonight?', time: '2:15 PM' },
    { sender: 'user', text: 'Feeling a bit anxious but I\'m going to go.', time: '2:20 PM' },
    { sender: 'coach', text: 'That\'s normal. Remember your breathing exercises. You got this! 👊', time: '2:21 PM' }
  ]

  let visible = false
  onMount(() => {
    visible = true
  })
</script>

<svelte:head>
  <title>ConnectRecovery App | Metzler Cares</title>
  <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0" /> 
</svelte:head>

<div class="min-h-screen bg-gray-100 flex items-center justify-center p-4 font-sans">
  
  <!-- Mobile Device Frame -->
  <div class="w-full max-w-md bg-white h-[800px] rounded-[3rem] shadow-2xl border-[8px] border-gray-900 relative overflow-hidden flex flex-col">
    
    <!-- Notch/Status Bar -->
    <div class="h-8 bg-gray-900 w-full absolute top-0 left-0 z-50 flex justify-center">
      <div class="w-32 h-6 bg-black rounded-b-xl"></div>
    </div>
    <div class="h-12 bg-white w-full flex justify-between items-end px-6 pb-2 text-xs font-bold text-gray-900 z-40 pt-8">
      <span>9:41</span>
      <div class="flex gap-1">
        <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" /></svg>
        <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M17.778 8.232c-2.403-1.302-4.11-1.304-6.626.127-.655.372-1.745.496-2.365.536C5.267 9.064 2.5 10.861 2.5 12.48c0 1.333 4.057 3.372 6.398 3.372 1.495 0 4.258-2.005 4.258-4.891 0-.856-.319-1.211-.604-1.429-.99-.753-1.42-1.054-2.638-1.3H17.778zM14 14a2 2 0 11-4 0 2 2 0 014 0z" clip-rule="evenodd" /></svg>
        <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" /></svg>
      </div>
    </div>

    <!-- App Content -->
    <div class="flex-1 overflow-y-auto bg-gray-50 pb-20 relative">
      
      <!-- Header -->
      <div class="bg-tech-primary p-6 pb-12 rounded-b-[2rem] shadow-lg relative z-10">
        <div class="flex justify-between items-center mb-6">
          <div>
            <div class="text-gray-400 text-sm">Good Morning,</div>
            <div class="text-white text-2xl font-bold">Alex</div>
          </div>
          <div class="w-10 h-10 rounded-full bg-gray-700 border-2 border-tech-accent overflow-hidden">
            <div class="w-full h-full bg-gradient-to-br from-gray-600 to-gray-800"></div>
          </div>
        </div>
        
        <!-- Streak Counter -->
        <div class="bg-white/10 backdrop-blur-md rounded-xl p-4 flex items-center justify-between border border-white/10">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-full bg-tech-accent flex items-center justify-center text-white font-bold">
              <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
            </div>
            <div>
              <div class="text-white font-bold">42 Days</div>
              <div class="text-gray-400 text-xs">Sober Streak</div>
            </div>
          </div>
          <div class="text-tech-teal font-bold text-sm">+1 Today</div>
        </div>
      </div>

      <!-- Daily Goals -->
      <div class="px-6 -mt-6 relative z-20">
        <div class="bg-white rounded-2xl shadow-sm p-6 mb-6">
          <h3 class="font-bold text-gray-800 mb-4 flex justify-between items-center">
            Today's Goals
            <span class="text-xs bg-gray-100 text-gray-500 px-2 py-1 rounded-full">2/4</span>
          </h3>
          <div class="space-y-3">
            {#each goals as goal}
              <div class="flex items-center gap-3 p-3 rounded-xl transition-colors {goal.completed ? 'bg-green-50' : 'bg-gray-50'}">
                <div class={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${goal.completed ? 'bg-green-500 border-green-500' : 'border-gray-300'}`}>
                  {#if goal.completed}
                    <svg class="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" /></svg>
                  {/if}
                </div>
                <div class="flex-1">
                  <div class={`font-medium text-sm ${goal.completed ? 'text-gray-500 line-through' : 'text-gray-800'}`}>{goal.title}</div>
                  <div class="text-xs text-gray-400">{goal.time}</div>
                </div>
              </div>
            {/each}
          </div>
        </div>

        <!-- Quick Actions -->
        <div class="grid grid-cols-2 gap-4 mb-6">
          <button class="bg-white p-4 rounded-2xl shadow-sm flex flex-col items-center gap-2 hover:bg-gray-50 transition-colors">
            <div class="w-12 h-12 rounded-full bg-red-100 text-red-500 flex items-center justify-center">
              <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
            </div>
            <span class="font-bold text-gray-700 text-sm">SOS</span>
          </button>
          <button class="bg-white p-4 rounded-2xl shadow-sm flex flex-col items-center gap-2 hover:bg-gray-50 transition-colors">
            <div class="w-12 h-12 rounded-full bg-blue-100 text-blue-500 flex items-center justify-center">
              <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
            </div>
            <span class="font-bold text-gray-700 text-sm">Meeting</span>
          </button>
        </div>
      </div>

      <!-- Chat Overlay (Simulated) -->
      {#if showChat}
        <div class="absolute bottom-0 left-0 w-full h-3/4 bg-white rounded-t-[2rem] shadow-[0_-10px_40px_rgba(0,0,0,0.1)] z-30 flex flex-col" transition:slide>
          <div class="p-4 border-b border-gray-100 flex justify-between items-center">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-full bg-tech-primary flex items-center justify-center text-white font-bold text-xs">COACH</div>
              <div>
                <div class="font-bold text-gray-900">Sarah (Peer Coach)</div>
                <div class="text-xs text-green-500 flex items-center gap-1"><span class="w-2 h-2 bg-green-500 rounded-full"></span> Online</div>
              </div>
            </div>
            <button on:click={() => showChat = false} class="p-2 text-gray-400 hover:text-gray-600">
              <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
          <div class="flex-1 p-4 space-y-4 overflow-y-auto bg-gray-50">
            {#each messages as msg}
              <div class={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div class={`max-w-[80%] p-3 rounded-2xl text-sm ${msg.sender === 'user' ? 'bg-tech-accent text-white rounded-tr-none' : 'bg-white text-gray-700 shadow-sm rounded-tl-none'}`}>
                  {msg.text}
                  <div class={`text-[10px] mt-1 ${msg.sender === 'user' ? 'text-blue-200' : 'text-gray-400'}`}>{msg.time}</div>
                </div>
              </div>
            {/each}
          </div>
          <div class="p-4 border-t border-gray-100 bg-white">
            <div class="flex gap-2">
              <input type="text" placeholder="Type a message..." class="flex-1 bg-gray-100 border-0 rounded-full px-4 py-2 text-sm focus:ring-2 focus:ring-tech-accent" />
              <button class="w-10 h-10 bg-tech-accent rounded-full flex items-center justify-center text-white hover:bg-blue-600 transition-colors">
                <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
              </button>
            </div>
          </div>
        </div>
      {/if}
    </div>

    <!-- Bottom Navigation -->
    <div class="h-20 bg-white border-t border-gray-200 flex justify-around items-center px-6 pb-4 absolute bottom-0 w-full z-20">
      <button class="flex flex-col items-center gap-1 text-tech-accent" on:click={() => activeTab = 'home'}>
        <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
        <span class="text-[10px] font-medium">Home</span>
      </button>
      <button class="flex flex-col items-center gap-1 text-gray-400 hover:text-gray-600">
        <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
        <span class="text-[10px] font-medium">Progress</span>
      </button>
      <div class="w-14 h-14 bg-tech-primary rounded-full -mt-8 border-4 border-gray-100 flex items-center justify-center shadow-lg cursor-pointer hover:bg-gray-800 transition-colors" on:click={() => showChat = !showChat}>
        <svg class="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
      </div>
      <button class="flex flex-col items-center gap-1 text-gray-400 hover:text-gray-600">
        <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
        <span class="text-[10px] font-medium">Learn</span>
      </button>
      <button class="flex flex-col items-center gap-1 text-gray-400 hover:text-gray-600">
        <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
        <span class="text-[10px] font-medium">Profile</span>
      </button>
    </div>
    
    <!-- Home Indicator -->
    <div class="h-1 w-32 bg-black rounded-full absolute bottom-2 left-1/2 -translate-x-1/2 z-50"></div>
  </div>
</div>
