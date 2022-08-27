<script>
  import { goto } from '@roxi/routify';
  import Logs from '../../lib/Logs.svelte';
</script>

<h1>😭😭 Game Over 😭😭</h1>
<button on:click={() => $goto(`/`)} class="btn btn-primary-outlined">Retourner au lobby</button>

<button class="bg-gray-50 mt-5 inline-block lg:hidden" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasRight" aria-controls="offcanvasRight">
  Voir l'historique ›
</button>

<Logs />