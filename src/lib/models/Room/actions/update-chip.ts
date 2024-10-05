import db from "$lib/models/db.js";
import type { Action } from "@sveltejs/kit";
import dayjs from "dayjs";

export const updateChip: Action = async ({ request }) => {
  const data = await request.formData();
  const roomId = data.get("roomId");
  const chipOrders = data.getAll("chipOrder[]");
  const ids = data.getAll("id[]");
  const inputs = data.getAll("input[]");

  await db.transaction().execute(async (trx) => {
    let currentIndex = 0;
    for (const chipOrder of chipOrders) {
      const userCount = 4;

      for (let j = 0; j < userCount; j++) {
        const id = ids[currentIndex];
        const input = inputs[currentIndex];

        const updateData = {
          input: input,
          chip: input,
          updatedAt: dayjs().toDate(),
        };

        // Update Chip
        await trx
          .updateTable("Chip")
          .set(updateData)
          .where("id", "=", id)
          .execute();

        // Update RoomChip
        await trx
          .updateTable("RoomChip")
          .set({ chipOrder: chipOrder })
          .where("roomId", "=", roomId)
          .where("chipId", "=", id)
          .execute();

        currentIndex++;
      }
    }
  });
  return { success: true, type: "update-chip" };
};
