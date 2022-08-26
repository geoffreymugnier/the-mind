<script>
  import { socket } from '../socket';
  import user from '../user';
  import { goto } from '@roxi/routify';
  import Logs from '../lib/Logs.svelte';

  let level = 1;
  let lives = 5;
  let lastCard = 0;

  socket.on('played', ({ card }) => {
    lastCard = card;
  })

  socket.on('new_round', ({ level: _level, lives: _lives }) => {
    level = _level;
    lives = _lives;
    lastCard = 0;
  })

  socket.on('loose_life', (_lives) => lives = _lives);
  socket.on('game_over', () => {
    $goto('/gameover');
  })
</script>

<div class="flex">
  <h2>🏆 {level}</h2>
  <h2>❤️ {lives}</h2>
</div>
<h1>{lastCard}</h1>
{#if $user.deck.length}
  <div class="deck">
    {#each $user.deck as card, index}
      <div class="deck-card" class:deck-card--min={index == 0}>{card}</div>
    {/each}
  </div>
  <button class="btn-place-card" on:click={() => socket.emit('play')}>Poser la carte</button>
{:else}
  <p>En attente des autres joueurs...</p>
{/if}

<Logs />

<style>
  .flex {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
    gap: 20px;
  }

  .last-placed-card {

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
    opacity: 1;
    background-color: rgb(124, 208, 219);
    color: #fff;
    font-weight: 600;
    font-size: 1.6rem;
  }

  .btn-place-card {
    margin-top: 20px;
  }
</style>