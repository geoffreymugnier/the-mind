<script>
  import { socket } from '../../socket';
  import { goto } from '@roxi/routify';
  import user from '../../user';
  import room from '../../room';
  import { onMount } from 'svelte';
  import Input from '../../lib/Input.svelte';

  export let lobby;

  let players = [];

  onMount(() => {
    socket.emit('join', lobby)
  })
  
  socket.on('joined_game', (data) => players = data);

  const handleJoin = () => {
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
    
    $goto(`/${lobby}/game`);
  })
</script>

<main>
  <h1>Mexican Standoff</h1>
  <h2>{lobby}</h2>
  {#if $user.joined}
    {#if players.length > 1}
      <button on:click={() => socket.emit('purge', lobby)}>Purger la salle</button>
      <button class="btn btn-primary" on:click={() => socket.emit('start')}>Lancer la partie</button>
    {:else}
    <p>En attente d'autres joueurs...</p>
    {/if}
  {:else}
  <div class="flex gap-2 justify-center">
    <Input name="username" bind:value={$user.name} label="Pseudo" placeholder="Entrez votre pseudo" />
    <button 
      class="btn btn-primary h-full" 
      on:click={handleJoin}
      disabled={!$user.name}>Rejoindre</button>
      </div>
  {/if}

  {#if players.length}
    <div class="my-3">
      {#each players as player}
        <p>{player}</p>
      {/each}
    </div>
  {/if}
</main>
