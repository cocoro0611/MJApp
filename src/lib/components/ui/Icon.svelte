<script lang="ts" context="module">
  export type IconType =
    | "close"
    | "back"
    | "delete"
    | "room"
    | "user"
    | "calculator"
    | "calculatorFilled"
    | "refresh";
</script>

<script lang="ts">
  export let iconType: IconType;
</script>

<button type="button" on:click>
  {#if iconType === "back"}
    <svg
      xmlns="http://www.w3.org/2000/svg"
      class="h-6 w-6"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M15 19l-7-7 7-7"
      ></path>
    </svg>
  {/if}

  {#if iconType === "refresh"}
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      class="icon icon-tabler icons-tabler-outline icon-tabler-refresh"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
      <path d="M20 11a8.1 8.1 0 0 0 -15.5 -2m-.5 -4v4h4"></path>
      <path d="M4 13a8.1 8.1 0 0 0 15.5 2m.5 4v-4h-4"></path>
    </svg>
  {/if}

  {#if iconType === "delete"}
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      class="icon icon-tabler icons-tabler-outline icon-tabler-trash"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
      <path d="M4 7l16 0"></path>
      <path d="M10 11l0 6"></path>
      <path d="M14 11l0 6"></path>
      <path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12"></path>
      <path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3"></path>
    </svg>
  {/if}

  {#if iconType === "room"}
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      class="icon icon-tabler icons-tabler-outline icon-tabler-home isFooterIcon"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
      <path d="M5 12l-2 0l9 -9l9 9l-2 0"></path>
      <path d="M5 12v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-7"></path>
      <path d="M9 21v-6a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v6"></path>
    </svg>
  {/if}

  {#if iconType === "user"}
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      class="icon icon-tabler icons-tabler-outline icon-tabler-user isFooterIcon"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
      <path d="M8 7a4 4 0 1 0 8 0a4 4 0 0 0 -8 0"></path>
      <path d="M6 21v-2a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v2"></path>
    </svg>
  {/if}

  {#if iconType === "calculator"}
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      class="icon icon-tabler icons-tabler-outline icon-tabler-calculator isFooterIcon"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
      <path
        d="M4 3m0 2a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v14a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2z"
      ></path>
      <path
        d="M8 7m0 1a1 1 0 0 1 1 -1h6a1 1 0 0 1 1 1v1a1 1 0 0 1 -1 1h-6a1 1 0 0 1 -1 -1z"
      ></path>
      <path d="M8 14l0 .01"></path>
      <path d="M12 14l0 .01"></path>
      <path d="M16 14l0 .01"></path>
      <path d="M8 17l0 .01"></path>
      <path d="M12 17l0 .01"></path>
      <path d="M16 17l0 .01"></path>
    </svg>
  {/if}

  {#if iconType === "calculatorFilled"}
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="currentColor"
      class="icon icon-tabler icons-tabler-filled icon-tabler-calculator isFooterIcon"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
      <path
        d="M18 2a3 3 0 0 1 3 3v14a3 3 0 0 1 -3 3h-12a3 3 0 0 1 -3 -3v-14a3 3 0 0 1 3 -3zm-10 15a1 1 0 0 0 -1 1l.007 .127a1 1 0 0 0 1.993 -.117l-.007 -.127a1 1 0 0 0 -.993 -.883zm4 0a1 1 0 0 0 -1 1l.007 .127a1 1 0 0 0 1.993 -.117l-.007 -.127a1 1 0 0 0 -.993 -.883zm4 0a1 1 0 0 0 -1 1l.007 .127a1 1 0 0 0 1.993 -.117l-.007 -.127a1 1 0 0 0 -.993 -.883zm-8 -4a1 1 0 0 0 -1 1l.007 .127a1 1 0 0 0 1.993 -.117l-.007 -.127a1 1 0 0 0 -.993 -.883zm4 0a1 1 0 0 0 -1 1l.007 .127a1 1 0 0 0 1.993 -.117l-.007 -.127a1 1 0 0 0 -.993 -.883zm4 0a1 1 0 0 0 -1 1l.007 .127a1 1 0 0 0 1.993 -.117l-.007 -.127a1 1 0 0 0 -.993 -.883zm-1 -7h-6a2 2 0 0 0 -2 2v1a2 2 0 0 0 2 2h6a2 2 0 0 0 2 -2v-1a2 2 0 0 0 -2 -2z"
      ></path>
    </svg>
  {/if}
</button>

<style>
  .isFooterIcon {
    @apply w-8 h-8;
  }
</style>
