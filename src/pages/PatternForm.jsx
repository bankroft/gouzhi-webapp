import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { patternsRepo } from '../db/repositories';
import { ChevronLeft, Camera, Save } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const PatternForm = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { id } = useParams();
    const isEdit = !!id;

    const [formData, setFormData] = useState({
        title: '',
        category: 'Other',
        difficulty: 1,
        tags: '',
        hookSize: '',
        content: '',
        note: '',
        images: []
    });

    useEffect(() => {
        if (isEdit) {
            patternsRepo.get(id).then(data => {
                if (data) {
                    setFormData({
                        ...data,
                        tags: data.tags ? data.tags.join(', ') : ''
                    });
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
            tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean),
            difficulty: Number(formData.difficulty)
        };

        if (isEdit) {
            await patternsRepo.update(dataToSave);
        } else {
            await patternsRepo.add(dataToSave);
        }
        navigate('/patterns');
    };

    return (
        <div className="container">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '16px 0' }}>
                <button onClick={() => navigate(-1)}><ChevronLeft size={24} /></button>
                <h2>{isEdit ? t('patterns.editTitle') : t('patterns.addTitle')}</h2>
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
                    <label style={{ display: 'block', marginBottom: '4px', fontSize: '0.9rem', fontWeight: 500 }}>{t('patterns.form.title')}</label>
                    <input
                        required
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        style={{ width: '100%', padding: '10px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}
                        placeholder={t('patterns.form.title')}
                    />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '4px', fontSize: '0.9rem', fontWeight: 500 }}>{t('patterns.form.category')}</label>
                        <select
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            style={{ width: '100%', padding: '10px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', background: 'var(--bg-card)', color: 'var(--text-main)' }}
                        >
                            <option>Amigurumi</option>
                            <option>Clothing</option>
                            <option>Home Decor</option>
                            <option>Accessories</option>
                            <option>Other</option>
                        </select>
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '4px', fontSize: '0.9rem', fontWeight: 500 }}>{t('patterns.form.hookSize')}</label>
                        <input
                            name="hookSize"
                            value={formData.hookSize}
                            onChange={handleChange}
                            style={{ width: '100%', padding: '10px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}
                            placeholder="e.g. 3.0mm"
                        />
                    </div>
                </div>

                <div>
                    <label style={{ display: 'block', marginBottom: '4px', fontSize: '0.9rem', fontWeight: 500 }}>{t('patterns.form.difficulty')} (1-5)</label>
                    <div style={{ display: 'flex', gap: '8px' }}>
                        {[1, 2, 3, 4, 5].map(num => (
                            <button
                                type="button"
                                key={num}
                                onClick={() => setFormData(p => ({ ...p, difficulty: num }))}
                                style={{
                                    flex: 1, padding: '8px',
                                    borderRadius: 'var(--radius-sm)',
                                    border: `1px solid ${formData.difficulty === num ? 'var(--primary-color)' : 'var(--border-color)'}`,
                                    background: formData.difficulty === num ? 'var(--primary-color)' : 'var(--bg-card)',
                                    color: formData.difficulty === num ? 'white' : 'var(--text-main)'
                                }}
                            >
                                {num}
                            </button>
                        ))}
                    </div>
                </div>

                <div>
                    <label style={{ display: 'block', marginBottom: '4px', fontSize: '0.9rem', fontWeight: 500 }}>{t('patterns.form.tags')}</label>
                    <input
                        name="tags"
                        value={formData.tags}
                        onChange={handleChange}
                        style={{ width: '100%', padding: '10px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}
                        placeholder={t('patterns.form.tags')}
                    />
                </div>

                <div>
                    <label style={{ display: 'block', marginBottom: '4px', fontSize: '0.9rem', fontWeight: 500 }}>{t('patterns.form.content')}</label>
                    <textarea
                        name="content"
                        value={formData.content}
                        onChange={handleChange}
                        rows={10}
                        style={{ width: '100%', padding: '10px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', fontFamily: 'inherit', whiteSpace: 'pre-wrap' }}
                        placeholder={t('patterns.form.content')}
                    />
                </div>

                <div>
                    <label style={{ display: 'block', marginBottom: '4px', fontSize: '0.9rem', fontWeight: 500 }}>{t('patterns.form.notes')}</label>
                    <textarea
                        name="note" // Note: in DB it might be 'note' or 'notes', kept as 'note' based on ViewFile 255
                        value={formData.note}
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

export default PatternForm;
