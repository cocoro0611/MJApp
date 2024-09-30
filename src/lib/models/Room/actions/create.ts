import { v4 } from "uuid";
import db from "$lib/models/db.js";
import type { Action } from "@sveltejs/kit";

export const createRoom: Action = async ({ request }) => {
  await db.transaction().execute(async (trx) => {
    const data = await request.formData();

    const roomForm = {
      id: v4(),
      name: data.get("name"),
      initialPoint: data.get("initialPoint"),
      returnPoint: data.get("returnPoint"),
      bonusPoint: data.get("bonusPoint"),
      scoreRate: data.get("scoreRate"),
      chipRate: data.get("chipRate"),
      gameAmount: 0,
    };
    await trx.insertInto("Room").values(roomForm).execute();

    const userIds = data.getAll("userId");
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
};

export const createScore: Action = async ({ request }) => {
  await db.transaction().execute(async (trx) => {
    const data = await request.formData();
    const roomId = data.get("roomId");

    const maxGameCount = await trx
      .selectFrom("Score")
      .where("roomId", "=", roomId)
      .select(db.fn.max("gameCount").as("maxGameCount"))
      .executeTakeFirst();
    const gameCount = (maxGameCount?.maxGameCount || 1) + 1;

    const users = await trx
      .selectFrom("User")
      .innerJoin("RoomUser", "User.id", "RoomUser.userId")
      .where("RoomUser.roomId", "=", roomId)
      .select("User.id")
      .execute();
    const userIds = users.map((user) => user.id);

    const ScoreForm = userIds.map((userId) => ({
      id: v4(),
      input: 0,
      score: 0,
      gameCount,
      userId,
      roomId,
    }));
    await trx.insertInto("Score").values(ScoreForm).execute();
  });
};

export const createChip: Action = async ({ request }) => {
  await db.transaction().execute(async (trx) => {
    const data = await request.formData();
    const roomId = data.get("roomId");
    const userIds = data.getAll("userId");
    const chipCount = data.get("chipCount");

    const ChipForm = userIds.map((userId) => ({
      id: v4(),
      input: 0,
      chip: 0,
      chipCount,
      userId,
      roomId,
    }));
    await trx.insertInto("Chip").values(ChipForm).execute();
  });
};
