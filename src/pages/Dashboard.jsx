import { useState, useEffect } from 'react';
import { patternsRepo, finishedRepo, yarnsRepo, projectsRepo } from '../db/repositories';
import { BookOpen, Layers, Archive, CheckCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const Dashboard = () => {
    const { t } = useTranslation();
    const [stats, setStats] = useState({
        patterns: 0,
        projects: 0,
        yarns: 0,
        finished: 0
    });

    useEffect(() => {
        const loadStats = async () => {
            const [patterns, projects, yarns, finished] = await Promise.all([
                patternsRepo.getAll(),
                projectsRepo.getAll(),
                yarnsRepo.getAll(),
                finishedRepo.getAll()
            ]);
            setStats({
                patterns: patterns.length,
                projects: projects.length,
                yarns: yarns.length,
                finished: finished.length
            });
        };
        loadStats();
    }, []);

    return (
        <div className="container">
            <h2 style={{ marginTop: 'var(--spacing-md)' }}>{t('dashboard.title')}</h2>

            <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: 'var(--spacing-md)',
                marginTop: 'var(--spacing-md)'
            }}>
                <div className="card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <BookOpen size={32} color="var(--primary-color)" />
                    <h3>{stats.patterns}</h3>
                    <span style={{ color: 'var(--text-muted)' }}>{t('dashboard.totalPatterns')}</span>
                </div>

                <div className="card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Layers size={32} color="var(--secondary-color)" />
                    <h3>{stats.projects}</h3>
                    <span style={{ color: 'var(--text-muted)' }}>{t('dashboard.activeProjects')}</span>
                </div>

                <div className="card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Archive size={32} color="var(--accent-color)" />
                    <h3>{stats.yarns}</h3>
                    <span style={{ color: 'var(--text-muted)' }}>{t('dashboard.yarnStash')}</span>
                </div>

                <div className="card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <CheckCircle size={32} color="#10b981" />
                    <h3>{stats.finished}</h3>
                    <span style={{ color: 'var(--text-muted)' }}>{t('dashboard.finishedWorks')}</span>
                </div>
            </div>

            <div style={{ marginTop: 'var(--spacing-xl)' }}>
                <h3>{t('common.loading')}...</h3>
                <p style={{ color: 'var(--text-muted)' }}>{t('common.noData')}</p>
            </div>
        </div>
    );
};

export default Dashboard;
