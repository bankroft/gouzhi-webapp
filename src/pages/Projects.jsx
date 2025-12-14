import { useState, useEffect } from 'react';
import { projectsRepo } from '../db/repositories';
import { Plus, Search, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const Projects = () => {
    const { t } = useTranslation();
    const [projects, setProjects] = useState([]);
    const [filter, setFilter] = useState('');

    const loadProjects = async () => {
        const all = await projectsRepo.getAll();
        setProjects(all.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)));
    };

    useEffect(() => {
        loadProjects();
    }, []);

    const filteredProjects = projects.filter(p =>
        p.name?.toLowerCase().includes(filter.toLowerCase())
    );

    const getStatusColor = (status) => {
        switch (status) {
            case 'in-progress': return 'var(--primary-color)';
            case 'completed': return '#10b981';
            case 'paused': return '#f59e0b';
            default: return 'var(--text-muted)';
        }
    };

    // Helper to translate status key safely
    const getStatusLabel = (status) => {
        // status stored as "in-progress" but translation key might be "in_progress" in en.json? 
        // Let's check en.json: "plan", "in_progress", "paused", "completed"
        // But the form saves "plan", "in-progress", "paused", "completed" (based on ProjectForm lines 82-85 in read 262)
        // Wait, ProjectForm lines 82-85 in read 262 showed values: "plan", "in-progress", "paused", "completed"
        // en.json has keys: "plan", "in_progress", "paused", "completed"
        // So "in-progress" from DB needs to map to "in_progress" key for translation?
        const key = status.replace('-', '_');
        return t(`projects.status.${key}`);
    };

    return (
        <div className="container" style={{ paddingBottom: '80px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'var(--spacing-md)' }}>
                <h2>{t('projects.title')}</h2>
                <Link to="/projects/new" className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Plus size={20} />
                </Link>
            </div>

            <div style={{ position: 'relative', marginTop: 'var(--spacing-md)' }}>
                <input
                    type="text"
                    placeholder={t('common.search')}
                    value={filter}
                    onChange={e => setFilter(e.target.value)}
                    style={{
                        width: '100%',
                        padding: '12px 12px 12px 40px',
                        borderRadius: 'var(--radius-md)',
                        border: '1px solid var(--border-color)',
                        fontSize: '16px'
                    }}
                />
                <Search size={20} style={{ position: 'absolute', left: 12, top: 12, color: 'var(--text-muted)' }} />
            </div>

            <div style={{ display: 'grid', gap: 'var(--spacing-md)', marginTop: 'var(--spacing-md)' }}>
                {filteredProjects.map(project => (
                    <Link to={`/projects/${project.id}`} key={project.id} className="card" style={{ display: 'flex', flexDirection: 'column', textDecoration: 'none', color: 'inherit' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h4 style={{ margin: 0 }}>{project.name}</h4>
                            <span style={{
                                fontSize: '0.75rem',
                                padding: '4px 8px',
                                borderRadius: '12px',
                                backgroundColor: `${getStatusColor(project.status)}20`,
                                color: getStatusColor(project.status),
                                border: `1px solid ${getStatusColor(project.status)}`
                            }}>
                                {getStatusLabel(project.status)}
                            </span>
                        </div>
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '8px 0' }}>
                            {t('projects.form.startDate')}: {new Date(project.startDate).toLocaleDateString()}
                        </p>
                        <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                                <Clock size={16} />
                                <span>{project.progress}%</span>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>

            {filteredProjects.length === 0 && (
                <div style={{ textAlign: 'center', marginTop: 'var(--spacing-xl)', color: 'var(--text-muted)' }}>
                    <p>{t('common.noData')}</p>
                </div>
            )}
        </div>
    );
};

export default Projects;
