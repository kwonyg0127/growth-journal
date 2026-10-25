import DateTimePicker from '@react-native-community/datetimepicker';
import { Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type Props = {
  visible: boolean;
  initialTime: string;
  onClose: () => void;
  onSelect: (timeString: string) => void;
};

export default function TimePickerModal({ visible, initialTime, onClose, onSelect }: Props) {
  if (!visible) return null;

  const [hours, minutes] = initialTime.split(':').map(Number);
  const date = new Date();
  date.setHours(hours, minutes, 0, 0);

  const handleTimeChange = (event: any, selectedDate?: Date) => {
    if (Platform.OS === 'android') {
      if (event.type === 'set' && selectedDate) {
        const h = String(selectedDate.getHours()).padStart(2, '0');
        const m = String(selectedDate.getMinutes()).padStart(2, '0');
        onSelect(`${h}:${m}`);
      } else {
        onClose();
      }
    } else {
      if (selectedDate) {
        const h = String(selectedDate.getHours()).padStart(2, '0');
        const m = String(selectedDate.getMinutes()).padStart(2, '0');
        onSelect(`${h}:${m}`);
      }
    }
  };

  return (
    <View style={styles.overlay}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>시간 선택</Text>
          <TouchableOpacity onPress={onClose}>
            <Text style={styles.closeText}>✕</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.pickerWrapper}>
          <DateTimePicker
            value={date}
            mode="time"
            is24Hour={false} // 🔥 오전/오후 표시 (12시간제)
            display="spinner"
            onChange={handleTimeChange}
            style={styles.picker}
            locale="ko-KR" // 한국어 설정
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)', // 배경을 조금 더 어둡게
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 200,
  },
  container: {
    backgroundColor: '#FFF',
    borderRadius: 24,
    width: '90%', // 모달 가로 폭을 90%로 키움
    padding: 20,
    alignItems: 'center',
    elevation: 10, // 그림자 추가
    shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 10,
  },
  title: { fontSize: 20, fontWeight: 'bold', color: '#111827' },
  closeText: { fontSize: 22, color: '#9CA3AF' },
  
  pickerWrapper: {
    width: '100%',
    height: 250, // 높이를 확보
    justifyContent: 'center',
    alignItems: 'center',
    // 🔥 휠 피커의 기본 크기가 작아서, scale을 이용해 강제로 1.3배 키웁니다.
    transform: [{ scaleX: 1.3 }, { scaleY: 1.3 }], 
  },
  picker: {
    width: '100%',
    height: '100%',
  },
});