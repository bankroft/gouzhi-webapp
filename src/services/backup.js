import { patternsRepo, finishedRepo, yarnsRepo, projectsRepo } from '../db/repositories';

export const exportAllData = async () => {
    const patterns = await patternsRepo.getAll();
    const finished = await finishedRepo.getAll();
    const yarns = await yarnsRepo.getAll();
    const projects = await projectsRepo.getAll();

    return {
        version: 1,
        timestamp: new Date().toISOString(),
        data: {
            patterns,
            finished,
            yarns,
            projects
        }
    };
};

export const importData = async (backupData) => {
    if (!backupData || !backupData.data) {
        throw new Error("Invalid backup format");
    }

    const { patterns, finished, yarns, projects } = backupData.data;

    // Clear existing data (optional, but safer to avoid duplicates if IDs match)
    // For a restore, we usually want to replace everything or merge. 
    // Here we'll do a primitive "clean and replace" for simplicity, or we could use 'put' which updates.
    // Let's use 'put' (update/insert) for each item to be safe against wiping without confirmation.
    // Actually, 'add' fails on duplicate keys. 'put' (which we implemented as repo.update using db.put) updates or adds.

    // Wait, our repos have .add and .update. .update uses put?
    // implementation_plan says generic repo has update using 'put'.

    const promises = [];

    if (patterns) {
        for (const p of patterns) promises.push(patternsRepo.update(p));
    }
    if (finished) {
        for (const f of finished) promises.push(finishedRepo.update(f));
    }
    if (yarns) {
        for (const y of yarns) promises.push(yarnsRepo.update(y));
    }
    if (projects) {
        for (const p of projects) promises.push(projectsRepo.update(p));
    }

    await Promise.all(promises);
    return promises.length;
};
