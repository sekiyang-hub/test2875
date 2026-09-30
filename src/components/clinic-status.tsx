'use client';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { defaultStatusSettings, resolveClinicStatus, statusLabels } from '@/lib/clinic-status';
import { readStatus, statusStoreConfigured } from '@/lib/status-store';
export function ClinicStatus() {
  const pathname = usePathname();
  const [settings, setSettings] = useState(defaultStatusSettings);
  const [now, setNow] = useState<Date | null>(null);
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    if (!statusStoreConfigured) return;
    let active = true;
    async function update() { try { const next = await readStatus(); if(active) { setSettings(next); setNow(new Date()); setFailed(false); } } catch { if(active) { setFailed(true); setNow(null); } } }
    void update(); const poll = setInterval(update, 30000); const clock = setInterval(() => setNow(value => value ? new Date() : null), 15000);
    const focus = () => void update(); window.addEventListener('focus',focus);
    return () => { active = false; clearInterval(poll); clearInterval(clock); window.removeEventListener('focus',focus); };
  }, []);
  if (!statusStoreConfigured || pathname.startsWith('/admin')) return null;
  const language = pathname.startsWith('/guide/') ? pathname.split('/')[2] : 'ko';
  const labels = statusLabels[language as keyof typeof statusLabels] || statusLabels.ko;
  if (!now) return failed ? <div className="container clinic-status">{language === 'ko' ? '현재 진료 상태는 전화로 확인해 주세요.' : labels[5]}</div> : null;
  const result = resolveClinicStatus(now,settings);
  return <div className={`container clinic-status status-${result.mode}`} role="status"><strong><span aria-hidden="true" className="status-dot"/>{labels[result.mode === 'open' ? 0 : result.mode === 'closed' ? 1 : 2]}</strong>{result.mode === 'open' && !result.manual && <span>{language === 'ko' ? `오늘 ${result.closes}까지 진료` : `${labels[3]} · ${labels[4]} ${result.closes}`}</span>}{result.message && <span>{result.message}</span>}{!result.manual && <small>{labels[5]}</small>}</div>;
}
