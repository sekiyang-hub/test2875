import {clinic} from '@/config/clinic';
export const faqs = [
{q:'평일 저녁에도 진료하나요?',a:`월요일부터 금요일까지 ${clinic.hours[0].open}~${clinic.hours[0].close} 진료합니다.`},
{q:'주말과 공휴일 진료시간은 어떻게 되나요?',a:`토요일·일요일·공휴일에는 ${clinic.hours[1].open}~${clinic.hours[1].close} 진료합니다.`},
{q:'병원은 어디에 있나요?',a:`${clinic.address.full}에 있습니다. 오시는 길 페이지에서 구글 지도로 위치와 방문 경로를 확인하세요.`},
{q:'예약이나 전화 상담은 어떻게 하나요?',a:`전화 문의는 ${clinic.phone}로 연락하세요. 온라인 예약 링크는 준비 중입니다.`},
{q:'주차가 가능한가요?',a:'주차 가능 여부와 이용 방법은 확인 후 안내합니다.'},
{q:'점심시간과 접수 마감시간이 따로 있나요?',a:'점심시간과 접수 마감시간은 확인 후 안내합니다.'}
];
