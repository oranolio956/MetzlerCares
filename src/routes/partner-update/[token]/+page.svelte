<script lang="ts">
  import { onMount } from 'svelte';
  import { page } from '$app/stores';
  import { supabase } from '$lib/utils/supabase';
  import { goto } from '$app/navigation';

  let token: string | null = null;
  let loading = true;
  let error: string | null = null;
  let outcomeData: {
    beneficiary_name: string;
    partner_name: string;
    interval_days: number;
    outcome_id: string;
  } | null = null;
  let selectedOutcome: string = '';
  let selectedMetric: string = '';
  let notes: string = '';
  let submitting = false;

  const outcomeOptions: { label: string; value: string }[] = [
    { label: 'Still in Residence', value: 'still_in_residence' },
    { label: 'Completed Program Successfully', value: 'completed_program_successfully' },
    { label: 'Discharged (Non-compliant)', value: 'discharged_non_compliant' },
    { label: 'Discharged (Left AMA)', value: 'discharged_left_ama' },
    { label: 'Lost Contact', value: 'lost_contact' },
  ];

  onMount(async () => {
    token = $page.params.token || null;
    if (!token) {
      error = 'Invalid link: Token missing.';
      loading = false;
      return;
    }

    await verifyTokenAndLoadData();
  });

  async function verifyTokenAndLoadData() {
    try {
      loading = true;
      error = null;

      const { data, error: verifyError } = await supabase.functions.invoke('verify-outcome-token', {
        body: { token },
        headers: { 'Content-Type': 'application/json' },
      });

      if (verifyError) {
        throw new Error(verifyError.message);
      }

      if (data?.success) {
        outcomeData = data.data;
      } else {
        throw new Error(data?.error || 'Invalid or expired link.');
      }
    } catch (err: any) {
      console.error('Error verifying token:', err);
      error = err.message || 'This link has expired or is invalid. Please contact Metzler Foundations to log this outcome manually.';
    } finally {
      loading = false;
    }
  }

  async function submitOutcome() {
    if (!selectedMetric || !outcomeData?.outcome_id || !token) {
      alert('Please select an outcome.');
      return;
    }

    try {
      submitting = true;
      const { data, error: submitError } = await supabase.functions.invoke('submit-outcome-update', {
        body: { token, outcome_metric: selectedMetric, notes },
        headers: { 'Content-Type': 'application/json' },
      });

      if (submitError) {
        throw new Error(submitError.message);
      }

      if (data?.success) {
        goto('/partner-update/success');
      } else {
        throw new Error(data?.error || 'Failed to submit outcome.');
      }
    } catch (err: any) {
      console.error('Error submitting outcome:', err);
      error = err.message || 'An error occurred while submitting the outcome. Please try again.';
    } finally {
      submitting = false;
    }
  }
</script>

<svelte:head>
  <title>Outcome Report - Metzler Foundations</title>
  <meta name="description" content="Submit outcome updates for beneficiary progress tracking." />
</svelte:head>

<div class="min-h-screen bg-cream text-navy">
  <div class="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
    {#if loading}
      <div class="flex justify-center items-center py-16">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-navy"></div>
        <span class="ml-3 text-navy">Verifying your link...</span>
      </div>
    {:else if error}
      <div class="bg-red-50 border border-red-200 rounded-lg p-6">
        <div class="flex">
          <div class="flex-shrink-0">
            <svg class="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
            </svg>
          </div>
          <div class="ml-3">
            <h3 class="text-sm font-medium text-red-800">Link Invalid or Expired</h3>
            <div class="mt-2 text-sm text-red-700">
              <p>{error}</p>
            </div>
            <div class="mt-4 flex items-center gap-3">
              <a href="mailto:support@metzlerfoundations.org?subject=Partner%20Outcome%20Link%20Issue" class="bg-red-100 px-3 py-2 rounded-md text-sm font-medium text-red-800 hover:bg-red-200">Contact Support</a>
              <button on:click={() => goto('/')} class="bg-white px-3 py-2 rounded-md text-sm font-medium text-navy border border-navy border-opacity-20 hover:bg-cream">Return Home</button>
            </div>
          </div>
        </div>
      </div>
    {:else if outcomeData}
      <!-- Header -->
      <div class="text-center mb-8">
        <h1 class="text-3xl font-medium text-navy mb-2">Outcome Report</h1>
        <p class="text-lg text-navy text-opacity-70">For: {outcomeData.partner_name}</p>
        <p class="text-sm text-navy text-opacity-50">{outcomeData.interval_days}-Day Check-in</p>
      </div>

      <!-- Beneficiary Info -->
      <div class="bg-white rounded-lg shadow-sm border border-navy border-opacity-10 p-6 mb-6">
        <h2 class="text-xl font-medium text-navy mb-4">Beneficiary Information</h2>
        <div class="space-y-2">
          <p><span class="font-medium">Name:</span> {outcomeData.beneficiary_name}</p>
          <p><span class="font-medium">Check-in Type:</span> {outcomeData.interval_days}-Day Follow-up</p>
        </div>
      </div>

      <!-- Outcome Form -->
      <div class="bg-white rounded-lg shadow-sm border border-navy border-opacity-10 p-6">
        <h2 class="text-xl font-medium text-navy mb-4">Report Outcome</h2>
        <form on:submit|preventDefault={submitOutcome} class="space-y-6">
          <div>
            <label for="outcome" class="block text-sm font-medium text-navy mb-2">
              Current Status *
            </label>
            <select
              id="outcome"
              bind:value={selectedMetric}
              required
              class="w-full px-3 py-2 border border-navy border-opacity-20 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-navy focus:border-navy bg-cream"
            >
              <option value="">Select an outcome...</option>
              {#each outcomeOptions as option}
                <option value={option.value}>{option.label}</option>
              {/each}
            </select>
          </div>

          <div>
            <label for="notes" class="block text-sm font-medium text-navy mb-2">Notes (optional)</label>
            <textarea
              id="notes"
              bind:value={notes}
              rows="3"
              class="w-full px-3 py-2 border border-navy border-opacity-20 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-navy focus:border-navy bg-cream"
              placeholder="Additional context (e.g., discharge reason)"
            ></textarea>
          </div>

          <button
            type="submit"
            disabled={submitting || !selectedMetric}
            class="w-full bg-olive text-cream font-medium py-3 px-4 rounded-md hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-olive focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {#if submitting}
              <div class="flex items-center justify-center">
                <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-cream mr-2"></div>
                Submitting...
              </div>
            {:else}
              Submit Outcome Report
            {/if}
          </button>
        </form>
      </div>

      <!-- Footer -->
      <div class="text-center mt-8 text-sm text-navy text-opacity-50">
        <p>This secure link will expire in 7 days. Your submission is confidential and helps us track program effectiveness.</p>
      </div>
    {/if}
  </div>
</div>
