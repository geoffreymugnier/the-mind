<script>
  import { goto } from '@roxi/routify';
  import user from '../../user';
  import { onMount } from 'svelte';

  export let lobby;

  onMount(() => {
    $user.joined = false;
  })
</script>

<h1>🎉🎉 Victory 🎉🎉</h1>
<button on:click={() => $goto(`/${lobby}`)} class="btn btn-primary">Retourner au lobby</button>
