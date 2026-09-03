import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal } from 'react-native';
import { useState } from 'react';
import { COLORS, RADIUS } from '../theme/colors';
import { useAppData } from '../lib/useAppData';

type Badge = { id: string; ico: string; name: string; req: string; check: (stats: any) => boolean };

const BADGES: Badge[] = [
  { id: 'first', ico: '🛫', name: 'Premier envol', req: '1 vol suivi', check: (s) => s.flightsCount >= 1 },
  { id: 'five', ico: '☁️', name: 'Habitué du ciel', req: '5 vols suivis', check: (s) => s.flightsCount >= 5 },
  { id: 'twenty', ico: '🧭', name: 'Grand voyageur', req: '20 vols suivis', check: (s) => s.flightsCount >= 20 },
  { id: 'fifty', ico: '🏆', name: 'Légende du tarmac', req: '50 vols suivis', check: (s) => s.flightsCount >= 50 },
  { id: 'km1000', ico: '📍', name: '1 000 km parcourus', req: '1 000 km cumulés', check: (s) => s.totalKm >= 1000 },
  { id: 'km10000', ico: '🌏', name: 'Longue distance', req: '10 000 km cumulés', check: (s) => s.totalKm >= 10000 },
  { id: 'km40000', ico: '🌍', name: 'Tour du monde', req: '40 000 km cumulés', check: (s) => s.totalKm >= 40000 },
  { id: 'explorer', ico: '🗺️', name: 'Explorateur', req: '3 destinations différentes', check: (s) => s.destinations.length >= 3 },
  { id: 'checklist', ico: '☑️', name: 'Checklist parfaite', req: 'Checklist 100% complétée', check: (s) => s.checklistCompleted },
  { id: 'luggage', ico: '🧳', name: 'Bagage prêt', req: 'Photos bagage + tag enregistrées', check: (s) => s.luggageDocumented },
];

export default function RecompensesScreen() {
  const { data } = useAppData();
  const [selected, setSelected] = useState<Badge | null>(null);
  const stats = data.stats;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.statsCard}>
        <StatRow label="Vols suivis" value={String(stats.flightsCount)} />
        <StatRow label="Destinations différentes" value={String(stats.destinations.length)} />
        <StatRow label="Kilomètres parcourus" value={`${stats.totalKm.toLocaleString('fr-FR')} km`} />
      </View>

      <Text style={styles.sectionTitle}>Tes badges</Text>
      <View style={styles.grid}>
        {BADGES.map((b) => {
          const unlocked = b.check(stats);
          return (
            <TouchableOpacity key={b.id} style={[styles.badgeCard, !unlocked && styles.badgeLocked]} onPress={() => setSelected(b)}>
              <Text style={styles.badgeIcon}>{unlocked ? b.ico : '🔒'}</Text>
              <Text style={styles.badgeName}>{b.name}</Text>
              <Text style={styles.badgeReq}>{b.req}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <Modal visible={!!selected} transparent animationType="fade" onRequestClose={() => setSelected(null)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            {selected && (
              <>
                <Text style={styles.modalIcon}>{selected.check(stats) ? selected.ico : '🔒'}</Text>
                <Text style={styles.modalName}>{selected.name}</Text>
                <Text style={styles.modalDetail}>
                  {selected.check(stats)
                    ? data.badgeUnlockDetails[selected.id] || 'Débloqué !'
                    : `Pas encore débloqué — condition : ${selected.req}.`}
                </Text>
                <TouchableOpacity style={styles.modalButton} onPress={() => setSelected(null)}>
                  <Text style={styles.modalButtonText}>Fermer</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

function StatRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.statRow}>
      <Text style={styles.statLabel}>{label}</Text>
      <Text style={styles.statValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.grayLight },
  content: { padding: 20, paddingBottom: 30 },
  statsCard: { backgroundColor: COLORS.coral, borderRadius: RADIUS.card, padding: 18, marginBottom: 20 },
  statRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  statLabel: { color: 'rgba(255,255,255,0.85)', fontSize: 12 },
  statValue: { color: COLORS.white, fontSize: 14, fontWeight: '700' },
  sectionTitle: { fontSize: 11, fontWeight: '700', color: COLORS.gray, textTransform: 'uppercase', marginBottom: 12, letterSpacing: 0.5 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  badgeCard: { width: '47%', backgroundColor: COLORS.white, borderRadius: RADIUS.row, padding: 14, alignItems: 'center', borderWidth: 1, borderColor: COLORS.line },
  badgeLocked: { opacity: 0.45 },
  badgeIcon: { fontSize: 28, marginBottom: 8 },
  badgeName: { fontSize: 12, fontWeight: '700', color: COLORS.ink, textAlign: 'center', marginBottom: 3 },
  badgeReq: { fontSize: 10, color: COLORS.gray, textAlign: 'center' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(13,15,20,0.55)', alignItems: 'center', justifyContent: 'center', padding: 24 },
  modalCard: { backgroundColor: COLORS.white, borderRadius: 20, padding: 26, alignItems: 'center', maxWidth: 300 },
  modalIcon: { fontSize: 44, marginBottom: 12 },
  modalName: { fontSize: 18, fontWeight: '700', color: COLORS.ink, marginBottom: 8 },
  modalDetail: { fontSize: 13, color: COLORS.gray, textAlign: 'center', marginBottom: 18, lineHeight: 18 },
  modalButton: { backgroundColor: COLORS.coral, borderRadius: 14, paddingVertical: 12, paddingHorizontal: 30 },
  modalButtonText: { color: COLORS.white, fontWeight: '700' },
});
