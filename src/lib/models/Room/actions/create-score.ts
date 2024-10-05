import { v4 } from "uuid";
import db from "$lib/models/db.js";
import type { Action } from "@sveltejs/kit";

export const createScore: Action = async ({ request }) => {
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

    const scores = userIds.map((userId) => ({
      id: v4(),
      input: 0,
      score: 0,
      userId,
    }));
    await trx.insertInto("Score").values(scores).execute();

    const maxScoreOrder = await trx
      .selectFrom("RoomScore")
      .where("roomId", "=", roomId)
      .select(db.fn.max("scoreOrder").as("maxScoreOrder"))
      .executeTakeFirst();
    const newScoreOrder = (maxScoreOrder?.maxScoreOrder || 0) + 1;

    const roomScores = scores.map((score) => ({
      roomId,
      scoreId: score.id,
      scoreOrder: newScoreOrder,
    }));
    await trx.insertInto("RoomScore").values(roomScores).execute();
  });
  return { success: true, type: "create-score" };
};
