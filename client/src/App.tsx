import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { AppShell } from './components/AppShell';
import { ErrorBoundary } from './components/ErrorBoundary';
import { Toast } from './components/Toast';
import { useClassroomSync } from './hooks/useClassroomSync';
import { useTheme } from './hooks/useTheme';
import { DashboardPage } from './pages/DashboardPage';
import { DisplayPage } from './pages/DisplayPage';
import { HelpPage } from './pages/HelpPage';
import { HomePage } from './pages/HomePage';
import { SettingsPage } from './pages/SettingsPage';

export default function App() {
  useTheme();
  useClassroomSync();
  return <ErrorBoundary><BrowserRouter><Routes><Route element={<AppShell />}><Route index element={<HomePage />} /><Route path="painel" element={<DashboardPage />} /><Route path="configuracoes" element={<SettingsPage />} /><Route path="ajuda" element={<HelpPage />} /></Route><Route path="exibicao" element={<DisplayPage />} /></Routes><Toast /></BrowserRouter></ErrorBoundary>;
}
