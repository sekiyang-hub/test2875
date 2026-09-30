import {Breadcrumb,PageIntro,Photo,Notice} from '@/components/clinic-ui';
import {BreadcrumbSchema} from '@/components/structured-data';
import {clinic} from '@/config/clinic';import {metadata} from '@/lib/seo';
export const generateMetadata=()=>metadata('병원 소개','연수행복치과의원 병원 소개 및 시설 안내.','/about');
export default function Page(){return <div className="container content"><Breadcrumb title="병원 소개"/><BreadcrumbSchema title="병원 소개" path="/about"/><PageIntro eyebrow="ABOUT OUR CLINIC" title="연수행복치과의원 소개" description="인천 연수동에 위치한 연수행복치과의원의 기본 정보를 안내합니다."/><div className="content-grid"><Photo/><section><h2>병원 기본정보</h2><p>{clinic.name}<br/>원장 {clinic.doctorName}<br/>인천광역시 연수구 연수동</p><Notice>시설 사진과 진료 철학, 장비 및 감염관리 내용은 병원 확인 후 등록합니다.</Notice></section></div><section><h2>병원 특징 안내 준비 중</h2><p>진료 전 설명, 검사와 진단, 감염관리 및 치료 후 관리에 관한 실제 운영 내용을 확인하여 안내할 예정입니다.</p></section></div>;}
