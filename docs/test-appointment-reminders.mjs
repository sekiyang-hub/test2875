// Run with Node.js 24+: node --test docs/test-appointment-reminders.mjs
import {test} from 'node:test';
import assert from 'node:assert/strict';
import {nextInboxAlert} from '../src/lib/appointment-inbox.ts';
const base={hasUnread:true,incoming:false,sound:true,minutes:3,lastAlertAt:0,now:180000};
for(const minutes of [1,3,5])test(`${minutes}-minute reminder waits until its boundary`,()=>{
 assert.equal(nextInboxAlert({...base,minutes,now:minutes*60000-1}),null);
 assert.equal(nextInboxAlert({...base,minutes,now:minutes*60000}),'reminder');
});
test('acknowledging all requests suppresses a due reminder',()=>{
 assert.equal(nextInboxAlert({...base,hasUnread:false}),null);
});
test('muting disables both incoming and repeat sounds',()=>{
 assert.equal(nextInboxAlert({...base,sound:false}),null);
 assert.equal(nextInboxAlert({...base,sound:false,incoming:true}),null);
});
test('repeat off preserves the immediate incoming alert',()=>{
 assert.equal(nextInboxAlert({...base,minutes:0}),null);
 assert.equal(nextInboxAlert({...base,minutes:0,incoming:true}),'incoming');
});
test('a new arrival and due reminder produce only one alert',()=>{
 assert.equal(nextInboxAlert({...base,incoming:true}),'incoming');
});
test('delayed/background polling produces one alert, without catch-up bursts',()=>{
 const now=30*60000;
 assert.equal(nextInboxAlert({...base,now}),'reminder');
 assert.equal(nextInboxAlert({...base,lastAlertAt:now,now:now+5000}),null);
});
test('initial inbox baseline starts a full interval instead of ringing immediately',()=>{
 assert.equal(nextInboxAlert({...base,lastAlertAt:null}),null);
});
test('new patient revision resets the reminder interval for the unread batch',()=>{
 const arrival=170000;
 assert.equal(nextInboxAlert({...base,incoming:true,now:arrival}),'incoming');
 assert.equal(nextInboxAlert({...base,lastAlertAt:arrival,now:180000}),null);
 assert.equal(nextInboxAlert({...base,lastAlertAt:arrival,now:arrival+180000}),'reminder');
});
