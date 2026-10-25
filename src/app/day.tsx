import { useScheduleStore } from '@/stores/scheduleStore';
import { TODAY_STRING } from '@/utils/date';
import { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import AiFab from '@/components/AiFab';
import CircularClock from '@/components/CircularClock';
import DayModal from '@/components/DayModal';

// ... (getWeekDates, toDateStr, WEEK_LABELS 유틸은 기존과 동일하므로 생략하지 않고 아래에 포함합니다)
const getWeekDates = (baseDate: string) => {
  const base = new Date(baseDate);
  const day = base.getDay();
  const diffToMonday = day === 0 ? -6 : 1 - day;
  const monday = new Date(base);
  monday.setDate(base.getDate() + diffToMonday);
  const dates: Date[] = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    dates.push(d);
  }
  return dates;
};

const toDateStr = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

const WEEK_LABELS = ['월', '화', '수', '목', '금', '토', '일'];

export default function DayTab() {
  const { scheduleData, selectedDate, setSelectedDate, deletePlan } = useScheduleStore();
  
  const plans = scheduleData[selectedDate] || [];
  const weekDates = getWeekDates(selectedDate);

  const [dayModalVisible, setDayModalVisible] = useState(false);

  const openEditModal = () => {
    setDayModalVisible(true);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.weekRow}>
        {weekDates.map((date, i) => {
          const dateStr = toDateStr(date);
          const isToday = dateStr === TODAY_STRING;
          const isSelected = dateStr === selectedDate;
          return (
            <TouchableOpacity key={i} style={styles.dayItem} onPress={() => setSelectedDate(dateStr)}>
              <Text style={[styles.dayLabel, isToday && styles.dayLabelToday]}>{WEEK_LABELS[i]}</Text>
              <View style={[styles.dayNumber, isToday && styles.dayNumberToday, isSelected && !isToday && styles.dayNumberSelected]}>
                <Text style={[styles.dayNumberText, isToday && styles.dayNumberTextToday, isSelected && !isToday && styles.dayNumberTextSelected]}>
                  {date.getDate()}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>

      <View style={styles.topActionWrapper}>
        <TouchableOpacity style={[styles.todayBtn, selectedDate === TODAY_STRING && styles.todayBtnDisabled]} onPress={() => setSelectedDate(TODAY_STRING)} disabled={selectedDate === TODAY_STRING}>
          <Text style={[styles.todayText, selectedDate === TODAY_STRING && styles.todayTextDisabled]}>오늘로 돌아가기</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.clockScrollWrapper} contentContainerStyle={{ alignItems: 'center', paddingBottom: 100 }}>
        
        <View style={styles.clockSection}>
          {/* 🔥 텍스트 제거하고, CircularClock의 title prop으로 넘김 */}
          <CircularClock plans={plans} period="AM" title="오전" onPlanPress={openEditModal} />
        </View>

        <View style={styles.clockSection}>
          {/* 🔥 텍스트 제거하고, CircularClock의 title prop으로 넘김 */}
          <CircularClock plans={plans} period="PM" title="오후" onPlanPress={openEditModal} />
        </View>

      </ScrollView>

      <AiFab />

      <DayModal
        visible={dayModalVisible}
        date={selectedDate}
        plans={plans}
        onClose={() => setDayModalVisible(false)}
        onAdd={() => {
          setDayModalVisible(false);
        }}
        onDelete={(id) => deletePlan(selectedDate, id)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAFAFA' },
  weekRow: { flexDirection: 'row', justifyContent: 'space-around', paddingVertical: 16, paddingHorizontal: 8, backgroundColor: '#FFFFFF', borderBottomWidth: 1, borderBottomColor: '#F0F0F0' },
  dayItem: { alignItems: 'center' },
  dayLabel: { fontSize: 12, color: '#9CA3AF', fontWeight: '600', marginBottom: 6 },
  dayLabelToday: { color: '#2E7D32' },
  dayNumber: { width: 32, height: 32, borderRadius: 16, justifyContent: 'center', alignItems: 'center' },
  dayNumberToday: { backgroundColor: '#2E7D32' },
  dayNumberSelected: { backgroundColor: '#E8F5E9' },
  dayNumberText: { fontSize: 15, fontWeight: '600', color: '#374151' },
  dayNumberTextToday: { color: '#FFFFFF', fontWeight: 'bold' },
  dayNumberTextSelected: { color: '#2E7D32', fontWeight: 'bold' },

  topActionWrapper: { flexDirection: 'row', justifyContent: 'flex-end', paddingHorizontal: 16, paddingTop: 12, paddingBottom: 8 },
  todayBtn: { backgroundColor: '#2E7D32', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20 },
  todayBtnDisabled: { backgroundColor: '#F0F0F0' },
  todayText: { color: '#FFFFFF', fontSize: 13, fontWeight: 'bold' },
  todayTextDisabled: { color: '#9CA3AF' },

  clockScrollWrapper: { flex: 1 },
  clockSection: { alignItems: 'center', marginTop: 10, marginBottom: 20 },
});