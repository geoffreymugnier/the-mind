<script>
  export let players;
</script>

<div class="flex flex-wrap gap-3 justify-center mt-5">
  {#each players as player}
    <div class="text-center">
      <div class="bg-gray-100 font-semibold text-xl rounded-full w-12 h-12 mb-3 mx-auto flex justify-center items-center">
        {player.nbOfCards}
      </div>
      <h5 class="leading-tight font-medium">{player.username}</h5>
    </div>
  {/each}
</div>

<style >
</style>