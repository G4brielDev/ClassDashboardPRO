import { ArrowRight, BellRing, CalendarClock, Cloud, MonitorPlay, Palette, ShieldCheck, TimerReset } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useClassroomStore } from '../store/useClassroomStore';
import { AppLogo } from '../components/Logo';
import { Badge, Card } from '../components/ui';

export function HomePage() {
  const apiConnected = useClassroomStore((state) => state.apiConnected);
  const school = useClassroomStore((state) => state.data.school);
  return (
    <div className="home-page">
      <section className="hero">
        <div className="hero-copy">
          <Badge tone={apiConnected ? 'success' : 'info'}>{apiConnected ? 'API Express conectada' : 'Modo local ativo'}</Badge>
          <h1>Uma tela organizada para conduzir a aula com clareza.</h1>
          <p>Gerencie agenda, atividades, cronômetro, tarefas e avisos em um painel. A apresentação é atualizada automaticamente em outra aba.</p>
          <div className="hero-actions"><Link className="btn btn-primary btn-lg" to="/painel">Abrir painel <ArrowRight size={19} /></Link><a className="btn btn-secondary btn-lg" href="/exibicao" target="_blank" rel="noreferrer"><MonitorPlay size={19} /> Abrir exibição</a></div>
          <div className="hero-note"><ShieldCheck size={18} /><span>Os dados ficam salvos no dispositivo e podem ser sincronizados pela API Express.</span></div>
        </div>
        <div className="hero-preview">
          <div className="preview-bar"><AppLogo compact /><span>{school.classroomName}</span><i /></div>
          <div className="preview-body"><div className="preview-main"><small>ATIVIDADE ATUAL</small><h2>Sistema Solar</h2><p>Exploração guiada e registro de curiosidades.</p><strong>24:36</strong><span><i style={{ width: '42%' }} /></span></div><div className="preview-side"><article><CalendarClock /><div><small>Próxima atividade</small><strong>Exercício em grupo</strong></div></article><article><BellRing /><div><small>Aviso</small><strong>Entrega até sexta-feira</strong></div></article></div></div>
        </div>
      </section>
      <section className="feature-section"><div className="section-title"><p className="eyebrow">Recursos principais</p><h2>Preparado para uso real em sala</h2></div><div className="feature-grid">
        <Card><TimerReset /><h3>Cronômetro confiável</h3><p>Continua correto mesmo quando a aba perde o foco ou a página é atualizada.</p></Card>
        <Card><CalendarClock /><h3>Agenda visual</h3><p>Organize a sequência da aula e marque atividades concluídas.</p></Card>
        <Card><Palette /><h3>Oito temas</h3><p>Alterne cores, modo escuro, escala de fonte e layouts de exibição.</p></Card>
        <Card><Cloud /><h3>React e Express</h3><p>Funciona localmente sem API e sincroniza com o backend quando disponível.</p></Card>
      </div></section>
      <section className="setup-banner"><div><p className="eyebrow">Comece agora</p><h2>Configure {school.schoolName}</h2><p>Revise escola, turma e preferências antes de abrir a tela no projetor.</p></div><Link className="btn btn-primary btn-lg" to="/configuracoes">Configurar minha sala <ArrowRight size={18} /></Link></section>
    </div>
  );
}
