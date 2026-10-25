import { getCategoryColor } from '@/constants/categories';
import { Plan } from '@/types/plan';
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

// ─────────────────────────────────────────────
// 화면 크기 기반으로 날짜 칸 너비 계산
// width를 고정하면 폰마다 깨지므로, 자동 계산
// ─────────────────────────────────────────────
const { width: SCREEN_WIDTH } = Dimensions.get('window');
const DAY_CELL_WIDTH = Math.floor((SCREEN_WIDTH - 16) / 7);

// ─────────────────────────────────────────────
// props 정의
// 부모가 이 6개를 넘겨줘야 한다
// ─────────────────────────────────────────────
type Props = {
  date: { day: number; dateString: string };
  plans: Plan[];
  isSelected: boolean;
  isToday: boolean;
  isDisabled: boolean;
  onPress: () => void;
};

export default function DayCell({
  date,
  plans,
  isSelected,
  isToday,
  isDisabled,
  onPress,
}: Props) {
  const visiblePlans = plans.slice(0, 2);
  const extraCount = plans.length - 2;

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.dayContainer, isSelected && styles.daySelected]}
      activeOpacity={0.7}
    >
      <View style={[styles.dayNumberWrap, isToday && styles.dayTodayWrap]}>
        <Text
          style={[
            styles.dayText,
            isToday && styles.dayTodayText,
            isDisabled && styles.dayDisabled,
          ]}
        >
          {date.day}
        </Text>
      </View>
      <View style={styles.eventsWrapper}>
        {visiblePlans.map((plan) => {
          const color = getCategoryColor(plan.category);
          return (
            <View key={plan.id} style={[styles.eventBadge, { backgroundColor: color.bg }]}>
              <Text
                style={[styles.eventText, { color: color.text }]}
                numberOfLines={1}
              >
                {plan.title}
              </Text>
            </View>
          );
        })}
        {extraCount > 0 && <Text style={styles.extraText}>+{extraCount}</Text>}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  dayContainer: {
    width: DAY_CELL_WIDTH,
    height: 68,
    paddingVertical: 4,
    alignItems: 'center',
    justifyContent: 'flex-start',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  daySelected: { backgroundColor: '#F0FDF4', borderColor: '#2E7D32' },
  dayNumberWrap: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 2,
  },
  dayTodayWrap: { backgroundColor: '#2E7D32' },
  dayText: { fontSize: 12, fontWeight: '600', color: '#374151' },
  dayTodayText: { color: '#FFFFFF', fontWeight: 'bold' },
  dayDisabled: { color: '#E5E7EB' },
  eventsWrapper: { width: '100%', alignItems: 'center' },
  eventBadge: {
    width: '92%',
    borderRadius: 3,
    paddingHorizontal: 2,
    paddingVertical: 1,
    marginTop: 1,
  },
  eventText: { fontSize: 7, fontWeight: '600' },
  extraText: { fontSize: 7, color: '#9CA3AF', marginTop: 1 },
});