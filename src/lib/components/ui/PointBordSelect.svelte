<script lang="ts">
  import { Button, Dropdown, DropdownItem } from "flowbite-svelte";
  import { ChevronDownOutline } from "flowbite-svelte-icons";

  export let fu: number;
  export let fuUp: number = 30;
  export let han: number;

  export let type: "han" | "fu";

  const fuSelectes = [20, 25, 30, 40, 50, 60, 70, 80, 90, 100, 110];
  const hanSelectes = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];

  const fuChange = (newFu: number) => {
    fu = newFu;
  };

  const hanChange = (newHan: number) => {
    han = newHan;
  };
</script>

<!-- FIXME: flowbite-svelteを使わずにつくりたい -->
<div class="flex justify-center gap-4">
  <Button color="light" class="text-blue-500 h-6 w-32 border-white mt-1">
    <div class="flex flex-col items-center {type === 'fu' ? 'mt-5' : ''}">
      <p>{fuUp} 符</p>
      {#if type === "fu"}
        <p>({fu} 符)</p>
      {/if}
    </div>
    <ChevronDownOutline
      class="-mx-2 text-blue-500 {type === 'fu' ? 'ms-0' : 'ms-2'}"
    />
  </Button>
  <Dropdown>
    {#each fuSelectes as fuSelect}
      <DropdownItem class="text-blue-500" on:click="{() => fuChange(fuSelect)}">
        {fuSelect} 符
      </DropdownItem>
    {/each}
  </Dropdown>

  <Button color="light" class="text-blue-500 h-6 w-28 border-white mt-1">
    {han} 翻
    <ChevronDownOutline class="ms-2 text-blue-500 -mx-2" />
  </Button>
  <Dropdown>
    {#each hanSelectes as hanSelect}
      <DropdownItem
        class="text-blue-500"
        on:click="{() => hanChange(hanSelect)}"
      >
        {hanSelect} 翻
      </DropdownItem>
    {/each}
  </Dropdown>
</div>
