import { Breadcrumb, PageIntro, Hours, ContactActions } from '@/components/clinic-ui';
import { BreadcrumbSchema } from '@/components/structured-data';
import { clinic, addressText } from '@/config/clinic';
import { metadata } from '@/lib/seo';
import { ClinicMap } from '@/components/clinic-map';
export const generateMetadata = () => metadata('오시는 길 · 진료시간', `${addressText}. 연수행복치과의원 위치와 평일·주말·공휴일 진료시간 안내.`, '/location');
export default function Page() {
 return <div className="container content"><Breadcrumb title="오시는 길"/><BreadcrumbSchema title="오시는 길" path="/location"/><PageIntro eyebrow="HOURS & LOCATION" title="오시는 길과 진료시간" description="방문에 필요한 정보를 한곳에서 확인하세요."/>
 <div className="content-grid"><section><h2>진료시간</h2><Hours/><p className="muted">점심시간 및 접수 마감시간은 확인 후 안내합니다.</p></section><section><h2>위치 안내</h2><p>{addressText}</p><p>연수행복치과의원은 건물 1층에 있습니다.</p><a className="button" href={clinic.googleMapURL}>구글 지도에서 위치 보기</a></section></div>
 <section id="location-map"><h2>위치 지도</h2><p>{addressText}</p><ClinicMap/></section>
 <div className="content-grid section"><section><h2>주차 안내</h2><p>{clinic.parking || '주차 가능 여부와 이용 방법 확인 중'}</p></section><section><h2>대중교통 안내</h2><p>{clinic.transit}</p></section></div>
 <section><h2>전화 문의</h2><p><a href={`tel:${clinic.phone.replace(/[^\d+]/g,'')}`}>{clinic.phone}</a></p></section><ContactActions/>
 </div>;
}
