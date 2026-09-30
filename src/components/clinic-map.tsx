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
  return <div className="clinic-map" style={{ marginTop: 24 }}>
    <iframe src={clinic.googleMapEmbedURL} title={text.title} width="600" height="320" style={{ width: '100%', height: 320, border: '1px solid #dbe6e6', display: 'block', borderRadius: 4 }} loading="lazy" allowFullScreen referrerPolicy="strict-origin-when-cross-origin"/>
    <a className="button" href={clinic.googleDirectionsURL} style={{ width: '100%', marginTop: 16, textAlign: 'center' }}>{text.directions}</a>
  </div>;
}
