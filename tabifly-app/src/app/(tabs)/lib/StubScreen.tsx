import { View, Text, StyleSheet } from 'react-native';
import { COLORS, RADIUS } from '../theme/colors';

export default function StubScreen({ icon, description }: { icon: string; description: string }) {
  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.icon}>{icon}</Text>
        <Text style={styles.text}>{description}</Text>
        <Text style={styles.note}>Cet écran sera construit en Phase 2, une fois Firebase branché.</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.grayLight, padding: 20, justifyContent: 'center' },
  card: { backgroundColor: COLORS.white, borderRadius: RADIUS.card, padding: 24, alignItems: 'center', borderWidth: 1, borderColor: COLORS.line },
  icon: { fontSize: 36, marginBottom: 12 },
  text: { fontSize: 14, color: COLORS.ink, textAlign: 'center', marginBottom: 8, fontWeight: '600' },
  note: { fontSize: 11.5, color: COLORS.gray, textAlign: 'center' },
});
