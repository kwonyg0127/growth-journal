// ─────────────────────────────────────────────
// 카테고리 정의
// 데이터는 순수 텍스트, 이모지는 표시용
// ─────────────────────────────────────────────

export const CATEGORIES = ['공부', '운동', '가족', '자기개발', '식사', '약속', '여가', '기타'];

export const CATEGORY_EMOJI: Record<string, string> = {
  '공부': '📚',
  '운동': '🏃',
  '가족': '👨‍👩‍👧',
  '자기개발': '📖',
  '식사': '🍚',
  '약속': '🤝',
  '여가': '🎮',
  '기타': '🎯',
};

export const CATEGORY_COLORS: Record<string, { bg: string; text: string }> = {
  '공부': { bg: '#DBEAFE', text: '#1D4ED8' },
  '운동': { bg: '#FEF3C7', text: '#B45309' },
  '가족': { bg: '#FCE7F3', text: '#BE185D' },
  '자기개발': { bg: '#EDE9FE', text: '#6D28D9' },
  '식사': { bg: '#D1FAE5', text: '#047857' },
  '약속': { bg: '#FEE2E2', text: '#B91C1C' },
  '여가': { bg: '#ECFCCB', text: '#4D7C0F' },
  '기타': { bg: '#F3F4F6', text: '#4B5563' },
};

export const getCategoryColor = (category: string) =>
  CATEGORY_COLORS[category] || { bg: '#F3F4F6', text: '#4B5563' };

export const getCategoryEmoji = (category: string) => CATEGORY_EMOJI[category] || '';