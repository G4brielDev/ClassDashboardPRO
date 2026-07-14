import { useEffect, useRef } from 'react';
import { classroomApi } from '../services/api';
import { useClassroomStore } from '../store/useClassroomStore';
import type { ClassroomData } from '../types';

const CHANNEL_NAME = 'tela-de-sala-sync';

function isNewer(candidate: ClassroomData, current: ClassroomData): boolean {
  return candidate.revision > current.revision || new Date(candidate.lastUpdated).getTime() > new Date(current.lastUpdated).getTime();
}

export function useClassroomSync(): void {
  const saveTimer = useRef<number | null>(null);
  const applyingRemote = useRef(false);

  useEffect(() => {
    let channel: BroadcastChannel | null = null;
    let eventSource: EventSource | null = null;

    const applyRemote = (incoming: ClassroomData) => {
      const current = useClassroomStore.getState().data;
      if (isNewer(incoming, current)) {
        applyingRemote.current = true;
        useClassroomStore.getState().replaceData(incoming);
        window.setTimeout(() => { applyingRemote.current = false; }, 0);
      }
    };

    const loadServerState = async () => {
      try {
        const remote = await classroomApi.getState();
        useClassroomStore.getState().setApiConnected(true);
        applyRemote(remote);
      } catch {
        useClassroomStore.getState().setApiConnected(false);
      }
    };

    void loadServerState();

    if ('BroadcastChannel' in window) {
      channel = new BroadcastChannel(CHANNEL_NAME);
      channel.onmessage = (event: MessageEvent<ClassroomData>) => applyRemote(event.data);
    }

    const onStorage = (event: StorageEvent) => {
      if (event.key !== 'tela-de-sala-external-sync' || !event.newValue) return;
      try { applyRemote(JSON.parse(event.newValue) as ClassroomData); } catch { /* ignore malformed external state */ }
    };
    window.addEventListener('storage', onStorage);

    try {
      eventSource = new EventSource(classroomApi.eventUrl);
      eventSource.addEventListener('state-updated', () => void loadServerState());
      eventSource.onerror = () => useClassroomStore.getState().setApiConnected(false);
    } catch {
      eventSource = null;
    }

    const unsubscribe = useClassroomStore.subscribe((state, previous) => {
      if (state.data === previous.data || applyingRemote.current) return;
      channel?.postMessage(state.data);
      localStorage.setItem('tela-de-sala-external-sync', JSON.stringify(state.data));
      if (saveTimer.current) window.clearTimeout(saveTimer.current);
      saveTimer.current = window.setTimeout(async () => {
        try {
          await classroomApi.saveState(useClassroomStore.getState().data);
          useClassroomStore.getState().setApiConnected(true);
        } catch {
          useClassroomStore.getState().setApiConnected(false);
        }
      }, 600);
    });

    return () => {
      unsubscribe();
      channel?.close();
      eventSource?.close();
      window.removeEventListener('storage', onStorage);
      if (saveTimer.current) window.clearTimeout(saveTimer.current);
    };
  }, []);
}
