import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { finishedRepo, patternsRepo } from '../db/repositories';
import { ChevronLeft, Camera, Save, Star } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const FinishedForm = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { id } = useParams();
    const isEdit = !!id;

    const [patterns, setPatterns] = useState([]);
    const [formData, setFormData] = useState({
        name: '',
        completedDate: new Date().toISOString().split('T')[0],
        patternId: '',
        timeSpent: '',
        rating: 5,
        notes: '',
        images: []
    });

    useEffect(() => {
        patternsRepo.getAll().then(setPatterns);

        if (isEdit) {
            finishedRepo.get(id).then(data => {
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
        if (isEdit) {
            await finishedRepo.update(formData);
        } else {
            await finishedRepo.add(formData);
        }
        navigate('/finished');
    };

    return (
        <div className="container">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '16px 0' }}>
                <button onClick={() => navigate(-1)}><ChevronLeft size={24} /></button>
                <h2>{isEdit ? t('finished.editTitle') : t('finished.addTitle')}</h2>
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
                    <label style={{ display: 'block', marginBottom: '4px', fontSize: '0.9rem', fontWeight: 500 }}>{t('finished.form.name')}</label>
                    <input
                        required
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        style={{ width: '100%', padding: '10px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}
                        placeholder={t('finished.form.name')}
                    />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '4px', fontSize: '0.9rem', fontWeight: 500 }}>{t('finished.form.completedDate')}</label>
                        <input
                            type="date"
                            name="completedDate"
                            value={formData.completedDate}
                            onChange={handleChange}
                            style={{ width: '100%', padding: '10px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', fontFamily: 'inherit' }}
                        />
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '4px', fontSize: '0.9rem', fontWeight: 500 }}>{t('finished.form.pattern')}</label>
                        <select
                            name="patternId"
                            value={formData.patternId}
                            onChange={handleChange}
                            style={{ width: '100%', padding: '10px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', background: 'var(--bg-card)', color: 'var(--text-main)' }}
                        >
                            <option value="">{t('common.search')}...</option>
                            {patterns.map(p => (
                                <option key={p.id} value={p.id}>{p.title}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div>
                    <label style={{ display: 'block', marginBottom: '4px', fontSize: '0.9rem', fontWeight: 500 }}>{t('finished.form.timeSpent')}</label>
                    <input
                        name="timeSpent"
                        value={formData.timeSpent}
                        onChange={handleChange}
                        style={{ width: '100%', padding: '10px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}
                        placeholder="e.g. 10 hours"
                    />
                </div>

                <div>
                    <label style={{ display: 'block', marginBottom: '4px', fontSize: '0.9rem', fontWeight: 500 }}>{t('finished.form.rating')}</label>
                    <div style={{ display: 'flex', gap: '8px' }}>
                        {[1, 2, 3, 4, 5].map(num => (
                            <button
                                type="button"
                                key={num}
                                onClick={() => setFormData(p => ({ ...p, rating: num }))}
                                style={{
                                    flex: 1, padding: '8px',
                                    borderRadius: 'var(--radius-sm)',
                                    border: `1px solid ${formData.rating >= num ? '#fbbf24' : 'var(--border-color)'}`,
                                    background: 'var(--bg-card)',
                                    color: formData.rating >= num ? '#fbbf24' : 'var(--text-muted)'
                                }}
                            >
                                <Star fill={formData.rating >= num ? "#fbbf24" : "none"} size={20} />
                            </button>
                        ))}
                    </div>
                </div>

                <div>
                    <label style={{ display: 'block', marginBottom: '4px', fontSize: '0.9rem', fontWeight: 500 }}>{t('patterns.form.notes')}</label>
                    <textarea
                        name="notes"
                        value={formData.notes}
                        onChange={handleChange}
                        rows={5}
                        style={{ width: '100%', padding: '10px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', fontFamily: 'inherit' }}
                        placeholder={t('patterns.form.notes')}
                    />
                </div>

                <button type="submit" className="btn btn-primary" style={{ marginTop: '16px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', padding: '12px' }}>
                    <Save size={20} />
                    <span>{t('common.save')}</span>
                </button>

            </form>
        </div>
    );
};

export default FinishedForm;
