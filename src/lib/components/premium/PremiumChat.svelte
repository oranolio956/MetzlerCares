<script lang="ts">
  import { createEventDispatcher, onMount } from 'svelte';
  import { fade, slide } from 'svelte/transition';
  import PremiumButton from './PremiumButton.svelte';
  import PremiumCard from './PremiumCard.svelte';

  export let isOpen = false;
  export let messages: Array<{
    id: string;
    text: string;
    sender: 'user' | 'assistant';
    timestamp: Date;
    isTyping?: boolean;
  }> = [];
  export let placeholder = "How can we help you today?";
  export let title = "Recovery Concierge";
  export let subtitle = "24/7 Support for Your Journey";

  let inputValue = '';
  let chatContainer: HTMLDivElement;
  let isTyping = false;

  const dispatch = createEventDispatcher();

  onMount(() => {
    if (isOpen && messages.length === 0) {
      addWelcomeMessage();
    }
  });

  $: if (isOpen && messages.length === 0) {
    addWelcomeMessage();
  }

  function addWelcomeMessage() {
    messages = [{
      id: crypto.randomUUID(),
      text: "Welcome to MetzlerCares Recovery Concierge. I'm here to provide personalized guidance for your recovery journey. How can I support you today?",
      sender: 'assistant',
      timestamp: new Date()
    }];
  }

  function scrollToBottom() {
    setTimeout(() => {
      if (chatContainer) {
        chatContainer.scrollTop = chatContainer.scrollHeight;
      }
    }, 100);
  }

  async function handleSubmit() {
    if (!inputValue.trim() || isTyping) return;

    const userMessage = {
      id: crypto.randomUUID(),
      text: inputValue.trim(),
      sender: 'user' as const,
      timestamp: new Date()
    };

    messages = [...messages, userMessage];
    inputValue = '';
    isTyping = true;

    scrollToBottom();

    // Simulate AI response
    setTimeout(() => {
      const responses = [
        "Thank you for sharing that. Based on what you've told me, I'd recommend connecting with one of our certified recovery specialists who can provide personalized guidance for your specific situation.",
        "That's an important step you're considering. Our Recovery Concierge service includes access to evidence-based treatment options and peer support networks in your area.",
        "I understand how challenging this can be. Let me help you explore the most appropriate care options based on your individual needs and circumstances.",
        "Your recovery journey is unique, and we're here to support you every step of the way. Would you like me to connect you with a specialist who can discuss personalized treatment approaches?",
        "Thank you for reaching out. Our team can help you navigate insurance coverage, treatment options, and create a personalized recovery plan that works for your life."
      ];

      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      
      const assistantMessage = {
        id: crypto.randomUUID(),
        text: randomResponse,
        sender: 'assistant' as const,
        timestamp: new Date()
      };

      messages = [...messages, assistantMessage];
      isTyping = false;
      scrollToBottom();
    }, 1500 + Math.random() * 1000);

    dispatch('message', { message: userMessage });
  }

  function handleKeydown(event: KeyboardEvent) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSubmit();
    }
  }

  function toggleChat() {
    isOpen = !isOpen;
    dispatch('toggle', { isOpen });
  }

  function formatTime(date: Date) {
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  }
</script>

<!-- Chat Widget Button -->
<div class="fixed bottom-6 right-6 z-50">
  {#if !isOpen}
    <PremiumButton
      variant="accent"
      size="lg"
      on:click={toggleChat}
      class="shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105"
      ariaLabel="Open Recovery Concierge chat"
      icon='<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path></svg>'
    >
      <span class="hidden sm:inline">Recovery Concierge</span>
    </PremiumButton>
  {/if}
</div>

<!-- Chat Window -->
{#if isOpen}
  <div 
    transition:fade={{ duration: 300 }}
    class="fixed bottom-6 right-6 z-50 w-full max-w-md h-[600px] sm:h-[500px]"
    role="dialog"
    aria-label="Recovery Concierge chat window"
    aria-live="polite"
  >
    <PremiumCard 
      variant="highlighted" 
      class="h-full flex flex-col overflow-hidden bg-white/95 backdrop-blur-xl border-forest-green/20"
      glow={true}
    >
      <!-- Chat Header -->
      <div class="flex items-center justify-between p-4 border-b border-forest-green/10 bg-gradient-to-r from-forest-green/5 to-mountain-blue/5">
        <div class="flex items-center space-x-3">
          <div class="w-10 h-10 rounded-full bg-gradient-to-br from-forest-green to-mountain-blue flex items-center justify-center">
            <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
            </svg>
          </div>
          <div>
            <h3 class="font-primary font-semibold text-forest-green">{title}</h3>
            <p class="text-sm text-mountain-blue">{subtitle}</p>
          </div>
        </div>
        <PremiumButton
          variant="ghost"
          size="sm"
          on:click={toggleChat}
          ariaLabel="Close chat"
          class="hover:bg-forest-green/10"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </PremiumButton>
      </div>

      <!-- Messages Container -->
      <div 
        bind:this={chatContainer}
        class="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-forest-green/20 scrollbar-track-transparent"
        role="log"
        aria-live="polite"
        aria-atomic="false"
      >
        {#each messages as message (message.id)}
          <div 
            transition:slide={{ duration: 200, axis: 'y' }}
            class="flex {message.sender === 'user' ? 'justify-end' : 'justify-start'}"
          >
            <div 
              class="max-w-[80%] {message.sender === 'user' 
                ? 'bg-forest-green text-white' 
                : 'bg-forest-green/5 text-forest-green border border-forest-green/10'
              } rounded-2xl px-4 py-3 shadow-sm"
            >
              <p class="text-sm leading-relaxed">{message.text}</p>
              <p class="text-xs opacity-70 mt-1 {message.sender === 'user' ? 'text-right' : 'text-left'}">
                {formatTime(message.timestamp)}
              </p>
            </div>
          </div>
        {/each}

        {#if isTyping}
          <div class="flex justify-start">
            <div class="bg-forest-green/5 text-forest-green border border-forest-green/10 rounded-2xl px-4 py-3 shadow-sm">
              <div class="flex space-x-2">
                <div class="w-2 h-2 bg-forest-green/40 rounded-full animate-bounce" style="animation-delay: 0ms"></div>
                <div class="w-2 h-2 bg-forest-green/40 rounded-full animate-bounce" style="animation-delay: 150ms"></div>
                <div class="w-2 h-2 bg-forest-green/40 rounded-full animate-bounce" style="animation-delay: 300ms"></div>
              </div>
            </div>
          </div>
        {/if}
      </div>

      <!-- Input Area -->
      <div class="p-4 border-t border-forest-green/10 bg-white/50">
        <form on:submit|preventDefault={handleSubmit} class="flex space-x-2">
          <textarea
            bind:value={inputValue}
            on:keydown={handleKeydown}
            {placeholder}
            rows="1"
            class="flex-1 resize-none border border-forest-green/20 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-mountain-blue/50 focus:border-transparent transition-all duration-200 bg-white/80 backdrop-blur-sm"
            disabled={isTyping}
            aria-label="Type your message"
          ></textarea>
          <PremiumButton
            type="submit"
            variant="primary"
            size="icon"
            disabled={!inputValue.trim() || isTyping}
            ariaLabel="Send message"
            class="shrink-0"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
            </svg>
          </PremiumButton>
        </form>
        <p class="text-xs text-mountain-blue/70 mt-2 text-center">
          Press Enter to send • Shift+Enter for new line
        </p>
      </div>
    </PremiumCard>
  </div>
{/if}