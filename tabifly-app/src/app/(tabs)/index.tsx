import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { COLORS, RADIUS } from '../../theme/colors';

export default function AccueilScreen() {
  const router = useRouter();

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.topbar}>
        <View style={styles.logoMark}><Text style={{ fontSize: 18 }}>✈️</Text></View>
        <View>
          <Text style={styles.title}>Tabifly</Text>
          <Text style={styles.subtitle}>Ton compagnon de voyage</Text>
        </View>
      </View>

      <View style={styles.hero}>
        <Text style={styles.heroLabel}>Prochain vol</Text>
        <Text style={styles.heroFlight}>Ajoute ton vol</Text>
        <Text style={styles.heroSub}>Onglet Voyage →</Text>
      </View>

      <Text style={styles.sectionTitle}>Accès rapide</Text>
      <View style={styles.quickGrid}>
        <TouchableOpacity style={styles.quick} onPress={() => router.push('/checklist' as any)}>
          <Text style={styles.quickIcon}>☑️</Text>
          <Text style={styles.quickLabel}>Checklist départ</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.quick} onPress={() => router.push('/bagages' as any)}>
          <Text style={styles.quickIcon}>🧳</Text>
          <Text style={styles.quickLabel}>Bagages</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.sectionTitle}>Alertes voyage</Text>
      <View style={[styles.card, { borderLeftWidth: 3, borderLeftColor: COLORS.amber }]}>
        <Text style={styles.cardLabel}>Météo destination</Text>
        <Text style={styles.cardValue}>Renseigne un vol pour voir la météo</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.grayLight },
  content: { padding: 20, paddingTop: 50, paddingBottom: 30 },
  topbar: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 20 },
  logoMark: { width: 34, height: 34, borderRadius: 10, backgroundColor: COLORS.coral, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 19, fontWeight: '700', color: COLORS.ink },
  subtitle: { fontSize: 11.5, color: COLORS.gray },
  hero: { backgroundColor: COLORS.coral, borderRadius: RADIUS.card, padding: 18, marginBottom: 20 },
  heroLabel: { color: 'rgba(255,255,255,0.85)', fontSize: 12, marginBottom: 4 },
  heroFlight: { color: COLORS.white, fontSize: 21, fontWeight: '700' },
  heroSub: { color: 'rgba(255,255,255,0.85)', fontSize: 11.5, marginTop: 2 },
  sectionTitle: { fontSize: 11, fontWeight: '700', color: COLORS.gray, textTransform: 'uppercase', marginBottom: 10, letterSpacing: 0.5, marginTop: 4 },
  quickGrid: { flexDirection: 'row', gap: 10, marginBottom: 4 },
  quick: { flex: 1, backgroundColor: COLORS.white, borderRadius: RADIUS.row, padding: 14, alignItems: 'center', borderWidth: 1, borderColor: COLORS.line },
  quickIcon: { fontSize: 20, marginBottom: 6 },
  quickLabel: { fontSize: 12, fontWeight: '600', color: COLORS.ink, textAlign: 'center' },
  card: { backgroundColor: COLORS.white, borderRadius: RADIUS.card, padding: 18, borderWidth: 1, borderColor: COLORS.line },
  cardLabel: { fontSize: 12, color: COLORS.gray, marginBottom: 4 },
  cardValue: { fontSize: 13, color: COLORS.ink },
});
