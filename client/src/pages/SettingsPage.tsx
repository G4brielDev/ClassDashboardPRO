import { zodResolver } from '@hookform/resolvers/zod';
import { Download, FileJson, History, ImageUp, KeyRound, RotateCcw, Save, Settings, ShieldCheck, Trash2, Upload } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { hashPin } from '../lib/crypto';
import { schoolSchema } from '../lib/schemas';
import { exportData, importData } from '../services/export';
import { useClassroomStore } from '../store/useClassroomStore';
import { Button, Card, Field, Input, Select, Switch, Textarea } from '../components/ui';

type SchoolForm = z.infer<typeof schoolSchema>;

export function SettingsPage() {
  const data = useClassroomStore((state) => state.data);
  const updateSchool = useClassroomStore((state) => state.updateSchool);
  const updateDisplay = useClassroomStore((state) => state.updateDisplay);
  const setPin = useClassroomStore((state) => state.setPin);
  const replaceData = useClassroomStore((state) => state.replaceData);
  const resetAll = useClassroomStore((state) => state.resetAll);
  const notify = useClassroomStore((state) => state.notify);
  const [pinValue, setPinValue] = useState('');
  const [pinConfirm, setPinConfirm] = useState('');
  const importRef = useRef<HTMLInputElement>(null);
  const logoRef = useRef<HTMLInputElement>(null);
  const { register, handleSubmit, reset, formState: { errors } } = useForm<SchoolForm>({ resolver: zodResolver(schoolSchema), defaultValues: data.school });

  useEffect(() => reset(data.school), [data.school, reset]);

  const saveSchool = (values: SchoolForm) => { updateSchool(values); notify('Dados da escola salvos.'); };
  const uploadLogo = async (file?: File) => {
    if (!file) return;
    if (!['image/png', 'image/jpeg', 'image/svg+xml', 'image/webp'].includes(file.type)) return notify('Formato de imagem não suportado.', 'error');
    if (file.size > 2 * 1024 * 1024) return notify('A logomarca deve ter no máximo 2 MB.', 'error');
    const reader = new FileReader();
    reader.onload = () => { updateSchool({ logoDataUrl: String(reader.result) }); notify('Logomarca atualizada.'); };
    reader.onerror = () => notify('Não foi possível ler a imagem.', 'error');
    reader.readAsDataURL(file);
  };
  const handleImport = async (file?: File) => {
    if (!file) return;
    try {
      const imported = await importData(file);
      if (!confirm('Substituir os dados atuais pelo arquivo importado?')) return;
      replaceData({ ...imported, revision: imported.revision + 1, lastUpdated: new Date().toISOString() });
      notify('Dados importados com sucesso.');
    } catch (error) { notify(error instanceof Error ? error.message : 'Arquivo inválido.', 'error'); }
    if (importRef.current) importRef.current.value = '';
  };
  const activatePin = async () => {
    if (!/^\d{4,8}$/.test(pinValue)) return notify('O PIN deve ter entre 4 e 8 dígitos.', 'error');
    if (pinValue !== pinConfirm) return notify('Os PINs não coincidem.', 'error');
    setPin(true, await hashPin(pinValue));
    setPinValue(''); setPinConfirm(''); notify('Proteção por PIN ativada.');
  };
  const removeHistory = (id: string) => replaceData({ ...data, history: data.history.filter((entry) => entry.id !== id), revision: data.revision + 1, lastUpdated: new Date().toISOString() });

  return <div className="settings-page"><div className="page-heading"><div><p className="eyebrow">Configurações</p><h1>Preferências da sala</h1><p>Gerencie identificação, exibição, arquivos e proteção do painel.</p></div><Settings size={32} /></div>
    <div className="settings-columns"><div className="settings-main">
      <Card><div className="section-heading"><div><p className="eyebrow">Identificação</p><h2>Escola e turma</h2></div><ShieldCheck /></div><form onSubmit={handleSubmit(saveSchool)} className="form-stack"><div className="form-grid cols-2"><Field label="Nome da escola" error={errors.schoolName?.message}><Input {...register('schoolName')} /></Field><Field label="Turma" error={errors.classroomName?.message}><Input {...register('classroomName')} /></Field><Field label="Professor" error={errors.teacherName?.message}><Input {...register('teacherName')} /></Field><Field label="Disciplina" error={errors.subjectName?.message}><Input {...register('subjectName')} /></Field></div><div className="form-actions"><Button type="submit"><Save size={18} /> Salvar dados</Button></div></form></Card>
      <Card><div className="section-heading"><div><p className="eyebrow">Exibição</p><h2>Informações visíveis</h2></div><Settings /></div><div className="switch-grid"><Switch checked={data.display.showSeconds} onChange={(showSeconds) => updateDisplay({ showSeconds })} label="Mostrar segundos" /><Switch checked={data.display.showDate} onChange={(showDate) => updateDisplay({ showDate })} label="Mostrar data" /><Switch checked={data.display.showTeacher} onChange={(showTeacher) => updateDisplay({ showTeacher })} label="Mostrar professor" /><Switch checked={data.display.showSubject} onChange={(showSubject) => updateDisplay({ showSubject })} label="Mostrar disciplina" /><Switch checked={data.display.showAgenda} onChange={(showAgenda) => updateDisplay({ showAgenda })} label="Mostrar agenda" /><Switch checked={data.display.showTasks} onChange={(showTasks) => updateDisplay({ showTasks })} label="Mostrar tarefas" /><Switch checked={data.display.showBirthdays} onChange={(showBirthdays) => updateDisplay({ showBirthdays })} label="Mostrar aniversariantes" /><Switch checked={data.display.keepAwake} onChange={(keepAwake) => updateDisplay({ keepAwake })} label="Manter tela ativa" /><Switch checked={data.display.soundsEnabled} onChange={(soundsEnabled) => updateDisplay({ soundsEnabled })} label="Ativar sons" /></div><div className="form-grid cols-2"><Field label="Formato do relógio"><Select value={data.display.clockFormat} onChange={(event) => updateDisplay({ clockFormat: event.target.value as '12h' | '24h' })}><option value="24h">24 horas</option><option value="12h">12 horas</option></Select></Field><Field label="Ocultar controles após"><Select value={data.display.controlsAutoHideSeconds} onChange={(event) => updateDisplay({ controlsAutoHideSeconds: Number(event.target.value) })}><option value="3">3 segundos</option><option value="6">6 segundos</option><option value="10">10 segundos</option><option value="20">20 segundos</option></Select></Field></div><Field label="Mensagem do dia"><Textarea value={data.display.dailyMessage} onChange={(event) => updateDisplay({ dailyMessage: event.target.value })} /></Field></Card>
      <Card><div className="section-heading"><div><p className="eyebrow">Histórico</p><h2>Últimas aulas</h2></div><History /></div>{data.history.length ? <div className="history-list">{data.history.map((entry) => <article key={entry.id}><div><strong>{entry.subject} · {entry.classroom}</strong><span>{entry.date.split('-').reverse().join('/')} · {entry.startedAt}–{entry.endedAt} · {entry.durationMinutes} min</span></div><button onClick={() => removeHistory(entry.id)} aria-label="Excluir registro"><Trash2 /></button></article>)}</div> : <p className="muted">O histórico será preenchido ao finalizar uma aula pelo painel.</p>}{data.history.length > 0 && <Button variant="ghost" size="sm" onClick={() => { if (confirm('Limpar todo o histórico?')) replaceData({ ...data, history: [], revision: data.revision + 1, lastUpdated: new Date().toISOString() }); }}>Limpar histórico</Button>}</Card>
    </div><aside className="settings-side">
      <Card><div className="section-heading"><div><p className="eyebrow">Marca</p><h2>Logomarca</h2></div><ImageUp /></div><div className="logo-upload">{data.school.logoDataUrl ? <img src={data.school.logoDataUrl} alt="Prévia da logomarca" /> : <span><ImageUp />Sem imagem</span>}</div><input ref={logoRef} hidden type="file" accept=".png,.jpg,.jpeg,.svg,.webp" onChange={(event) => void uploadLogo(event.target.files?.[0])} /><Button variant="secondary" className="w-full" onClick={() => logoRef.current?.click()}><Upload size={17} /> Selecionar imagem</Button>{data.school.logoDataUrl && <Button variant="ghost" className="w-full" onClick={() => updateSchool({ logoDataUrl: '' })}>Remover logomarca</Button>}<small className="muted">PNG, JPG, SVG ou WebP. Máximo de 2 MB.</small></Card>
      <Card><div className="section-heading"><div><p className="eyebrow">Backup</p><h2>Importar e exportar</h2></div><FileJson /></div><Button className="w-full" onClick={() => exportData(data)}><Download size={17} /> Exportar JSON</Button><input ref={importRef} hidden type="file" accept="application/json,.json" onChange={(event) => void handleImport(event.target.files?.[0])} /><Button variant="secondary" className="w-full" onClick={() => importRef.current?.click()}><Upload size={17} /> Importar JSON</Button></Card>
      <Card><div className="section-heading"><div><p className="eyebrow">Proteção local</p><h2>PIN do painel</h2></div><KeyRound /></div>{data.pin.enabled ? <><p className="muted">O painel está protegido contra alterações acidentais.</p><Button variant="danger" className="w-full" onClick={() => { if (confirm('Remover a proteção por PIN?')) { setPin(false, ''); notify('Proteção removida.'); } }}>Remover PIN</Button></> : <><Field label="Novo PIN"><Input type="password" inputMode="numeric" maxLength={8} value={pinValue} onChange={(event) => setPinValue(event.target.value.replace(/\D/g, ''))} /></Field><Field label="Confirmar PIN"><Input type="password" inputMode="numeric" maxLength={8} value={pinConfirm} onChange={(event) => setPinConfirm(event.target.value.replace(/\D/g, ''))} /></Field><Button className="w-full" onClick={() => void activatePin()}>Ativar proteção</Button></>}</Card>
      <Card className="danger-card"><div className="section-heading"><div><p className="eyebrow">Restauração</p><h2>Dados de exemplo</h2></div><RotateCcw /></div><p>Substitui todo o conteúdo atual pelo conjunto inicial.</p><Button variant="danger" className="w-full" onClick={() => { if (confirm('Restaurar todos os dados?')) { resetAll(); notify('Configurações restauradas.'); } }}>Restaurar padrões</Button></Card>
    </aside></div>
  </div>;
}
