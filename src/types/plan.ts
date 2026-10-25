// ─────────────────────────────────────────────
// Plan 타입 정의
// "일정 하나"의 형태를 정의하는 양식
// ─────────────────────────────────────────────
export type Plan = {
  id: string;
  title: string;
  startTime: string;
  endTime: string;
  category: string;
  done?: boolean;
};