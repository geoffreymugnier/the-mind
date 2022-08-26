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

  const handleJoin = (data) => {
    user.setName(data.target.username.value);

    socket.emit('join', $user.name);
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
  {#if $user.name}
    <p class="text-gray-500">En attente du début de partie...</p>
  {:else}
    <form on:submit|preventDefault={handleJoin}>
      <Input name="username" label="Pseudo" placeholder="Entrez votre pseudo" />
      <button class="btn btn-primary">Rejoindre</button>
    </form>
  {/if}
  
  {#if players.length}
    <div class="my-3">
      {#each players as player}
        <p>{player}</p>
      {/each}
    </div>
  {/if}

  {#if players.length > 1}
    <button class="btn btn-primary" on:click={() => socket.emit('start')}>Lancer la partie</button>
    <button on:click={() => socket.emit('purge')}>Purger la salle</button>
  {/if}
</main>
