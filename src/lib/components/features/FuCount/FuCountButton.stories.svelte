<script lang="ts" context="module">
  import type { Meta } from "@storybook/svelte";

  import FuCountButton from "./FuCountButton.svelte";

  export const meta: Meta<FuCountButton> = {
    title: "features/Point-Fusuu/FuCountButton",
    component: FuCountButton,
  };
</script>

<script lang="ts">
  import { Story } from "@storybook/addon-svelte-csf";

  let han: number = 0;
  let fu: number = 20;
  let isFuro: boolean = true;

  let fuCountButton: FuCountButton;

  const clearValue = () => {
    han = 0;
    fu = 20;
    fuCountButton.resetItemsStores();
  };
</script>

<Story name="Default">
  <div class="p-4">
    <button class="text-blue-500 font-bold mx-4 mb-2" on:click="{clearValue}"
      >Clear</button
    >
    <div class="mt-4">
      <div>Total Han：{han}</div>
      <div>Total fu：{fu}</div>
      <div>Is Furo：{isFuro ? "Yes" : "No"}</div>
    </div>
    <FuCountButton bind:this="{fuCountButton}" bind:han bind:fu />
  </div>
</Story>
