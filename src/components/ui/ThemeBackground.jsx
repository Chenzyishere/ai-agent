import { useSettingsStore, backgroundPresets } from '@/stores/useSettingsStore';
import { useMemo } from 'react';

export default function ThemeBackground() {
  const bgKey = useSettingsStore((s) => s.settings.background);
  const preset = backgroundPresets[bgKey] || backgroundPresets.aurora;

  return useMemo(() => (
    <div aria-hidden="true" className="fixed inset-0 overflow-hidden pointer-events-none">
      <div
        className={`absolute inset-0 animate-[gradient-flow_8s_ease_infinite] bg-linear-to-r bg-[length:200%_200%] ${preset.gradient}`}
      >
        <div className={`absolute top-[-10%] left-[-10%] h-[50vw] w-[50vw] rounded-full blur-[120px] ${preset.glow1}`} />
        <div className={`absolute bottom-[-10%] right-[-10%] h-[50vw] w-[50vw] rounded-full blur-[120px] ${preset.glow2}`} />
      </div>
    </div>
  ), [preset]);
}
