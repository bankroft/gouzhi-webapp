import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { finishedRepo, patternsRepo } from '../db/repositories';
import { ChevronLeft, Edit, Trash2, Calendar, Clock, Star, BookOpen } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const FinishedDetail = () => {
    const { t } = useTranslation();
    const { id } = useParams();
    const navigate = useNavigate();
    const [work, setWork] = useState(null);
    const [pattern, setPattern] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            const data = await finishedRepo.get(id);
            setWork(data);
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
            await finishedRepo.delete(id);
            navigate('/finished');
        }
    };

    if (loading) return <div className="p-4">{t('common.loading')}</div>;
    if (!work) return <div className="p-4">{t('common.noData')}</div>;

    return (
        <div className="container" style={{ paddingBottom: '80px' }}>

            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 0' }}>
                <button onClick={() => navigate('/finished')}><ChevronLeft size={24} /></button>
                <div style={{ display: 'flex', gap: '16px' }}>
                    <Link to={`/finished/${id}/edit`}><Edit size={24} color="var(--primary-color)" /></Link>
                    <button onClick={handleDelete}><Trash2 size={24} color="#ef4444" /></button>
                </div>
            </div>

            {/* Main Image */}
            {work.images && work.images.length > 0 && (
                <div style={{
                    width: '100%', height: '300px',
                    borderRadius: 'var(--radius-md)',
                    overflow: 'hidden', marginBottom: 'var(--spacing-md)',
                    boxShadow: 'var(--shadow-md)'
                }}>
                    <img src={work.images[0]} alt={work.name} style={{ width: '100%', height: '100%', objectFit: 'contain', background: '#e2e8f0' }} />
                </div>
            )}

            {/* Title & Rating */}
            <div style={{ marginBottom: 'var(--spacing-md)' }}>
                <h1 style={{ fontSize: '1.5rem', marginBottom: '8px' }}>{work.name}</h1>
                <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                    {[...Array(5)].map((_, i) => (
                        <Star key={i} size={16} fill={i < work.rating ? "#fbbf24" : "none"} color={i < work.rating ? "#fbbf24" : "var(--text-muted)"} />
                    ))}
                </div>
            </div>

            {/* Details Grid */}
            <div className="card" style={{ marginBottom: 'var(--spacing-md)' }}>
                <div style={{ display: 'grid', gap: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Calendar size={18} color="var(--text-muted)" />
                        <span style={{ fontWeight: 500 }}>{new Date(work.completedDate).toLocaleDateString()}</span>
                    </div>
                    {work.timeSpent && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Clock size={18} color="var(--text-muted)" />
                            <span>{work.timeSpent}</span>
                        </div>
                    )}
                    {pattern && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <BookOpen size={18} color="var(--text-muted)" />
                            <Link to={`/patterns/${pattern.id}`} style={{ color: 'var(--primary-color)', textDecoration: 'underline' }}>
                                {t('finished.form.pattern')}: {pattern.title}
                            </Link>
                        </div>
                    )}
                </div>
            </div>

            {/* Notes */}
            {work.notes && (
                <div className="card">
                    <h3 style={{ fontSize: '1.1rem' }}>{t('patterns.form.notes')}</h3>
                    <p style={{ whiteSpace: 'pre-wrap', lineHeight: '1.5', color: 'var(--text-main)' }}>{work.notes}</p>
                </div>
            )}

            {/* Gallery (if more than 1 image) */}
            {work.images && work.images.length > 1 && (
                <div style={{ marginTop: 'var(--spacing-md)' }}>
                    <h3>{t('patterns.form.images')}</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
                        {work.images.map((img, i) => (
                            <img key={i} src={img} style={{ width: '100%', height: '80px', objectFit: 'cover', borderRadius: 'var(--radius-sm)' }} />
                        ))}
                    </div>
                </div>
            )}

        </div>
    );
};

export default FinishedDetail;
