import db from "$lib/models/db.js";
import type { Action } from "@sveltejs/kit";
import dayjs from "dayjs";

export const updateRoom: Action = async ({ request }) => {
  const data = await request.formData();
  const id = data.get("id");

  const updateData = {
    name: data.get("name"),
    initialPoint: data.get("initialPoint"),
    returnPoint: data.get("returnPoint"),
    bonusPoint: data.get("bonusPoint"),
    scoreRate: data.get("scoreRate"),
    chipRate: data.get("chipRate"),
    gameAmount: data.get("gameAmount"),
    updatedAt: dayjs().toDate(),
  };

  await db.updateTable("Room").set(updateData).where("id", "=", id).execute();
};

export const updateScore: Action = async ({ request }) => {
  const data = await request.formData();
  const ids = data.getAll("id[]");
  const inputs = data.getAll("input[]");
  const scores = data.getAll("score[]");

  for (let i = 0; i < ids.length; i++) {
    const updateData = {
      input: inputs[i],
      score: scores[i],
    };

    await db
      .updateTable("Score")
      .set(updateData)
      .where("id", "=", ids[i])
      .execute();
  }
};

export const updateChip: Action = async ({ request }) => {
  const data = await request.formData();
  const id = data.get("id");

  const updateData = {
    input: data.get("input"),
    score: data.get("chip"),
  };

  await db.updateTable("Chip").set(updateData).where("id", "=", id).execute();
};
