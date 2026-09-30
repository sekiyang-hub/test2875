export const clinic = {
  name: '연수행복치과의원', doctorName: '양세기',
  address: { region: '인천광역시', district: '연수구', locality: '연수동', full: '인천광역시 연수구 먼우금로222번길 14 1층' },
  phone: '010-3915-2875', reservationURL: '', naverMapURL: '', kakaoMapURL: '', kakaoURL: '',
  googleMapURL: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent('인천광역시 연수구 먼우금로222번길 14')}`,
  directionsLabel: '연수행복치과의원 · 1층', parking: '', transit: '구글 지도에서 출발지를 입력해 대중교통 또는 도보 경로를 확인하세요.', coordinates: null,
  hours: [
    { label: '평일 · 월요일–금요일', open: '10:00', close: '21:00', days: ['Monday','Tuesday','Wednesday','Thursday','Friday'] },
    { label: '토요일 · 일요일 · 공휴일', open: '10:00', close: '17:00', days: ['Saturday','Sunday'] },
  ],
  photos: { hero: '/images/clinic-placeholder.svg', doctor: '/images/doctor-placeholder.svg' },
  contentVerified: true,
};
export const addressText = clinic.address.full || `${clinic.address.region} ${clinic.address.district} ${clinic.address.locality}`;
export const siteURL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.dental365.net';
