export type ClinicMode = 'auto' | 'open' | 'closed' | 'holiday';
export type ClinicStatusSettings = { mode: ClinicMode; expires_at: string | null; message: string; holiday_dates: string[] };
export const defaultStatusSettings: ClinicStatusSettings = { mode: 'auto', expires_at: null, message: '', holiday_dates: [] };
export function seoulDate(now: Date) {
  const local = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  return { date: local.toISOString().slice(0, 10), day: local.getUTCDay(), minutes: local.getUTCHours() * 60 + local.getUTCMinutes() };
}
export function resolveClinicStatus(now: Date, settings = defaultStatusSettings) {
  const today = seoulDate(now);
  const override = settings.mode !== 'auto' && settings.expires_at && Date.parse(settings.expires_at) > now.getTime();
  const fixedHoliday = ['01-01','03-01','05-05','06-06','08-15','10-03','10-09','12-25'].includes(today.date.slice(5));
  const closes = today.day === 0 || today.day === 6 || fixedHoliday || settings.holiday_dates.includes(today.date) ? '17:00' : '21:00';
  const mode = override ? settings.mode : today.minutes >= 600 && today.minutes < Number(closes.slice(0,2)) * 60 ? 'open' : 'closed';
  return { mode: mode as Exclude<ClinicMode,'auto'>, closes, message: override ? settings.message : '', manual: Boolean(override) };
}
export const statusLabels = {
  ko: ['진료 중','진료 종료','휴진','오늘','까지 진료','진료시간에 따른 안내 · 방문 전 확인해 주세요'],
  en: ['Open','Closed','Temporarily closed','Today','Closing time','Based on clinic hours · Please confirm before visiting'],
  zh: ['营业中','营业结束','暂停营业','今日','营业至','按营业时间显示 · 来院前请确认'],
  vi: ['Đang mở cửa','Đã đóng cửa','Tạm nghỉ','Hôm nay','Đóng cửa lúc','Theo giờ làm việc · Vui lòng xác nhận trước khi đến'],
  mn: ['Нээлттэй','Хаалттай','Түр амарна','Өнөөдөр','Хаах цаг','Ажлын цагийн мэдээлэл · Ирэхээсээ өмнө лавлана уу'],
  ne: ['खुला छ','बन्द छ','अस्थायी बन्द','आज','बन्द हुने समय','समयतालिका अनुसार · आउनुअघि पुष्टि गर्नुहोस्'],
  ru: ['Открыто','Закрыто','Временно закрыто','Сегодня','Закрытие в','По расписанию · Уточните перед визитом'],
  uz: ['Ochiq','Yopiq','Vaqtincha yopiq','Bugun','Yopilish vaqti','Ish jadvali asosida · Kelishdan oldin aniqlashtiring'],
  th: ['เปิดให้บริการ','ปิดบริการ','หยุดชั่วคราว','วันนี้','ปิดเวลา','ตามเวลาทำการ · โปรดยืนยันก่อนมา'],
};
