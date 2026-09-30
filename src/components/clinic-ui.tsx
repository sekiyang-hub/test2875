'use client';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { clinic, addressText } from '@/config/clinic';
import { languages, type Language } from '@/content/languages';
const menuLabels = { en: 'Menu', zh: '菜单', vi: 'Menu', mn: 'Цэс', ne: 'मेनु', ru: 'Меню', uz: 'Menyu', th: 'เมนู' };
const kakaoLabels = { en: 'Chat on KakaoTalk', zh: 'KakaoTalk 咨询', vi: 'Tư vấn KakaoTalk', mn: 'KakaoTalk зөвлөгөө', ne: 'KakaoTalk परामर्श', ru: 'Чат в KakaoTalk', uz: 'KakaoTalk orqali maslahat', th: 'แชท KakaoTalk' };
function KakaoContact({label='카카오톡 상담'}:{label?:string}) { return clinic.kakaoURL ? <a className="button kakao" href={clinic.kakaoURL}>{label}</a> : null; }
const bookingLabels = { en: 'Book on Naver', zh: 'Naver 预约', vi: 'Đặt lịch Naver', mn: 'Naver цаг захиалах', ne: 'Naver मा बुकिङ', ru: 'Запись через Naver', uz: 'Naver orqali yozilish', th: 'จองผ่าน Naver' };
function NaverBooking({label='네이버 예약'}:{label?:string}) { return clinic.reservationURL ? <a className="button naver" href={clinic.reservationURL} target="_blank" rel="noopener noreferrer">{label}</a> : null; }
function useGuide() { const pathname = usePathname(); const code = pathname.split('/')[2]; return pathname.startsWith('/guide/') && Object.hasOwn(languages, code) ? { code: code as Language, text: languages[code as Language] } : null; }
export function Brand() { return <Link href="/" className="brand" aria-label={`${clinic.name} 홈`}><span className="brand-symbol" aria-hidden="true">H</span><span>{clinic.name}<small>YEONSU HAPPY DENTAL</small></span></Link>; }
const nav = [['/about','병원 소개'],['/dentist','의료진'],['/treatments','진료 안내'],['/faq','자주 묻는 질문'],['/location','오시는 길']];
export function Header() {
  const guide = useGuide();
  const links = guide ? [[`/guide/${guide.code}/#guide-hours`, guide.text.hours], [`/guide/${guide.code}/#guide-location`, guide.text.directions], [`/guide/${guide.code}/#guide-before`, guide.text.appointment]] : nav;
  const menu = guide ? menuLabels[guide.code] : '메뉴';
  return <header className="header" lang={guide?.text.lang || 'ko'}><nav className="language-nav container" aria-label="언어 선택 / Language"><Link href="/" lang="ko">한국어</Link>{Object.entries(languages).map(([code, text]) => <Link key={code} href={`/guide/${code}/`} lang={text.lang} aria-current={guide?.code === code ? 'page' : undefined}>{text.label}</Link>)}</nav><div className="container header-inner"><Brand/><nav className="desktop-nav" aria-label={menu}>{links.map(([url,name])=><Link key={url} href={url}>{name}</Link>)}</nav><details className="mobile-menu" key={guide?.code || 'ko'}><summary>{menu}</summary><nav aria-label={menu}>{links.map(([url,name])=><Link key={url} href={url}>{name}</Link>)}</nav></details></div></header>;
}
export function Hours() { return <div className="hours-list">{clinic.hours.map(h=><div key={h.label}><span>{h.label}</span><strong>{h.open}<span className="dash">–</span>{h.close}</strong></div>)}</div>; }
export function ContactActions() { return <div className="actions"><Link className="button" href="/treatments">진료 안내</Link><a className="button secondary" href="/location/#location-map">오시는 길</a>{clinic.phone ? <a className="button secondary" href={`tel:${clinic.phone.replace(/[^\d+]/g,'')}`}>전화하기</a> : <span className="button inactive" aria-disabled="true">전화 연결 준비 중</span>}<NaverBooking/><KakaoContact/></div>; }
export function Photo({kind='hero'}:{kind?:'hero'|'doctor'}) { return <div className={`photo photo-${kind}`}><Image src={clinic.photos[kind]} alt={kind==='hero'?'병원 실제 사진 등록 예정':'양세기 원장 사진 등록 예정'} fill sizes={kind==='hero'?'(max-width: 760px) 100vw, 50vw':'(max-width: 760px) 100vw, 35vw'} priority={kind==='hero'}/></div>; }
export function Footer() {
  const guide = useGuide();
  if (guide) return <><footer className="footer" lang={guide.text.lang}><div className="container footer-grid"><Brand/><div><strong>{guide.text.address}</strong><p>{guide.text.doctor}</p><a href={`tel:${clinic.phone}`}>{clinic.phone}</a><p><NaverBooking label={bookingLabels[guide.code]}/></p><p><KakaoContact label={kakaoLabels[guide.code]}/></p><p><Link href="/">{guide.text.home}</Link></p></div></div><div className="container footer-bottom">© {clinic.name}</div></footer><nav className="mobile-actions" lang={guide.text.lang} aria-label={menuLabels[guide.code]}><a href={`tel:${clinic.phone}`}>{guide.text.call}</a><NaverBooking label={bookingLabels[guide.code]}/><KakaoContact label={kakaoLabels[guide.code]}/><a href={clinic.googleDirectionsURL}>{guide.text.directions}</a></nav></>;
  return <><footer className="footer"><div className="container footer-grid"><Brand/><div><strong>{addressText}</strong><p>원장 {clinic.doctorName} · <a href={`tel:${clinic.phone.replace(/[^\d+]/g,'')}`}>{clinic.phone}</a> · 오시는 길: {clinic.directionsLabel}</p><p><NaverBooking/></p><p><KakaoContact/></p><Link href="/privacy">개인정보처리방침</Link> · <Link href="/information">치과정보</Link></div></div><div className="container footer-bottom">© {clinic.name}<span>현재 사이트는 병원 정보 및 콘텐츠 검토 전 초안입니다.</span></div></footer><nav className="mobile-actions" aria-label="빠른 이용">{clinic.phone?<a href={`tel:${clinic.phone}`}>전화하기</a>:<span aria-disabled="true">전화 준비 중</span>}<NaverBooking/><KakaoContact/><a href={clinic.googleDirectionsURL}>오시는 길</a></nav></>;
}
export function Breadcrumb({title, parent}:{title:string,parent?:{name:string,url:string}}) { return <nav className="breadcrumb" aria-label="현재 위치"><Link href="/">홈</Link><span>/</span>{parent&&<><Link href={parent.url}>{parent.name}</Link><span>/</span></>}<span aria-current="page">{title}</span></nav>; }
export function PageIntro({eyebrow,title,description}:{eyebrow:string,title:string,description:string}) {return <div className="page-intro"><span className="eyebrow">{eyebrow}</span><h1>{title}</h1><p>{description}</p></div>;}
export function Notice({children}:{children:React.ReactNode}) { return <div className="notice">{children}</div>; }
