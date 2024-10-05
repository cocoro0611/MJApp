<script lang="ts">
  import Grid from "../layout/Grid.svelte";
  import CountCard from "./CountCard.svelte";
  import InputCard from "./InputCard.svelte";
  import type { RoomData, ChipData } from "$lib/models/Room/type.js";
  export let chip: ChipData;
  export let room: RoomData;

  export let inputValues: Record<string, number> = {};
  export let selectedChipId: string | null = null;
  export let chipClick: (chip: ChipData, chipId: string) => void = () => {};

  $: totalPoint =
    80 -
    chip.userChips.reduce((sum, userChip) => {
      const input = inputValues[userChip.id] ?? userChip.input ?? 0;
      return sum + input;
    }, 0);

  function handleScoreClick(chipId: string) {
    chipClick(chip, chipId);
  }
</script>

<input type="hidden" name="chipOrder[]" value="{chip.chipOrder}" />
{#each chip.userChips as userChip}
  <input type="hidden" name="id[]" value="{userChip.id}" />
  <input
    type="hidden"
    name="input[]"
    value="{inputValues[userChip.id] ?? userChip.input ?? 0}"
  />
{/each}

<Grid firstContent="{chip.chipOrder === 1}" rightContentes="{chip.userChips}">
  <svelte:fragment slot="leftContent">
    <CountCard
      inputType="chip"
      totalValue="{totalPoint}"
      count="{chip.chipOrder}"
    />
  </svelte:fragment>

  <svelte:fragment slot="rightContent" let:rightContent="{userChip}">
    <InputCard
      inputType="chip"
      isSelected="{selectedChipId === userChip.id}"
      inputValue="{inputValues[userChip.id] ?? userChip.input ?? 0}"
      on:click="{() => handleScoreClick(userChip.id)}"
    />
    <div
      class="flex justify-center text-sm font-bold"
      class:text-blue-500="{userChip.chip >= 20}"
      class:text-red-500="{userChip.chip < 20}"
    >
      {(userChip.chip - 20) * room.chipRate}
    </div>
  </svelte:fragment>
</Grid>
