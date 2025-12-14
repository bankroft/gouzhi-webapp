import { openDB } from 'idb';

const DB_NAME = 'crochet-db';
const DB_VERSION = 1;

export const initDB = async () => {
    return openDB(DB_NAME, DB_VERSION, {
        upgrade(db) {
            if (!db.objectStoreNames.contains('patterns')) {
                const store = db.createObjectStore('patterns', { keyPath: 'id' });
                store.createIndex('category', 'category');
                store.createIndex('createdAt', 'createdAt');
            }
            if (!db.objectStoreNames.contains('finished_works')) {
                const store = db.createObjectStore('finished_works', { keyPath: 'id' });
                store.createIndex('completedDate', 'completedDate');
            }
            if (!db.objectStoreNames.contains('yarns')) {
                const store = db.createObjectStore('yarns', { keyPath: 'id' });
                store.createIndex('brand', 'brand');
                store.createIndex('color', 'color');
            }
            if (!db.objectStoreNames.contains('projects')) {
                const store = db.createObjectStore('projects', { keyPath: 'id' });
                store.createIndex('status', 'status');
            }
        },
    });
};

export const dbPromise = initDB();
