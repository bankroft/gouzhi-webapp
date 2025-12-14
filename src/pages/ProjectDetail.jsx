import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { projectsRepo, patternsRepo } from '../db/repositories';
import { ChevronLeft, Edit, Trash2, Calendar, BookOpen } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const ProjectDetail = () => {
    const { t } = useTranslation();
    const { id } = useParams();
    const navigate = useNavigate();
    const [project, setProject] = useState(null);
    const [pattern, setPattern] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            const data = await projectsRepo.get(id);
            setProject(data);
            if (data && data.patternId) {
                const p = await patternsRepo.get(data.patternId);
                setPattern(p);
            }
            setLoading(false);
        };
        load();
    }, [id]);

    const handleDelete = async () => {
        if (confirm(t('common.confirmDelete'))) {
            await projectsRepo.delete(id);
            navigate('/projects');
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'in-progress': return 'var(--primary-color)';
            case 'completed': return '#10b981';
            case 'paused': return '#f59e0b';
            default: return 'var(--text-muted)';
        }
    };

    const getStatusLabel = (status) => {
        if (!status) return '-';
        const key = status.replace('-', '_');
        return t(`projects.status.${key}`);
    };

    if (loading) return <div className="p-4">{t('common.loading')}</div>;
    if (!project) return <div className="p-4">{t('common.noData')}</div>;

    return (
        <div className="container" style={{ paddingBottom: '80px' }}>

            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 0' }}>
                <button onClick={() => navigate('/projects')}><ChevronLeft size={24} /></button>
                <div style={{ display: 'flex', gap: '16px' }}>
                    <Link to={`/projects/${id}/edit`}><Edit size={24} color="var(--primary-color)" /></Link>
                    <button onClick={handleDelete}><Trash2 size={24} color="#ef4444" /></button>
                </div>
            </div>

            {/* Title & Status */}
            <div style={{ marginBottom: 'var(--spacing-md)' }}>
                <h1 style={{ fontSize: '1.5rem', marginBottom: '8px' }}>{project.name}</h1>
                <span style={{
                    padding: '4px 12px', borderRadius: '16px', fontSize: '0.9rem',
                    background: getStatusColor(project.status), color: 'white'
                }}>
                    {getStatusLabel(project.status)}
                </span>
            </div>

            {/* Progress */}
            <div className="card" style={{ marginBottom: 'var(--spacing-md)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <span style={{ fontWeight: 500 }}>{t('projects.form.progress')}</span>
                    <span>{project.progress}%</span>
                </div>
                <div style={{ width: '100%', height: '8px', background: '#e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ width: `${project.progress}%`, height: '100%', background: getStatusColor(project.status) }}></div>
                </div>
            </div>

            {/* Details Grid */}
            <div className="card" style={{ marginBottom: 'var(--spacing-md)' }}>
                <div style={{ display: 'grid', gap: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Calendar size={18} color="var(--text-muted)" />
                        <span style={{ fontWeight: 500 }}>{t('projects.form.startDate')}: {new Date(project.startDate).toLocaleDateString()}</span>
                    </div>
                    {pattern && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <BookOpen size={18} color="var(--text-muted)" />
                            <Link to={`/patterns/${pattern.id}`} style={{ color: 'var(--primary-color)', textDecoration: 'underline' }}>
                                {t('projects.form.pattern')}: {pattern.title}
                            </Link>
                        </div>
                    )}
                </div>
            </div>

            {/* Notes */}
            {project.notes && (
                <div className="card">
                    <h3 style={{ fontSize: '1.1rem' }}>{t('patterns.form.notes')}</h3>
                    <p style={{ whiteSpace: 'pre-wrap', lineHeight: '1.5', color: 'var(--text-main)' }}>{project.notes}</p>
                </div>
            )}

        </div>
    );
};

export default ProjectDetail;
