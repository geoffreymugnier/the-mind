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
    <div class="inline-flex gap-2" role="group">
      <Input name="lobby" placeholder="Nom du lobby" bind:value={lobby} />
      <button class="btn btn-primary h-full" on:click={joinLobby}>Rejoindre</button>
    </div>
  </form>
  <p class="text-gray-500">Pas d'idée de nom de lobby ? <span class="font-semibold cursor-pointer text-indigo-800" on:click={() => lobby = generateLobbyId()}>Cliquez ici pour le générer !</span> 🙂</p>
</main>
