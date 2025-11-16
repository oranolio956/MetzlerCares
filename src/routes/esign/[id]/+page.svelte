<script lang="ts">
  import { onMount } from 'svelte';
  import { page } from '$app/stores';
  
  interface ConsentRecord {
    id: string;
    client_name: string;
    client_dob: string;
    partner_name: string;
    expires_at: string;
  }
  let consent: ConsentRecord | null = null;
  let loading: boolean = true;
  let signatureData: { name: string; date: string; signature: string } = {
    name: '',
    date: new Date().toISOString().split('T')[0],
    signature: ''
  };
  let isSigning: boolean = false;
  let signComplete: boolean = false;

  onMount(async () => {
    const consentId = $page.params.id;
    
    try {
      const response = await fetch(`/api/esign/consent?id=${consentId}`);
      const result = await response.json();
      
      if (result.success) {
        consent = result.consent;
      }
    } catch (error) {
      console.error('Failed to load consent:', error);
    } finally {
      loading = false;
    }
  });

  async function handleSignature() {
    if (!signatureData.name.trim() || !signatureData.signature) {
      alert('Please provide your name and signature');
      return;
    }

    isSigning = true;
    
    try {
      const response = await fetch(`/api/esign/consent/${$page.params.id}/sign`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(signatureData)
      });
      
      const result = await response.json();
      
      if (result.success) {
        signComplete = true;
      } else {
        alert('Failed to complete signature. Please try again.');
      }
    } catch (error) {
      alert('An error occurred. Please try again.');
    } finally {
      isSigning = false;
    }
  }

  function handleSignatureDraw(canvas: HTMLCanvasElement) {
    if (!canvas || !canvas.getContext) return;
    
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    
    let drawing: boolean = false;
    let lastX: number = 0;
    let lastY: number = 0;

    function startDrawing(e: { clientX: number; clientY: number }) {
      drawing = true;
      lastX = e.clientX - rect.left;
      lastY = e.clientY - rect.top;
    }

    function draw(e: { clientX: number; clientY: number }) {
      if (!drawing) return;
      if (!ctx) return;
      ctx.beginPath();
      ctx.moveTo(lastX, lastY);
      ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
      ctx.stroke();
      
      lastX = e.clientX - rect.left;
      lastY = e.clientY - rect.top;
    }

    function stopDrawing() {
      drawing = false;
      signatureData.signature = (canvas as HTMLCanvasElement).toDataURL();
    }

    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', stopDrawing);
    canvas.addEventListener('mouseout', stopDrawing);

    // Touch support
    canvas.addEventListener('touchstart', (e) => {
      e.preventDefault();
      const touch = e.touches[0];
      startDrawing({
        clientX: touch.clientX,
        clientY: touch.clientY
      });
    });
    
    canvas.addEventListener('touchmove', (e) => {
      e.preventDefault();
      const touch = e.touches[0];
      draw({
        clientX: touch.clientX,
        clientY: touch.clientY
      });
    });
    
    canvas.addEventListener('touchend', stopDrawing);

    return {
      destroy() {
        canvas.removeEventListener('mousedown', startDrawing);
        canvas.removeEventListener('mousemove', draw);
        canvas.removeEventListener('mouseup', stopDrawing);
        canvas.removeEventListener('mouseout', stopDrawing);
        canvas.removeEventListener('touchstart', startDrawing as any);
        canvas.removeEventListener('touchmove', draw as any);
        canvas.removeEventListener('touchend', stopDrawing);
      }
    };
  }

  function clearSignature() {
    const canvas = document.getElementById('signature-canvas') as HTMLCanvasElement | null;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    }
    signatureData.signature = '';
  }
</script>

<svelte:head>
  <title>42 CFR Part 2 Consent - Metzler Bridge</title>
</svelte:head>

