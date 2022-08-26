<script>
  import { socket } from '../socket';
  import { goto } from '@roxi/routify';
  import user from '../user';
  import { onMount } from 'svelte';

  let players = [];

  onMount(() => {
    socket.emit('joined').on('joined', (data) => players = data);
  })

  const handleJoin = (data) => {
    user.setName(data.target.username.value);

    socket.emit('join', $user.name);
  }
  
  socket.on('join', (data) => players = [...players, data]);
  socket.on('game_started', () => $goto('/game'))
</script>

<main>
  {#if $user.name}
    <p>En attente du début de partie</p>
  {:else}
    <form on:submit|preventDefault={handleJoin}>
      <input type="text" name="username" placeholder="username">
      <button>Rejoindre</button>
    </form>
  {/if}
  
  <p>Joueurs présents :</p>
  {#each players as player}
  <p>{player}</p>
  {/each}

  {#if players.length > 1}
    <button on:click={() => socket.emit('start')}>Lancer la partie</button>
    <button on:click={() => socket.emit('purge')}>Purger la salle</button>
  {/if}
</main>
