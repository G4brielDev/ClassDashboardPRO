import { Presentation } from 'lucide-react';
import { useClassroomStore } from '../store/useClassroomStore';
import { cn } from './ui';

export function AppLogo({ compact = false }: { compact?: boolean }) {
  const logoDataUrl = useClassroomStore((state) => state.data.school.logoDataUrl);
  return (
    <div className={cn('app-logo', compact && 'app-logo-compact')}>
      <span className="logo-mark">
        {logoDataUrl ? <img src={logoDataUrl} alt="Logomarca da escola" /> : <Presentation size={compact ? 18 : 24} />}
      </span>
      {!compact && <span><strong>Tela de Sala</strong><small>Painel digital</small></span>}
    </div>
  );
}
