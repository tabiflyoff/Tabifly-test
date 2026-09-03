import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { COLORS, RADIUS } from '../../theme/colors';

const ITEMS: { icon: string; label: string; route: string }[] = [
  { icon: '📄', label: 'Documents de voyage', route: '/documents' },
  { icon: '💱', label: 'Devise & budget', route: '/budget' },
  { icon: '🔁', label: 'Correspondances', route: '/correspondances' },
  { icon: '🗣️', label: 'Traduction', route: '/traduction' },
  { icon: '🧳', label: 'Bagages', route: '/bagages' },
  { icon: '💬', label: 'Fil de vol partagé', route: '/filvol' },
  { icon: '🏅', label: 'Récompenses', route: '/recompenses' },
  { icon: '✦', label: 'Premium', route: '/premium' },
  { icon: '👤', label: 'Compte', route: '/compte' },
];

export default function PlusScreen() {
  const router = useRouter();
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.sectionTitle}>Tous les modules</Text>
      {ITEMS.map((item) => (
        <TouchableOpacity key={item.route} style={styles.listRow} onPress={() => router.push(item.route as any)}>
          <View style={styles.icoBadge}><Text style={{ fontSize: 17 }}>{item.icon}</Text></View>
          <Text style={styles.label}>{item.label}</Text>
          <Text style={styles.chev}>›</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.grayLight },
  content: { padding: 20, paddingTop: 50, paddingBottom: 30 },
  sectionTitle: { fontSize: 11, fontWeight: '700', color: COLORS.gray, textTransform: 'uppercase', marginBottom: 12, letterSpacing: 0.5 },
  listRow: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: COLORS.white, borderRadius: RADIUS.row, padding: 13, marginBottom: 10, borderWidth: 1, borderColor: COLORS.line },
  icoBadge: { width: 38, height: 38, borderRadius: 11, backgroundColor: COLORS.coralLight, alignItems: 'center', justifyContent: 'center' },
  label: { flex: 1, fontSize: 14, fontWeight: '600', color: COLORS.ink },
  chev: { color: COLORS.gray, fontSize: 18 },
});
