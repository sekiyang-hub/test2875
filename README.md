# 연수행복치과의원 홈페이지

Next.js App Router + TypeScript + Tailwind CSS. 대부분의 화면은 Server Components로 구성하고 정적 HTML로 내보냅니다. 모바일 메뉴와 FAQ는 기본 HTML details 요소를 사용합니다.

## 실행
Node.js 20.9 이상과 pnpm이 필요합니다. 이 프로젝트의 잠금 파일은 pnpm-lock.yaml입니다.

```sh
pnpm install --frozen-lockfile
cp .env.example .env.local
pnpm dev
```

Windows에서는 .env.example을 복사하여 .env.local로 이름을 바꾸면 됩니다. 브라우저에서 개발 서버가 표시하는 주소를 여세요.

```sh
pnpm typecheck
pnpm lint
pnpm build
```

빌드 결과는 out/입니다. 이 폴더를 정적 호스팅에 올리면 됩니다. Next.js 서버 기능이 필요한 상담·예약 시스템을 추가할 경우 output 설정과 배포 방식을 다시 검토하세요.

## 구조
- src/config/clinic.ts: 병원명, 원장, 주소, 전화, 진료시간, 지도·예약·상담 링크, 주차, 사진 경로와 공개 검토 상태
- src/app: 홈페이지와 독립 URL 페이지, sitemap.xml, robots.txt
- src/components: 공통 레이아웃, 진료시간, 버튼과 구조화 데이터
- src/content/treatments.ts: 진료과목 설명과 참고 자료
- src/content/faq.ts: 방문 FAQ
- src/content/information.ts: 안내 콘텐츠
- src/lib/seo.ts: 페이지 메타데이터
- src/lib/routes.ts: 자동 사이트맵에 사용할 경로
- public/images: 실제 사진으로 교체할 자리 표시 이미지
- .openai/hosting.json: 비공개 Sites 배포 정보

## 병원 정보 수정
src/config/clinic.ts에서 name, doctorName, address.full, phone, hours를 수정합니다. 전화번호와 링크가 비어 있으면 연결 버튼은 준비 중으로 표시됩니다. 전화번호를 입력하면 tel 링크가 자동 활성화됩니다. 예약 링크는 실제 예약 시스템 주소를 입력하세요. URL은 https로 시작하는 정상 주소를 사용합니다.

전화번호는 010-3915-2875로 등록됐으며, 오시는 길은 연수역을 임시 기준 위치로 사용합니다. 주소는 현재 인천광역시 연수구 연수동까지만 확정됐습니다. 상세주소, 좌표와 지도 링크를 추측해서 입력하지 마세요. parking과 transit에 주차 및 대중교통 안내를 넣습니다. 연수역 네이버 지도 검색 링크를 제공하며 API 지도는 포함되지 않았습니다.

## 의료진과 병원 소개
이름은 clinic.ts에서 변경합니다. /dentist의 약력과 철학, /about의 시설·장비·감염관리 내용은 실제 운영 자료를 받은 뒤 src/app/dentist/page.tsx와 src/app/about/page.tsx에서 수정합니다.

## 사진 교체
실제 병원 및 원장 사진을 public/images에 넣고 clinic.ts의 photos 경로를 바꿉니다. Next Image를 사용하며 크기를 미리 확보해 화면 밀림을 줄입니다. 초안은 텍스트가 표시된 SVG 자리 표시 이미지를 사용합니다.
실제 사진은 적절한 크기의 WebP/AVIF로 변환하세요. 정적 배포에서는 images.unoptimized=true이므로 서버 자동 최적화가 없습니다. 표시 크기에 맞춰 사진을 직접 압축하거나 외부 이미지 로더를 추가하세요. 원장 사진에 다른 사람의 이미지를 쓰지 마세요.

## 진료과목·FAQ·콘텐츠 추가
treatments.ts의 배열에 기존 형식과 동일하게 항목을 추가합니다. slug는 영어 소문자와 하이픈을 사용하세요. 목록·홈 카드·상세 페이지·사이트맵이 함께 갱신됩니다. 치료 설명은 의료진의 검토가 필요하며 제공하지 않는 진료를 본원 진료로 표시하지 마세요.
faq.ts 배열에서 q와 a를 추가하거나 수정합니다. information.ts에서 slug, title, description, sections를 넣으면 목록과 상세 페이지가 자동 생성됩니다.

## SEO와 AI가 읽을 수 있는 정보
각 페이지의 generateMetadata에 제목과 설명이 있습니다. 공통 SEO 설정은 src/lib/seo.ts입니다.
.env.local의 NEXT_PUBLIC_SITE_URL에 실제 공개 도메인을 넣고 빌드하면 canonical, Open Graph URL, 사이트맵과 BreadcrumbList에 반영됩니다. 값이 없으면 잘못된 예시 도메인을 출력하지 않습니다.
Dentist와 Person JSON-LD는 화면과 같은 데이터만 표시하며, 검증되지 않은 약력·전화·상세주소를 추가하지 않습니다. 공휴일은 PublicHolidays 진료시간으로 별도 표시합니다.
FAQ 구조화 데이터는 적용하지 않았습니다. 검색 결과의 FAQ 노출은 제한적이며, 실제 자격을 검토한 뒤 선택적으로 추가할 수 있습니다.
검색 및 AI 답변 노출을 보장할 수는 없습니다. 중요한 정보는 HTML 텍스트로 제공합니다.

## 공개 전
현재 contentVerified=false이므로 noindex 및 robots Disallow가 적용됩니다. 비공개 초안의 색인을 막기 위한 설정입니다.
상세주소·전화·예약 링크·진료과목 제공 여부·원장 약력·사진·치료 설명·개인정보처리방침을 확인하세요. 진료시간의 점심시간과 접수 마감시간도 확정하세요.
실제 콘텐츠 검토를 마친 다음 contentVerified=true로 바꾸고 NEXT_PUBLIC_SITE_URL을 공개 도메인으로 설정한 후 다시 빌드·배포합니다. 사이트 공유 범위는 별도로 공개 전환해야 합니다.
개인정보처리방침은 완성된 법률 문서가 아닌 작성 안내입니다. 상담 폼과 추적 스크립트는 없습니다. 호스팅 및 향후 외부 서비스의 실제 처리 내용을 반영해 확정하세요.
Google Search Console과 Naver Search Advisor 등록은 공개 도메인 확정 후 진행합니다. 키와 인증 정보는 소스에 직접 넣지 마세요.

## 배포
현재 .openai/hosting.json은 Sites 정적 배포(out/)를 사용합니다. 동일 프로젝트 ID를 유지하고 변경 후 다시 배포하세요.
다른 정적 호스팅을 쓰려면 pnpm build 후 out/만 업로드합니다. 각 경로의 index.html이 제공되는 디렉터리 방식과 404.html 처리를 지원해야 합니다.

## 참고
치료 설명의 참고 자료는 각 상세 페이지에 연결되어 있습니다. 콘텐츠는 일반 안내 초안이며 병원 의료진의 검토를 완료한 것으로 표시하지 않습니다.
Next.js: https://nextjs.org/docs/app/guides/static-exports
Google FAQ 안내: https://developers.google.com/search/docs/appearance/structured-data/faqpage
