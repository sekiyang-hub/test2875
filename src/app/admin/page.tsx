import type { Metadata } from 'next';
import { StatusAdmin } from '@/components/status-admin';
import Link from 'next/link';
export const metadata: Metadata = { title: '진료 상태 관리', robots: { index: false, follow: false } };
export default function AdminPage() { return <><nav className="container booking-toolbar" aria-label="관리 기능"><Link className="button secondary" href="/admin/bookings/">예약 접수 관리</Link></nav><StatusAdmin/></>; }
