import { AlertCircle, CheckCircle2, Info, X } from 'lucide-react';
import { useEffect } from 'react';
import { useClassroomStore } from '../store/useClassroomStore';

export function Toast() {
  const toast = useClassroomStore((state) => state.toast);
  const clearToast = useClassroomStore((state) => state.clearToast);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(clearToast, 3200);
    return () => window.clearTimeout(timer);
  }, [toast, clearToast]);

  if (!toast) return null;
  const Icon = toast.kind === 'success' ? CheckCircle2 : toast.kind === 'error' ? AlertCircle : Info;
  return (
    <div className={`toast toast-${toast.kind}`} role="status">
      <Icon size={20} />
      <span>{toast.message}</span>
      <button type="button" aria-label="Fechar notificação" onClick={clearToast}><X size={16} /></button>
    </div>
  );
}
