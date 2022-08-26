<script>
  import { socket } from '../socket';

  let logs = [];

  socket.on('new_round', ({ level }) => {
    logs = [{
      message: `🏆 <b>Vous passez au niveau ${level} !</b>`,
      type: "success"
    }, ...logs]
  })

  socket.on('loose_life', () => {
    logs = [{
      message: `💔 <b>Vous perdez une vie</b>`,
      type: "error"
    }, ...logs]
  });

  socket.on('log', ({ message, type }) => {
    logs = [{
      message,
      type
    }, ...logs];
  })
</script>

<div class="logs">
  {#each logs as { message, type }}
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

  .logs .log {
    margin: 0 5px;
    border-radius: 10px;
  }

  .bg-success {
    background-color: rgb(211, 255, 200);
  }
  .bg-error {
    background-color: rgb(255, 137, 137);
  }
</style>