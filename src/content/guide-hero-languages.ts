import type {Language} from './languages';

export const guideHero:Record<Language,{title:string;subtitle:string;schedule:string}>={
 en:{title:'A friendly dental clinic for our community',subtitle:'Close to home. Comfortable at every visit.',schedule:'Weekdays until 9 pm · Open weekends and public holidays'},
 zh:{title:'与社区居民相伴的幸福牙科',subtitle:'近在身边，舒心相伴。',schedule:'工作日营业至21:00 · 周末及法定节假日接诊'},
 vi:{title:'Nha khoa thân thiện, đồng hành cùng cộng đồng',subtitle:'Gần nhà, luôn thoải mái.',schedule:'Ngày thường đến 21:00 · Mở cửa cuối tuần và ngày lễ'},
 mn:{title:'Хөршүүдтэйгээ хамтдаа, найрсаг шүдний эмнэлэг',subtitle:'Ойрхон, үргэлж тухтай.',schedule:'Ажлын өдрүүдэд 21:00 хүртэл · Амралтын болон баярын өдрүүдэд ажиллана'},
 ne:{title:'समुदायसँगै अघि बढ्ने आत्मीय दन्त क्लिनिक',subtitle:'नजिकै, सधैँ सहज।',schedule:'कार्यदिनमा राति ९ बजेसम्म · सप्ताहन्त र सार्वजनिक बिदामा पनि सेवा'},
 ru:{title:'Дружелюбная стоматология для нашего района',subtitle:'Рядом с домом, спокойно и комфортно.',schedule:'По будням до 21:00 · Работаем в выходные и праздники'},
 uz:{title:'Mahallamiz uchun samimiy stomatologiya',subtitle:'Yaqin joyda, doimo qulay.',schedule:'Ish kunlari 21:00 gacha · Dam olish va bayram kunlari ham ochiq'},
 th:{title:'คลินิกทันตกรรมที่เป็นมิตร เคียงข้างชุมชน',subtitle:'ใกล้บ้าน สบายใจทุกครั้งที่มา',schedule:'วันธรรมดาถึง 21:00 น. · เปิดวันหยุดสุดสัปดาห์และวันหยุดนักขัตฤกษ์'}
};
