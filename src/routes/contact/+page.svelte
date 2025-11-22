<script lang="ts">
  import { enhance } from '$app/forms'
  import { page } from '$app/stores'
  import type { ActionData } from './$types'
  import { LoadingSpinner, ErrorMessage, SuccessMessage } from '$lib'
  import { onMount } from 'svelte'
  import gsap from 'gsap'
  import RecoveryBackground from '$lib/components/RecoveryBackground.svelte'

  export let form: ActionData

  let isSubmitting = false
  let submitted = false
  let formContainer: HTMLElement;

  $: if (form?.success && !submitted) {
    submitted = true
    setTimeout(() => {
      submitted = false
    }, 5000)
  }

  onMount(() => {
    gsap.from(formContainer, {
      y: 50,
      opacity: 0,
      duration: 1,
      ease: 'power3.out',
      delay: 0.2
    });
  });
</script>

<svelte:head>
  <title>The Bridge | Metzler Cares</title>
  <meta
    name="description"
    content="Connect with Metzler Cares. We're here to support your recovery journey."
  />
</svelte:head>

<RecoveryBackground />

<div class="min-h-screen font-body text-recovery-slate bg-recovery-paper/90 pt-20 px-4 md:px-8">
  
  <!-- Hero Section -->
  <section class="text-center py-16 md:py-24 max-w-4xl mx-auto relative z-10">
    <span class="font-hand text-3xl text-recovery-clay block mb-4">Connect with us</span>
    <h1 class="font-heading text-5xl md:text-7xl font-bold text-recovery-moss mb-6">Cross the Bridge</h1>
    <p class="text-xl text-recovery-slate/80 leading-relaxed max-w-2xl mx-auto">
      Whether you need support, have questions about our programs, or want to explore partnership opportunities, we are here to help you across.
    </p>
  </section>

  <div class="container mx-auto max-w-6xl pb-24">
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
      
      <!-- Left Column: The Signpost (Info) -->
      <div class="lg:col-span-5 space-y-12">
        
        <!-- Emergency Lantern -->
        <div class="bg-red-50/80 backdrop-blur-sm border border-red-200 rounded-[2rem] p-8 relative overflow-hidden group shadow-sm hover:shadow-md transition-all">
          <div class="absolute top-0 right-0 w-20 h-20 bg-red-100 rounded-bl-full -mr-4 -mt-4"></div>
          <h3 class="font-heading text-2xl font-bold text-red-800 mb-4 flex items-center gap-3">
            <span class="text-3xl">🏮</span> Emergency Beacon
          </h3>
          <p class="text-red-700/90 mb-6 leading-relaxed">
            If you're experiencing homelessness or housing instability, please seek immediate shelter.
          </p>
          <div class="space-y-3 font-heading text-lg">
            <p class="text-red-800 font-bold flex justify-between border-b border-red-200 pb-2">
              <span>National Housing Hotline</span>
              <span>1-800-548-4001</span>
            </p>
            <p class="text-red-800 font-bold flex justify-between pt-1">
              <span>Colorado Crisis Line</span>
              <span>988</span>
            </p>
          </div>
        </div>

        <!-- Contact Ways -->
        <div class="space-y-8 pl-4 border-l-2 border-recovery-moss/20">
          <div class="relative">
            <div class="absolute -left-[21px] top-1 w-3 h-3 rounded-full bg-recovery-moss border-2 border-recovery-paper"></div>
            <h3 class="font-heading text-xl font-bold text-recovery-moss mb-1">Email Support</h3>
            <p class="text-recovery-slate/70">support@metzlercares.org</p>
            <p class="text-sm text-recovery-clay font-hand mt-1">Response within 24h</p>
          </div>

          <div class="relative">
            <div class="absolute -left-[21px] top-1 w-3 h-3 rounded-full bg-recovery-moss border-2 border-recovery-paper"></div>
            <h3 class="font-heading text-xl font-bold text-recovery-moss mb-1">Phone Support</h3>
            <p class="text-recovery-slate/70">Mon - Fri, 9 AM - 5 PM MST</p>
            <p class="text-sm text-recovery-clay font-hand mt-1">Urgent partnerships</p>
          </div>

          <div class="relative">
            <div class="absolute -left-[21px] top-1 w-3 h-3 rounded-full bg-recovery-moss border-2 border-recovery-paper"></div>
            <h3 class="font-heading text-xl font-bold text-recovery-moss mb-1">Base Camp</h3>
            <p class="text-recovery-slate/70">Serving Colorado Communities<br>Virtual-first operations</p>
          </div>
        </div>

      </div>

      <!-- Right Column: The Parchment (Form) -->
      <div class="lg:col-span-7" bind:this={formContainer}>
        <div class="bg-white relative rounded-sm shadow-2xl transform rotate-1 p-8 md:p-12">
           <!-- Paper texture effect -->
          <div class="absolute inset-0 bg-[#fffdf5] opacity-50 pointer-events-none rounded-sm"></div>
          
          <!-- Tape Effect -->
          <div class="absolute -top-3 left-1/2 -translate-x-1/2 w-32 h-8 bg-yellow-100/80 rotate-[-2deg] shadow-sm"></div>

          <h2 class="font-heading text-3xl text-recovery-moss mb-8 relative z-10">Send a Message</h2>

          {#if submitted}
            <div class="py-12 text-center">
              <div class="w-20 h-20 bg-recovery-moss text-white rounded-full flex items-center justify-center mx-auto mb-6 text-4xl">
                ✓
              </div>
              <h3 class="font-heading text-2xl text-recovery-moss mb-2">Message Received</h3>
              <p class="text-recovery-slate/70">We will extend a hand shortly.</p>
            </div>
          {:else}
            <form
              method="POST"
              action="?/contact"
              use:enhance={() => {
                isSubmitting = true
                return async ({ update }) => {
                  await update()
                  isSubmitting = false
                }
              }}
              class="space-y-8 relative z-10"
            >
              <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                <!-- Name -->
                <div class="group">
                  <label for="name" class="block font-hand text-xl text-recovery-clay mb-2 group-focus-within:text-recovery-moss transition-colors">Full Name</label>
                  <input 
                    id="name" 
                    name="name" 
                    type="text" 
                    required 
                    class="w-full bg-transparent border-b-2 border-recovery-slate/20 px-0 py-2 focus:outline-none focus:border-recovery-moss transition-colors placeholder-recovery-slate/30 font-body text-lg"
                    placeholder="Write your name here..." 
                  />
                </div>

                <!-- Email -->
                <div class="group">
                  <label for="email" class="block font-hand text-xl text-recovery-clay mb-2 group-focus-within:text-recovery-moss transition-colors">Email Address</label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    class="w-full bg-transparent border-b-2 border-recovery-slate/20 px-0 py-2 focus:outline-none focus:border-recovery-moss transition-colors placeholder-recovery-slate/30 font-body text-lg"
                    placeholder="Where can we reach you?"
                  />
                </div>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                 <!-- Phone -->
                 <div class="group">
                  <label for="phone" class="block font-hand text-xl text-recovery-clay mb-2 group-focus-within:text-recovery-moss transition-colors">Phone (Optional)</label>
                  <input id="phone" name="phone" type="tel" class="w-full bg-transparent border-b-2 border-recovery-slate/20 px-0 py-2 focus:outline-none focus:border-recovery-moss transition-colors placeholder-recovery-slate/30 font-body text-lg" placeholder="(555) ..." />
                </div>

                <!-- Inquiry Type -->
                <div class="group">
                  <label for="inquiryType" class="block font-hand text-xl text-recovery-clay mb-2 group-focus-within:text-recovery-moss transition-colors">How can we help?</label>
                  <select id="inquiryType" name="inquiryType" required class="w-full bg-transparent border-b-2 border-recovery-slate/20 px-0 py-2 focus:outline-none focus:border-recovery-moss transition-colors font-body text-lg text-recovery-slate">
                    <option value="" disabled selected>Select a path...</option>
                    <option value="general">General Information</option>
                    <option value="application">Application Support</option>
                    <option value="partnership">Partnership Inquiry</option>
                    <option value="technical">Technical Support</option>
                    <option value="billing">Billing Question</option>
                    <option value="feedback">Feedback</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              <!-- Subject -->
              <div class="group">
                <label for="subject" class="block font-hand text-xl text-recovery-clay mb-2 group-focus-within:text-recovery-moss transition-colors">Subject</label>
                <input
                  id="subject"
                  name="subject"
                  type="text"
                  required
                  class="w-full bg-transparent border-b-2 border-recovery-slate/20 px-0 py-2 focus:outline-none focus:border-recovery-moss transition-colors placeholder-recovery-slate/30 font-body text-lg"
                  placeholder="Briefly, what is this about?"
                />
              </div>

              <!-- Message -->
              <div class="group">
                <label for="message" class="block font-hand text-xl text-recovery-clay mb-2 group-focus-within:text-recovery-moss transition-colors">Your Message</label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows="4"
                  class="w-full bg-transparent border-b-2 border-recovery-slate/20 px-0 py-2 focus:outline-none focus:border-recovery-moss transition-colors placeholder-recovery-slate/30 font-body text-lg resize-none bg-[linear-gradient(transparent_1.9rem,#e2e8f0_2rem)] bg-[size:100%_2rem] leading-[2rem]"
                  placeholder="Tell us your story..."
                ></textarea>
              </div>

              <!-- Privacy Notice with Security Badge -->
              <div class="flex flex-col md:flex-row items-center justify-between gap-4">
                <p class="text-sm text-recovery-slate/50 italic">
                  By sending this note, you agree to our
                  <a href="/privacy" class="text-recovery-clay hover:underline">Privacy Policy</a>.
                </p>
                <div class="flex items-center gap-2 text-xs text-recovery-moss font-bold bg-recovery-moss/10 px-3 py-1 rounded-full">
                  <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                  Secure & Encrypted
                </div>
              </div>

              <!-- Submit Button -->
              <button
                type="submit"
                disabled={isSubmitting}
                class="w-full md:w-auto px-8 py-4 bg-recovery-moss text-white rounded-full font-heading text-xl font-bold shadow-forest hover:bg-recovery-clay hover:shadow-sunset hover:-translate-y-1 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
              >
                {#if isSubmitting}
                  <LoadingSpinner size="sm" color="white" />
                  <span>Sending...</span>
                {:else}
                  Send Message <span class="text-2xl">✉</span>
                {/if}
              </button>
            </form>
          {/if}

          <!-- Form Errors -->
          {#if form?.errors}
            <div class="mt-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700">
               <p>{Object.values(form.errors).join(', ')}</p>
            </div>
          {/if}
        </div>
      </div>

    </div>
  </div>
</div>
