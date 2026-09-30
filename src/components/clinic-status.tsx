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
    const initialClock = setTimeout(() => setNow(new Date()), 0);
    void update(); const poll = setInterval(update, 30000); const clock = setInterval(() => setNow(new Date()), 1000);
    const focus = () => void update(); window.addEventListener('focus',focus);
    return () => { active = false; clearTimeout(initialClock); clearInterval(poll); clearInterval(clock); window.removeEventListener('focus',focus); };
  }, []);
  if (!statusStoreConfigured) return null;
  const language = pathname.startsWith('/guide/') ? pathname.split('/')[2] : 'ko';
  const labels = statusLabels[language as keyof typeof statusLabels] || statusLabels.ko;
  if (!now) return null;
  const locales: Record<string,string> = {ko:'ko-KR',en:'en-GB',zh:'zh-CN',vi:'vi-VN',mn:'mn-MN',ne:'ne-NP',ru:'ru-RU',uz:'uz-UZ',th:'th-TH'};
  const locale = locales[language] || 'ko-KR';
  const date = new Intl.DateTimeFormat(locale,{timeZone:'Asia/Seoul',year:'numeric',month:'long',day:'numeric',weekday:'long'}).format(now);
  const time = new Intl.DateTimeFormat(locale,{timeZone:'Asia/Seoul',hour:'2-digit',minute:'2-digit',hourCycle:'h23'}).format(now);
  const currentTime = <time className="clinic-current-time" dateTime={now.toISOString()}><span>{date}</span><strong>{time}</strong></time>;
  if (pathname.startsWith('/admin')) return <div className="container clinic-status">{currentTime}</div>;
  if (failed) return <div className="container clinic-status">{currentTime}<span>{language === 'ko' ? '현재 진료 상태는 전화로 확인해 주세요.' : labels[5]}</span></div>;
  const result = resolveClinicStatus(now,settings);
  return <div className={`container clinic-status status-${result.mode}`}>{currentTime}<div className="clinic-status-detail" role="status"><strong><span aria-hidden="true" className="status-dot"/>{labels[result.mode === 'open' ? 0 : result.mode === 'closed' ? 1 : 2]}</strong>{result.mode === 'open' && !result.manual && <span>{language === 'ko' ? `오늘 ${result.closes}까지 진료` : `${labels[3]} · ${labels[4]} ${result.closes}`}</span>}{result.message && <span>{result.message}</span>}{!result.manual && <small>{labels[5]}</small>}</div></div>;
}
