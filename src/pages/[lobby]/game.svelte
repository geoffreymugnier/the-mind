<script>
  import { socket } from '../../socket';
  import user from '../../user';
  import room from '../../room';
  import { goto } from '@roxi/routify';
  import Logs from '../../lib/Logs.svelte';
  import Players from '../../lib/Players.svelte';
  import StarModal from '../../lib/StarModal.svelte';
  import logs from '../../logs';

  export let lobby;
  
  socket.on('game_over', () => {
    $goto(`/${lobby}/gameover`);
  })

  socket.on('game_won', () => {
    $goto(`/${lobby}/victory`);
  })

  const handleCardClick = (index) => {
    if (index === 0) {
      socket.emit('play');
    }
  }

  const handleStartVote = () => {
    if ($room.stars >= 1) {
      socket.emit("start_star_vote", $user.name);
    }
  }

  $: canUseStar = () => {
    return $room.stars > 0 && $room.level > 1 && $room.players.every(player => player.nbOfCards > 0);
  }
</script>

<div class="fixed top-20 left-0 w-full">
  {#each $logs.lastLogs as lastLogMessage}
    <p>{@html lastLogMessage.message}</p>
  {/each}
</div>

{#if $room.voting}
  <StarModal />
{/if}

<div class="fixed top-0 left-0 w-full flex justify-center mb-5">
  <h2 class="font-semibold text-2xl">🏆 {$room.level}</h2>
  <h2 class="font-semibold text-2xl">❤️ {$room.lives}</h2>
  <button class="btn" class:btn-primary={canUseStar()} disabled={!canUseStar()} on:click={handleStartVote}>
    <span class="font-semibold text-2xl">⭐ {$room.stars}</span>
  </button>
</div>

<h1 class="border border-red-500 main-card">{$room.lastCard}</h1>
{#if $user.deck.length}
  <div class="deck mt-5">
    {#each $user.deck as card, index}
      <div 
        class="deck-card" 
        class:deck-card--min={index == 0}
        on:click={() => handleCardClick(index)}
        ><span class="transition duration-200 ease-in-out">{card}</span></div>
    {/each}
  </div>
{:else}
  <p class="mt-5">Bien joué, vous avez placé toutes vos cartes !</p>
  <p>En attente des autres joueurs...</p>
{/if}

<Players players={$room.players} />

<Logs />

<style lang="scss">
  .flex {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
    gap: 20px;
  }

  .deck {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
  }

  .deck-card {
    @apply bg-indigo-700;
    opacity: .50;
    border: 1px solid #fafafa;
    color: #fff;
    border-radius: 6px;
    height: 100px;
    width: 64px;
    margin: auto;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .deck-card--min {
    @apply bg-indigo-700 transition duration-200 ease-in-out;

    &:hover {
      @apply bg-indigo-500;

      span {
        @apply scale-125;
      }
    }
    opacity: 1;
    color: #fff;
    font-weight: 600;
    font-size: 1.5rem;
    cursor: pointer;
  }

  .main-card {
    border: 1px solid #fafafa;
    background-color: rgb(39, 180, 67);
    color: #fff;
    border-radius: 6px;
    height: 130px;
    width: 85px;
    margin: auto;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .btn-place-card {
    margin-top: 20px;
  }
</style>