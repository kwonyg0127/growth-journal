import { useScheduleStore } from '@/stores/scheduleStore';
import { Plan } from '@/types/plan';
import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

export default function AiFab() {
  const [isOpen, setIsOpen] = useState(false);
  const [text, setText] = useState('');
  
  const [suggestedPlan, setSuggestedPlan] = useState<Plan | null>(null);

  const { selectedDate, addPlan } = useScheduleStore();

  const parseFakeAI = (inputText: string) => {
    const newPlan: Plan = {
      id: Date.now().toString() + Math.random().toString(36).slice(2, 6),
      title: inputText,
      startTime: '20:00',
      endTime: '21:00',
      category: '기타',
      done: false,
    };
    setSuggestedPlan(newPlan);
  };

  const handleSend = () => {
    if (!text.trim()) return;
    parseFakeAI(text);
  };

  const handleConfirm = () => {
    if (suggestedPlan) {
      addPlan(selectedDate, suggestedPlan);
      setSuggestedPlan(null);
      setText('');
      setIsOpen(false);
    }
  };

  const handleClose = () => {
    setSuggestedPlan(null);
    setText('');
    setIsOpen(false);
  };

  return (
    <>
      <TouchableOpacity style={styles.fab} onPress={() => setIsOpen(true)} activeOpacity={0.8}>
        <Text style={styles.fabIcon}>✨</Text>
      </TouchableOpacity>

      <Modal visible={isOpen} transparent animationType="slide" onRequestClose={handleClose}>
        {/* 🔥 1. 화면 전체를 감싸는 Pressable (바깥 누르면 닫힘) */}
        <Pressable style={styles.modalOverlay} onPress={handleClose}>
          
          {/* 🔥 2. 키보드 래퍼 (pointerEvents="box-none"을 주어 자식이 아닌 빈 공간은 터치를 통과시킴) */}
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            style={styles.keyboardWrapper}
            pointerEvents="box-none"
          >
            {/* 🔥 3. 채팅창 본체 (터치 시 이벤트가 부모인 Pressable로 전파되는 것을 막음) */}
            <Pressable style={styles.bottomSheet} onPress={(e) => e.stopPropagation()}>
              <View style={styles.header}>
                <Text style={styles.headerTitle}>AI 비서</Text>
                <TouchableOpacity onPress={handleClose}>
                  <Text style={styles.closeText}>✕</Text>
                </TouchableOpacity>
              </View>

              {!suggestedPlan ? (
                <>
                  <TextInput
                    style={styles.input}
                    placeholder="예: 내일 오후 3시에 친구랑 약속"
                    value={text}
                    onChangeText={setText}
                    placeholderTextColor="#9CA3AF"
                    autoFocus
                  />
                  <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
                    <Text style={styles.sendButtonText}>AI에게 보내기</Text>
                  </TouchableOpacity>
                </>
              ) : (
                <View style={styles.suggestionBox}>
                  <Text style={styles.suggestionTitle}>이렇게 일정을 추가할까요?</Text>
                  
                  <View style={styles.card}>
                    <Text style={styles.cardDate}>{selectedDate}</Text>
                    <Text style={styles.cardTitle}>{suggestedPlan.title}</Text>
                    <Text style={styles.cardTime}>
                      {suggestedPlan.startTime} ~ {suggestedPlan.endTime} ({suggestedPlan.category})
                    </Text>
                  </View>

                  <View style={styles.actionRow}>
                    <TouchableOpacity style={[styles.actionBtn, styles.cancelBtn]} onPress={handleClose}>
                      <Text style={styles.cancelBtnText}>취소</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.actionBtn, styles.confirmBtn]} onPress={handleConfirm}>
                      <Text style={styles.confirmBtnText}>추가</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            </Pressable>
          </KeyboardAvoidingView>
        </Pressable>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: 'absolute', right: 20, bottom: 20, width: 60, height: 60, borderRadius: 30,
    backgroundColor: '#2E7D32', justifyContent: 'center', alignItems: 'center',
    shadowColor: '#2E7D32', shadowOpacity: 0.4, shadowRadius: 12, elevation: 8,
    zIndex: 10,
  },
  fabIcon: { fontSize: 26 },
  
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.35)', // 어두운 배경을 여기로 합침
  },
  keyboardWrapper: {
    width: '100%',
    justifyContent: 'flex-end',
  },
  
  bottomSheet: {
    backgroundColor: '#FFF', 
    borderTopLeftRadius: 24, 
    borderTopRightRadius: 24,
    padding: 20, 
    paddingBottom: 40,
  },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#111827' },
  closeText: { fontSize: 20, color: '#9CA3AF' },
  
  input: {
    backgroundColor: '#F3F4F6', borderRadius: 12, padding: 16, fontSize: 16,
    color: '#111827', marginBottom: 16,
  },
  sendButton: {
    backgroundColor: '#2E7D32', borderRadius: 12, paddingVertical: 16, alignItems: 'center',
  },
  sendButtonText: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },

  suggestionBox: {
    backgroundColor: '#F9FAFB', borderRadius: 16, padding: 20,
    borderWidth: 1, borderColor: '#E5E7EB',
  },
  suggestionTitle: { fontSize: 16, fontWeight: 'bold', color: '#111827', marginBottom: 12, textAlign: 'center' },
  card: { backgroundColor: '#FFF', padding: 16, borderRadius: 12, marginBottom: 16, elevation: 2 },
  cardDate: { fontSize: 12, color: '#6B7280', marginBottom: 4 },
  cardTitle: { fontSize: 18, fontWeight: 'bold', color: '#111827', marginBottom: 8 },
  cardTime: { fontSize: 14, color: '#2E7D32', fontWeight: '600' },
  
  actionRow: { flexDirection: 'row', gap: 12 },
  actionBtn: { flex: 1, paddingVertical: 14, borderRadius: 12, alignItems: 'center' },
  cancelBtn: { backgroundColor: '#E5E7EB' },
  cancelBtnText: { color: '#4B5563', fontSize: 16, fontWeight: 'bold' },
  confirmBtn: { backgroundColor: '#2E7D32' },
  confirmBtnText: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },
});