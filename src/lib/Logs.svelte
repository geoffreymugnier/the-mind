<script>
  import room from '../room';
  import { socket } from '../socket';

  const changeBackgroundAccordingToAction = (actionType) => {
    let color = '';

    switch (actionType) {
      case 'successful_play':
        color = "rgb(181 255 204)";
        break;
      case 'error':
        color = "rgb(255 171 171)";
        break;
    }
    
    document.body.style.backgroundColor = color;
    
    setTimeout(() => {
      document.body.style.removeProperty('background-color');
    }, 300);
  }

  socket.on("star_vote_failed", (username) => {
    room.pushToLogs({
      message: `⭐ <b>${username}</b> a refusé d'utiliser une étoile`,
    });
  });

  socket.on("star_vote_succeeded", () => {
    room.pushToLogs({
      message: `⭐ <b>Une étoile a été utilisée</b>`,
      type: 'star'
    });
  });

  socket.on('new_round', ({ level }) => {
    room.pushToLogs({
      message: `🏆 <b>Vous passez au niveau ${level} !</b>`,
      type: "success"
    });
  })

  socket.on('loose_life', () => {
    room.pushToLogs({
      message: `💔 <b>Vous perdez une vie</b>`,
      type: "error"
    });
  });

  socket.on('log', ({ message, type }) => {
    room.pushToLogs({
      message,
      type
    });
    
    changeBackgroundAccordingToAction(type);
  })
</script>

<div class="offcanvas offcanvas-end fixed bottom-0 flex flex-col max-w-full bg-white invisible bg-clip-padding shadow-sm outline-none transition duration-300 ease-in-out text-gray-700 top-0 right-0 border-none w-96" tabindex="-1" id="offcanvasRight" aria-labelledby="offcanvasRightLabel">
  <div class="offcanvas-header flex items-center justify-between p-4">
    <h5 class="offcanvas-title mb-0 leading-normal font-semibold" id="offcanvasRightLabel">Historique</h5>
    <button type="button" class="btn-close box-content w-4 h-4 p-2 -my-5 -mr-2 text-black border-none rounded-none opacity-50 focus:shadow-none focus:outline-none focus:opacity-100 hover:text-black hover:opacity-75 hover:no-underline" data-bs-dismiss="offcanvas" aria-label="Close"></button>
  </div>
  <div class="offcanvas-body flex-grow p-4 overflow-y-auto">
    {#each $room.logs as { message, type }}
      <div class="log bg-{type}">
        <p>{@html message}</p>
      </div>
    {/each}
  </div>
</div>

<div class="logs hidden lg:block">
  {#each $room.logs as { message, type }}
    <div class="log bg-{type}">
      <p>{@html message}</p>
    </div>
  {/each}
</div>

<style>
  .logs {    
    position: absolute;
    top: 0;
    background-color: #fafafa;
    right: 0;
    width: 250px;
    height: 100%;
    font-weight: 500;
    font-size: .9em;
  }

  .log {
    @apply mb-1;
    margin: 0 5px;
    border-radius: 10px;
  }

  .bg-success {
    background-color: rgb(211, 255, 200);
  }
  .bg-error {
    background-color: rgb(255, 137, 137);
  }
  
  .bg-star {
    @apply bg-indigo-300;
  }
</style>