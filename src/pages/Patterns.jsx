import { useState, useEffect } from 'react';
import { patternsRepo } from '../db/repositories';
import { Plus, Search, Trash2, BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const Patterns = () => {
    const { t } = useTranslation();
    const [patterns, setPatterns] = useState([]);
    const [filter, setFilter] = useState('');

    const loadPatterns = async () => {
        const all = await patternsRepo.getAll();
        setPatterns(all.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
    };

    useEffect(() => {
        loadPatterns();
    }, []);

    const handleDelete = async (id) => {
        if (confirm(t('common.confirmDelete'))) {
            await patternsRepo.delete(id);
            loadPatterns();
        }
    };

    const filteredPatterns = patterns.filter(p =>
        p.title?.toLowerCase().includes(filter.toLowerCase()) ||
        p.category?.toLowerCase().includes(filter.toLowerCase())
    );

    return (
        <div className="container" style={{ paddingBottom: '80px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'var(--spacing-md)' }}>
                <h2>{t('patterns.title')}</h2>
                <Link to="/patterns/new" className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
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

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: 'var(--spacing-md)', marginTop: 'var(--spacing-md)' }}>
                {filteredPatterns.map(pattern => (
                    <Link to={`/patterns/${pattern.id}`} key={pattern.id} className="card" style={{ padding: 0, overflow: 'hidden', display: 'block', textDecoration: 'none', color: 'inherit' }}>
                        <div style={{ height: 150, background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            {pattern.images && pattern.images.length > 0 ? (
                                <img src={pattern.images[0]} alt={pattern.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            ) : (
                                <BookOpen size={48} color="#cbd5e1" />
                            )}
                        </div>
                        <div style={{ padding: 'var(--spacing-sm)' }}>
                            <h4 style={{ margin: 0, fontSize: '1rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{pattern.title}</h4>
                            <p style={{ margin: '4px 0', fontSize: '0.8rem', color: 'var(--text-muted)' }}>{pattern.category}</p>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px', alignItems: 'center' }}>
                                <span style={{ fontSize: '0.8rem' }}>★ {pattern.difficulty}/5</span>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>

            {filteredPatterns.length === 0 && (
                <div style={{ textAlign: 'center', marginTop: 'var(--spacing-xl)', color: 'var(--text-muted)' }}>
                    <p>{t('common.noData')}</p>
                </div>
            )}
        </div>
    );
};

export default Patterns;
