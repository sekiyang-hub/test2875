export const languages = {
  en: {
    label: 'English', lang: 'en', title: 'Yeonsu Happy Dental Clinic', intro: 'Dental clinic in Yeonsu-dong, Incheon. Open until 9 pm on weekdays and on weekends and public holidays.',
    call: 'Call the clinic', directions: 'Directions', hours: 'Opening hours', weekdays: 'Monday–Friday', weekends: 'Weekends & public holidays', location: 'Location', address: 'Yeonsu-dong, Yeonsu-gu, Incheon, South Korea', station: 'Find Yeonsu Station on the map', note: 'Yeonsu Station is a temporary reference point, not the clinic address. Please call to confirm the exact address before visiting.', appointment: 'Before your visit', booking: 'Please call to ask about appointments, treatment availability and language assistance. Support in your language has not yet been confirmed.', doctor: 'Dentist: Yang SEKI (양세기)', home: 'Korean homepage',
  },
  zh: {
    label: '中文', lang: 'zh-Hans', title: '延寿幸福牙科诊所', intro: '位于韩国仁川延寿洞的牙科诊所。工作日营业至晚上9点，周末及法定节假日也营业。',
    call: '致电诊所', directions: '交通指南', hours: '营业时间', weekdays: '周一至周五', weekends: '周末及法定节假日', location: '诊所位置', address: '韩国仁川广域市延寿区延寿洞', station: '在地图上查看延寿站', note: '延寿站仅为临时参考地点，并非诊所地址。就诊前请致电确认具体地址。', appointment: '就诊前须知', booking: '请致电咨询预约、可提供的诊疗项目及语言协助。目前尚未确认是否可提供中文咨询。', doctor: '牙医：양세기（Yang SEKI）', home: '韩语主页',
  },
  vi: {
    label: 'Tiếng Việt', lang: 'vi', title: 'Phòng khám nha khoa Yeonsu Happy', intro: 'Phòng khám nha khoa tại Yeonsu-dong, Incheon. Mở cửa đến 21 giờ vào các ngày trong tuần, cả cuối tuần và ngày lễ.',
    call: 'Gọi phòng khám', directions: 'Đường đến phòng khám', hours: 'Giờ làm việc', weekdays: 'Thứ Hai–Thứ Sáu', weekends: 'Cuối tuần và ngày lễ', location: 'Địa điểm', address: 'Yeonsu-dong, Yeonsu-gu, Incheon, Hàn Quốc', station: 'Xem ga Yeonsu trên bản đồ', note: 'Ga Yeonsu chỉ là điểm tham chiếu tạm thời, không phải địa chỉ phòng khám. Vui lòng gọi để xác nhận địa chỉ chính xác trước khi đến.', appointment: 'Trước khi đến khám', booking: 'Vui lòng gọi để hỏi về lịch hẹn, dịch vụ điều trị và hỗ trợ ngôn ngữ. Khả năng tư vấn bằng tiếng Việt hiện chưa được xác nhận.', doctor: 'Nha sĩ: Yang SEKI (양세기)', home: 'Trang chủ tiếng Hàn',
  },
  mn: {
    label: 'Монгол', lang: 'mn', title: 'Ёнсү Happy шүдний эмнэлэг', intro: 'Инчон хотын Ёнсү-дон дахь шүдний эмнэлэг. Ажлын өдрүүдэд 21:00 цаг хүртэл, мөн амралтын болон бүх нийтийн баярын өдрүүдэд ажиллана.',
    call: 'Эмнэлэг рүү залгах', directions: 'Хэрхэн очих вэ', hours: 'Ажиллах цаг', weekdays: 'Даваа–Баасан', weekends: 'Амралтын болон баярын өдрүүд', location: 'Байршил', address: 'БНСУ, Инчон хот, Ёнсү дүүрэг, Ёнсү-дон', station: 'Ёнсү өртөөг газрын зураг дээр харах', note: 'Ёнсү өртөө нь түр баримжаалах газар бөгөөд эмнэлгийн хаяг биш юм. Ирэхээсээ өмнө утсаар холбогдож яг хаягийг тодруулна уу.', appointment: 'Ирэхийн өмнө', booking: 'Цаг авах, эмчилгээний үйлчилгээ болон хэлний тусламжийн талаар утсаар лавлана уу. Монгол хэлээр зөвлөгөө өгөх боломж одоогоор баталгаажаагүй байна.', doctor: 'Шүдний эмч: Yang SEKI (양세기)', home: 'Солонгос хэл дээрх нүүр хуудас',
  },
} as const;
export type Language = keyof typeof languages;
