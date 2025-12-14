import { Outlet, NavLink, Link } from 'react-router-dom';
import { Home, BookOpen, Layers, Archive, CheckCircle, Settings } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import './Layout.css';

const Layout = () => {
    const { t } = useTranslation();

    return (
        <div className="app-layout">
            <header className="app-header">
                <h1>Crochet Manager</h1>
                <Link to="/settings" style={{ color: 'inherit', display: 'flex', alignItems: 'center' }}>
                    <Settings size={24} />
                </Link>
            </header>

            <main className="app-content">
                <Outlet />
            </main>

            <nav className="bottom-nav">
                <NavLink to="/" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                    <Home size={24} />
                    <span>{t('nav.home')}</span>
                </NavLink>
                <NavLink to="/patterns" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                    <BookOpen size={24} />
                    <span>{t('nav.patterns')}</span>
                </NavLink>
                <NavLink to="/projects" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                    <Layers size={24} />
                    <span>{t('nav.projects')}</span>
                </NavLink>
                <NavLink to="/inventory" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                    <Archive size={24} />
                    <span>{t('nav.inventory')}</span>
                </NavLink>
                <NavLink to="/finished" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                    <CheckCircle size={24} />
                    <span>{t('nav.finished')}</span>
                </NavLink>
            </nav>
        </div>
    );
};

export default Layout;
