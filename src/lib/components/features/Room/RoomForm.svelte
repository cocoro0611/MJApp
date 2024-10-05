<script lang="ts">
  import { v4 } from "uuid";
  import dayjs from "dayjs";
  import Form from "$lib/components/layout/Form.svelte";
  import FormField from "$lib/components/layout/FormField.svelte";
  import InputForm from "$lib/components/form/InputForm.svelte";
  import RoomMemberForm from "$lib/components/form/RoomMemberForm.svelte";
  import RoomSettingForm from "$lib/components/form/RoomSettingForm.svelte";

  import type { UserData } from "$lib/models/Member/type.js";
  import type { RoomData } from "$lib/models/Room/type.js";

  export let users: UserData[] = [
    {
      id: "",
      name: "",
      icon: "",
      isDefault: false,
    },
  ];
  export let room: RoomData = {
    id: v4(),
    name: `${dayjs().format("YYYY/MM/DD")}`,
    initialPoint: 25000,
    returnPoint: 30000,
    bonusPoint: "10-30",
    scoreRate: 50,
    chipRate: 100,
    gameAmount: 0,
    users: [
      {
        id: "",
        name: "",
        icon: "",
        isDefault: false,
        totalScore: 0,
        totalChip: 0,
        totalPoint: 0,
      },
    ],
  };

  export let action = "";

  $: isCreate = action === "?/create-room";
  $: isUpdate = action === "?/update-room";

  const updateRoomName = (event: CustomEvent<string>) => {
    room.name = event.detail;
  };

  const updateGameAmount = (event: CustomEvent<number>) => {
    room.gameAmount = event.detail;
  };
</script>

<Form {action}>
  <input type="hidden" name="id" value="{room.id}" />
  {#if isCreate}
    <FormField name="部屋名">
      <InputForm
        name="name"
        placeholder="部屋名を入力"
        bind:value="{room.name}"
        on:input="{updateRoomName}"
        maxlength="{10}"
      />
    </FormField>
    <FormField name="">
      <RoomMemberForm {users} />
    </FormField>
  {/if}
  <FormField name="">
    <RoomSettingForm {room} />
  </FormField>
  {#if isUpdate}
    <FormField name="場代">
      <InputForm
        type="number"
        name="gameAmount"
        placeholder="金額を入力"
        bind:value="{room.gameAmount}"
        on:input="{updateGameAmount}"
      >
        <span slot="left" class="text-gray-500">¥</span>
      </InputForm>
    </FormField>
  {/if}
</Form>
