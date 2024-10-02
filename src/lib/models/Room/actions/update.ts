import db from "$lib/models/db.js";
import type { Action } from "@sveltejs/kit";
import dayjs from "dayjs";

export const updateRoom: Action = async ({ request }) => {
  const data = await request.formData();
  const id = data.get("id");

  await db.transaction().execute(async (trx) => {
    const getRoom = await trx
      .selectFrom("Room")
      .select(["name"])
      .where("id", "=", id)
      .executeTakeFirst();

    const updateData = {
      name: getRoom?.name,
      initialPoint: data.get("initialPoint"),
      returnPoint: data.get("returnPoint"),
      bonusPoint: data.get("bonusPoint"),
      scoreRate: data.get("scoreRate"),
      chipRate: data.get("chipRate"),
      gameAmount: data.get("gameAmount"),
      updatedAt: dayjs().toDate(),
    };

    await trx
      .updateTable("Room")
      .set(updateData)
      .where("id", "=", id)
      .execute();
  });
  return { success: true, type: "update-room" };
};

export const updateRoomUser: Action = async ({ request }) => {
  const data = await request.formData();
  const id = data.get("id");

  const updateData = {
    name: data.get("name"),
    icon: data.get("icon"),
    updatedAt: dayjs().toDate(),
  };
  await db.updateTable("User").set(updateData).where("id", "=", id).execute();
  return { success: true, type: "update-room-user" };
};

export const updateScore: Action = async ({ request }) => {
  const data = await request.formData();
  const roomId = data.get("roomId");
  const selectedScoreId = data.get("selectedScoreId");
  const gameCounts = data.getAll("gameCount[]");
  const ids = data.getAll("id[]");
  const inputs = data.getAll("input[]");

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
  for (let i = 0; i < gameCounts.length; i++) {
    const gameCount = gameCounts[i];
    const userCount = 4;

    let gameScores = [];
    for (let j = 0; j < userCount; j++) {
      const id = ids[currentIndex];
      const input = Number(inputs[currentIndex]);
      const baseScore = Math.round((input - Number(returnPoint) / 100) / 10);
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
        await db
          .updateTable("Score")
          .set(updateData)
          .where("id", "=", id)
          .where("roomId", "=", roomId)
          .where("gameCount", "=", gameCount)
          .execute();
      }
    }
  }
  return { success: true, type: "update-score" };
};

export const updateChip: Action = async ({ request }) => {
  const data = await request.formData();
  const roomId = data.get("roomId");
  const chipCounts = data.getAll("chipCount[]");
  const ids = data.getAll("id[]");
  const inputs = data.getAll("input[]");

  let currentIndex = 0;
  for (let i = 0; i < chipCounts.length; i++) {
    const chipCount = chipCounts[i];
    const userCount = 4;

    for (let j = 0; j < userCount; j++) {
      const id = ids[currentIndex];
      const input = inputs[currentIndex];

      const updateData = {
        input: Number(input),
        chip: Number(input),
        updatedAt: dayjs().toDate(),
      };

      await db
        .updateTable("Chip")
        .set(updateData)
        .where("id", "=", id)
        .where("roomId", "=", roomId)
        .where("chipCount", "=", chipCount)
        .execute();

      currentIndex++;
    }
  }
  return { success: true, type: "update-chip" };
};
