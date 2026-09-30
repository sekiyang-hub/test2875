export const clinic = {
  name: '연수행복치과의원', doctorName: '양세기',
  address: { region: '인천광역시', district: '연수구', locality: '연수동', full: '인천광역시 연수구 먼우금로222번길 14 1층' },
  phone: '010-3915-2875', reservationURL: 'https://booking.naver.com/booking/13/bizes/679753', naverMapURL: '', kakaoMapURL: '', kakaoURL: 'https://pf.kakao.com/_xaxaQXG/chat',
  googleMapURL: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent('인천광역시 연수구 먼우금로222번길 14')}`,
  googleDirectionsURL: `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent('인천광역시 연수구 먼우금로222번길 14')}`,
  naverDirectionsURL: 'https://map.naver.com/p/directions/-/3z552Q,2AFKyU,%EC%9D%B8%EC%B2%9C%20%EC%97%B0%EC%88%98%EA%B5%AC%20%EB%A8%BC%EC%9A%B0%EA%B8%88%EB%A1%9C222%EB%B2%88%EA%B8%B8%2014,,ADDRESS_POI/-/transit',
  kakaoDirectionsURL: `https://map.kakao.com/link/to/${encodeURIComponent('연수행복치과의원')},37.4164196,126.6781292`,
  tmapDirectionsURL: `tmap://route?goalname=${encodeURIComponent('연수행복치과의원')}&goalx=126.6781292&goaly=37.4164196&rGoName=${encodeURIComponent('연수행복치과의원')}&rGoX=126.6781292&rGoY=37.4164196`,
  googleMapEmbedURL: 'https://www.google.com/maps/embed?pb=!1m5!3m3!1m2!1s0x357b79e8985ba055%3A0x3a44e5a85414747a!2z7J247LKc6rSR7Jet7IucIOyXsOyImOq1rCDrqLzsmrDquIjroZwyMjLrsojquLggMTQ!5e0!3m2!1sko!2skr!4v1790748403134!5m2!1sko!2skr',
  directionsLabel: '연수행복치과의원 · 1층', parking: '', transit: '구글 지도에서 출발지를 입력해 대중교통 또는 도보 경로를 확인하세요.', coordinates: null,
  hours: [
    { label: '평일 · 월요일–금요일', open: '10:00', close: '21:00', days: ['Monday','Tuesday','Wednesday','Thursday','Friday'] },
    { label: '토요일 · 일요일 · 공휴일', open: '10:00', close: '17:00', days: ['Saturday','Sunday'] },
  ],
  photos: { hero: '/images/clinic-placeholder.svg', doctor: '/images/doctor-yang-seki.jpg' },
  contentVerified: true,
};
export const addressText = clinic.address.full || `${clinic.address.region} ${clinic.address.district} ${clinic.address.locality}`;
export const siteURL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.dental365.net';

