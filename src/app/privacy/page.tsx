import {appointmentsEnabled,appointmentPreview} from '@/lib/simple-appointments';
import {appointmentStorageRegion,appointmentRetentionDays} from '@/config/appointments';
import {clinic} from '@/config/clinic';
import {Breadcrumb,PageIntro} from '@/components/clinic-ui';
import {metadata} from '@/lib/seo';

const privacyOfficer={name:'양세기',title:'원장',phone:'010-8159-2879'};

export const generateMetadata=()=>metadata('개인정보처리방침','예약 신청 정보의 수집 목적, 보유기간, 국외 이전, 보호책임자 안내.','/privacy');

export default function Page(){return <div className="container content"><Breadcrumb title="개인정보처리방침"/><PageIntro eyebrow="PRIVACY" title="개인정보처리방침" description={`${clinic.name}은 개인정보 보호법에 따라 홈페이지에서 처리하는 개인정보를 아래와 같이 안내합니다.`}/>
<p>시행일: 2026년 11월 5일</p>

<section><h2>1. 처리 목적과 처리 항목</h2>
<p>{appointmentPreview?'로컬 미리보기에서는 입력 내용을 서버에 전송하거나 저장하지 않습니다.':appointmentsEnabled?'홈페이지의 간편 예약 신청 시 동의를 받아 아래 정보를 수집합니다.':'온라인 신청 기능은 현재 비활성화되어 있습니다.'}</p>
<ul>
<li>처리 목적: 예약 신청 확인, 직원의 전화 연락, 일정 조율·확정 및 변경 처리</li>
<li>필수 항목: 이름, 휴대전화 번호, 희망 방문 일시</li>
<li>함께 저장되는 정보: 신청 화면 언어, 접수번호, 처리 상태, 확정 일시, 신청·수정·처리 시각</li>
<li>관리자 계정: 예약을 처리하는 직원의 로그인 이메일과 처리 기록</li>
</ul>
<p>수집·이용 동의를 거부할 수 있으며, 이 경우 온라인 신청은 이용할 수 없습니다. 전화 문의와 예약은 가능합니다. 신청란에는 주민등록번호, 진료기록 또는 상세한 건강정보를 입력하지 마세요.</p>
<p>만 14세 미만 아동의 예약은 법정대리인이 신청하거나 병원으로 전화해 주세요.</p>
</section>

<section><h2>2. 보유기간과 파기</h2>
<ul>
<li>보유기간: 희망 방문 일시, 확정 일시, 마지막 처리 일시 중 가장 늦은 시점으로부터 {appointmentRetentionDays}일</li>
<li>파기 절차: 매일 실행되는 자동 삭제 작업으로 보유기간이 지난 신청과 처리 이력을 함께 삭제합니다.</li>
<li>파기 방법: 전자적 파일 형태의 정보는 데이터베이스에서 복구할 수 없는 방법으로 삭제합니다. 홈페이지 예약 정보는 종이로 출력해 보관하지 않습니다.</li>
</ul>
<p>다른 법령에 따라 보존해야 하는 경우에는 해당 법령이 정한 기간 동안 보관합니다.</p>
</section>

<section><h2>3. 제3자 제공</h2>
<p>{clinic.name}은 예약 신청 정보를 제3자에게 제공하지 않습니다. 다만 정보주체가 별도로 동의하거나 법령에 특별한 규정이 있는 경우에는 예외로 합니다.</p>
<p>예약 신청 정보는 AI 모델이나 자동 문자 발송 서비스로 전송하지 않습니다. 신청 내역은 승인된 직원만 확인하고 처리합니다.</p>
</section>

<section><h2>4. 처리 위탁</h2>
<ul>
<li>수탁자: Supabase Pte. Ltd.</li>
<li>위탁 업무: 예약 신청 데이터 저장, 관리자 로그인 인증, 데이터베이스 운영</li>
<li>보유기간: 위 2항의 보유기간 또는 위탁계약 종료 시까지</li>
</ul>
<p>홈페이지는 Vercel Inc.(미국)의 호스팅 서비스로 운영됩니다. 서비스 제공과 보안을 위해 접속 기록(IP 주소, 접속 시각, 브라우저 정보)이 호스팅 업체에 일시적으로 기록될 수 있습니다. 예약 신청 정보는 호스팅 업체에 저장되지 않고 위 수탁자의 데이터베이스로 바로 전송됩니다.</p>
</section>

<section><h2>5. 개인정보의 국외 이전</h2>
<p>예약 신청 정보는 {appointmentStorageRegion}의 서버에 저장됩니다. 다만 수탁자의 기술 지원, 장애 대응, 보안 사고 대응 과정에서 국외에서 원격으로 접근할 수 있어 개인정보 보호법 제28조의8에 따라 아래와 같이 안내합니다.</p>
<ul>
<li>이전받는 자: Supabase Pte. Ltd.(싱가포르) 및 기술 지원·운영을 맡는 계열사 Supabase, Inc.(미국)</li>
<li>연락처: <a href="mailto:privacy@supabase.com">privacy@supabase.com</a></li>
<li>이전되는 국가: 싱가포르, 미국 (지원 인력의 근무 지역에 따라 그 밖의 국가에서 접근할 수 있음)</li>
<li>이전 시기와 방법: 예약 신청 시 정보통신망을 통해 서울 리전 서버에 저장되며, 기술 지원·보안 대응이 필요한 때에 접근 권한이 통제된 원격 접속으로 열람될 수 있습니다.</li>
<li>이전 항목: 위 1항의 예약 신청 정보와 관리자 계정 정보</li>
<li>이전 목적: 데이터 저장, 관리자 인증, 기술 지원 및 보안 대응</li>
<li>보유·이용 기간: 위 2항의 보유기간 또는 위탁계약 종료 시까지</li>
<li>거부 방법과 효과: 온라인 신청을 이용하지 않으면 국외 이전이 발생하지 않습니다. 이 경우 전화로 예약할 수 있습니다.</li>
</ul>
<p>수탁자의 처리 지역에 관한 자세한 내용은 <a href="https://supabase.com/legal/privacy-resources/data-residency-and-transfers-faq" target="_blank" rel="noopener noreferrer">Supabase 데이터 처리 안내</a>에서 확인할 수 있습니다.</p>
</section>

<section><h2>6. 정보주체의 권리와 행사 방법</h2>
<p>정보주체는 언제든지 개인정보 열람, 정정·삭제, 처리정지, 동의 철회를 요구할 수 있습니다. 병원에 전화하거나 방문해 요청하실 수 있으며, 본인 확인 후 지체 없이 조치합니다. 법정대리인이나 위임을 받은 사람을 통해서도 요청할 수 있습니다.</p>
<p>직원 확정 전에는 신청을 완료한 대화창에서 내용을 직접 확인하고 수정할 수 있습니다. 수정 권한은 해당 페이지의 메모리에만 보관하므로 새로고침하거나 페이지를 나가면 온라인으로 다시 확인할 수 없습니다. 이후 변경·취소는 병원으로 전화해 주세요.</p>
</section>

<section><h2>7. 안전성 확보 조치</h2>
<ul>
<li>예약 정보는 승인된 관리자 계정으로 로그인한 직원만 조회할 수 있도록 데이터베이스 접근을 제한합니다.</li>
<li>홈페이지와 데이터베이스 사이의 모든 통신은 암호화(HTTPS)됩니다.</li>
<li>예약 처리 이력을 기록하고, 보유기간이 지난 정보는 자동으로 삭제합니다.</li>
<li>예약에 꼭 필요한 최소한의 정보만 수집합니다.</li>
</ul>
</section>

<section><h2>8. 쿠키 등 자동 수집 장치</h2>
<p>홈페이지는 방문 분석이나 광고를 위한 쿠키를 사용하지 않습니다. 지도, 네이버 예약, 카카오톡 연결을 이용하면 해당 서비스가 자체 정책에 따라 쿠키를 사용할 수 있으며, 브라우저 설정에서 쿠키 저장을 거부할 수 있습니다.</p>
</section>

<section><h2>9. 개인정보 보호책임자</h2>
<ul>
<li>성명: {privacyOfficer.name}</li>
<li>직책: {privacyOfficer.title}</li>
<li>연락처: <a href={`tel:${privacyOfficer.phone.replace(/-/g,'')}`}>{privacyOfficer.phone}</a></li>
</ul>
<p>개인정보 열람 청구와 문의는 보호책임자 또는 병원 대표번호(<a href={`tel:${clinic.phone.replace(/-/g,'')}`}>{clinic.phone}</a>)로 접수할 수 있습니다.</p>
</section>

<section><h2>10. 권익침해 구제 방법</h2>
<p>개인정보 침해에 대한 신고나 상담이 필요한 경우 아래 기관에 문의할 수 있습니다.</p>
<ul>
<li>개인정보분쟁조정위원회: 1833-6972 (<a href="https://www.kopico.go.kr" target="_blank" rel="noopener noreferrer">www.kopico.go.kr</a>)</li>
<li>개인정보침해신고센터: 국번 없이 118 (<a href="https://privacy.kisa.or.kr" target="_blank" rel="noopener noreferrer">privacy.kisa.or.kr</a>)</li>
<li>대검찰청: 국번 없이 1301 (<a href="https://www.spo.go.kr" target="_blank" rel="noopener noreferrer">www.spo.go.kr</a>)</li>
<li>경찰청: 국번 없이 182 (<a href="https://ecrm.police.go.kr" target="_blank" rel="noopener noreferrer">ecrm.police.go.kr</a>)</li>
</ul>
</section>

<section><h2>11. 적용 범위와 변경</h2>
<p>이 방침은 홈페이지 예약 신청 정보에 적용됩니다. 병원에서 별도로 작성하는 진료기록은 의료법 등 해당 법령의 기준에 따라 처리합니다.</p>
<p>이 방침이 바뀌면 시행일과 함께 이 페이지에 안내합니다.</p>
<ul>
<li>2026년 11월 5일: 보호책임자, 국외 이전, 파기 방법, 권리 행사, 안전성 확보 조치, 구제 방법 추가</li>
<li>2026년 10월 27일: 최초 시행</li>
</ul>
</section>
</div>;}
