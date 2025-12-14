import { useState, useEffect } from 'react';
import { yarnsRepo } from '../db/repositories';
import { Plus, Search, Archive } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const Inventory = () => {
    const { t } = useTranslation();
    const [yarns, setYarns] = useState([]);
    const [filter, setFilter] = useState('');

    const loadYarns = async () => {
        const all = await yarnsRepo.getAll();
        setYarns(all.sort((a, b) => a.brand.localeCompare(b.brand)));
    };

    useEffect(() => {
        loadYarns();
    }, []);

    const filteredYarns = yarns.filter(y =>
        y.brand?.toLowerCase().includes(filter.toLowerCase()) ||
        y.color?.toLowerCase().includes(filter.toLowerCase())
    );

    return (
        <div className="container" style={{ paddingBottom: '80px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'var(--spacing-md)' }}>
                <h2>{t('inventory.title')}</h2>
                <Link to="/inventory/new" className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
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
                {filteredYarns.map(yarn => (
                    <Link to={`/inventory/${yarn.id}`} key={yarn.id} className="card" style={{ padding: 0, overflow: 'hidden', display: 'block', textDecoration: 'none', color: 'inherit' }}>
                        <div style={{ height: 120, background: yarn.colorValue || '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            {yarn.images && yarn.images.length > 0 ? (
                                <img src={yarn.images[0]} alt={yarn.brand} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            ) : (
                                !yarn.colorValue && <Archive size={48} color="#cbd5e1" />
                            )}
                        </div>
                        <div style={{ padding: 'var(--spacing-sm)' }}>
                            <h4 style={{ margin: 0, fontSize: '1rem' }}>{yarn.brand}</h4>
                            <p style={{ margin: '4px 0', fontSize: '0.8rem', color: 'var(--text-muted)' }}>{yarn.color}</p>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px', alignItems: 'center' }}>
                                <span style={{ fontSize: '0.8rem', fontWeight: '500' }}>
                                    {yarn.stock} {yarn.unit || 'g'}
                                </span>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>

            {filteredYarns.length === 0 && (
                <div style={{ textAlign: 'center', marginTop: 'var(--spacing-xl)', color: 'var(--text-muted)' }}>
                    <p>{t('common.noData')}</p>
                </div>
            )}
        </div>
    );
};

export default Inventory;
