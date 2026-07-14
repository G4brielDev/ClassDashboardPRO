import { BookOpen, CircleHelp, Home, MonitorPlay, PanelLeft, Settings } from 'lucide-react';
import { NavLink, Outlet } from 'react-router-dom';
import { AppLogo } from './Logo';
import { cn } from './ui';

const links = [
  { to: '/', label: 'Início', icon: Home },
  { to: '/painel', label: 'Painel', icon: PanelLeft },
  { to: '/exibicao', label: 'Exibição', icon: MonitorPlay },
  { to: '/configuracoes', label: 'Configurações', icon: Settings },
  { to: '/ajuda', label: 'Ajuda', icon: CircleHelp }
];

export function AppShell() {
  return (
    <div className="app-shell">
      <header className="topbar">
        <AppLogo />
        <nav className="topnav" aria-label="Navegação principal">
          {links.map(({ to, label, icon: Icon }) => (
            <NavLink key={to} to={to} className={({ isActive }) => cn('topnav-link', isActive && 'active')}>
              <Icon size={18} />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>
        <a className="btn btn-primary btn-sm" href="/exibicao" target="_blank" rel="noreferrer"><MonitorPlay size={17} /> Abrir tela</a>
      </header>
      <main className="shell-content"><Outlet /></main>
      <footer className="footer"><BookOpen size={16} /> Tela de Sala · Dados salvos no navegador e sincronizados com a API quando disponível.</footer>
    </div>
  );
}
