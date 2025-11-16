<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import MetzlerBridgeLogo from '$lib/MetzlerBridgeLogo.svelte';

  let mounted = false;
  let calendlyEmbed: HTMLDivElement;

  onMount(() => {
    mounted = true;
    
    // Load Calendly embed
    const script = document.createElement('script');
    script.src = 'https://assets.calendly.com/assets/external/widget.js';
    script.async = true;
    document.head.appendChild(script);
  });

  function openCalendly() {
    // @ts-ignore
    if (window.Calendly) {
      // @ts-ignore
      window.Calendly.initPopupWidget({ url: 'https://calendly.com/metzlercares/partner-demo' });
    }
  }
</script>

<svelte:head>
  <title>The Metzler Method: A Discharge Solution | Our Partners</title>
  <meta name="description" content="Reduce Readmissions. Fulfill Accreditation. Ensure Compliance. Book a demo of our tech-advanced discharge solution." />
  <link href="https://assets.calendly.com/assets/external/widget.css" rel="stylesheet">
</svelte:head>

<div class="min-h-screen bg-accent relative overflow-hidden">
  <!-- Premium background gradient matching homepage -->
  <div class="absolute inset-0 bg-gradient-to-br from-gray-light via-accent to-gray-light opacity-60"></div>
  
  <!-- Animated background elements with premium feel -->
  <div class="absolute inset-0">
    <div class="absolute top-20 left-20 w-64 h-64 bg-primary opacity-5 rounded-full blur-3xl animate-pulse"></div>
    <div class="absolute bottom-20 right-20 w-96 h-96 bg-secondary opacity-5 rounded-full blur-3xl animate-pulse" style="animation-delay: 1s;"></div>
  </div>
  <!-- Hero Section -->
  <section class="section relative overflow-hidden z-10">
    <div class="absolute inset-0">
      <div class="absolute top-0 left-0 w-96 h-96 bg-primary opacity-5 rounded-full blur-3xl animate-pulse"></div>
      <div class="absolute bottom-0 right-0 w-64 h-64 bg-secondary opacity-10 rounded-full blur-2xl animate-pulse" style="animation-delay: 0.5s;"></div>
    </div>
    
    <div class="container relative z-10 text-center">
      <div class="bg-white/90 backdrop-blur-sm rounded-3xl p-12 shadow-2xl border border-white/20">
      <div class="mb-8 animate-fade-in">
        <MetzlerBridgeLogo class="w-20 h-20 mx-auto mb-6 opacity-90" />
      </div>
      
      <h1 class="text-5xl md:text-6xl font-extrabold mb-6 tracking-tight leading-tight animate-fade-in text-primary" style="animation-delay: 0.1s;">
        The Metzler Method:
        <br />
        <span class="text-secondary">A Discharge Solution</span>
      </h1>
      
      <h2 class="text-2xl md:text-3xl font-semibold mb-8 text-gray-medium leading-relaxed animate-fade-in" style="animation-delay: 0.2s;">
        Reduce Readmissions. Fulfill Accreditation. Ensure Compliance.
      </h2>
      
      <button 
        on:click={openCalendly}
        class="btn bg-primary text-white text-xl px-12 py-4 font-bold animate-fade-in hover:bg-primary/90 transition-colors" 
        style="animation-delay: 0.3s;"
      >
        Book a Demo
      </button>
    </div>
  </section>

  <!-- Show Don't Tell Section 1: PSS Kanban Board -->
  <section class="section bg-white">
    <div class="container">
      <div class="grid lg:grid-cols-2 gap-16 items-center">
        <!-- Content -->
        <div class="animate-slide-in">
          <h2 class="text-4xl font-extrabold text-primary mb-6 tracking-tight">
            From Abstract Fear to an Actionable Plan
          </h2>
          <p class="text-lg text-gray-medium leading-relaxed mb-8">
            Our PSS-led staff uses a modern, interactive checklist to manage every life-stabilization task—from IDs to SNAP—before discharge.
          </p>
          <div class="space-y-4">
            <div class="flex items-center gap-4">
              <div class="w-3 h-3 bg-secondary rounded-full"></div>
              <span class="text-gray-dark font-medium">Real-time task tracking</span>
            </div>
            <div class="flex items-center gap-4">
              <div class="w-3 h-3 bg-secondary rounded-full"></div>
              <span class="text-gray-dark font-medium">Automated progress updates</span>
            </div>
            <div class="flex items-center gap-4">
              <div class="w-3 h-3 bg-secondary rounded-full"></div>
              <span class="text-gray-dark font-medium">Zero paperwork friction</span>
            </div>
          </div>
        </div>
        
        <!-- Animated Mockup -->
        <div class="animate-scale-in">
          <div class="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-8 transform rotate-1 hover:rotate-0 transition-transform duration-500 border border-white/20">
            <div class="flex items-center gap-3 mb-6">
              <div class="w-3 h-3 bg-red-400 rounded-full"></div>
              <div class="w-3 h-3 bg-yellow-400 rounded-full"></div>
              <div class="w-3 h-3 bg-green-400 rounded-full"></div>
              <span class="text-sm text-gray-medium ml-2">PSS Dashboard</span>
            </div>
            
            <div class="space-y-4">
              <!-- Kanban columns mockup -->
              <div class="grid grid-cols-4 gap-3">
                <div class="bg-gray-100 rounded-lg p-3">
                  <h4 class="text-xs font-semibold text-gray-dark mb-2">To Do</h4>
                  <div class="space-y-2">
                    <div class="bg-white rounded p-2 text-xs border-l-4 border-red-400">Secure ID</div>
                    <div class="bg-white rounded p-2 text-xs border-l-4 border-yellow-400">Apply SNAP</div>
                  </div>
                </div>
                <div class="bg-blue-50 rounded-lg p-3">
                  <h4 class="text-xs font-semibold text-gray-dark mb-2">In Progress</h4>
                  <div class="space-y-2">
                    <div class="bg-white rounded p-2 text-xs border-l-4 border-blue-400">Find Housing</div>
                  </div>
                </div>
                <div class="bg-yellow-50 rounded-lg p-3">
                  <h4 class="text-xs font-semibold text-gray-dark mb-2">Submitted</h4>
                  <div class="space-y-2">
                    <div class="bg-white rounded p-2 text-xs border-l-4 border-yellow-500">Workforce Reg</div>
                  </div>
                </div>
                <div class="bg-green-50 rounded-lg p-3">
                  <h4 class="text-xs font-semibold text-gray-dark mb-2">Complete</h4>
                  <div class="space-y-2">
                    <div class="bg-white rounded p-2 text-xs border-l-4 border-green-400">Fresh Start Kit</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Show Don't Tell Section 2: Partner Portal -->
  <section class="section bg-gray-light">
    <div class="container">
      <div class="grid lg:grid-cols-2 gap-16 items-center">
        <!-- Animated Mockup (Left this time for asymmetry) -->
        <div class="animate-scale-in order-2 lg:order-1">
          <div class="bg-gradient-to-br from-primary to-blue-900 rounded-3xl shadow-2xl p-8 transform -rotate-1 hover:rotate-0 transition-transform duration-500 border border-white/20">
            <div class="flex items-center gap-3 mb-6">
              <div class="w-3 h-3 bg-white opacity-60 rounded-full"></div>
              <div class="w-3 h-3 bg-white opacity-60 rounded-full"></div>
              <div class="w-3 h-3 bg-white opacity-60 rounded-full"></div>
              <span class="text-sm text-white opacity-80 ml-2">Partner Portal</span>
            </div>
            
            <div class="space-y-4">
              <div class="bg-white bg-opacity-10 backdrop-blur rounded-lg p-4">
                <div class="flex items-center justify-between mb-3">
                  <h4 class="text-white font-semibold">Client Progress</h4>
                  <span class="text-secondary text-sm font-bold">LIVE</span>
                </div>
                <div class="space-y-3">
                  <div class="flex items-center gap-3">
                    <div class="w-8 h-8 bg-secondary rounded-full flex items-center justify-center text-white text-xs font-bold">JD</div>
                    <div class="flex-1">
                      <div class="text-white text-sm font-medium">John Doe</div>
                      <div class="text-white text-xs opacity-70">85% Complete</div>
                    </div>
                    <div class="w-16 h-2 bg-white bg-opacity-20 rounded-full overflow-hidden">
                      <div class="h-full bg-secondary rounded-full" style="width: 85%"></div>
                    </div>
                  </div>
                  <div class="flex items-center gap-3">
                    <div class="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center text-white text-xs font-bold">JS</div>
                    <div class="flex-1">
                      <div class="text-white text-sm font-medium">Jane Smith</div>
                      <div class="text-white text-xs opacity-70">60% Complete</div>
                    </div>
                    <div class="w-16 h-2 bg-white bg-opacity-20 rounded-full overflow-hidden">
                      <div class="h-full bg-yellow-400 rounded-full" style="width: 60%"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Content -->
        <div class="animate-slide-in order-1 lg:order-2">
          <h2 class="text-4xl font-extrabold text-primary mb-6 tracking-tight">
            Real-Time Compliance.
            <br />
            <span class="text-secondary">Zero Friction.</span>
          </h2>
          <p class="text-lg text-gray-medium leading-relaxed mb-8">
            Our portal gives your team compliant, read-only visibility into client progress. No more 'discharge chasm.' No more "2-3 day waits."
          </p>
          <div class="space-y-4">
            <div class="flex items-center gap-4">
              <div class="w-3 h-3 bg-primary rounded-full"></div>
              <span class="text-gray-dark font-medium">Instant client status updates</span>
            </div>
            <div class="flex items-center gap-4">
              <div class="w-3 h-3 bg-primary rounded-full"></div>
              <span class="text-gray-dark font-medium">HIPAA-compliant read-only access</span>
            </div>
            <div class="flex items-center gap-4">
              <div class="w-3 h-3 bg-primary rounded-full"></div>
              <span class="text-gray-dark font-medium">Zero operational overhead</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Compliance by Design Section -->
  <section class="section bg-white">
    <div class="container">
      <div class="grid lg:grid-cols-2 gap-16 items-center">
        <!-- Content -->
        <div class="animate-slide-in">
          <h2 class="text-4xl font-extrabold text-primary mb-6 tracking-tight">
            Enterprise-Grade Security & Compliance
          </h2>
          <p class="text-lg text-gray-medium leading-relaxed mb-8">
            Our platform is built on a zero-trust, RLS architecture. We sign the BAA/QSOA and handle 100% of the data-sharing compliance under 42 CFR Part 2.
          </p>
          <div class="grid grid-cols-2 gap-6">
            <div class="bg-white rounded-xl p-6 shadow-lg">
              <div class="text-3xl font-bold text-primary mb-2">Zero Trust</div>
              <div class="text-sm text-gray-medium">Row-level security at the database level</div>
            </div>
            <div class="bg-white rounded-xl p-6 shadow-lg">
              <div class="text-3xl font-bold text-secondary mb-2">HIPAA</div>
              <div class="text-sm text-gray-medium">Full Business Associate Agreement</div>
            </div>
            <div class="bg-white rounded-xl p-6 shadow-lg">
              <div class="text-3xl font-bold text-primary mb-2">42 CFR</div>
              <div class="text-sm text-gray-medium">Part 2 compliance built-in</div>
            </div>
            <div class="bg-white rounded-xl p-6 shadow-lg">
              <div class="text-3xl font-bold text-secondary mb-2">Audit</div>
              <div class="text-sm text-gray-medium">Complete audit trail for every action</div>
            </div>
          </div>
        </div>
        
        <!-- Clean Architecture Diagram -->
        <div class="animate-scale-in">
          <div class="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border border-white/20">
            <div class="text-center mb-6">
              <h3 class="text-xl font-bold text-primary mb-2">Multi-Tenant Architecture</h3>
              <p class="text-gray-medium text-sm">Physically impossible data leaks</p>
            </div>
            
            <div class="space-y-4">
              <!-- Tenant A -->
              <div class="bg-primary bg-opacity-5 rounded-lg p-4">
                <div class="flex items-center gap-3 mb-3">
                  <div class="w-4 h-4 bg-primary rounded"></div>
                  <span class="font-semibold text-primary">Rehab A</span>
                </div>
                <div class="space-y-2 pl-7">
                  <div class="text-sm text-gray-dark">• Client Data A</div>
                  <div class="text-sm text-gray-dark">• Staff Users A</div>
                  <div class="text-sm text-gray-dark">• Progress Tracking A</div>
                </div>
              </div>
              
              <!-- Database Security Layer -->
              <div class="bg-secondary bg-opacity-10 rounded-lg p-4 text-center">
                <div class="text-sm font-semibold text-secondary mb-1">Database-Level RLS Policies</div>
                <div class="text-xs text-gray-medium">Row Level Security enforced at query time</div>
              </div>
              
              <!-- Tenant B -->
              <div class="bg-primary bg-opacity-5 rounded-lg p-4">
                <div class="flex items-center gap-3 mb-3">
                  <div class="w-4 h-4 bg-secondary rounded"></div>
                  <span class="font-semibold text-primary">Rehab B</span>
                </div>
                <div class="space-y-2 pl-7">
                  <div class="text-sm text-gray-dark">• Client Data B</div>
                  <div class="text-sm text-gray-dark">• Staff Users B</div>
                  <div class="text-sm text-gray-dark">• Progress Tracking B</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Final CTA -->
  <section class="section relative overflow-hidden">
    <div class="absolute inset-0 bg-gradient-to-br from-primary to-blue-900"></div>
    <div class="container relative z-10 text-center text-white">
      <div class="bg-white/10 backdrop-blur-sm rounded-3xl p-12 border border-white/20 max-w-4xl mx-auto">
        <h2 class="text-4xl font-extrabold mb-6 tracking-tight">
          Ready to Transform Your Discharge Process?
        </h2>
        <p class="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
          Join the rehabs that are already reducing readmissions and ensuring compliance with our tech-advanced solution.
        </p>
        <button 
          on:click={openCalendly}
          class="btn bg-white text-primary text-xl px-12 py-4 font-bold hover:bg-gray-100 transition-colors"
        >
          Book a Demo
        </button>
      </div>
    </div>
  </section>
</div>

<style>
  /* Enhanced animations */
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes slideIn {
    from {
      opacity: 0;
      transform: translateX(-30px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }

  @keyframes scaleIn {
    from {
      opacity: 0;
      transform: scale(0.95);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }

  .animate-fade-in {
    animation: fadeIn 0.8s cubic-bezier(0.4, 0, 0.2, 1) forwards;
    opacity: 0;
  }

  .animate-slide-in {
    animation: slideIn 0.8s cubic-bezier(0.4, 0, 0.2, 1) forwards;
    opacity: 0;
  }

  .animate-scale-in {
    animation: scaleIn 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards;
    opacity: 0;
  }

  .section {
    padding: 6rem 0;
  }

  .gradient-primary {
    background: linear-gradient(135deg, #1a237e 0%, #151d6d 100%);
  }

  /* Premium card hover effects */
  .bg-white.rounded-2xl.shadow-2xl {
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .bg-white.rounded-2xl.shadow-2xl:hover {
    transform: translateY(-4px) rotate(0deg) !important;
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  }

  /* Responsive adjustments */
  @media (max-width: 768px) {
    .section {
      padding: 4rem 0;
    }
    
    .text-5xl {
      font-size: 2.5rem;
    }
  }
</style>
