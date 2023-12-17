<script>
  import { goto } from '@roxi/routify';
  import Input from '../lib/Input.svelte';
  import {onMount} from 'svelte';
  import user from '../user';
  import room from '../room';
  import { socket } from '../socket';
  import Splash from '../lib/Splash.svelte';

  let lobby = null;

  let publicLobbies = [];

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
  
  const joinLobby = (_lobby = lobby) => {
    $goto(`/${_lobby ??  generateLobbyId()}`);
  }

  socket.emit('ask_for_lobbies');

  socket.on('list_lobbies', (lobbies) => {
    for (let [key, value] of Object.entries(lobbies)) {
      publicLobbies = [
        ...publicLobbies, 
        {
          id: key,
          nbOfPlayers: value.players.length
        }
      ]
    }
  })

  $: console.log(publicLobbies);
</script>

<main>
  <Splash />
  <form on:submit|preventDefault={() => joinLobby(lobby)}>
    <Input name="lobby" class="w-full" placeholder="Nom du lobby" bind:value={lobby} />
    <button class="btn btn-primary w-full mb-2" on:click={() => joinLobby(lobby)}>Rejoindre</button>
    <button class="btn btn-primary-outlined w-full" on:click={() => lobby = generateLobbyId()}>
      Session aléatoire
    </button>
  </form>

  {#if publicLobbies.length > 0}
    <div class="mt-10">
      <p>Lobbies</p>
      {#each publicLobbies as _lobby}
        <div class="flex justify-between items-center bg-gray-800 text-white px-4 py-2 my-2 rounded">
          <div class="text-left">
            <p class="text-2xl uppercase">{_lobby.id}</p>
            <p>{_lobby.nbOfPlayers} joueur(s)</p>
          </div>
          <button class="btn btn-white text-gray-800" on:click={() => joinLobby(_lobby.id)}>Rejoindre</button>
        </div>
      {/each}
    </div>
  {/if}
</main>