import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { patternsRepo } from '../db/repositories';
import { ChevronLeft, Edit, Trash2, Hash } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const PatternDetail = () => {
    const { t } = useTranslation();
    const { id } = useParams();
    const navigate = useNavigate();
    const [pattern, setPattern] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            const data = await patternsRepo.get(id);
            setPattern(data);
            setLoading(false);
        };
        load();
    }, [id]);

    const handleDelete = async () => {
        if (confirm(t('common.confirmDelete'))) {
            await patternsRepo.delete(id);
            navigate('/patterns');
        }
    };

    if (loading) return <div className="p-4">{t('common.loading')}</div>;
    if (!pattern) return <div className="p-4">{t('common.noData')}</div>;

    return (
        <div className="container" style={{ paddingBottom: '80px' }}>

            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 0' }}>
                <button onClick={() => navigate('/patterns')}><ChevronLeft size={24} /></button>
                <div style={{ display: 'flex', gap: '16px' }}>
                    <Link to={`/patterns/${id}/edit`}><Edit size={24} color="var(--primary-color)" /></Link>
                    <button onClick={handleDelete}><Trash2 size={24} color="#ef4444" /></button>
                </div>
            </div>

            {/* Main Image */}
            {pattern.images && pattern.images.length > 0 && (
                <div style={{
                    width: '100%', height: '300px',
                    borderRadius: 'var(--radius-md)',
                    overflow: 'hidden', marginBottom: 'var(--spacing-md)',
                    boxShadow: 'var(--shadow-md)'
                }}>
                    <img src={pattern.images[0]} alt={pattern.title} style={{ width: '100%', height: '100%', objectFit: 'contain', background: '#e2e8f0' }} />
                </div>
            )}

            {/* Title & Difficulty */}
            <div style={{ marginBottom: 'var(--spacing-md)' }}>
                <h1 style={{ fontSize: '1.5rem', marginBottom: '8px' }}>{pattern.title}</h1>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <span style={{
                        background: 'var(--primary-color)', color: 'white',
                        padding: '4px 12px', borderRadius: '16px', fontSize: '0.8rem'
                    }}>
                        {pattern.category}
                    </span>
                    <span style={{ color: 'orange', fontWeight: 'bold' }}>
                        {'★'.repeat(pattern.difficulty)}{'☆'.repeat(5 - pattern.difficulty)}
                    </span>
                </div>
            </div>

            {/* Details Grid */}
            <div className="card" style={{ marginBottom: 'var(--spacing-md)' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div>
                        <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem', display: 'block' }}>{t('patterns.form.hookSize')}</span>
                        <span style={{ fontWeight: 500 }}>{pattern.hookSize || '-'}</span>
                    </div>
                    <div>
                        <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem', display: 'block' }}>Created</span>
                        <span style={{ fontWeight: 500 }}>{new Date(pattern.createdAt).toLocaleDateString()}</span>
                    </div>
                </div>
            </div>

            {/* Tags */}
            {pattern.tags && pattern.tags.length > 0 && (
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: 'var(--spacing-md)' }}>
                    {pattern.tags.map(tag => (
                        <span key={tag} style={{
                            background: '#f1f5f9', color: 'var(--text-muted)',
                            padding: '4px 8px', borderRadius: '4px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '4px'
                        }}>
                            <Hash size={12} /> {tag}
                        </span>
                    ))}
                </div>
            )}



            {/* Content / Instructions */}
            {pattern.content && (
                <div className="card" style={{ marginBottom: 'var(--spacing-md)' }}>
                    <h3 style={{ fontSize: '1.1rem' }}>{t('patterns.form.content')}</h3>
                    <p style={{ whiteSpace: 'pre-wrap', lineHeight: '1.6', color: 'var(--text-main)', fontFamily: 'inherit' }}>{pattern.content}</p>
                </div>
            )}

            {/* Notes */}
            {pattern.note && (
                <div className="card">
                    <h3 style={{ fontSize: '1.1rem' }}>{t('patterns.form.notes')}</h3>
                    <p style={{ whiteSpace: 'pre-wrap', lineHeight: '1.5', color: 'var(--text-main)' }}>{pattern.note}</p>
                </div>
            )}

            {/* Gallery (if more than 1 image) */}
            {pattern.images && pattern.images.length > 1 && (
                <div style={{ marginTop: 'var(--spacing-md)' }}>
                    <h3>{t('patterns.form.images')}</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
                        {pattern.images.map((img, i) => (
                            <img key={i} src={img} style={{ width: '100%', height: '80px', objectFit: 'cover', borderRadius: 'var(--radius-sm)' }} />
                        ))}
                    </div>
                </div>
            )}

        </div>
    );
};

export default PatternDetail;
