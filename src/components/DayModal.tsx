import { getCategoryColor, getCategoryEmoji } from '@/constants/categories';
import { Plan } from '@/types/plan';
import { FlatList, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type Props = {
  visible: boolean;
  date: string;
  plans: Plan[];
  onClose: () => void;
  onAdd: () => void;
  onDelete: (planId: string) => void; // 🔥 추가
};

export default function DayModal({ visible, date, plans, onClose, onAdd, onDelete }: Props) {
  if (!visible) return null;

  return (
    <Pressable style={styles.overlay} onPress={onClose}>
      <Pressable style={styles.dayModalContent} onPress={(e) => e.stopPropagation()}>
        <View style={styles.dayModalHeader}>
          <View>
            <Text style={styles.dayModalDate}>{date}</Text>
            <Text style={styles.dayModalCount}>{plans.length}개의 일정</Text>
          </View>
          <Pressable onPress={onClose}>
            <Text style={styles.closeIcon}>✕</Text>
          </Pressable>
        </View>

        {plans.length === 0 ? (
          <View style={styles.emptyBox}>
            <Text style={styles.emptyText}>이 날은 비어있어요 ✨</Text>
            <Text style={styles.emptySubText}>아래 버튼으로 일정을 추가해보세요</Text>
          </View>
        ) : (
          <FlatList
            data={plans}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.modalList}
            renderItem={({ item }) => {
              const color = getCategoryColor(item.category);
              const emoji = getCategoryEmoji(item.category);
              return (
                <View style={styles.planCard}>
                  <View style={[styles.colorBar, { backgroundColor: color.text }]} />
                  <View style={styles.planInfo}>
                    <View style={styles.planTopRow}>
                      <Text style={styles.planTitle}>{item.title}</Text>
                      <View style={[styles.categoryTag, { backgroundColor: color.bg }]}>
                        <Text style={[styles.categoryText, { color: color.text }]}>
                          {emoji} {item.category}
                        </Text>
                      </View>
                    </View>
                    <Text style={styles.planTime}>
                      {item.startTime} ~ {item.endTime}
                    </Text>
                  </View>
                  
                  {/* 🔥 삭제 버튼 */}
                  <TouchableOpacity onPress={() => onDelete(item.id)} style={styles.deleteBtn}>
                    <Text style={styles.deleteIcon}>🗑️</Text>
                  </TouchableOpacity>
                </View>
              );
            }}
          />
        )}

        <Pressable style={styles.addButton} onPress={onAdd}>
          <Text style={styles.addButtonText}>+ 일정 추가</Text>
        </Pressable>
      </Pressable>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.35)',
    justifyContent: 'flex-end',
    zIndex: 10,
  },
  dayModalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 32,
    maxHeight: '70%',
  },
  dayModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  dayModalDate: { fontSize: 18, fontWeight: 'bold', color: '#111827' },
  dayModalCount: { fontSize: 12, color: '#9CA3AF', marginTop: 2 },
  closeIcon: { fontSize: 20, color: '#9CA3AF', paddingHorizontal: 8 },
  emptyBox: { alignItems: 'center', paddingVertical: 30 },
  emptyText: { color: '#6B7280', fontSize: 15, fontWeight: '600' },
  emptySubText: { color: '#9CA3AF', fontSize: 13, marginTop: 6 },
  modalList: { paddingBottom: 10 },
  planCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    padding: 14,
    borderRadius: 12,
    marginBottom: 10,
  },
  colorBar: { width: 4, height: 36, borderRadius: 2, marginRight: 12 },
  planInfo: { flex: 1 },
  planTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  planTitle: { fontSize: 16, fontWeight: '600', color: '#111827', flex: 1 },
  categoryTag: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8, marginLeft: 8 },
  categoryText: { fontSize: 11, fontWeight: '600' },
  planTime: { fontSize: 13, color: '#9CA3AF' },
  
  // 🔥 삭제 버튼 스타일
  deleteBtn: { padding: 8, marginLeft: 8 },
  deleteIcon: { fontSize: 16 },

  addButton: {
    marginTop: 8,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: '#2E7D32',
    alignItems: 'center',
  },
  addButtonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});