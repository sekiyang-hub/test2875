import type {Appointment} from './simple-appointments';
export function unreadAppointments(rows:Appointment[]){return rows.filter(r=>r.needs_review);}
// Only patient revisions produce alerts. Staff acknowledgements/status changes do not.
export function incomingRevisions(previous:ReadonlyMap<string,number>,rows:Appointment[]){
 return rows.filter(r=>r.needs_review&&r.patient_revision>(previous.get(r.id)??0));
}
export function inboxLabel(row:Appointment){return row.patient_revision>1?'환자 수정':'새 신청';}
export const reminderOptions=[0,1,3,5] as const;
export type ReminderMinutes=typeof reminderOptions[number];
// Called only after a successful inbox refresh: stale/offline data cannot trigger reminders.
export function nextInboxAlert({hasUnread,incoming,sound,minutes,lastAlertAt,now}:{hasUnread:boolean;incoming:boolean;sound:boolean;minutes:ReminderMinutes;lastAlertAt:number|null;now:number}):'incoming'|'reminder'|null{
 if(!sound||!hasUnread)return null;
 if(incoming)return 'incoming';
 return minutes>0&&lastAlertAt!==null&&now-lastAlertAt>=minutes*60000?'reminder':null;
}
