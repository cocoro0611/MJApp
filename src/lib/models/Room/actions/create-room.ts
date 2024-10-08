import { v4 } from "uuid";
import db from "$lib/models/db.js";
import type { Action } from "@sveltejs/kit";

export const createRoom: Action = async ({ request }) => {
  let createdRoomId: string | null = null;
  await db.transaction().execute(async (trx) => {
    const data = await request.formData();

    const roomForm = {
      id: data.get("id") as string,
      name: data.get("name"),
      initialPoint: data.get("initialPoint"),
      returnPoint: data.get("returnPoint"),
      bonusPoint: data.get("bonusPoint"),
      scoreRate: data.get("scoreRate"),
      chipRate: data.get("chipRate"),
      gameAmount: 0,
    };
    await trx.insertInto("Room").values(roomForm).execute();
    createdRoomId = roomForm.id;

    const userIds = data.getAll("userId");

    await trx.updateTable("User").set({ isDefault: false }).execute();
    await trx
      .updateTable("User")
      .set({ isDefault: true })
      .where("id", "in", userIds)
      .execute();

    const roomUsers = userIds.map((userId, index) => ({
      userId,
      roomId: roomForm.id,
      order: index + 1,
    }));
    await trx.insertInto("RoomUser").values(roomUsers).execute();

    const initialScore = userIds.map((userId) => ({
      id: v4(),
      input: 0,
      score: 0,
      gameCount: 1,
      userId,
      roomId: roomForm.id,
    }));
    await trx.insertInto("Score").values(initialScore).execute();
  });
  return { success: true, type: "create-room", roomId: createdRoomId };
};
