import db from "$lib/models/db.js";
import type { ChipData } from "../type.js";

export async function readChips(): Promise<ChipData[]> {
  const roomChips = await db
    .selectFrom("RoomChip")
    .innerJoin("Chip", "RoomChip.chipId", "Chip.id")
    .innerJoin("RoomUser", (join) =>
      join
        .onRef("RoomChip.roomId", "=", "RoomUser.roomId")
        .onRef("Chip.userId", "=", "RoomUser.userId")
    )
    .select([
      "RoomChip.roomId",
      "RoomChip.chipOrder",
      "Chip.id as chipId",
      "Chip.input",
      "Chip.chip",
      "Chip.userId",
      "RoomUser.userOrder",
    ])
    .orderBy("RoomUser.userOrder")
    .orderBy("RoomChip.chipOrder")
    .execute();

  const groupedChips: { [key: string]: ChipData } = {};

  roomChips.forEach((chip) => {
    const key = `${chip.roomId}-${chip.chipOrder}`;
    if (!groupedChips[key]) {
      groupedChips[key] = {
        roomId: chip.roomId,
        chipOrder: chip.chipOrder,
        userChips: [],
      };
    }
    groupedChips[key].userChips.push({
      id: chip.chipId,
      input: chip.input,
      chip: chip.chip,
      userId: chip.userId,
    });
  });

  return Object.values(groupedChips);
}
