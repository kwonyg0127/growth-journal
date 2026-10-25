import { Plan } from '@/types/plan';

// ─────────────────────────────────────────────
// 초기 더미 데이터 (테스트용)
// 나중에 AsyncStorage에서 진짜 데이터를 불러올 예정
// ─────────────────────────────────────────────
export const initialScheduleData: Record<string, Plan[]> = {
  "2026-10-05": [
    { id: "1", title: "아빠 생일", startTime: "19:00", endTime: "21:00", category: "가족" },
  ],
  "2026-10-06": [
    { id: "2", title: "운동", startTime: "18:00", endTime: "19:00", category: "운동" },
  ],
  "2026-10-07": [
    { id: "3", title: "앱 개발", startTime: "20:00", endTime: "22:00", category: "자기개발" },
    { id: "4", title: "독서", startTime: "22:00", endTime: "23:00", category: "공부" },
  ],
  "2026-10-15": [
    { id: "5", title: "회의", startTime: "10:00", endTime: "11:00", category: "약속" },
    { id: "6", title: "점심약속", startTime: "12:00", endTime: "13:00", category: "식사" },
    { id: "7", title: "치과", startTime: "16:00", endTime: "17:00", category: "기타" },
  ],
};