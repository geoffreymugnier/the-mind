<script>
  import room from '../room';
  import user from '../user';
  import { socket } from '../socket';

  let displayCloseButton = false;
  let hasVoted = false;

  socket.on("star_vote_failed", (username) => {
    displayCloseButton = true;
  });

  socket.on("star_vote_succeeded", ({ stars, card }) => {
    $room.stars = stars;
    $room.lastCard = card;
    
    room.stopVote();
  });

  const handleVoteYes = () => {
    socket.emit("star_vote", true);
    hasVoted = true;
  }
  const handleVoteNo = () => {
    socket.emit("star_vote", false);
    hasVoted = true;
  }

  if ($user.name === $room.voteStartedBy) {
    handleVoteYes();
  }
</script>

<div class="modal fade fixed top-0 left-0 w-full h-full outline-none overflow-x-hidden overflow-y-auto show"
    id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1"
    aria-labelledby="staticBackdropLabel" >
    <div class="modal-dialog relative w-auto pointer-events-none">
      <div
        class="modal-content border-none shadow-lg relative flex flex-col w-full pointer-events-auto bg-white bg-clip-padding rounded-md outline-none text-current">
        <span class="m-auto w-12 h-12 bg-blue-100 rounded-full p-3">⭐</span>
        <h5 class="text-xl font-medium mt-2 leading-normal text-gray-800" id="exampleModalLabel">
          <b>{$room.voteStartedBy}</b> souhaite utiliser une étoile
        </h5>
         <div class="flex gap-3 text-center m-auto my-5">
            {#each $room.players as player}
              <div class="text-center">
                <div 
                  class:text-green-500={player.hasVoted} 
                  class:text-red-500={!player.hasVoted} 
                  class="bg-gray-100 font-semibold text-xl rounded-full w-12 h-12 mb-3 mx-auto flex justify-center items-center">
                  {player.hasVoted ? '✓' : '✗'}
                </div>
                <h5 class="leading-tight font-medium">
                  {#if player.username == $user.name}
                    Vous
                  {:else}
                    {player.username}
                  {/if}
                </h5>
              </div>
            {/each}
          </div>
        <div
        class="modal-footer flex flex-shrink-0 flex-wrap items-center justify-center gap-3 p-4">
        {#if displayCloseButton}
          <button type="button" class="btn btn-default" data-bs-dismiss="modal" on:click={room.stopVote}>Et bah d'accord !</button>
        {:else if !hasVoted}
          <button type="button" class="btn btn-primary w-full" on:click={handleVoteYes}>Oui, utiliser l'étoile</button>
          <button type="button" class="btn btn-danger w-full" on:click={handleVoteNo}>Non, {$room.voteStartedBy} est une petite frappe</button>
          {/if}
        </div>
      </div>
    </div>
  </div>