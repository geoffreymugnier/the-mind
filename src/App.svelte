<script>
  import { Router } from "@roxi/routify";
  import { routes } from "../.routify/routes";
  import { onDestroy, onMount } from 'svelte';
  import { socket } from "./socket";
</script>

<Router routes={routes} />