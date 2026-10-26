import {appointmentsLaunchReady} from '@/config/appointments';
export function slotLabel(date:string){return new Intl.DateTimeFormat('ko-KR',{timeZone:'Asia/Seoul',month:'long',day:'numeric',weekday:'short',hour:'2-digit',minute:'2-digit',hour12:false}).format(new Date(date));}
export function normalizePhone(raw:string){const digits=raw.replace(/[\s()-]/g,'');if(/^010\d{8}$/.test(digits))return '+82'+digits.slice(1);if(/^\+[1-9]\d{7,14}$/.test(digits))return digits;throw new Error('휴대전화 번호를 확인해 주세요. 예: 01012345678');}
export const appointmentPreview=process.env.NODE_ENV==='development'&&process.env.NEXT_PUBLIC_APPOINTMENT_PREVIEW==='true';
export const appointmentsEnabled=appointmentsLaunchReady&&process.env.NEXT_PUBLIC_SIMPLE_APPOINTMENTS_ENABLED!=='false';
const url=process.env.NEXT_PUBLIC_SUPABASE_URL||'https://twgxohkkovkefzoyslov.supabase.co';
const key=process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY||process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY||'sb_publishable_xRiq-anmTCtvRBjPLVEx_Q_CqNAxqv7';
export type Appointment={id:string;patient_name:string;phone:string;preferred_at:string;confirmed_at:string|null;status:string;created_at:string;updated_at:string};
export const appointmentLabels:Record<string,string>={pending:'신청 접수',confirmed:'직원 확인 · 확정',rejected:'접수 불가',cancelled:'취소',contact_failed:'연락 필요'};
async function api(path:string,body:unknown|undefined,token?:string){
 const response=await fetch(`${url}/rest/v1/${path}`,{method:body===undefined?'GET':'POST',headers:{apikey:key,'Content-Type':'application/json',...(token?{Authorization:`Bearer ${token}`}:{})},body:body===undefined?undefined:JSON.stringify(body),cache:'no-store',signal:AbortSignal.timeout(15000)});
 if(!response.ok){const data=await response.json().catch(()=>null);throw new Error(data?.code==='P0001'?data.message:response.status===401?'로그인이 만료되었습니다. 다시 로그인해 주세요.':'접수를 완료하지 못했습니다. 잠시 후 다시 시도하거나 병원에 전화해 주세요.');}
 return response.status===204?null:response.json();
}
export async function submitAppointment(data:{id:string;name:string;phone:string;preferredAt:string;consent:boolean;website:string;editToken?:string}):Promise<string>{return api('rpc/submit_appointment',{p_id:data.id,p_name:data.name,p_phone:data.phone,p_preferred_at:data.preferredAt,p_consent:data.consent,p_website:data.website,p_edit_token:data.editToken});}
export async function listAppointments(token:string):Promise<Appointment[]>{return api('appointment_requests?select=id,patient_name,phone,preferred_at,confirmed_at,status,created_at,updated_at&order=created_at.desc&limit=300',undefined,token);}
export async function processAppointment(token:string,row:Appointment,status:string,confirmedAt:string|null,contacted:boolean){await api('rpc/process_appointment',{p_id:row.id,p_status:status,p_expected_updated_at:row.updated_at,p_confirmed_at:confirmedAt,p_contacted:contacted},token);}

export async function updateAppointment(data:{id:string;name:string;phone:string;preferredAt:string;consent:boolean;editToken:string}):Promise<string>{return api('rpc/update_appointment',{p_id:data.id,p_name:data.name,p_phone:data.phone,p_preferred_at:data.preferredAt,p_consent:data.consent,p_edit_token:data.editToken});}
