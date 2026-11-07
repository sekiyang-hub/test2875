import type { Metadata } from 'next';
import { StatusAdmin } from '@/components/status-admin';
export const metadata: Metadata = { title: '진료 상태 관리', robots: { index: false, follow: false } };
export default function AdminPage() { return <StatusAdmin/>; }
