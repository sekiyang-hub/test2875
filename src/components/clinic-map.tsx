'use client';
import { useState } from 'react';
import { clinic } from '@/config/clinic';
import type { Language } from '@/content/languages';

const labels = {
  ko: { title: '연수행복치과의원 위치 지도', directions: '구글 지도에서 길찾기' },
  en: { title: 'Clinic location on Google Maps', directions: 'Get directions in Google Maps' },
  zh: { title: '诊所位置地图', directions: '使用 Google 地图导航' },
  vi: { title: 'Bản đồ vị trí phòng khám', directions: 'Tìm đường trên Google Maps' },
  mn: { title: 'Эмнэлгийн байршлын газрын зураг', directions: 'Google Maps дээр зам харах' },
  ne: { title: 'क्लिनिकको स्थानको नक्सा', directions: 'Google Maps मा बाटो हेर्नुहोस्' },
  ru: { title: 'Карта расположения клиники', directions: 'Построить маршрут в Google Картах' },
  uz: { title: 'Klinika joylashuvi xaritasi', directions: 'Google Maps orqali yo‘lni topish' },
  th: { title: 'แผนที่ที่ตั้งคลินิก', directions: 'ดูเส้นทางใน Google Maps' },
};

export function ClinicMap({ language = 'ko' }: { language?: Language | 'ko' }) {
  const text = labels[language];
  const [tmapNotice, setTmapNotice] = useState(false);
  const providers = ['Naver Map', 'Kakao Map', 'TMAP'];
  const extraLabels: Record<string,string[]> = {
    ko: ['네이버 지도에서 길찾기','카카오 지도에서 길찾기','티맵에서 길찾기'],
    en: providers.map(name => `Get directions in ${name}`),
    zh: providers.map(name => `使用 ${name} 导航`),
    vi: providers.map(name => `Tìm đường trên ${name}`),
    mn: providers.map(name => `${name} дээр зам харах`),
    ne: providers.map(name => `${name} मा बाटो हेर्नुहोस्`),
    ru: providers.map(name => `Построить маршрут в ${name}`),
    uz: providers.map(name => `${name} orqali yo‘lni topish`),
    th: providers.map(name => `ดูเส้นทางใน ${name}`),
  };
  const appNotes: Record<string,string> = {
    ko: '티맵 길찾기는 티맵 앱이 설치된 휴대전화에서 이용해 주세요.',
    en: 'Use TMAP directions on a phone with the TMAP app installed.',
    zh: '请在已安装 TMAP 应用的手机上使用导航。',
    vi: 'Sử dụng chỉ đường trên điện thoại đã cài ứng dụng TMAP.',
    mn: 'TMAP апп суулгасан утаснаас замын зааврыг ашиглана уу.',
    ne: 'TMAP एप स्थापना भएको फोनमा मार्ग निर्देशन प्रयोग गर्नुहोस्।',
    ru: 'Для маршрута TMAP используйте телефон с установленным приложением TMAP.',
    uz: 'TMAP yo‘nalishlarini TMAP ilovasi o‘rnatilgan telefonda oching.',
    th: 'ใช้เส้นทาง TMAP บนโทรศัพท์ที่ติดตั้งแอป TMAP',
  };
  const buttonStyle = { width: '100%', textAlign: 'center' as const };
  return <div className="clinic-map" style={{ marginTop: 24 }}>
    <iframe src={clinic.googleMapEmbedURL} title={text.title} width="600" height="320" style={{ width: '100%', height: 320, border: '1px solid #dbe6e6', display: 'block', borderRadius: 4 }} loading="lazy" allowFullScreen referrerPolicy="strict-origin-when-cross-origin"/>
    <div style={{display:'grid',gap:12,marginTop:16}}>
      <a className="button" href={clinic.googleDirectionsURL} target="_blank" rel="noopener noreferrer" style={buttonStyle}>{text.directions}</a>
      <a className="button" href={clinic.naverDirectionsURL} target="_blank" rel="noopener noreferrer" style={buttonStyle}>{extraLabels[language][0]}</a>
      <a className="button" href={clinic.kakaoDirectionsURL} target="_blank" rel="noopener noreferrer" style={buttonStyle}>{extraLabels[language][1]}</a>
      <a className="button" href={clinic.tmapDirectionsURL} style={buttonStyle} onClick={event => { if (!/Android|iPhone|iPad|iPod/i.test(navigator.userAgent)) { event.preventDefault(); setTmapNotice(true); } }}>{extraLabels[language][2]}</a>
    </div>
    <p className={tmapNotice ? 'notice' : 'muted'} role={tmapNotice ? 'status' : undefined} style={{marginTop:12}}>{appNotes[language]}</p>
  </div>;
}
