import { dbPromise } from './db';
import { v4 as uuidv4 } from 'uuid';

const createRepository = (storeName) => ({
    getAll: async () => {
        const db = await dbPromise;
        return db.getAll(storeName);
    },
    get: async (id) => {
        const db = await dbPromise;
        return db.get(storeName, id);
    },
    add: async (item) => {
        const db = await dbPromise;
        const newItem = { ...item, id: uuidv4(), createdAt: new Date().toISOString() };
        await db.add(storeName, newItem);
        return newItem;
    },
    update: async (item) => {
        const db = await dbPromise;
        const updatedItem = { ...item, updatedAt: new Date().toISOString() };
        await db.put(storeName, updatedItem);
        return updatedItem;
    },
    delete: async (id) => {
        const db = await dbPromise;
        return db.delete(storeName, id);
    }
});

export const patternsRepo = createRepository('patterns');
export const finishedRepo = createRepository('finished_works');
export const yarnsRepo = createRepository('yarns');
export const projectsRepo = createRepository('projects');
