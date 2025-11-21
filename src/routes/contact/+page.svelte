<script lang="ts">
  import { enhance } from '$app/forms'
  import { page } from '$app/stores'
  import type { ActionData } from './$types'
  import { LoadingSpinner, ErrorMessage, SuccessMessage } from '$lib'

  export let form: ActionData

  let isSubmitting = false
  let submitted = false

  $: if (form?.success && !submitted) {
    submitted = true
    // Reset form after successful submission
    setTimeout(() => {
      submitted = false
    }, 5000)
  }
</script>

<svelte:head>
  <title>Contact Us - Metzler Foundations</title>
  <meta
    name="description"
    content="Get in touch with Metzler Foundations. We're here to help with questions about housing scholarships, recovery support, and partnership opportunities."
  />
  <meta
    name="keywords"
    content="contact Metzler Foundations, recovery housing help, partnership inquiry, support contact"
  />
  <link rel="canonical" href="https://metzlerfoundations.org/contact" />
</svelte:head>

<div class="min-h-screen bg-cream text-forest-green">
  <!-- Hero Section -->
  <section class="hero gradient-forest">
    <div class="container mx-auto text-center">
      <h1 class="hero-title">Get In Touch</h1>
      <p class="hero-subtitle max-w-2xl mx-auto">
        We're here to help. Whether you need support, have questions about our programs, or want to explore partnership
        opportunities, we'd love to hear from you.
      </p>
    </div>
  </section>

  <!-- Contact Form & Info -->
  <section class="section">
    <div class="container mx-auto">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <!-- Contact Information -->
        <div class="space-y-8">
          <div>
            <h2 class="section-title text-left">Contact Information</h2>

            <!-- Emergency Support -->
            <div class="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
              <h3 class="text-lg font-semibold text-red-800 mb-2">🚨 Emergency Housing Support</h3>
              <p class="text-red-700 mb-4">
                If you're experiencing homelessness or housing instability, please contact:
              </p>
              <div class="space-y-2">
                <p class="font-medium text-red-800">National Housing Hotline: 1-800-548-4001</p>
                <p class="font-medium text-red-800">Colorado Crisis Line: 988</p>
              </div>
            </div>

            <!-- Contact Methods -->
            <div class="space-y-6">
              <div class="flex items-start space-x-4">
                <div class="icon-circle bg-forest-green bg-opacity-20 text-forest-green flex-shrink-0">
                  <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 class="font-semibold text-forest-green">Email Support</h3>
                  <p class="text-forest-green opacity-70">support@metzlerfoundations.org</p>
                  <p class="text-sm text-forest-green opacity-60 mt-1">Response within 24 hours during business days</p>
                </div>
              </div>

              <div class="flex items-start space-x-4">
                <div class="icon-circle bg-forest-green bg-opacity-20 text-forest-green flex-shrink-0">
                  <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 class="font-semibold text-forest-green">Phone Support</h3>
                  <p class="text-forest-green opacity-70">Available Monday - Friday, 9 AM - 5 PM MST</p>
                  <p class="text-sm text-forest-green opacity-60 mt-1">For urgent partnership or technical issues only</p>
                </div>
              </div>

              <div class="flex items-start space-x-4">
                <div class="icon-circle bg-forest-green bg-opacity-20 text-forest-green flex-shrink-0">
                  <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 class="font-semibold text-forest-green">Office Location</h3>
                  <p class="text-forest-green opacity-70">
                    Serving Colorado Communities<br />
                    Virtual-first operations
                  </p>
                </div>
              </div>
            </div>
          </div>

          <!-- Quick Links -->
          <div>
            <h3 class="text-lg font-semibold text-forest-green mb-4">Quick Links</h3>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <a
                href="/faq"
                class="card hover:shadow-md transition-shadow"
              >
                <h4 class="font-medium text-forest-green mb-2">Frequently Asked Questions</h4>
                <p class="text-sm text-forest-green opacity-70">Find answers to common questions about our programs.</p>
              </a>
              <a
                href="/resources/colorado"
                class="card hover:shadow-md transition-shadow"
              >
                <h4 class="font-medium text-forest-green mb-2">Recovery Resources</h4>
                <p class="text-sm text-forest-green opacity-70">Additional support services in Colorado.</p>
              </a>
              <a
                href="/partners"
                class="card hover:shadow-md transition-shadow"
              >
                <h4 class="font-medium text-forest-green mb-2">Partner With Us</h4>
                <p class="text-sm text-forest-green opacity-70">Learn about partnership opportunities.</p>
              </a>
              <a
                href="/impact"
                class="card hover:shadow-md transition-shadow"
              >
                <h4 class="font-medium text-forest-green mb-2">Our Impact</h4>
                <p class="text-sm text-forest-green opacity-70">See how we're making a difference.</p>
              </a>
            </div>
          </div>
        </div>

        <!-- Contact Form -->
        <div class="card">
          <h2 class="section-title text-left">Send Us a Message</h2>

          {#if submitted}
            <SuccessMessage
              title="Message Sent!"
              message="Thank you for contacting us. We'll get back to you within 24 hours."
              icon="check"
            />
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
              class="space-y-6"
            >
              <!-- Name -->
              <div>
                <label for="name" class="form-label">Full Name *</label>
                <input id="name" name="name" type="text" required class="form-input" placeholder="Your full name" />
              </div>

              <!-- Email -->
              <div>
                <label for="email" class="form-label">Email Address *</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  class="form-input"
                  placeholder="your.email@example.com"
                />
              </div>

              <!-- Phone (Optional) -->
              <div>
                <label for="phone" class="form-label">Phone Number</label>
                <input id="phone" name="phone" type="tel" class="form-input" placeholder="(555) 123-4567" />
              </div>

              <!-- Inquiry Type -->
              <div>
                <label for="inquiryType" class="form-label">How can we help you? *</label>
                <select id="inquiryType" name="inquiryType" required class="form-input">
                  <option value="">Select an option</option>
                  <option value="general">General Information</option>
                  <option value="application">Application Support</option>
                  <option value="partnership">Partnership Inquiry</option>
                  <option value="technical">Technical Support</option>
                  <option value="billing">Billing Question</option>
                  <option value="feedback">Feedback</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <!-- Subject -->
              <div>
                <label for="subject" class="form-label">Subject *</label>
                <input
                  id="subject"
                  name="subject"
                  type="text"
                  required
                  class="form-input"
                  placeholder="Brief description of your inquiry"
                />
              </div>

              <!-- Message -->
              <div>
                <label for="message" class="form-label">Message *</label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows="6"
                  class="form-input resize-none"
                  placeholder="Please provide details about your inquiry..."
                ></textarea>
              </div>

              <!-- Privacy Notice -->
              <div class="bg-cream bg-opacity-50 rounded-lg p-4">
                <p class="text-sm text-forest-green opacity-70">
                  By submitting this form, you agree to our
                  <a href="/privacy" class="text-forest-green hover:text-forest-green-dark underline">Privacy Policy</a>. We'll only use
                  your information to respond to your inquiry.
                </p>
              </div>

              <!-- Submit Button -->
              <button
                type="submit"
                disabled={isSubmitting}
                class="w-full btn btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {#if isSubmitting}
                  <div class="flex items-center justify-center space-x-2">
                    <LoadingSpinner size="sm" color="white" />
                    <span>Sending...</span>
                  </div>
                {:else}
                  Send Message
                {/if}
              </button>
            </form>
          {/if}

          <!-- Form Errors -->
          {#if form?.errors}
            <div class="mt-6">
              <ErrorMessage title="Form Error" message={Object.values(form.errors).join(', ')} />
            </div>
          {/if}
        </div>
      </div>
    </div>
  </section>
</div>

<style>
  /* Use unified design system classes */
  .hero {
    padding: 4rem 1rem;
  }
  
  .hero-title {
    font-size: 2.5rem;
    font-family: serif;
    font-weight: 500;
    color: #065f46;
    margin-bottom: 1.5rem;
  }
  
  .hero-subtitle {
    font-size: 1.25rem;
    color: #065f46;
    opacity: 0.8;
    margin-bottom: 2rem;
  }
  
  .section {
    padding: 4rem 1rem;
  }
  
  .section-title {
    font-size: 1.875rem;
    font-family: serif;
    font-weight: 500;
    color: #065f46;
    margin-bottom: 2rem;
  }
  
  .container {
    max-width: 72rem;
  }
  
  .card {
    background-color: white;
    border-radius: 0.75rem;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    border: 1px solid rgba(6, 95, 70, 0.1);
    padding: 2rem;
  }
  
  .icon-circle {
    width: 3rem;
    height: 3rem;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 0.75rem 1.5rem;
    border-radius: 0.5rem;
    font-weight: 500;
    transition: all 0.2s ease-in-out;
  }
  
  .btn-primary {
    background-color: #065f46;
    color: white;
  }
  
  .btn-primary:hover {
    background-color: #047857;
  }
  
  .form-label {
    display: block;
    font-size: 0.875rem;
    font-weight: 500;
    color: #065f46;
    margin-bottom: 0.5rem;
  }
  
  .form-input {
    width: 100%;
    padding: 0.75rem 1rem;
    border: 1px solid rgba(6, 95, 70, 0.2);
    border-radius: 0.5rem;
    transition: all 0.2s ease-in-out;
  }
  
  .form-input:focus {
    outline: none;
    box-shadow: 0 0 0 2px #065f46;
    border-color: transparent;
  }
  
  @media (min-width: 640px) {
    .hero {
      padding: 4rem 1.5rem;
    }
    
    .section {
      padding: 4rem 1.5rem;
    }
  }
  
  @media (min-width: 768px) {
    .hero-title {
      font-size: 3rem;
    }
  }
  
  @media (min-width: 1024px) {
    .hero {
      padding: 4rem 2rem;
    }
    
    .hero-title {
      font-size: 3rem;
    }
    
    .section {
      padding: 4rem 2rem;
    }
  }
</style>