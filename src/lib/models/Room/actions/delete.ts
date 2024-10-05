import db from "$lib/models/db.js";
import type { Action } from "@sveltejs/kit";

export const deleteRoom: Action = async ({ request }) => {
  const data = await request.formData();
  const id = data.get("roomId");

  await db.transaction().execute(async (trx) => {
    const roomScores = await trx
      .selectFrom("RoomScore")
      .select("scoreId")
      .where("roomId", "=", id)
      .execute();

    const roomChips = await trx
      .selectFrom("RoomChip")
      .select("chipId")
      .where("roomId", "=", id)
      .execute();

    const scoreIds = roomScores.map((rs) => rs.scoreId);
    const chipIds = roomChips.map((rc) => rc.chipId);

    await trx.deleteFrom("RoomScore").where("roomId", "=", id).execute();

    await trx.deleteFrom("RoomChip").where("roomId", "=", id).execute();

    if (scoreIds.length > 0) {
      await trx.deleteFrom("Score").where("id", "in", scoreIds).execute();
    }

    if (chipIds.length > 0) {
      await trx.deleteFrom("Chip").where("id", "in", chipIds).execute();
    }

    await trx.deleteFrom("RoomUser").where("roomId", "=", id).execute();

    await trx.deleteFrom("Room").where("id", "=", id).execute();
  });

  return { success: true, type: "delete-room" };
};

export const deleteScore: Action = async ({ request }) => {
  const data = await request.formData();
  const id = data.get("id");

  await db.deleteFrom("Score").where("id", "=", id).execute();
  return { success: true };
};

export const deleteChip: Action = async ({ request }) => {
  const data = await request.formData();
  const id = data.get("id");

  await db.deleteFrom("Chip").where("id", "=", id).execute();
  return { success: true };
};
