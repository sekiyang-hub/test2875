import Link from 'next/link';
export function AdminTabs({current}:{current:'bookings'|'status'}){
 return <nav className="admin-tabs" aria-label="관리 화면">
  <Link href="/admin/bookings/" aria-current={current==='bookings'?'page':undefined}>예약 신청</Link>
  <Link href="/admin/" aria-current={current==='status'?'page':undefined}>진료 상태</Link>
 </nav>;
}
