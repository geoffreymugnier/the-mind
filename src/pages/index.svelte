<script>
  import { socket } from '../socket';
  import { goto } from '@roxi/routify';
  import user from '../user';
  import room from '../room';
  import { onMount } from 'svelte';
  import Input from '../lib/Input.svelte';

  let players = [];

  onMount(() => {
    socket.emit('joined').on('joined', (data) => players = data);
  })

  const handleJoin = () => {
    socket.emit('join', $user.name);
    $user.joined = true;
  }
  
  socket.on('join', (data) => players = [...players, data]);
  socket.on('game_started', ({ level, lives, stars, players }) => {
    $room.players = players;
    $room.level = level;
    $room.lives = lives;
    $room.stars = stars;
    
    $goto('/game');
  })
</script>

<main>
  <h1>The Mind</h1>
  {#if $user.joined}
    {#if players.length > 1}
      <button class="btn btn-primary" on:click={() => socket.emit('start')}>Lancer la partie</button>
      <button on:click={() => socket.emit('purge')}>Purger la salle</button>
    {:else}
    <p>En attente d'autres joueurs...</p>
    {/if}
  {:else}
    <Input name="username" bind:value={$user.name} label="Pseudo" placeholder="Entrez votre pseudo" />
    <button 
      class="btn btn-primary" 
      on:click={handleJoin}
      disabled={!$user.name}>Rejoindre</button>
  {/if}

  {#if players.length}
    <div class="my-3">
      {#each players as player}
        <p>{player}</p>
      {/each}
    </div>
  {/if}
</main>
