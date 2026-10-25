import { Plan } from '@/types/plan';
import { TODAY_MONTH_STRING, TODAY_STRING, TODAY_YEAR } from '@/utils/date';
import { useFocusEffect } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import {
  Alert, BackHandler, Dimensions, StyleSheet, Text, TouchableOpacity, View,
} from 'react-native';
import { Calendar, LocaleConfig } from 'react-native-calendars';
import { SafeAreaView } from 'react-native-safe-area-context';

import AddFormModal from '@/components/AddFormModal';
import AiFab from '@/components/AiFab';
import BriefingCard from '@/components/BriefingCard';
import DayCell from '@/components/DayCell';
import DayModal from '@/components/DayModal';
import PickerModal from '@/components/PickerModal';
import { useScheduleStore } from '@/stores/scheduleStore';

LocaleConfig.locales['ko'] = {
  monthNames: ['1월','2월','3월','4월','5월','6월','7월','8월','9월','10월','11월','12월'],
  monthNamesShort: ['1월','2월','3월','4월','5월','6월','7월','8월','9월','10월','11월','12월'],
  dayNames: ['일요일','월요일','화요일','수요일','목요일','금요일','토요일'],
  dayNamesShort: ['일','월','화','수','목','금','토'],
};
LocaleConfig.defaultLocale = 'ko';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const DAY_CELL_WIDTH = Math.floor((SCREEN_WIDTH - 16) / 7);

