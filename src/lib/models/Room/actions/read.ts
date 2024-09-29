import db from "$lib/models/db.js";
import type { RoomData, ScoreData } from "../type.js";

export async function readRooms(): Promise<RoomData[]> {
  const rooms = await db
    .selectFrom("Room")
    .selectAll()
    .orderBy("Room.updatedAt", "desc")
    .execute();
  const roomIds = rooms.map(({ id }) => id);

  const users =
    roomIds.length > 0
      ? await db
          .selectFrom("User")
          .innerJoin("RoomUser", "User.id", "RoomUser.userId")
          .select(["User.id", "User.name", "User.icon", "RoomUser.roomId"])
          .orderBy("RoomUser.order", "asc")
          .where("RoomUser.roomId", "in", roomIds)
          .execute()
      : [];

  const totalScores =
    roomIds.length > 0
      ? await db
          .selectFrom("Score")
          .select([
            "Score.userId",
            "Score.roomId",
            db.fn.sum<number>("score").as("totalScore"),
          ])
          .where("Score.roomId", "in", roomIds)
          .groupBy(["Score.userId", "Score.roomId"])
          .execute()
      : [];

  const totalChips =
    roomIds.length > 0
      ? await db
          .selectFrom("Chip")
          .select([
            "Chip.userId",
            "Chip.roomId",
            db.fn.sum<number>("chip").as("totalChip"),
            db.fn.max<number>("gameCount").as("gameCount"),
          ])
          .where("Chip.roomId", "in", roomIds)
          .groupBy(["Chip.userId", "Chip.roomId"])
          .execute()
      : [];

  return rooms.map(
    (room): RoomData => ({
      id: room.id,
      name: room.name,
      initialPoint: room.initialPoint,
      returnPoint: room.returnPoint,
      bonusPoint: room.bonusPoint,
      scoreRate: room.scoreRate,
      chipRate: room.chipRate,
      gameAmount: room.gameAmount,
      users: users
        .filter((user) => user.roomId === room.id)
        .map((user) => {
          const userScore = totalScores.find(
            (score) => score.userId === user.id && score.roomId === room.id
          );
          const totalScore = Number(userScore?.totalScore ?? 0);

          const userChip = totalChips.find(
            (chip) => chip.userId === user.id && chip.roomId === room.id
          );
          const totalChip = Number(userChip?.totalChip ?? 0);
          const gameCount = Number(userChip?.gameCount ?? 0);

          return {
            id: user.id,
            name: user.name,
            icon: user.icon,
            totalScore,
            totalChip,
            totalPoint:
              Number(room.scoreRate) * totalScore +
              Number(room.chipRate) * (totalChip - 20 * gameCount) -
              Number(room.gameAmount) / 4,
          };
        }),
    })
  );
}

// TODO:呼び出しが変
export async function readScores(): Promise<ScoreData[]> {
  // RoomUserテーブルからすべてのエントリを取得
  const roomUsers = await db
    .selectFrom("RoomUser")
    .select(["userId", "roomId", "order"])
    .execute();

  // userIdからroomIdとorderを素早く検索するためのマップを作成
  const userRoomMap = new Map(
    roomUsers.map((ru) => [ru.userId, { roomId: ru.roomId, order: ru.order }])
  );

  // Scoreテーブルから全てのスコアデータを取得
  const userScores = await db
    .selectFrom("Score")
    .select(["id", "input", "score", "gameCount", "userId"])
    .execute();

  // roomIdとgameCountでグループ化するためのマップを作成
  const groupedScores = new Map<string, ScoreData>();

  // スコアデータを処理
  for (const userScore of userScores) {
    const { id, input, score, gameCount, userId } = userScore;
    const userRoom = userRoomMap.get(userId);

    // マッチするroomIdが見つからない場合はスキップ
    if (!userRoom) continue;

    const { roomId, order } = userRoom;
    const key = `${roomId}-${gameCount}`;

    if (!groupedScores.has(key)) {
      groupedScores.set(key, {
        roomId,
        gameCount,
        userScores: [],
      });
    }

    groupedScores.get(key)!.userScores.push({
      id,
      input,
      score,
      userId,
      order,
    });
  }

  // グループ化されたスコアデータを配列に変換し、ソート
  const result = Array.from(groupedScores.values()).sort(
    (a, b) => a.gameCount - b.gameCount
  );

  // 各ScoreData内のuserScoresをRoomUser.orderでソート
  for (const scoreData of result) {
    scoreData.userScores.sort((a, b) => a.order - b.order);
  }

  return result;
}
