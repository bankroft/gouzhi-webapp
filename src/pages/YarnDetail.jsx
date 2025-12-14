import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { yarnsRepo } from '../db/repositories';
import { ChevronLeft, Edit, Trash2, Archive } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const YarnDetail = () => {
    const { t } = useTranslation();
    const { id } = useParams();
    const navigate = useNavigate();
    const [yarn, setYarn] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            const data = await yarnsRepo.get(id);
            setYarn(data);
            setLoading(false);
        };
        load();
    }, [id]);

    const handleDelete = async () => {
        if (confirm(t('common.confirmDelete'))) {
            await yarnsRepo.delete(id);
            navigate('/inventory');
        }
    };

    if (loading) return <div className="p-4">{t('common.loading')}</div>;
    if (!yarn) return <div className="p-4">{t('common.noData')}</div>;

    return (
        <div className="container" style={{ paddingBottom: '80px' }}>

            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 0' }}>
                <button onClick={() => navigate('/inventory')}><ChevronLeft size={24} /></button>
                <div style={{ display: 'flex', gap: '16px' }}>
                    <Link to={`/inventory/${id}/edit`}><Edit size={24} color="var(--primary-color)" /></Link>
                    <button onClick={handleDelete}><Trash2 size={24} color="#ef4444" /></button>
                </div>
            </div>

            {/* Main Visual */}
            <div style={{
                width: '100%', height: '200px',
                borderRadius: 'var(--radius-md)',
                overflow: 'hidden', marginBottom: 'var(--spacing-md)',
                boxShadow: 'var(--shadow-md)',
                background: yarn.images && yarn.images.length > 0 ? 'white' : yarn.colorValue || '#f1f5f9',
                display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
                {yarn.images && yarn.images.length > 0 ? (
                    <img src={yarn.images[0]} alt={yarn.brand} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                ) : (
                    !yarn.images?.length && !yarn.colorValue && <Archive size={64} color="#cbd5e1" />
                )}
            </div>

            {/* Info */}
            <div style={{ marginBottom: 'var(--spacing-md)' }}>
                <h1 style={{ fontSize: '1.5rem', marginBottom: '8px' }}>{yarn.brand}</h1>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: yarn.colorValue, border: '1px solid var(--border-color)' }}></div>
                    <span style={{ fontSize: '1.1rem', color: 'var(--text-muted)' }}>{yarn.color}</span>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="card" style={{ marginBottom: 'var(--spacing-md)' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div>
                        <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem', display: 'block' }}>{t('inventory.form.stock')}</span>
                        <span style={{ fontWeight: 600, fontSize: '1.2rem', color: Number(yarn.stock) === 0 ? '#ef4444' : 'var(--primary-color)' }}>
                            {yarn.stock} {yarn.unit}
                        </span>
                    </div>
                    <div>
                        <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem', display: 'block' }}>{t('inventory.form.material')}</span>
                        <span style={{ fontWeight: 500 }}>{yarn.material || '-'}</span>
                    </div>
                    <div>
                        <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem', display: 'block' }}>{t('inventory.form.weight')}</span>
                        <span style={{ fontWeight: 500 }}>{yarn.weight || '-'}</span>
                    </div>
                </div>
            </div>

            {/* Gallery (if more than 1 image) */}
            {yarn.images && yarn.images.length > 1 && (
                <div style={{ marginTop: 'var(--spacing-md)' }}>
                    <h3>{t('patterns.form.images')}</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
                        {yarn.images.map((img, i) => (
                            <img key={i} src={img} style={{ width: '100%', height: '80px', objectFit: 'cover', borderRadius: 'var(--radius-sm)' }} />
                        ))}
                    </div>
                </div>
            )}

        </div>
    );
};

export default YarnDetail;
