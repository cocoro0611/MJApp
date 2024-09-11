import { v4  } from 'uuid';
import dayjs from 'dayjs';
import db from '$lib/models/db.js';
import type { Action } from '@sveltejs/kit';

export const createUser: Action = async ({ request }) => {
    const data = await request.formData();
    const userForm = {
        id: v4(),
        name: data.get('name'),
        icon: data.get('icon'),
        createdAt: dayjs().toDate(),
    };
    await db.insertInto('User').values(userForm).execute();
    return { success: true };
};
