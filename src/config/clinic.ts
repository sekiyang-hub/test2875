export const clinic = {
  name: '연수행복치과의원', doctorName: '양세기',
  address: { region: '인천광역시', district: '연수구', locality: '연수동', full: '' },
  phone: '010-3915-2875', reservationURL: '', naverMapURL: 'https://map.naver.com/p/search/%EC%97%B0%EC%88%98%EC%97%AD', kakaoMapURL: '', kakaoURL: '',
  directionsLabel: '연수역', parking: '', transit: '연수역을 임시 기준 위치로 안내합니다. 병원까지의 정확한 경로는 상세주소 확인 후 안내합니다.', coordinates: null,
  hours: [
    { label: '평일 · 월요일–금요일', open: '10:00', close: '21:00', days: ['Monday','Tuesday','Wednesday','Thursday','Friday'] },
    { label: '토요일 · 일요일 · 공휴일', open: '10:00', close: '17:00', days: ['Saturday','Sunday'] },
  ],
  photos: { hero: '/images/clinic-placeholder.svg', doctor: '/images/doctor-placeholder.svg' },
  contentVerified: false,
};
export const addressText = clinic.address.full || `${clinic.address.region} ${clinic.address.district} ${clinic.address.locality}`;
export const siteURL = process.env.NEXT_PUBLIC_SITE_URL || '';
