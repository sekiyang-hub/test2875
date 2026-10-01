import type { Metadata } from 'next';
import { Header, Footer } from '@/components/clinic-ui';
import { clinic, siteURL } from '@/config/clinic';
import './globals.css';
import { ClinicSchema } from '@/components/structured-data';
import { ClinicStatus } from '@/components/clinic-status';
export const metadata:Metadata = { title:{default:clinic.name,template:`%s | ${clinic.name}`},description:'연수행복치과의원 진료시간, 의료진 및 위치 안내',metadataBase:siteURL?new URL(siteURL):undefined, icons:{icon:'/favicon.svg'}, verification:{google:'QDDaVDaIDSPgSkf6TRvbWn750EcJ57JkNuU0zTc3buk'}, other:{'naver-site-verification':'ae015cd15a19d94191afde23e1f367bff3fda723'} };
export default function RootLayout({children}:{children:React.ReactNode}) { return <html lang="ko"><body><a className="skip" href="#main">본문 바로가기</a><ClinicSchema/><Header/><ClinicStatus/><main id="main">{children}</main><Footer/></body></html>; }
