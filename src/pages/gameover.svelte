<script>
  import { goto } from '@roxi/routify';
</script>

<p>Game Over !</p>
<button on:click={() => $goto('/')} class="btn btn-primary">Retourner au lobby</button>
