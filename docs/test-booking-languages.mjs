// Node 24+: node --test docs/test-booking-languages.mjs
import {test} from 'node:test';
import assert from 'node:assert/strict';
import {bookingLanguages,bookingLocale,localizedBookingError} from '../src/content/booking-languages.ts';
const steps=['welcome','name','phone','date','time','review','done'];
for(const [code,t] of Object.entries(bookingLanguages)){
 test(`${code}: complete translated booking, consent, receipt and validation`,()=>{
  assert.deepEqual(Object.keys(t).sort(),Object.keys(bookingLanguages.ko).sort());
  for(const [key,value] of Object.entries(t)){
   if(key==='prompts'){assert.deepEqual(Object.keys(value),steps);for(const text of Object.values(value)){assert.ok(text.trim());if(code!=='ko')assert.doesNotMatch(text,/[가-힣]/);}}
   else if(key==='steps'){assert.equal(value.length,3);assert.ok(value.every(x=>x.trim()));}
   else{assert.equal(typeof value,'string');assert.ok(value.trim(),key);if(code!=='ko')assert.doesNotMatch(value,/[가-힣]/,key);}
  }
  assert.equal(localizedBookingError(new Error('nameError'),t),t.nameError);
  assert.equal(localizedBookingError(new Error('휴대전화 번호를 확인해 주세요.'),t),t.phoneError);
  assert.equal(localizedBookingError(new Error('직원이 이미 처리한 신청입니다.'),t),t.lockedError);
  assert.equal(localizedBookingError(new Error('수정 권한을 확인할 수 없습니다.'),t),t.accessError);
  assert.equal(localizedBookingError(new Error('신청 요청이 많습니다.'),t),t.limitError);
  assert.equal(localizedBookingError(new Error('2시간 후부터 60일 이내'),t),t.timeError);
  assert.equal(localizedBookingError(new Error('개인정보 동의를 확인해 주세요.'),t),t.consentError);
  assert.equal(localizedBookingError(new Error('Unexpected internal details'),t),t.failureError);
 });
 if(code!=='ko')test(`${code}: locale retained on guide, treatment and booking routes`,()=>{
  assert.equal(bookingLocale(`/guide/${code}/`),code);
  assert.equal(bookingLocale(`/guide/${code}/booking/`),code);
  assert.equal(bookingLocale(`/guide/${code}/treatments/implant/`),code);
 });
}
test('Korean default and unknown-language routes are safe',()=>{
 for(const path of ['/','/booking/','/admin/bookings/','/guide/nope/','/guide/constructor/'])assert.equal(bookingLocale(path),'ko');
});
