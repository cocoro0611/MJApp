import type { PageServerLoad, Actions } from "./$types.js";

import { createUser } from "$lib/models/Member/actions/create.js";
import { updateUser } from "$lib/models/Member/actions/update.js";
import { deleteUser } from "$lib/models/Member/actions/delete.js";

import {
  createRoom,
  createScore,
  createChip,
} from "$lib/models/Room/actions/create.js";
import {
  updateRoom,
  updateScore,
  updateChip,
} from "$lib/models/Room/actions/update.js";
import {
  deleteRoom,
  deleteScore,
  deleteChip,
} from "$lib/models/Room/actions/delete.js";

import { readUsers } from "$lib/models/Member/actions/read.js";
import { readRooms, readScores } from "$lib/models/Room/actions/read.js";

export const actions: Actions = {
  createUser,
  updateUser,
  deleteUser,

  createRoom,
  createScore,
  createChip,

  updateRoom,
  updateScore,
  updateChip,

  deleteRoom,
  deleteScore,
  deleteChip,
};

export const load: PageServerLoad = async () => {
  const users = await readUsers();
  const rooms = await readRooms();
  const scores = await readScores();
  return { users, rooms, scores };
};