<div class="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
  {#if loading}
    <div class="flex items-center justify-center min-h-screen">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
    </div>
  {:else if !consent}
    <div class="flex items-center justify-center min-h-screen">
      <div class="text-center">
        <h2 class="text-2xl font-bold text-gray-900 mb-4">Consent Not Found</h2>
        <p class="text-gray-600">This consent request may have expired or been completed.</p>
      </div>
    </div>
  {:else if signComplete}
    <div class="flex items-center justify-center min-h-screen">
      <div class="text-center max-w-md mx-auto px-6">
        <div class="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg class="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
          </svg>
        </div>
        <h2 class="text-3xl font-bold text-gray-900 mb-4">Consent Complete</h2>
        <p class="text-gray-600 mb-8">Your consent has been successfully recorded. You may now close this window.</p>
        <div class="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-800">
          <strong>Reference:</strong> {consent.id}<br>
          <strong>Expires:</strong> {new Date(consent.expires_at).toLocaleDateString()}
        </div>
      </div>
    </div>
  {:else}
    <div class="max-w-4xl mx-auto px-6 py-12">
      <!-- Header -->
      <div class="text-center mb-12">
        <div class="w-16 h-16 bg-primary-600 rounded-lg flex items-center justify-center mx-auto mb-6">
          <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
          </svg>
        </div>
        <h1 class="text-3xl font-bold text-gray-900 mb-4">42 CFR Part 2 Consent</h1>
        <p class="text-lg text-gray-600">Federal law requires your consent for sharing treatment information</p>
      </div>

      <!-- Consent Details -->
      <div class="bg-white rounded-xl shadow-lg border border-gray-200 p-8 mb-8">
        <div class="grid md:grid-cols-2 gap-8">
          <div>
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Client Information</h3>
            <div class="space-y-3">
              <div>
                <p class="text-sm font-medium text-gray-700">Name</p>
                <p class="text-gray-900 font-medium">{consent.client_name}</p>
              </div>
              <div>
                <p class="text-sm font-medium text-gray-700">Date of Birth</p>
                <p class="text-gray-900 font-medium">{new Date(consent.client_dob).toLocaleDateString()}</p>
              </div>
            </div>
          </div>
          <div>
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Provider Information</h3>
            <div class="space-y-3">
              <div>
                <p class="text-sm font-medium text-gray-700">Provider</p>
                <p class="text-gray-900 font-medium">{consent.partner_name}</p>
              </div>
              <div>
                <p class="text-sm font-medium text-gray-700">Consent Type</p>
                <p class="text-gray-900 font-medium">Treatment, Payment, Operations (TPO)</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Consent Text -->
      <div class="bg-white rounded-xl shadow-lg border border-gray-200 p-8 mb-8">
        <h3 class="text-lg font-semibold text-gray-900 mb-6">Consent for Disclosure</h3>
        <div class="prose max-w-none text-gray-700 space-y-4">
          <p>
            I voluntarily consent to the disclosure of my treatment information for the purposes of 
            <strong>treatment, payment, and healthcare operations (TPO)</strong> as permitted under 
            42 CFR Part 2 - the federal confidentiality regulations for substance use disorder treatment.
          </p>
          <p>
            I understand that:
          </p>
          <ul class="list-disc pl-6 space-y-2">
            <li>My treatment information is protected by federal law</li>
            <li>I may revoke this consent at any time, except to the extent that action has been taken in reliance on it</li>
            <li>This consent will expire in one year unless I revoke it sooner</li>
            <li>My treatment information may be shared with authorized healthcare providers for continuity of care</li>
          </ul>
        </div>
      </div>

      <!-- Signature Form -->
      <div class="bg-white rounded-xl shadow-lg border border-gray-200 p-8 mb-8">
        <h3 class="text-lg font-semibold text-gray-900 mb-6">Digital Signature</h3>
        
        <div class="space-y-6">
          <div>
            <label for="signature-name" class="block text-sm font-medium text-gray-700 mb-2">Full Legal Name *</label>
            <input
              id="signature-name"
              type="text"
              bind:value={signatureData.name}
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Enter your full legal name"
            />
          </div>

          <div>
            <label for="signature-date" class="block text-sm font-medium text-gray-700 mb-2">Date *</label>
            <input
              id="signature-date"
              type="date"
              bind:value={signatureData.date}
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          <div>
            <label for="signature-canvas" class="block text-sm font-medium text-gray-700 mb-2">Digital Signature *</label>
            <p class="text-sm text-gray-600 mb-4">Please sign in the box below using your mouse or finger</p>
            
            <div class="border-2 border-gray-300 rounded-lg p-4">
              <canvas
                id="signature-canvas"
                width="500"
                height="150"
                class="w-full h-32 border border-gray-200 rounded cursor-crosshair"
                use:handleSignatureDraw
              ></canvas>
            </div>
            
            <button
              type="button"
              on:click={clearSignature}
              class="mt-2 px-4 py-2 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Clear Signature
            </button>
          </div>
        </div>
      </div>

      <!-- Submit Button -->
      <div class="text-center">
        <button
          on:click={handleSignature}
          disabled={isSigning}
          class="px-8 py-4 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105"
        >
          {isSigning ? 'Processing...' : 'Complete Consent'}
        </button>
        
        <p class="text-sm text-gray-500 mt-4">
          By signing, you acknowledge that you have read and understand this consent form
        </p>
      </div>
    </div>
  {/if}
</div>

<style>
  :global(:root) {
    --primary-600: #1a237e;
    --primary-500: #3949ab;
    --primary-700: #0d47a1;
  }
</style>