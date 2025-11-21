<script lang="ts">
  import InsuranceVerifier from './InsuranceVerifier.svelte'
  export let provider: string
</script>

<InsuranceVerifier persona={provider} />
