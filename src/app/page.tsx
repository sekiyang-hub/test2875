import Link from 'next/link';
import { clinic } from '@/config/clinic';
import { HomeTreatmentOverview } from "@/components/treatment-index";
import { ContactActions, Hours, Photo } from '@/components/clinic-ui';
import { ClinicMap } from "@/components/clinic-map";
import { metadata } from '@/lib/seo';
export const generateMetadata=()=>metadata('연수행복치과의원 · 진료시간과 방문 안내','인천 연수구 연수행복치과의원. 평일 10:00–21:00, 토요일·일요일·공휴일 10:00–17:00.');
export default function Home() { return <><section className="hero"><div className="container hero-grid"><div className="hero-copy"><span className="eyebrow">인천 연수구 · YEONSU HAPPY Dental Clinic</span><h1>{clinic.name}</h1><p className="hero-lead">평일 밤 9시까지,<br/>주말과 공휴일에도 진료합니다.</p><p className="hero-sub">일상에 맞춰 방문하실 수 있도록<br/>진료시간과 위치를 먼저 확인하세요.</p><ContactActions/></div><div className="hero-side"><Photo/><div className="hero-hours"><span className="eyebrow">OPENING HOURS</span><h2>방문 전, 진료시간을 확인하세요</h2><Hours/><Link href="/location">진료시간·위치 자세히 보기</Link></div></div></div></section><section className="section container" id="location-map"><h2>위치 지도</h2><p>{clinic.address.full}</p><ClinicMap/></section><HomeTreatmentOverview/><section className="section doctor-section"><div className="container doctor-grid"><Photo kind="doctor"/><div><span className="eyebrow">OUR DENTIST</span><h2>{clinic.doctorName} 원장</h2><p>연수행복치과의원 의료진 소개</p><p className="muted">약력과 진료 분야, 진료 철학을 준비하고 있습니다.</p><Link className="button secondary" href="/dentist">의료진 소개</Link></div></div></section></>; }
