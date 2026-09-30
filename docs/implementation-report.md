# 진료 콘텐츠 개편 결과

2026-09-30. 현재 프로젝트에 저장된 병원 기본정보는 변경하지 않았다. src/config/clinic.ts의 작업 전후 파일 내용 일치를 확인했다. 외국어 안내와 예약·전화·지도 연결, 원장 사진과 관리자 설정을 유지했다.

## 변경 사항
- 홈페이지의 짧은 진료 초안 카드를 6개 분야 안내와 증상별 진료 찾기로 개편.
- /treatments/를 6개 분야와 11개 증상별 진입점으로 구성.
- 기존 상세페이지 5개를 확장하고 17개 상세페이지를 추가하여 총 22개 제공.
- 상세페이지에 검사, 치료 흐름, 조건별 선택, 치료 후 관리와 관련 안내를 제공.
- 기본정보·다국어 안내는 유지. 삭제했던 홈 FAQ와 메뉴는 되살리지 않음. /faq/ 기존 독립 페이지는 유지.

## 상세 페이지 URL
공개 기준 주소 https://www.dental365.net 아래의 경로이며, 2026-09-30 재업로드에서 원격 코드 일치와 실제 사이트의 새 진료 안내 표시를 확인했다.

| 분야 | 경로 |
| --- | --- |
| 임플란트 | /treatments/implant/ |
| 디지털 가이드 | /treatments/digital-guided-implant/ |
| 임플란트 문제·수리 | /treatments/implant-repair/ |
| 주변 잇몸 염증·주위염 | /treatments/peri-implantitis/ |
| 임플란트 유지관리 | /treatments/implant-maintenance/ |
| 충치·보존 | /treatments/cavity/ |
| 레진 빌드업 | /treatments/resin-build-up/ |
| 생활치수치료·VPT | /treatments/vital-pulp-therapy/ |
| 신경·근관치료 | /treatments/root-canal/ |
| 치주치료 | /treatments/periodontal/ |
| 스케일링 | /treatments/scaling/ |
| 보철·심미 | /treatments/prosthodontics/ |
| 지르코니아 인레이·온레이 | /treatments/zirconia-inlay-onlay/ |
| 라미네이트·무삭제·최소삭제 | /treatments/laminate/ |
| 메릴랜드 브릿지 | /treatments/maryland-bridge/ |
| STM | /treatments/stm/ |
| 치아미백 | /treatments/whitening/ |
| 사랑니·발치 | /treatments/wisdom-teeth/ |
| 턱관절 | /treatments/temporomandibular-disorders/ |
| 부분교정 | /treatments/partial-orthodontics/ |
| 투명교정 | /treatments/clear-aligners/ |
| 치아 사이 벌어짐 | /treatments/diastema/ |

## 구현 파일
변경: src/app/page.tsx, src/app/globals.css, src/app/treatments/page.tsx, src/app/treatments/[slug]/page.tsx, src/content/treatments.ts.

추가: src/content/treatment-guides.ts, src/components/treatment-content.tsx, treatment-detail.tsx, treatment-index.tsx, treatment-schema.tsx.

lint 정리: src/components/clinic-status.tsx의 초기 시각 설정을 정리하고 postcss.config.mjs의 익명 기본 내보내기를 이름 있는 변수로 변경. 진료시간 계산과 기본정보 데이터는 변경하지 않음.

문서: docs/image-sources.md, visual-assets-needed.md, medical-content-review.md, implementation-report.md, check-treatment-export.mjs, export-check-result.txt.

## 도식과 이미지
임플란트 구조·브릿지 비교 자체 SVG 2종. 디지털 가이드, VPT, 빌드업, STM 등의 HTML/CSS 단계도와 치간이개 조건별 선택지 도식. SVG는 viewBox로 비율을 유지하며 반응형으로 축소한다. SVG의 title/desc로 정보성 대체 설명을 제공. 새 외부 이미지, 스톡 치료사례와 Before/After 없음.

턱관절 해부학·운동 도식과 추가 치아 단면 도식 제작 요구사항은 visual-assets-needed.md에 기록. 기존 Next Image 방식과 사진은 유지. 이번 변경은 추가 래스터 이미지 요청이나 이미지 최적화 라이브러리를 만들지 않음. CLS의 정량 측정은 수행하지 않았으며, SVG 비율과 화면 넘침을 확인함.

## SEO와 구조화 데이터
상세페이지별 title/description/canonical과 H1·논리적인 H2/H3. 기존 metadata 함수와 BreadcrumbList·Dentist 스키마 재사용. 각 상세페이지에 내용과 일치하는 MedicalWebPage를 추가하고 기존 병원 스키마를 중복 생성하지 않음. 실제 치료 제공이나 의료진 승인 상태를 구조화 데이터로 주장하지 않음. 진료 데이터로부터 새 경로가 기존 routes.ts와 sitemap.ts에 자동 반영됨.

## 검증
- pnpm lint: 통과, 오류·경고 없음.
- pnpm typecheck: 통과.
- pnpm build: 통과, 44개 정적 출력.
- node docs/check-treatment-export.mjs: 22개 진료 상세 및 홈·목록 총 24페이지 검사 통과. 내부 링크와 앵커, H1, title/description/canonical, 이미지 ALT·파일 존재, JSON-LD JSON 파싱, 사이트맵 경로 확인.
- 390px 모바일, 820px 태블릿, 기본 1280px 데스크톱에서 레이아웃을 확인. 모바일 1열, 태블릿 2열, 가로 넘침 없음. 진료 분야 앵커 이동 및 브릿지 도식의 데스크톱 표시 확인.
- 병원 기본정보 파일 불변 확인. 홈의 FAQ 섹션·링크가 제거 상태임을 자동 검사.
- 실제 Google 검색 리치결과 승인·검색 노출·의료진 검토 또는 Vercel 배포를 보장하지 않음.

## 남은 확인
의료진의 본원 진료범위·내용·도식 검토는 medical-content-review.md 참조. 외국어 진료 상세 번역은 이번 작업에 포함하지 않음. 최초 업로드는 브라우저 보안 정책으로 차단되었으나, 사용자 요청에 따른 재시도에서 GitHub 업로드와 실제 사이트 반영을 확인함. 제공하는 소스 ZIP은 .env.local, node_modules, .next, out 및 Git 관련 내부 파일을 제외함.
