<script lang="ts">
  import Grid from "../layout/Grid.svelte";
  import CountCard from "./CountCard.svelte";
  import InputCard from "./InputCard.svelte";
  import type { RoomData, ScoreData } from "$lib/models/Room/type.js";
  import { saveLocalData } from "$lib/utils/local-storage.js";
  export let score: ScoreData;
  export let room: RoomData;

  export let inputValues: Record<string, number> = {};
  export let selectedScoreId: string | null = null;
  export let scoreClick: (score: ScoreData, scoreId: string) => void = () => {};

  let initialTotalPoint: number = room.initialPoint * 4;
  $: totalPoint =
    initialTotalPoint -
    score.userScores.reduce((sum, userScore) => {
      const input = inputValues[userScore.id] ?? userScore.input ?? 0;
      return sum + input * 100;
    }, 0);

  function handleScoreClick(scoreId: string) {
    scoreClick(score, scoreId);
    saveLocalData("scoreId", scoreId);
  }
</script>

<input type="hidden" name="scoreOrder[]" value="{score.scoreOrder}" />
<input type="hidden" name="selectedScoreId" value="{selectedScoreId}" />
{#each score.userScores as userScore}
  <input type="hidden" name="id[]" value="{userScore.id}" />
  <input
    type="hidden"
    name="input[]"
    value="{inputValues[userScore.id] ?? userScore.input ?? 0}"
  />
{/each}

<Grid
  firstContent="{score.scoreOrder === 1}"
  rightContentes="{score.userScores}"
>
  <svelte:fragment slot="leftContent">
    <CountCard totalValue="{totalPoint}" count="{score.scoreOrder}" />
  </svelte:fragment>

  <svelte:fragment slot="rightContent" let:rightContent="{userScore}">
    <InputCard
      isSelected="{selectedScoreId === userScore.id}"
      inputValue="{inputValues[userScore.id] ?? userScore.input ?? 0}"
      on:click="{() => handleScoreClick(userScore.id)}"
    />
    <div
      class="flex justify-center text-sm font-bold"
      class:text-blue-500="{userScore.score >= 0}"
      class:text-red-500="{userScore.score < 0}"
    >
      {userScore.score}
    </div>
  </svelte:fragment>
</Grid>
