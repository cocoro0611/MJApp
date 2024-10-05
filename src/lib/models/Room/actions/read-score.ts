import db from "$lib/models/db.js";
import type { ScoreData } from "../type.js";

export async function readScores(): Promise<ScoreData[]> {
  const roomScores = await db
    .selectFrom("RoomScore")
    .innerJoin("Score", "RoomScore.scoreId", "Score.id")
    .innerJoin("RoomUser", (join) =>
      join
        .onRef("RoomScore.roomId", "=", "RoomUser.roomId")
        .onRef("Score.userId", "=", "RoomUser.userId")
    )
    .select([
      "RoomScore.roomId",
      "RoomScore.scoreOrder",
      "Score.id as scoreId",
      "Score.input",
      "Score.score",
      "Score.userId",
      "RoomUser.userOrder",
    ])
    .orderBy("RoomUser.userOrder")
    .orderBy("RoomScore.scoreOrder")
    .execute();

  const groupedScores: { [key: string]: ScoreData } = {};

  roomScores.forEach((score) => {
    const key = `${score.roomId}-${score.scoreOrder}`;
    if (!groupedScores[key]) {
      groupedScores[key] = {
        roomId: score.roomId,
        scoreOrder: score.scoreOrder,
        userScores: [],
      };
    }
    groupedScores[key].userScores.push({
      id: score.scoreId,
      input: score.input,
      score: score.score,
      userId: score.userId,
    });
  });

  return Object.values(groupedScores);
}
