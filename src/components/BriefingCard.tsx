import { StyleSheet, Text, View } from 'react-native';

// ─────────────────────────────────────────────
// 부모에게 받을 props 정의
// "message"와 "sub"라는 문자열을 받겠다
// ─────────────────────────────────────────────
type Props = {
  message: string;
  sub: string;
};

export default function BriefingCard({ message, sub }: Props) {
  return (
    <View style={styles.briefingCard}>
      <View style={styles.briefingIconWrap}>
        <Text style={styles.briefingIcon}>✨</Text>
      </View>
      <View style={styles.briefingTextWrap}>
        <Text style={styles.briefingTitle}>{message}</Text>
        <Text style={styles.briefingSub}>{sub}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  briefingCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginTop: 8,
    marginBottom: 4,
    padding: 14,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  briefingIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#E8F5E9',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  briefingIcon: { fontSize: 18 },
  briefingTextWrap: { flex: 1 },
  briefingTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 3,
  },
  briefingSub: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
});