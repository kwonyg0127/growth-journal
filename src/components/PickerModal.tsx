import { Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

// ─────────────────────────────────────────────
// props 정의
// ─────────────────────────────────────────────
type Props = {
  visible: boolean;
  year: number;
  onClose: () => void;
  onSelectYear: (y: number) => void;
  onSelectMonth: (m: number) => void;
};

const YEARS = [2024, 2025, 2026, 2027, 2028, 2029, 2030];
const MONTHS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

export default function PickerModal({
  visible,
  year,
  onClose,
  onSelectYear,
  onSelectMonth,
}: Props) {
  if (!visible) return null;

  return (
    <Pressable style={styles.overlay} onPress={onClose}>
      <Pressable style={styles.modalContent} onPress={(e) => e.stopPropagation()}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>날짜 선택</Text>
          <TouchableOpacity onPress={onClose}>
            <Text style={styles.closeIcon}>✕</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionTitle}>연도</Text>
        <View style={styles.yearGrid}>
          {YEARS.map((y) => (
            <TouchableOpacity
              key={y}
              style={[styles.yearButton, year === y && styles.yearButtonSelected]}
              onPress={() => onSelectYear(y)}
            >
              <Text style={[styles.yearText, year === y && styles.yearTextSelected]}>
                {y}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.sectionTitle}>월</Text>
        <View style={styles.monthGrid}>
          {MONTHS.map((m) => (
            <TouchableOpacity
              key={m}
              style={styles.monthButton}
              onPress={() => onSelectMonth(m)}
            >
              <Text style={styles.monthText}>{m}월</Text>
            </TouchableOpacity>
          ))}
        </View>
      </Pressable>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.35)',
    justifyContent: 'flex-end',
    zIndex: 10,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#111827' },
  closeIcon: { fontSize: 20, color: '#9CA3AF', paddingHorizontal: 8 },
  sectionTitle: { fontSize: 13, fontWeight: '600', color: '#6B7280', marginBottom: 10 },
  yearGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 24 },
  yearButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 10,
    backgroundColor: '#F3F4F6',
  },
  yearButtonSelected: { backgroundColor: '#2E7D32' },
  yearText: { fontSize: 14, color: '#374151' },
  yearTextSelected: { color: '#fff', fontWeight: 'bold' },
  monthGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  monthButton: {
    width: '22%',
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    marginBottom: 6,
  },
  monthText: { fontSize: 15, color: '#374151', fontWeight: '500' },
});