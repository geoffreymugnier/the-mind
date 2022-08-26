<script>
  import { socket } from '../socket';
  import user from '../user';
  import room from '../room';
  import { goto } from '@roxi/routify';
  import Logs from '../lib/Logs.svelte';
  import Players from '../lib/Players.svelte';

  socket.on('game_over', () => {
    $goto('/gameover');
  })

  const handleCardClick = (index) => {
    if (index === 0) {
      socket.emit('play');
    }
  }

</script>

<div class="flex justify-center mb-5">
  <h2 class="font-semibold text-2xl">🏆 {$room.level}</h2>
  <h2 class="font-semibold text-2xl">❤️ {$room.lives}</h2>
</div>

<h1 class="border border-red-500 main-card">{$room.lastCard}</h1>
{#if $user.deck.length}
  <div class="deck mt-5">
    {#each $user.deck as card, index}
      <div 
        class="deck-card" 
        class:deck-card--min={index == 0}
        on:click={() => handleCardClick(index)}
        ><span class="transition duration-300 ease-in-out">{card}</span></div>
    {/each}
  </div>
{:else}
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
    opacity: .50;
    border: 1px solid #fafafa;
    background-color: rgb(124, 208, 219);
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
    @apply bg-blue-400;

    &:hover {
      @apply bg-blue-500;

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