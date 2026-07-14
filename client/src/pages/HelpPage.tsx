import { BookOpen, Cloud, Download, Keyboard, MonitorPlay, Presentation, TimerReset, WifiOff } from 'lucide-react';
import { Card } from '../components/ui';

const shortcuts = [
  ['F', 'Entrar ou sair da tela cheia'], ['Espaço', 'Iniciar ou pausar o cronômetro'], ['R', 'Reiniciar o cronômetro'],
  ['↑ / ↓', 'Adicionar ou remover um minuto'], ['H', 'Ocultar ou exibir controles'], ['L', 'Alternar o layout']
];

export function HelpPage() {
  return <div className="help-page"><div className="page-heading"><div><p className="eyebrow">Central de ajuda</p><h1>Como usar a Tela de Sala</h1><p>Guia rápido para configurar, apresentar e fazer backup dos dados.</p></div><BookOpen size={32} /></div><div className="help-grid">
    <Card><Presentation /><h2>1. Configure a sala</h2><p>Abra Configurações, informe escola, turma, professor e disciplina. Envie uma logomarca opcional.</p></Card>
    <Card><CalendarIcon /><h2>2. Monte a agenda</h2><p>No Painel, acesse Agenda para incluir horários, atividades, intervalos, apresentações e avaliações.</p></Card>
    <Card><TimerReset /><h2>3. Ajuste o cronômetro</h2><p>Escolha uma duração ou use os controles de mais e menos um minuto. O cálculo utiliza o relógio real.</p></Card>
    <Card><MonitorPlay /><h2>4. Abra a exibição</h2><p>Abra a rota de exibição em outra aba, mova-a para o projetor e pressione F para tela cheia.</p></Card>
    <Card><Cloud /><h2>Sincronização</h2><p>Abas do mesmo navegador usam BroadcastChannel. Com a API Express ativa, os dados também são persistidos no servidor.</p></Card>
    <Card><WifiOff /><h2>Funcionamento offline</h2><p>Depois do primeiro carregamento, a PWA mantém os arquivos em cache. Os dados locais permanecem disponíveis sem internet.</p></Card>
    <Card><Download /><h2>Backup</h2><p>Exporte um JSON pela página Configurações. A importação valida o arquivo antes de substituir os dados atuais.</p></Card>
    <Card><Keyboard /><h2>Atalhos de teclado</h2><div className="shortcut-list">{shortcuts.map(([key, action]) => <div key={key}><kbd>{key}</kbd><span>{action}</span></div>)}</div></Card>
  </div><Card className="help-note"><h2>Deploy</h2><p>O frontend pode ser publicado no Netlify. Para persistência multiusuário, publique a API Express no Render ou Railway e configure <code>VITE_API_URL</code> no Netlify. O servidor Express também consegue servir o build do React em uma implantação única.</p></Card></div>;
}

function CalendarIcon() {
  return <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M8 2v4M16 2v4M3 10h18M5 4h14a2 2 0 0 1 2 2v14H3V6a2 2 0 0 1 2-2Z"/></svg>;
}
