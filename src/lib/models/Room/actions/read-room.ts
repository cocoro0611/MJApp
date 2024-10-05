import db from "$lib/models/db.js";
import type { RoomData } from "../type.js";

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
          .select([
            "User.id",
            "User.name",
            "User.icon",
            "User.isDefault",
            "RoomUser.roomId",
            "RoomUser.userOrder",
          ])
          .orderBy("RoomUser.userOrder", "asc")
          .where("RoomUser.roomId", "in", roomIds)
          .execute()
      : [];

  const totalScores =
    roomIds.length > 0
      ? await db
          .selectFrom("Score")
          .innerJoin("RoomScore", "Score.id", "RoomScore.scoreId")
          .select([
            "Score.userId",
            "RoomScore.roomId",
            db.fn.sum<number>("score").as("totalScore"),
          ])
          .where("RoomScore.roomId", "in", roomIds)
          .groupBy(["Score.userId", "RoomScore.roomId"])
          .execute()
      : [];

  const totalChips =
    roomIds.length > 0
      ? await db
          .selectFrom("Chip")
          .innerJoin("RoomChip", "Chip.id", "RoomChip.chipId")
          .select([
            "Chip.userId",
            "RoomChip.roomId",
            db.fn.sum<number>("chip").as("totalChip"),
            db.fn.max<number>("RoomChip.chipOrder").as("chipOrder"),
          ])
          .where("RoomChip.roomId", "in", roomIds)
          .groupBy(["Chip.userId", "RoomChip.roomId"])
          .execute()
      : [];

  // Create lookup maps for faster access
  const userMap = new Map(
    users.map((user) => [`${user.roomId}-${user.id}`, user])
  );
  const scoreMap = new Map(
    totalScores.map((score) => [`${score.roomId}-${score.userId}`, score])
  );
  const chipMap = new Map(
    totalChips.map((chip) => [`${chip.roomId}-${chip.userId}`, chip])
  );

  return rooms.map((room): RoomData => {
    const roomUsers = users.filter((user) => user.roomId === room.id);

    return {
      id: room.id,
      name: room.name,
      initialPoint: room.initialPoint,
      returnPoint: room.returnPoint,
      bonusPoint: room.bonusPoint,
      scoreRate: room.scoreRate,
      chipRate: room.chipRate,
      gameAmount: room.gameAmount,
      users: roomUsers.map((user) => {
        const key = `${room.id}-${user.id}`;
        const userScore = scoreMap.get(key);
        const userChip = chipMap.get(key);

        const totalScore = Number(userScore?.totalScore ?? 0);
        const totalChip = Number(userChip?.totalChip ?? 0);
        const chipOrder = Number(userChip?.chipOrder ?? 0);

        return {
          id: user.id,
          name: user.name,
          icon: user.icon,
          isDefault: user.isDefault,
          totalScore,
          totalChip,
          totalPoint:
            Number(room.scoreRate) * totalScore +
            Number(room.chipRate) * (totalChip - 20 * chipOrder) -
            Number(room.gameAmount) / 4,
        };
      }),
    };
  });
}
