import { createClient } from 'webdav';

export const getWebDAVClient = (url, username, password) => {
    return createClient(url, {
        username,
        password
    });
};

export const testConnection = async (url, username, password) => {
    try {
        const client = getWebDAVClient(url, username, password);
        // Try to list the root directory to test connection
        await client.getDirectoryContents("/");
        return true;
    } catch (error) {
        console.error("WebDAV Connection Failed:", error);
        throw error;
    }
};

export const uploadBackup = async (config, data) => {
    const client = getWebDAVClient(config.url, config.username, config.password);
    const filename = `/crochet_backup_${new Date().toISOString().replace(/[:.]/g, '-')}.json`;
    await client.putFileContents(filename, JSON.stringify(data), { overwrite: true });
    return filename;
};

export const listBackups = async (config) => {
    const client = getWebDAVClient(config.url, config.username, config.password);
    const contents = await client.getDirectoryContents("/");
    return contents
        .filter(item => item.filename.includes('crochet_backup') && item.type === 'file')
        .sort((a, b) => new Date(b.lastmod) - new Date(a.lastmod));
};

export const downloadBackup = async (config, filename) => {
    const client = getWebDAVClient(config.url, config.username, config.password);
    const content = await client.getFileContents(filename, { format: "text" });
    return JSON.parse(content);
};
