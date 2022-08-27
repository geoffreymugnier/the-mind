<script>
  import { goto } from '@roxi/routify';
  import Input from '../lib/Input.svelte';

  let lobby = null;

  const generateLobbyId = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let id = '';
    for (let i = 0; i < 6; i++) {
      id += chars[Math.floor(Math.random() * chars.length)];
    }
    return id;
  }
  
  const joinLobby = () => {
    $goto(`/${lobby ??  generateLobbyId()}`);
  }
</script>

<main>
  <h1>Mexican Standoff</h1>

<div class="flex items-center justify-center">
  <div class="inline-flex gap-2" role="group">
    <Input name="lobby" placeholder="Lobby" bind:value={lobby} />
    <button class="btn btn-primary h-full" on:click={joinLobby}>Rejoindre</button>
  </div>
</div>

<button class="btn btn-primary-outlined h-full mt-5" on:click={joinLobby}>Créer un nouveau lobby</button>

</main>
