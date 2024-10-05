<script lang="ts">
  import Header from "$lib/components/layout/Header.svelte";
  import Main from "$lib/components/layout/Main.svelte";
  import Icon from "$lib/components/ui/Icon.svelte";

  import { currentPage } from "$lib/utils/page-store.js";
  import type { RoomData, ScoreData } from "$lib/models/Room/type.js";

  export let room: RoomData;
  export let score: ScoreData;
</script>

<Header>
  <svelte:fragment slot="left">
    <Icon iconType="back" on:click="{() => ($currentPage = 'roomDetail')}" />
  </svelte:fragment>
  <svelte:fragment slot="center">{room.name}</svelte:fragment>
</Header>

<Main
  >順位を選択してください
  {score.roomId}
  {score.scoreOrder}
  {#each score.userScores as userScore}
    {userScore.id}
    {userScore.input}
    {userScore.score}
    {userScore.userId}
  {/each}
</Main>
