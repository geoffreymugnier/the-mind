<script>
  import { socket } from '../../socket';
  import { goto } from '@roxi/routify';
  import user from '../../user';
  import room from '../../room';
  import { onMount } from 'svelte';
  import Input from '../../lib/Input.svelte';
  import Splash from '../../lib/Splash.svelte';

  export let lobby;

  let players = [];
  let error;

  onMount(() => {
    socket.emit('join', lobby)
  })
  
  socket.on("player_disconnected", (username) => {
    players = players.filter(p => p !== username)
  });

  socket.on('cannot_join', message => {
    error = message;
    $user.joined = false;
  });

  socket.on('joined_game', (data) => players = data);

  const handleJoin = () => {
    error = null;
    socket.emit('joined_game', {
      lobbyId: lobby,
      username: $user.name
    });
    
    $user.joined = true;
  }
  
  socket.on("purged", () => {
    players = [];
    $user.joined = false;
  });

  // socket.on('join', (data) => players = [...players, data]);
  socket.on('game_started', ({ level, lives, stars, players }) => {
    $room.players = players;
    $room.level = level;
    $room.lives = lives;
    $room.stars = stars;

    // just a reset for next time player comes in lobby
    $user.joined = false;
    
    $goto(`/${lobby}/game`);
  })
</script>

<main>
  <Splash />
  <h2>{lobby}</h2>
  {#if $user.joined}
    {#if players.length > 1}
      <button on:click={() => socket.emit('purge', lobby)}>Purger la salle</button>
      <button class="btn btn-primary" on:click={() => socket.emit('start')}>Lancer la partie</button>
    {:else}
    <p>En attente d'autres joueurs...</p>
    {/if}
  {:else}
    <form on:submit|preventDefault={handleJoin}>
      <div class="flex gap-2 justify-center">
        <Input name="username" bind:value={$user.name} placeholder="Entrez votre pseudo" autofocus />
        <button 
          class="btn btn-primary h-full" 
          disabled={!$user.name}>Rejoindre</button>
      </div>
    </form>
  {/if}

  {#if error}
      <p class="text-red-500">{error}</p>
  {/if}
  {#if players.length}
    <div class="my-3">
      {#each players as player}
        <p>{player}</p>
      {/each}
    </div>
  {/if}
</main>
