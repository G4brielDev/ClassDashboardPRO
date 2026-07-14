import { useEffect } from 'react';
import { useClassroomStore } from '../store/useClassroomStore';

export function useTheme(): void {
  const appearance = useClassroomStore((state) => state.data.appearance);

  useEffect(() => {
    const root = document.documentElement;
    root.dataset.theme = appearance.theme;
    root.classList.toggle('dark', appearance.mode === 'dark');
    root.style.setProperty('--font-scale', String(appearance.fontScale));
    root.dataset.radius = appearance.radius;
    root.dataset.density = appearance.density;
    root.classList.toggle('reduce-motion', !appearance.animations);
  }, [appearance]);
}
