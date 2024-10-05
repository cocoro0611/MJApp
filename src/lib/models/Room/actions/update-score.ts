import db from "$lib/models/db.js";
import type { Action } from "@sveltejs/kit";
import dayjs from "dayjs";

export const updateScore: Action = async ({ request }) => {
  const data = await request.formData();
  const roomId = data.get("roomId");
  const scoreOrders = data.getAll("scoreOrder[]");
  const ids = data.getAll("id[]");
  const inputs = data.getAll("input[]");
  const selectedScoreId = data.get("selectedScoreId");

  const room = await db
    .selectFrom("Room")
    .where("id", "=", roomId)
    .select(["initialPoint", "returnPoint", "bonusPoint"])
    .executeTakeFirst();
  if (!room) {
    throw new Error("Room not found");
  }
  const { initialPoint, returnPoint, bonusPoint } = room;

  const oka = ((Number(returnPoint) - Number(initialPoint)) * 4) / 1000;
  const umaLow = Number(bonusPoint?.slice(0, 2));
  const umaHigh = Number(bonusPoint?.slice(3, 5));

  const umaList = [umaHigh, umaLow, -umaLow, -umaHigh];

  let currentIndex = 0;
  for (const scoreOrder of scoreOrders) {
    const userCount = 4;
    let gameScores = [];
    for (let j = 0; j < userCount; j++) {
      const id = ids[currentIndex];
      const input = inputs[currentIndex];
      const baseScore = Math.round(
        (Number(input) - Number(returnPoint) / 100) / 10
      );
      gameScores.push({ id, input, baseScore });
      currentIndex++;
    }

    if (gameScores.some((score) => score.id === selectedScoreId)) {
      gameScores.sort((a, b) => b.baseScore - a.baseScore);

      // 同点チェック
      const hasTie = gameScores.some(
        (score, index, array) =>
          index > 0 && score.baseScore === array[index - 1].baseScore
      );

      if (hasTie) {
        return { success: true, type: "tie-score" };
      }

      await db.transaction().execute(async (trx) => {
        for (let j = 0; j < userCount; j++) {
          const { id, input, baseScore } = gameScores[j];
          let finalScore = baseScore + umaList[j];

          if (j === 0) {
            finalScore += oka;
          }

          const updateData = {
            input: input,
            score: Math.round(finalScore),
            updatedAt: dayjs().toDate(),
          };

          await trx
            .updateTable("Score")
            .set(updateData)
            .where("id", "=", id)
            .execute();

          // RoomScoreのscoreOrderも更新
          await trx
            .updateTable("RoomScore")
            .set({ scoreOrder: scoreOrder })
            .where("roomId", "=", roomId)
            .where("scoreId", "=", id)
            .execute();
        }
      });

      break; // 選択されたスコアの更新が完了したらループを抜ける
    }
  }

  return { success: true, type: "update-score" };
};
