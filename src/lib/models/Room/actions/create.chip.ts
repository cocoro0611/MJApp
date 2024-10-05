import { v4 } from "uuid";
import db from "$lib/models/db.js";
import type { Action } from "@sveltejs/kit";

export const createChip: Action = async ({ request }) => {
  await db.transaction().execute(async (trx) => {
    const data = await request.formData();
    const roomId = data.get("roomId");

    const users = await trx
      .selectFrom("User")
      .innerJoin("RoomUser", "User.id", "RoomUser.userId")
      .where("RoomUser.roomId", "=", roomId)
      .select("User.id")
      .execute();
    const userIds = users.map((user) => user.id);

    const chips = userIds.map((userId) => ({
      id: v4(),
      input: 0,
      chip: 0,
      userId,
    }));
    await trx.insertInto("Chip").values(chips).execute();

    const maxChipOrder = await trx
      .selectFrom("RoomChip")
      .where("roomId", "=", roomId)
      .select(db.fn.max("chipOrder").as("maxChipOrder"))
      .executeTakeFirst();
    const newChipOrder = (maxChipOrder?.maxChipOrder || 0) + 1;

    const roomChips = chips.map((chip) => ({
      roomId,
      chipId: chip.id,
      chipOrder: newChipOrder,
    }));
    await trx.insertInto("RoomChip").values(roomChips).execute();
  });
  return { success: true, type: "create-chip" };
};
