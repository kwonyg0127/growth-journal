import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import TimePickerModal from './TimePickerModal';

type Props = {
  visible: boolean;
  date: string;
  title: string;
  startTime: string;
  endTime: string;
  onChangeTitle: (v: string) => void;
  onChangeStart: (v: string) => void;
  onChangeEnd: (v: string) => void;
  onClose: () => void;
  onSave: () => void;
};

export default function AddFormModal({
  visible,
  date,
  title,
  startTime,
  endTime,
  onChangeTitle,
  onChangeStart,
  onChangeEnd,
  onClose,
  onSave,
}: Props) {
  const [pickerMode, setPickerMode] = useState<'start' | 'end' | null>(null);

  if (!visible) return null;

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.overlayHigh}
    >
      <Pressable style={styles.overlayInner} onPress={onClose}>
        <Pressable style={styles.formContent} onPress={(e) => e.stopPropagation()}>
          
          <ScrollView 
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 20 }} 
          >
            <View style={styles.header}>
              <Text style={styles.headerTitle}>새 일정 추가</Text>
              <TouchableOpacity onPress={onClose}>
                <Text style={styles.closeIcon}>✕</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.formLabel}>날짜</Text>
            <View style={styles.formReadonly}>
              <Text style={styles.formReadonlyText}>{date}</Text>
            </View>

            <Text style={styles.formLabel}>활동명</Text>
            <TextInput
              style={styles.formInput}
              placeholder="예: 수학 공부, 아빠 생일"
              value={title}
              onChangeText={onChangeTitle}
              placeholderTextColor="#9CA3AF"
            />

            <View style={styles.timeRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.formLabel}>시작 시간</Text>
                <TouchableOpacity style={styles.timeButton} onPress={() => setPickerMode('start')}>
                  <Text style={styles.timeButtonText}>{startTime || '시간 선택'}</Text>
                </TouchableOpacity>
              </View>
              <View style={{ width: 12 }} />
              <View style={{ flex: 1 }}>
                <Text style={styles.formLabel}>종료 시간</Text>
                <TouchableOpacity style={styles.timeButton} onPress={() => setPickerMode('end')}>
                  <Text style={styles.timeButtonText}>{endTime || '시간 선택'}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>

          <View style={styles.footer}>
            <TouchableOpacity style={styles.saveButton} onPress={onSave}>
              <Text style={styles.saveButtonText}>저장</Text>
            </TouchableOpacity>
          </View>

        </Pressable>
      </Pressable>

      {pickerMode && (
        <TimePickerModal
          visible={!!pickerMode}
          initialTime={pickerMode === 'start' ? (startTime || '09:00') : (endTime || '10:00')}
          onClose={() => setPickerMode(null)}
          onSelect={(time) => {
            if (pickerMode === 'start') onChangeStart(time);
            else onChangeEnd(time);
            setPickerMode(null);
          }}
        />
      )}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  overlayHigh: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    zIndex: 20,
  },
  overlayInner: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
    justifyContent: 'flex-end',
  },
  formContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 20,
    maxHeight: '85%', 
    paddingBottom: 20, 
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#111827' },
  closeIcon: { fontSize: 20, color: '#9CA3AF', paddingHorizontal: 8 },
  formLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6B7280',
    marginBottom: 8,
    marginTop: 14,
  },
  formReadonly: { backgroundColor: '#F3F4F6', borderRadius: 10, padding: 14 },
  formReadonlyText: { fontSize: 15, color: '#374151', fontWeight: '500' },
  formInput: {
    backgroundColor: '#F3F4F6',
    borderRadius: 10,
    padding: 14,
    fontSize: 15,
    color: '#111827',
  },
  timeRow: { flexDirection: 'row', alignItems: 'flex-end' },
  timeButton: {
    backgroundColor: '#F3F4F6',
    borderRadius: 10,
    padding: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  timeButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2E7D32',
  },
  footer: {
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  saveButton: {
    paddingVertical: 16,
    borderRadius: 12,
    backgroundColor: '#2E7D32',
    alignItems: 'center',
  },
  saveButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});