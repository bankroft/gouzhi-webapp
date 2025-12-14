import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { projectsRepo, patternsRepo } from '../db/repositories';
import { ChevronLeft, Save } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const ProjectForm = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { id } = useParams();
    const isEdit = !!id;

    const [patterns, setPatterns] = useState([]);
    const [formData, setFormData] = useState({
        name: '',
        status: 'plan', // plan, in-progress, completed, paused
        startDate: new Date().toISOString().split('T')[0],
        patternId: '',
        progress: 0,
        notes: ''
    });

    useEffect(() => {
        patternsRepo.getAll().then(setPatterns);

        if (isEdit) {
            projectsRepo.get(id).then(data => {
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        const dataToSave = {
            ...formData,
            progress: Number(formData.progress)
        };

        if (isEdit) {
            await projectsRepo.update(dataToSave);
        } else {
            await projectsRepo.add(dataToSave);
        }
        navigate('/projects');
    };

    return (
        <div className="container">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '16px 0' }}>
                <button onClick={() => navigate(-1)}><ChevronLeft size={24} /></button>
                <h2>{isEdit ? t('projects.editTitle') : t('projects.addTitle')}</h2>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px', paddingBottom: '80px' }}>

                <div>
                    <label style={{ display: 'block', marginBottom: '4px', fontSize: '0.9rem', fontWeight: 500 }}>{t('projects.form.name')}</label>
                    <input
                        required
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        style={{ width: '100%', padding: '10px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}
                        placeholder={t('projects.form.name')}
                    />
                </div>

                <div>
                    <label style={{ display: 'block', marginBottom: '4px', fontSize: '0.9rem', fontWeight: 500 }}>{t('projects.form.status')}</label>
                    <select
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                        style={{ width: '100%', padding: '10px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', background: 'var(--bg-card)', color: 'var(--text-main)' }}
                    >
                        <option value="plan">{t('projects.status.plan')}</option>
                        <option value="in-progress">{t('projects.status.in_progress')}</option>
                        <option value="paused">{t('projects.status.paused')}</option>
                        <option value="completed">{t('projects.status.completed')}</option>
                    </select>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '4px', fontSize: '0.9rem', fontWeight: 500 }}>{t('projects.form.startDate')}</label>
                        <input
                            type="date"
                            name="startDate"
                            value={formData.startDate}
                            onChange={handleChange}
                            style={{ width: '100%', padding: '10px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', fontFamily: 'inherit' }}
                        />
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '4px', fontSize: '0.9rem', fontWeight: 500 }}>{t('projects.form.pattern')}</label>
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
                    <label style={{ display: 'block', marginBottom: '4px', fontSize: '0.9rem', fontWeight: 500 }}>{t('projects.form.progress')} ({formData.progress}%)</label>
                    <input
                        type="range"
                        name="progress"
                        min="0"
                        max="100"
                        step="5"
                        value={formData.progress}
                        onChange={handleChange}
                        style={{ width: '100%' }}
                    />
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

export default ProjectForm;
