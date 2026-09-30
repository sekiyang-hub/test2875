import type { Metadata } from 'next';
import { Header, Footer } from '@/components/clinic-ui';
import { clinic, siteURL } from '@/config/clinic';
import './globals.css';
import { ClinicSchema } from '@/components/structured-data';
export const metadata:Metadata = { title:{default:clinic.name,template:`%s | ${clinic.name}`},description:'연수행복치과의원 진료시간, 의료진 및 위치 안내',metadataBase:siteURL?new URL(siteURL):undefined, icons:{icon:'/favicon.svg'} };
export default function RootLayout({children}:{children:React.ReactNode}) { return <html lang="ko"><body><a className="skip" href="#main">본문 바로가기</a><ClinicSchema/><Header/><main id="main">{children}</main><Footer/></body></html>; }