export default function CalendarTab() {
  const { scheduleData, addPlan, deletePlan, selectedDate, setSelectedDate } = useScheduleStore();

  const [currentMonth, setCurrentMonth] = useState(TODAY_MONTH_STRING);
  const [calendarKey, setCalendarKey] = useState(0);
  const [pickerVisible, setPickerVisible] = useState(false);
  const [pickerYear, setPickerYear] = useState(TODAY_YEAR);

  const [dayModalVisible, setDayModalVisible] = useState(false);
  const [dayModalDate, setDayModalDate] = useState("");

  const [addFormVisible, setAddFormVisible] = useState(false);
  const [formTitle, setFormTitle] = useState("");
  const [formStart, setFormStart] = useState("");
  const [formEnd, setFormEnd] = useState("");
  // 🔥 formCategory 상태 삭제됨

  const modalPlans = scheduleData[dayModalDate] || [];

  // AI 브리핑 데이터 계산
  const selectedPlans = scheduleData[selectedDate] || [];
  const isToday = selectedDate === TODAY_STRING;
  const dateLabel = isToday ? '오늘' : `${selectedDate.slice(5).replace('-', '월 ')}일`;

  let briefingMessage = '';
  let briefingSub = '';

  if (selectedPlans.length === 0) {
    briefingMessage = `${dateLabel}은 여유로운 하루예요 ☕`;
    briefingSub = 'AI에게 말로 일정을 추가해보세요';
  } else {
    briefingMessage = `${dateLabel}은 ${selectedPlans.length}개의 일정이 있어요`;
    const firstPlan = selectedPlans[0];
    briefingSub = `가장 먼저: ${firstPlan.startTime} ${firstPlan.title}`;
  }

  useFocusEffect(
    useCallback(() => {
      return () => {
        setDayModalVisible(false);
        setAddFormVisible(false);
        setPickerVisible(false);
      };
    }, [])
  );

  useEffect(() => {
    const backAction = () => {
      if (addFormVisible) { setAddFormVisible(false); return true; }
      if (dayModalVisible) { setDayModalVisible(false); return true; }
      if (pickerVisible) { setPickerVisible(false); return true; }
      return false;
    };
    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);
    return () => backHandler.remove();
  }, [addFormVisible, dayModalVisible, pickerVisible]);

  const handleSelectMonth = (month: number) => {
    const newDate = `${pickerYear}-${String(month).padStart(2, '0')}-01`;
    setCurrentMonth(newDate);
    setSelectedDate(newDate);
    setCalendarKey((k) => k + 1);
    setPickerVisible(false);
  };

  const openDayModal = (dateString: string) => {
    setSelectedDate(dateString);
    setDayModalDate(dateString);
    setDayModalVisible(true);
  };

  const openAddForm = () => {
    setFormTitle("");
    setFormStart("");
    setFormEnd("");
    // 🔥 setFormCategory 삭제
    setAddFormVisible(true);
  };

  const isValidTime = (t: string) => /^([01]\d|2[0-3]):[0-5]\d$/.test(t);

  const handleSavePlan = () => {
    if (!formTitle.trim()) {
      Alert.alert("알림", "활동명을 입력해주세요.");
      return;
    }
    if (!isValidTime(formStart) || !isValidTime(formEnd)) {
      Alert.alert("알림", "시간을 정확히 선택해주세요.");
      return;
    }
    if (formEnd <= formStart) {
      Alert.alert("알림", "종료 시간은 시작 시간보다 늦어야 해요.");
      return;
    }

    const newPlan: Plan = {
      id: Date.now().toString() + Math.random().toString(36).slice(2, 6),
      title: formTitle.trim(),
      startTime: formStart,
      endTime: formEnd,
      category: "기타", // 🔥 무조건 '기타'로 저장
      done: false,
    };

    addPlan(dayModalDate, newPlan);
    setAddFormVisible(false);
  };

  const renderHeader = (date: any) => {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    return (
      <TouchableOpacity
        style={styles.customHeader}
        onPress={() => {
          setPickerYear(year);
          setPickerVisible(true);
        }}
      >
        <Text style={styles.headerYear}>{year}년</Text>
        <Text style={styles.headerMonth}>{month}월</Text>
        <Text style={styles.headerArrow}>▼</Text>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <BriefingCard message={briefingMessage} sub={briefingSub} />

      <View style={styles.calendarWrapper}>
        <Calendar
          key={calendarKey}
          current={currentMonth}
          onDayPress={(day: any) => openDayModal(day.dateString)}
          dayComponent={({ date, state }: any) => {
            const dateString = date.dateString;
            const plans = scheduleData[dateString] || [];
            return (
              <DayCell
                date={date}
                plans={plans}
                isSelected={dateString === selectedDate}
                isToday={dateString === TODAY_STRING}
                isDisabled={state === 'disabled'}
                onPress={() => openDayModal(dateString)}
              />
            );
          }}
          renderHeader={renderHeader}
          style={styles.calendar}
          theme={{
            arrowColor: '#2E7D32',
            'stylesheet.calendar.header': {
              header: {
                flexDirection: 'row',
                justifyContent: 'space-between',
                paddingLeft: 10,
                paddingRight: 10,
                marginTop: 6,
                alignItems: 'center',
              },
              week: {
                marginTop: 8,
                marginBottom: 4,
                flexDirection: 'row',
                justifyContent: 'space-around',
              },
              dayHeader: {
                width: DAY_CELL_WIDTH,
                textAlign: 'center',
                fontSize: 12,
                color: '#9CA3AF',
                fontWeight: '600',
              },
            },
          } as any}
        />
      </View>

      <AiFab />

      <DayModal
        visible={dayModalVisible}
        date={dayModalDate}
        plans={modalPlans}
        onClose={() => setDayModalVisible(false)}
        onAdd={openAddForm}
        onDelete={(id) => deletePlan(dayModalDate, id)}
      />

      <AddFormModal
        visible={addFormVisible}
        date={dayModalDate}
        title={formTitle}
        startTime={formStart}
        endTime={formEnd}
        onChangeTitle={setFormTitle}
        onChangeStart={setFormStart}
        onChangeEnd={setFormEnd}
        onClose={() => setAddFormVisible(false)}
        onSave={handleSavePlan}
      />

      <PickerModal
        visible={pickerVisible}
        year={pickerYear}
        onClose={() => setPickerVisible(false)}
        onSelectYear={setPickerYear}
        onSelectMonth={handleSelectMonth}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAFAFA' },
  calendarWrapper: { flex: 1, backgroundColor: '#FFFFFF' },
  calendar: { width: SCREEN_WIDTH },

  customHeader: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'center',
    paddingVertical: 12,
    gap: 6,
  },
  headerYear: { fontSize: 14, color: '#9CA3AF', fontWeight: '600' },
  headerMonth: { fontSize: 22, fontWeight: 'bold', color: '#111827' },
  headerArrow: { fontSize: 10, color: '#2E7D32', marginLeft: 2 },
});