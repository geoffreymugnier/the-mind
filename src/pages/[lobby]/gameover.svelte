<script>
  import { goto } from '@roxi/routify';
  import { onMount } from 'svelte';
  import Logs from '../../lib/Logs.svelte';
  import room from '../../room';

  export let lobby;
  
  onMount(() => {
    room.reset();
  })
</script>

<h1>😭😭 Game Over 😭😭</h1>
<div class="flex">
  <button on:click={() => $goto(`/${lobby}`)} class="btn btn-primary-outlined">Retourner au lobby</button>
</div>

<button class="bg-gray-50 mt-5 inline-block lg:hidden" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasRight" aria-controls="offcanvasRight">
  Voir l'historique ›
</button>

<Logs />