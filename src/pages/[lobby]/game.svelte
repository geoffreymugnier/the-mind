<script>
  import { socket } from '../../socket';
  import user from '../../user';
  import room from '../../room';
  import { goto } from '@roxi/routify';
  import Logs from '../../lib/Logs.svelte';
  import Players from '../../lib/Players.svelte';
  import StarModal from '../../lib/StarModal.svelte';
  import logs from '../../logs';
  import { scale } from 'svelte/transition';

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

{#key $room.lastCard}
  <h1 in:scale class="border border-red-500 main-card">
    {$room.lastCard}
  </h1>
{/key}

{#if $user.deck.length}
  <div class="deck mt-5">
    {#each $user.deck as card, index}
      <div 
        class="deck-card" 
        class:deck-card--min={index == 0}
        on:click={() => handleCardClick(index)}
      >
        <span class="transition duration-200 ease-in-out">{card}</span>
        <span class="absolute top-2 right-2 text-sm">{card}</span>
      </div>
    {/each}
  </div>
{:else}
  <div class="deck">
    <p class="mt-5">Bien joué, vous avez placé toutes vos cartes !</p>
  </div>
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
    position: fixed;
    display: flex;
    bottom: 1.5em;
    left: 0;
    width: 100%;
    justify-content: center;
  }

  .deck-card {
    position: absolute;
    @apply bg-gray-700;
    box-shadow: 1px 1px 1px rgba(0, 0, 0, 0.2);
    color: #fff;
    border-radius: 6px;
    height: 115px;
    width: 68px;
    display: flex;
    justify-content: center;
    align-items: center;
    transform: translate(38px, 16px);
    rotate: 3deg;
  }

  .deck .deck-card:nth-child(2) {
    z-index: 1;
    transform: translate(38px, 16px);
    rotate: 3deg;
  }

  .deck .deck-card:nth-child(3) {
    z-index: 0;
    transform: translate(65px, 10px);
    rotate: 8deg;
  }

  .deck .deck-card:nth-child(1) {
    box-shadow: 1px 1px 10px rgba(0, 0, 0, 0.6);

    @apply bg-gray-900 transition duration-200 ease-in-out;

    &:hover {
      @apply bg-gray-600;

      span {
        @apply scale-125;
      }
    }
    
    color: #fff;
    font-weight: 600;
    font-size: 2em;
    cursor: pointer;
    height: 135px;
    width: 85px;
    transform: none;
    position: static;
    z-index: 2;
    rotate: 0deg;
  }

  .main-card {
    border: 1px solid #fafafa;
    background-color: rgb(255 197 66);
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