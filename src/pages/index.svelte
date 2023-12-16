<script>
  import { goto } from '@roxi/routify';
  import Input from '../lib/Input.svelte';
  import {onMount} from 'svelte';
  import user from '../user';
  import room from '../room';

  let lobby = null;

  onMount(() => {
    $user.joined = false;
    
    $room.logs = [];
    $room.lastCard = 0;
  });

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
  <img src="/gringo.png" class="m-auto mb-5 w-96" alt="Mexican Standoff" />
  <form on:submit|preventDefault={joinLobby}>
    <Input name="lobby" class="w-full" placeholder="Nom du lobby" bind:value={lobby} />
    <button class="btn btn-primary w-full mb-2" on:click={joinLobby}>Rejoindre</button>
    <button class="btn btn-primary-outlined w-full" on:click={() => lobby = generateLobbyId()}>
      Session aléatoire
    </button>
  </form>
</main>
