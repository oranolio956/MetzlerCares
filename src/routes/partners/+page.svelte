<script lang="ts">
  import MetzlerBridgeLogo from '$lib/MetzlerBridgeLogo.svelte';
  import { goto } from '$app/navigation';
  import { enhance } from '$app/forms';
  import type { PartnerFormData } from '$lib/types';

  export let data;

  let mouContent = data.mouContent;
  let formData = {
    facilityName: '',
    contactName: '',
    contactEmail: '',
    contactPhone: '',
    addressStreet: '',
    addressCity: '',
    addressState: 'CO',
    addressZip: '',
    mouAccepted: false
  };

  let mouAccepted = false;
  let submitting = false;
  let mouFile: File | null = null;
  let insuranceFile: File | null = null;

  

  
</script>

<svelte:head>
  <title>Partner With Metzler Foundations</title>
  <meta name="description" content="Join our preferred provider network for sober living facilities. Direct payments, automated placements, and streamlined operations." />
</svelte:head>

<div class="min-h-screen bg-cream text-navy">
  <!-- Header -->
  <header class="bg-cream border-b border-navy border-opacity-10">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
      <div class="flex justify-between items-center">
        <button on:click={() => goto('/')} class="flex items-center space-x-2">
          <MetzlerBridgeLogo className="w-8 h-8 text-navy" />
          <span class="text-xl font-serif font-medium text-navy">Metzler Foundations</span>
        </button>
      </div>
    </div>
  </header>

  <!-- Main Content -->
  <main class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
    <!-- Hero Section -->
    <div class="text-center mb-12">
      <h1 class="text-4xl md:text-5xl font-serif font-medium text-navy mb-6">
        Partner With Metzler Foundations
      </h1>
      <p class="text-xl text-navy text-opacity-80 mb-8 max-w-3xl mx-auto">
        We are a modern scholarship fund, not a housing provider. We partner with the best, certified sober living homes in Colorado.
        Our model is built to support you: we pay our partners instantly via ACH for every approved resident.
      </p>
    </div>

    <!-- Application Form -->
    <div class="bg-white rounded-lg shadow-sm border border-navy border-opacity-10 p-8">
      <form method="POST" action="?/apply" enctype="multipart/form-data" class="space-y-8">
        <input type="hidden" name="csrf_token" value={data.csrfToken} />
        <!-- Facility Information -->
        <div>
          <h2 class="text-2xl font-medium text-navy mb-6">Facility Information</h2>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label for="facilityName" class="form-label">Facility Name *</label>
              <input
                type="text"
                id="facilityName"
                name="facilityName"
                bind:value={formData.facilityName}
                required
                class="form-input"
                placeholder="Your facility name"
              />
            </div>

            <div>
              <label for="contactName" class="form-label">Contact Person *</label>
              <input
                type="text"
                id="contactName"
                name="contactName"
                bind:value={formData.contactName}
                required
                class="form-input"
                placeholder="Authorized representative name"
              />
            </div>

            <div>
              <label for="contactEmail" class="form-label">Contact Email *</label>
              <input
                type="email"
                id="contactEmail"
                name="contactEmail"
                bind:value={formData.contactEmail}
                required
                class="form-input"
                placeholder="contact@facility.com"
              />
            </div>

            <div>
              <label for="contactPhone" class="form-label">Contact Phone</label>
              <input
                type="tel"
                id="contactPhone"
                name="contactPhone"
                bind:value={formData.contactPhone}
                class="form-input"
                placeholder="(555) 123-4567"
              />
            </div>
          </div>
        </div>

        <!-- Address Information -->
        <div>
          <h2 class="text-2xl font-medium text-navy mb-6">Facility Address</h2>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="md:col-span-2">
              <label for="addressStreet" class="form-label">Street Address *</label>
              <input
                type="text"
                id="addressStreet"
                name="addressStreet"
                bind:value={formData.addressStreet}
                required
                class="form-input"
                placeholder="123 Main Street"
              />
            </div>

            <div>
              <label for="addressCity" class="form-label">City *</label>
              <input
                type="text"
                id="addressCity"
                name="addressCity"
                bind:value={formData.addressCity}
                required
                class="form-input"
                placeholder="Denver"
              />
            </div>

            <div>
              <label for="addressState" class="form-label">State *</label>
              <select
                id="addressState"
                name="addressState"
                bind:value={formData.addressState}
                required
                class="form-input"
              >
                <option value="CO">Colorado</option>
              </select>
            </div>

            <div>
              <label for="addressZip" class="form-label">ZIP Code *</label>
              <input
                type="text"
                id="addressZip"
                name="addressZip"
                bind:value={formData.addressZip}
                required
                class="form-input"
                placeholder="80202"
              />
            </div>
          </div>
        </div>

        <!-- Document Upload -->
        <div>
          <h2 class="text-2xl font-medium text-navy mb-6">Required Documentation</h2>

          <div class="space-y-6">
            <div>
              <label for="certification" class="form-label">
                NARR Certification or State Equivalent *
              </label>
              <input
                type="file"
                id="certification"
                name="mou"
                accept=".pdf,.jpg,.jpeg,.png"
                required
                class="block w-full text-sm text-navy file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-olive file:text-cream hover:file:bg-opacity-90"
              />
              <p class="text-sm text-navy text-opacity-60 mt-1">
                Upload your current NARR certification or state equivalent licensing document.
              </p>
            </div>

            <div>
              <label for="insurance" class="form-label">
                General Liability Insurance *
              </label>
              <input
                type="file"
                id="insurance"
                name="insurance"
                accept=".pdf,.jpg,.jpeg,.png"
                required
                class="block w-full text-sm text-navy file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-olive file:text-cream hover:file:bg-opacity-90"
              />
              <p class="text-sm text-navy text-opacity-60 mt-1">
                Upload proof of current general liability insurance coverage.
              </p>
            </div>
          </div>
        </div>

        <!-- MOU Agreement -->
        <div>
          <h2 class="text-2xl font-medium text-navy mb-6">Partnership Agreement</h2>

          {#if mouContent}
            <div class="bg-navy bg-opacity-5 rounded-lg p-6 mb-6 max-h-60 overflow-y-auto">
              <h3 class="text-lg font-medium text-navy mb-4">Memorandum of Understanding Preview</h3>

              {#each mouContent.foundationResponsibilities as responsibility}
                <div class="mb-2">
                  <strong>Foundation:</strong> {responsibility}
                </div>
              {/each}

              {#each mouContent.providerResponsibilities as responsibility}
                <div class="mb-2">
                  <strong>Provider:</strong> {responsibility}
                </div>
              {/each}

              <div class="mt-4 pt-4 border-t border-navy border-opacity-20">
                <p class="text-sm text-navy text-opacity-70">
                  {mouContent.confidentiality}
                </p>
              </div>
            </div>
          {/if}

          <div class="border border-navy border-opacity-20 rounded-lg p-4">
            <div class="flex items-start">
              <div class="flex items-center h-5">
                <input
                  id="mou"
                  bind:checked={formData.mouAccepted}
                  type="checkbox"
                  name="mouAccepted"
                  class="h-4 w-4 text-navy focus:ring-navy border-gray-300 rounded"
                  required
                />
              </div>
              <div class="ml-3 text-sm">
                <label for="mou" class="font-medium text-navy">
                  I am an authorized representative of this facility and I have read, understood, and agree to all terms of the Metzler Foundations Preferred Provider Network MOU. *
                </label>
                <p class="text-navy text-opacity-60 mt-1">
                  This agreement is legally binding and establishes our partnership terms, responsibilities, and data-sharing protocols.
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Submit Button -->
        <div class="pt-6 border-t border-navy border-opacity-10">
          <button
            type="submit"
            class="w-full bg-olive text-cream py-3 px-4 rounded-md font-medium hover:bg-opacity-90 transition-colors"
          >
            Apply to Become a Partner
          </button>

          <p class="text-center text-sm text-navy text-opacity-60 mt-4">
            Applications are reviewed within 1-2 business days. You'll receive an email confirmation upon submission.
          </p>
        </div>
      </form>
    </div>
  </main>
</div>
