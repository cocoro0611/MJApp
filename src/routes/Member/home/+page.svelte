<script lang="ts">
  import Header from "$lib/components/layout/Header.svelte";
  import Main from "$lib/components/layout/Main.svelte";
  import MemberSummary from "$lib/components/features/Member/MemberSummary.svelte";
  import Button from "$lib/components/ui/Button.svelte";
  import { currentPage } from "$lib/utils/page-store.js";

  import type { UserData } from "$lib/models/Member/type.js";
  export let users: UserData[];
</script>

<Header>
  <svelte:fragment slot="center">メンバー一覧</svelte:fragment>
</Header>

<Main>
  <MemberSummary {users} />
</Main>

<Button isPlus on:click="{() => currentPage.set('memberNew')}" />
