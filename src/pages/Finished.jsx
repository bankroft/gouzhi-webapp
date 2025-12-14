import { useState, useEffect } from 'react';
import { finishedRepo } from '../db/repositories';
import { Plus, Search, Star, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const Finished = () => {
    const { t } = useTranslation();
    const [works, setWorks] = useState([]);
    const [filter, setFilter] = useState('');

    const loadWorks = async () => {
        const all = await finishedRepo.getAll();
        setWorks(all.sort((a, b) => new Date(b.completedDate) - new Date(a.completedDate)));
    };

    useEffect(() => {
        loadWorks();
    }, []);

    const filteredWorks = works.filter(w =>
        w.name?.toLowerCase().includes(filter.toLowerCase())
    );

    return (
        <div className="container" style={{ paddingBottom: '80px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'var(--spacing-md)' }}>
                <h2>{t('finished.title')}</h2>
                <Link to="/finished/new" className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
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
                {filteredWorks.map(work => (
                    <Link to={`/finished/${work.id}`} key={work.id} className="card" style={{ padding: 0, overflow: 'hidden', display: 'block', textDecoration: 'none', color: 'inherit' }}>
                        <div style={{ height: 150, background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            {work.images && work.images.length > 0 ? (
                                <img src={work.images[0]} alt={work.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            ) : (
                                <CheckCircle size={48} color="#cbd5e1" />
                            )}
                        </div>
                        <div style={{ padding: 'var(--spacing-sm)' }}>
                            <h4 style={{ margin: 0, fontSize: '1rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{work.name}</h4>
                            <p style={{ margin: '4px 0', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                                {new Date(work.completedDate).toLocaleDateString()}
                            </p>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px', alignItems: 'center' }}>
                                <span style={{ fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '2px' }}>
                                    {work.rating} <Star size={12} fill="#fbbf24" stroke="none" />
                                </span>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>

            {filteredWorks.length === 0 && (
                <div style={{ textAlign: 'center', marginTop: 'var(--spacing-xl)', color: 'var(--text-muted)' }}>
                    <p>{t('common.noData')}</p>
                </div>
            )}
        </div>
    );
};

export default Finished;
