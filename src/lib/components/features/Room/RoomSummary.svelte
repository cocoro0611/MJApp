<script lang="ts">
  import RoomCard from "$lib/components/card/RoomCard.svelte";
  import { saveLocalData } from "$lib/utils/local-storage.js";
  import { currentPage } from "$lib/utils/page-store.js";

  import type { RoomData } from "$lib/models/Room/type.js";
  export let rooms: RoomData[];

  const selectedRoom = (room: RoomData) => {
    saveLocalData("roomId", room.id);
    currentPage.set("roomDetail");
  };
</script>

{#each rooms as room}
  <div class="flex justify-center py-2">
    <RoomCard {room} on:click="{() => selectedRoom(room)}" />
  </div>
{/each}
