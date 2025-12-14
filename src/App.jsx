import { createHashRouter, RouterProvider } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Patterns from './pages/Patterns';
import PatternForm from './pages/PatternForm';
import PatternDetail from './pages/PatternDetail';
import Projects from './pages/Projects';
import ProjectForm from './pages/ProjectForm';
import ProjectDetail from './pages/ProjectDetail';
import Inventory from './pages/Inventory';
import YarnForm from './pages/YarnForm';
import YarnDetail from './pages/YarnDetail';
import Finished from './pages/Finished';
import FinishedForm from './pages/FinishedForm';
import FinishedDetail from './pages/FinishedDetail';
import Settings from './pages/Settings';
import './index.css';

const router = createHashRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <Dashboard /> },
      { path: 'patterns', element: <Patterns /> },
      { path: 'patterns/new', element: <PatternForm /> },
      { path: 'patterns/:id', element: <PatternDetail /> },
      { path: 'patterns/:id/edit', element: <PatternForm /> },
      { path: 'projects', element: <Projects /> },
      { path: 'projects/new', element: <ProjectForm /> },
      { path: 'projects/:id', element: <ProjectDetail /> },
      { path: 'projects/:id/edit', element: <ProjectForm /> },
      { path: 'inventory', element: <Inventory /> },
      { path: 'inventory/new', element: <YarnForm /> },
      { path: 'inventory/:id', element: <YarnDetail /> },
      { path: 'inventory/:id/edit', element: <YarnForm /> },
      { path: 'finished', element: <Finished /> },
      { path: 'finished/new', element: <FinishedForm /> },
      { path: 'finished/:id', element: <FinishedDetail /> },
      { path: 'finished/:id/edit', element: <FinishedForm /> },
      { path: 'settings', element: <Settings /> },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
