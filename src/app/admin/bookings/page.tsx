import type { Metadata } from 'next';
import {BookingAdmin} from '@/components/booking-admin';
export const metadata:Metadata={title:'예약 신청 관리',robots:{index:false,follow:false}};
export default function BookingAdminPage(){return <BookingAdmin/>;}
