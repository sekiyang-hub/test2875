import type {Appointment} from './simple-appointments';
export function unreadAppointments(rows:Appointment[]){return rows.filter(r=>r.needs_review);}
// Only patient revisions produce alerts. Staff acknowledgements/status changes do not.
export function incomingRevisions(previous:ReadonlyMap<string,number>,rows:Appointment[]){
 return rows.filter(r=>r.needs_review&&r.patient_revision>(previous.get(r.id)??0));
}
export function inboxLabel(row:Appointment){return row.patient_revision>1?'환자 수정':'새 신청';}
