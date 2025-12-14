import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { yarnsRepo } from '../db/repositories';
import { ChevronLeft, Camera, Save } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const YarnForm = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { id } = useParams();
    const isEdit = !!id;

    const [formData, setFormData] = useState({
        brand: '',
        color: '',
        colorValue: '#ffffff',
        material: '',
        weight: '',
        stock: '',
        unit: 'g',
        purchasedFrom: '',
        price: '',
        images: []
    });

    useEffect(() => {
        if (isEdit) {
            yarnsRepo.get(id).then(data => {
                if (data) {
                    setFormData(data);
                }
            });
        }
    }, [id, isEdit]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleImageUpload = (e) => {
        const files = Array.from(e.target.files);
        Promise.all(files.map(file => {
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onloadend = () => resolve(reader.result);
                reader.onerror = reject;
                reader.readAsDataURL(file);
            });
        })).then(newImages => {
            setFormData(prev => ({ ...prev, images: [...prev.images, ...newImages] }));
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const dataToSave = {
            ...formData,
            stock: Number(formData.stock),
            price: Number(formData.price)
        };

        if (isEdit) {
            await yarnsRepo.update(dataToSave);
        } else {
            await yarnsRepo.add(dataToSave);
        }
        navigate('/inventory');
    };

    return (
        <div className="container">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '16px 0' }}>
                <button onClick={() => navigate(-1)}><ChevronLeft size={24} /></button>
                <h2>{isEdit ? t('inventory.editTitle') : t('inventory.addTitle')}</h2>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px', paddingBottom: '80px' }}>

                {/* Image Upload */}
                <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', padding: '8px 0' }}>
                    <label style={{
                        minWidth: '80px', height: '80px',
                        border: '2px dashed var(--border-color)',
                        borderRadius: 'var(--radius-md)',
                        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                        cursor: 'pointer', color: 'var(--text-muted)'
                    }}>
                        <Camera size={24} />
                        <span style={{ fontSize: '0.75rem' }}>{t('common.add')}</span>
                        <input type="file" multiple accept="image/*" onChange={handleImageUpload} style={{ display: 'none' }} />
                    </label>
                    {formData.images.map((img, idx) => (
                        <div key={idx} style={{ position: 'relative', minWidth: '80px', height: '80px' }}>
                            <img src={img} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 'var(--radius-md)' }} />
                            <button
                                type="button"
                                onClick={() => setFormData(p => ({ ...p, images: p.images.filter((_, i) => i !== idx) }))}
                                style={{
                                    position: 'absolute', top: -5, right: -5,
                                    background: 'red', color: 'white',
                                    borderRadius: '50%', width: '20px', height: '20px',
                                    fontSize: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center'
                                }}
                            >
                                ×
                            </button>
                        </div>
                    ))}
                </div>

                <div>
                    <label style={{ display: 'block', marginBottom: '4px', fontSize: '0.9rem', fontWeight: 500 }}>{t('inventory.form.brand')}</label>
                    <input
                        required
                        name="brand"
                        value={formData.brand}
                        onChange={handleChange}
                        style={{ width: '100%', padding: '10px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}
                        placeholder="e.g. Scheepjes Catona"
                    />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 120px', gap: '16px' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '4px', fontSize: '0.9rem', fontWeight: 500 }}>{t('inventory.form.color')}</label>
                        <input
                            required
                            name="color"
                            value={formData.color}
                            onChange={handleChange}
                            style={{ width: '100%', padding: '10px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}
                            placeholder="e.g. 105 Bridal White"
                        />
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '4px', fontSize: '0.9rem', fontWeight: 500 }}>{t('inventory.form.colorValue')}</label>
                        <div style={{ display: 'flex', alignItems: 'center', height: '42px', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)', padding: '4px' }}>
                            <input
                                type="color"
                                name="colorValue"
                                value={formData.colorValue}
                                onChange={handleChange}
                                style={{ width: '100%', height: '100%', border: 'none', background: 'none', cursor: 'pointer' }}
                            />
                        </div>
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '4px', fontSize: '0.9rem', fontWeight: 500 }}>{t('inventory.form.material')}</label>
                        <input
                            name="material"
                            value={formData.material}
                            onChange={handleChange}
                            style={{ width: '100%', padding: '10px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}
                            placeholder="Cotton, Wool..."
                        />
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '4px', fontSize: '0.9rem', fontWeight: 500 }}>{t('inventory.form.weight')}</label>
                        <input
                            name="weight"
                            value={formData.weight}
                            onChange={handleChange}
                            style={{ width: '100%', padding: '10px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}
                            placeholder="DK, Fingering..."
                        />
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 80px', gap: '16px' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '4px', fontSize: '0.9rem', fontWeight: 500 }}>{t('inventory.form.stock')}</label>
                        <input
                            type="number"
                            name="stock"
                            value={formData.stock}
                            onChange={handleChange}
                            style={{ width: '100%', padding: '10px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}
                            placeholder="Amount"
                        />
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '4px', fontSize: '0.9rem', fontWeight: 500 }}>{t('inventory.form.unit')}</label>
                        <select
                            name="unit"
                            value={formData.unit}
                            onChange={handleChange}
                            style={{ width: '100%', padding: '10px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', background: 'var(--bg-card)', color: 'var(--text-main)' }}
                        >
                            <option>g</option>
                            <option>oz</option>
                            <option>balls</option>
                            <option>m</option>
                            <option>yds</option>
                        </select>
                    </div>
                </div>

                <button type="submit" className="btn btn-primary" style={{ marginTop: '16px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', padding: '12px' }}>
                    <Save size={20} />
                    <span>{t('common.save')}</span>
                </button>

            </form>
        </div>
    );
};

export default YarnForm;
