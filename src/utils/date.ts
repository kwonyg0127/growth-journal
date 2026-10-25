// ─────────────────────────────────────────────
// 날짜 계산 유틸
// toISOString()은 UTC 기준이라 한국 새벽 0~9시에 어제 날짜가 나옴.
// getFullYear/getMonth/getDate는 로컬(폰) 시간 기준이라 정확함.
// ─────────────────────────────────────────────

export const toDateString = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

const today = new Date();
export const TODAY_STRING = toDateString(today);
export const TODAY_MONTH_STRING = TODAY_STRING.slice(0, 7) + '-01';
export const TODAY_YEAR = today.getFullYear();