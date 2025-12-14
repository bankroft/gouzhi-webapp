import { useState, useEffect } from 'react';
import { Save, UploadCloud, DownloadCloud, FileUp, FileDown, CheckCircle, AlertCircle, Loader2, Moon, Sun, Monitor, Languages } from 'lucide-react';
import { testConnection, uploadBackup, listBackups, downloadBackup } from '../services/webdav';
import { exportAllData, importData } from '../services/backup';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../context/ThemeContext';

const Settings = () => {
    const { t, i18n } = useTranslation();
    const { theme, setTheme } = useTheme();

    const changeLanguage = (lng) => {
        i18n.changeLanguage(lng);
    };

    const [config, setConfig] = useState({
        url: '',
        username: '',
        password: ''
    });

    const [status, setStatus] = useState({ type: '', msg: '' });
    const [loading, setLoading] = useState(false);
    const [backups, setBackups] = useState([]);

    useEffect(() => {
        const saved = localStorage.getItem('webdav_config');
        if (saved) {
            setConfig(JSON.parse(saved));
        }
    }, []);

    const saveConfig = () => {
        localStorage.setItem('webdav_config', JSON.stringify(config));
        setStatus({ type: 'success', msg: 'Settings saved locally.' });
    };

    const handleTest = async () => {
        setLoading(true);
        setStatus({ type: '', msg: '' });
        try {
            await testConnection(config.url, config.username, config.password);
            setStatus({ type: 'success', msg: 'Connection successful!' });
            loadBackupsList();
        } catch (e) {
            setStatus({ type: 'error', msg: 'Connection failed: ' + e.message });
        } finally {
            setLoading(false);
        }
    };

    const loadBackupsList = async () => {
        if (!config.url) return;
        try {
            const list = await listBackups(config);
            setBackups(list);
        } catch (e) {
            console.error(e);
        }
    };

    const handleBackup = async () => {
        if (!confirm('Create a new backup on WebDAV?')) return;
        setLoading(true);
        try {
            const data = await exportAllData();
            const filename = await uploadBackup(config, data);
            setStatus({ type: 'success', msg: `Backup uploaded: ${filename}` });
            loadBackupsList();
        } catch (e) {
            setStatus({ type: 'error', msg: 'Backup failed: ' + e.message });
        } finally {
            setLoading(false);
        }
    };

    const handleRestore = async (filename) => {
        if (!confirm(`Restore from ${filename}? This will merge/overwrite local data.`)) return;
        setLoading(true);
        try {
            const data = await downloadBackup(config, filename);
            const count = await importData(data);
            setStatus({ type: 'success', msg: `Restored ${count} items successfully.` });
        } catch (e) {
            setStatus({ type: 'error', msg: 'Restore failed: ' + e.message });
        } finally {
            setLoading(false);
        }
    };

    const handleLocalExport = async () => {
        const data = await exportAllData();
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `crochet_backup_${new Date().toISOString().split('T')[0]}.json`;
        a.click();
    };

    const handleLocalImport = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = async (entry) => {
            try {
                const json = JSON.parse(entry.target.result);
                setLoading(true);
                const count = await importData(json);
                setStatus({ type: 'success', msg: `Imported ${count} items.` });
            } catch (err) {
                setStatus({ type: 'error', msg: 'Import failed: ' + err.message });
            } finally {
                setLoading(false);
            }
        };
        reader.readAsText(file);
    };

    return (
        <div className="container" style={{ paddingBottom: '80px' }}>
            <h2 style={{ marginTop: 'var(--spacing-md)' }}>{t('settings.title')}</h2>

            {/* Status Message */}
            {status.msg && (
                <div style={{
                    padding: '12px', marginBottom: '16px', borderRadius: 'var(--radius-md)',
                    background: status.type === 'success' ? '#dcfce7' : '#fee2e2',
                    color: status.type === 'success' ? '#166534' : '#991b1b',
                    display: 'flex', alignItems: 'center', gap: '8px'
                }}>
                    {status.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
                    {status.msg}
                </div>
            )}

            {/* Appearance Settings */}
            <div className="card" style={{ marginBottom: 'var(--spacing-md)' }}>
                <h3>{t('settings.appearance')}</h3>

                <div style={{ marginBottom: '16px' }}>
                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: 'var(--text-muted)' }}>{t('settings.theme')}</label>
                    <div style={{ display: 'flex', background: 'var(--bg-body)', padding: '4px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                        {['light', 'dark', 'system'].map((m) => (
                            <button
                                key={m}
                                onClick={() => setTheme(m)}
                                style={{
                                    flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                                    padding: '8px', borderRadius: 'var(--radius-sm)',
                                    background: theme === m ? 'var(--bg-card)' : 'transparent',
                                    color: theme === m ? 'var(--primary-color)' : 'var(--text-muted)',
                                    boxShadow: theme === m ? 'var(--shadow-sm)' : 'none',
                                    fontWeight: theme === m ? 600 : 400
                                }}
                            >
                                {m === 'light' && <Sun size={16} />}
                                {m === 'dark' && <Moon size={16} />}
                                {m === 'system' && <Monitor size={16} />}
                                {t(`settings.themes.${m}`)}
                            </button>
                        ))}
                    </div>
                </div>

                <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: 'var(--text-muted)' }}>{t('settings.language')}</label>
                    <div style={{ display: 'flex', background: 'var(--bg-body)', padding: '4px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                        <button
                            onClick={() => changeLanguage('en')}
                            style={{
                                flex: 1, padding: '8px', borderRadius: 'var(--radius-sm)',
                                background: i18n.resolvedLanguage === 'en' ? 'var(--bg-card)' : 'transparent',
                                color: i18n.resolvedLanguage === 'en' ? 'var(--primary-color)' : 'var(--text-muted)',
                                boxShadow: i18n.resolvedLanguage === 'en' ? 'var(--shadow-sm)' : 'none',
                                fontWeight: i18n.resolvedLanguage === 'en' ? 600 : 400
                            }}
                        >English</button>
                        <button
                            onClick={() => changeLanguage('zh')}
                            style={{
                                flex: 1, padding: '8px', borderRadius: 'var(--radius-sm)',
                                background: i18n.resolvedLanguage === 'zh' ? 'var(--bg-card)' : 'transparent',
                                color: i18n.resolvedLanguage === 'zh' ? 'var(--primary-color)' : 'var(--text-muted)',
                                boxShadow: i18n.resolvedLanguage === 'zh' ? 'var(--shadow-sm)' : 'none',
                                fontWeight: i18n.resolvedLanguage === 'zh' ? 600 : 400
                            }}
                        >中文</button>
                    </div>
                </div>
            </div>

            {/* WebDAV Settings */}
            <div className="card" style={{ marginBottom: 'var(--spacing-md)' }}>
                <h3>{t('settings.webdav')}</h3>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '12px' }}>Connect to your Nextcloud/WebDAV server.</p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <input
                        placeholder="WebDAV URL (e.g., https://cloud.example.com/remote.php/dav/files/user/)"
                        value={config.url}
                        onChange={e => setConfig({ ...config, url: e.target.value })}
                        style={{ padding: '8px', borderRadius: '4px', border: '1px solid var(--border-color)' }}
                    />
                    <input
                        placeholder="Username"
                        value={config.username}
                        onChange={e => setConfig({ ...config, username: e.target.value })}
                        style={{ padding: '8px', borderRadius: '4px', border: '1px solid var(--border-color)' }}
                    />
                    <input
                        type="password"
                        placeholder="Password / App Token"
                        value={config.password}
                        onChange={e => setConfig({ ...config, password: e.target.value })}
                        style={{ padding: '8px', borderRadius: '4px', border: '1px solid var(--border-color)' }}
                    />

                    <div style={{ display: 'flex', gap: '8px' }}>
                        <button onClick={saveConfig} className="btn" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', background: '#e2e8f0' }}>
                            <Save size={18} /> Save
                        </button>
                        <button onClick={handleTest} className="btn" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', background: '#e2e8f0' }}>
                            {loading ? <Loader2 size={18} className="animate-spin" /> : <UploadCloud size={18} />} Test
                        </button>
                    </div>
                </div>

                <hr style={{ margin: '16px 0', borderTop: '1px solid var(--border-color)' }} />

                <button onClick={handleBackup} disabled={!config.url} className="btn btn-primary" style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '12px' }}>
                    <UploadCloud size={20} /> Backup to Cloud
                </button>

                {backups.length > 0 && (
                    <div>
                        <h4 style={{ fontSize: '1rem', marginTop: '12px' }}>Available Backups</h4>
                        <ul style={{ listStyle: 'none', padding: 0, maxHeight: '200px', overflowY: 'auto' }}>
                            {backups.map(b => (
                                <li key={b.filename} style={{ padding: '8px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span style={{ fontSize: '0.85rem' }}>{b.basename} <br /><small style={{ color: 'var(--text-muted)' }}>{new Date(b.lastmod).toLocaleString()}</small></span>
                                    <button onClick={() => handleRestore(b.filename)} className="btn" style={{ padding: '4px 8px', fontSize: '0.8rem', background: '#dbeafe', color: '#1e40af' }}>Restore</button>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>

            {/* Local Export/Import */}
            <div className="card">
                <h3>Local Backup</h3>
                <div style={{ display: 'flex', gap: '16px', marginTop: '16px' }}>
                    <button onClick={handleLocalExport} className="btn" style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', padding: '16px', background: '#f8fafc', border: '1px solid var(--border-color)' }}>
                        <DownloadCloud size={24} color="var(--primary-color)" />
                        <span>Export JSON</span>
                    </button>
                    <label className="btn" style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', padding: '16px', background: '#f8fafc', border: '1px solid var(--border-color)', cursor: 'pointer' }}>
                        <FileUp size={24} color="var(--primary-color)" />
                        <span>Import JSON</span>
                        <input type="file" accept=".json" onChange={handleLocalImport} style={{ display: 'none' }} />
                    </label>
                </div>
            </div>

        </div>
    );
};

export default Settings;
