<script lang="ts">
  import RoomHome from "./home/+page.svelte";
  import RoomNew from "./new/+page.svelte";
  import RoomEdit from "./edit/+page.svelte";
  import RoomUserEdit from "./user-edit/+page.svelte";
  import RoomDetail from "./detail/+page.svelte";
  import RoomTie from "./tie/+page.svelte";
  import { currentPage } from "$lib/utils/page-store.js";
  import { getLocalData } from "$lib/utils/local-storage.js";

  import type { UserData } from "$lib/models/Member/type.js";
  import type { RoomData, ScoreData, ChipData } from "$lib/models/Room/type.js";
  export let users: UserData[];
  export let rooms: RoomData[];
  export let scores: ScoreData[];
  export let chips: ChipData[];

  $: selectedRoom =
    $currentPage === "roomEdit" ||
    $currentPage === "roomDetail" ||
    $currentPage === "roomTie"
      ? rooms.find((room) => room.id === getLocalData("roomId")) || null
      : null;
  $: selectedRoomUser =
    $currentPage === "roomUserEdit"
      ? users.find((user) => user.id === getLocalData("userId")) || null
      : null;

  $: selectedRoomScore =
    $currentPage === "roomTie"
      ? scores.find((score) =>
          score.userScores.some(
            (userScore) => userScore.id === getLocalData("scoreId")
          )
        ) || null
      : null;
</script>

{#if $currentPage === "room"}
  <RoomHome {rooms} {users}></RoomHome>
{:else if $currentPage === "roomNew"}
  <RoomNew {users} />
{:else if $currentPage === "roomEdit" && selectedRoom}
  <RoomEdit room="{selectedRoom}" />
{:else if $currentPage === "roomUserEdit" && selectedRoomUser}
  <RoomUserEdit user="{selectedRoomUser}" />
{:else if $currentPage === "roomDetail" && selectedRoom}
  <RoomDetail {scores} {chips} room="{selectedRoom}" />
{:else if $currentPage === "roomTie" && selectedRoom && selectedRoomScore}
  <!-- TODO:同順位ページの作成 -->
  <RoomTie score="{selectedRoomScore}" room="{selectedRoom}" />
{/if}
