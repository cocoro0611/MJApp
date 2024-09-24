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
      gameRate: data.get("gameRate"),
      chipValue: data.get("chipValue"),
    };
    await trx.insertInto("Room").values(roomForm).execute();

    const userIds = data.getAll("userId");
    const roomUsers = userIds.map((userId, index) => ({
      userId,
      roomId: roomForm.id,
      order: index + 1,
    }));
    await trx.insertInto("RoomUser").values(roomUsers).execute();
  });
};

// export const createScore: Action = async ({ request }) => {
//   await db.transaction().execute(async (trx) => {
//     const data = await request.formData();
//     const roomId = data.get("roomId") as string;
//     const scoreOrder = parseInt(data.get("scoreOrder") as string);
//     const scores = data.getAll("score");
//     const chips = data.getAll("chip");
//     const userIds = data.getAll("userId");

//     // 各ユーザーのスコアとチップを保存
//     for (let i = 0; i < userIds.length; i++) {
//       const scoreData = {
//         id: v4(),
//         roomId: roomId,
//         userId: userIds[i] as string,
//         score: parseInt(scores[i] as string) || null,
//         chip: parseInt(chips[i] as string) || null,
//         createdAt: dayjs().toDate(),
//         order: scoreOrder,
//       };

//       await trx.insertInto("Score").values(scoreData).execute();
//     }
//   });
//   return { success: true };
// };
