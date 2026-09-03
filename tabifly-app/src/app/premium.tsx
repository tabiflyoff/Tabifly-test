import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useState } from 'react';
import { COLORS, RADIUS } from '../theme/colors';
import { useAppData } from '../lib/useAppData';

const FEATURES = [
  { icon: '🚫', title: 'Zéro publicité', desc: 'Une expérience fluide, sans bannière.' },
  { icon: '💬', title: 'Fil de vol partagé', desc: 'Échange en direct avec les autres passagers.' },
  { icon: '🗣️', title: 'Traduction illimitée', desc: 'Demande ton chemin dans n\'importe quelle langue.' },
  { icon: '📶', title: 'Mode hors ligne', desc: 'Checklist, budget et documents accessibles sans réseau.' },
];

export default function PremiumScreen() {
  const { data, update } = useAppData();
  const [plan, setPlan] = useState<'monthly' | 'yearly'>('monthly');

  function activate() {
    update({ isPremium: true });
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.hero}>
        <Text style={styles.badge}>✦ PREMIUM</Text>
        <Text style={styles.trialBadge}>🎁 Essai gratuit de 7 jours</Text>
        <Text style={styles.headline}>Voyage sans limites</Text>
        <Text style={styles.sub}>Toute l'app, sans pub, avec les outils qui comptent.</Text>
      </View>

      <Text style={styles.sectionTitle}>Ce que tu débloques</Text>
      {FEATURES.map((f) => (
        <View key={f.title} style={styles.feature}>
          <View style={styles.featureIcon}><Text style={{ fontSize: 16 }}>{f.icon}</Text></View>
          <View style={{ flex: 1 }}>
            <Text style={styles.featureTitle}>{f.title}</Text>
            <Text style={styles.featureDesc}>{f.desc}</Text>
          </View>
        </View>
      ))}

      <Text style={styles.sectionTitle}>Choisis ta formule</Text>
      <View style={styles.planToggle}>
        <TouchableOpacity style={[styles.planOpt, plan === 'monthly' && styles.planOptActive]} onPress={() => setPlan('monthly')}>
          <Text style={plan === 'monthly' ? styles.planTextActive : styles.planText}>Mensuel</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.planOpt, plan === 'yearly' && styles.planOptActive]} onPress={() => setPlan('yearly')}>
          <Text style={plan === 'yearly' ? styles.planTextActive : styles.planText}>Annuel (-33%)</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.card}>
        <Text style={styles.price}>{plan === 'monthly' ? '4,99€/mois' : '39,99€/an'}</Text>
        <Text style={styles.priceNote}>7 jours offerts, puis {plan === 'monthly' ? 'sans engagement' : '3,33€/mois'}</Text>
        {data.isPremium ? (
          <View style={styles.activeTag}><Text style={styles.activeTagText}>✓ Premium déjà actif</Text></View>
        ) : (
          <TouchableOpacity style={styles.button} onPress={activate}>
            <Text style={styles.buttonText}>Démarrer l'essai gratuit</Text>
          </TouchableOpacity>
        )}
      </View>
      <Text style={styles.legalNote}>Le vrai paiement (Google Play Billing) sera branché en Phase 4 — ce bouton simule l'activation pour l'instant.</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.grayLight },
  content: { padding: 20, paddingBottom: 30 },
  hero: { backgroundColor: '#1B1830', borderRadius: RADIUS.card, padding: 26, alignItems: 'center', marginBottom: 20 },
  badge: { fontSize: 11, fontWeight: '700', letterSpacing: 1, color: '#FFD9BA', backgroundColor: 'rgba(255,138,90,0.18)', paddingHorizontal: 12, paddingVertical: 5, borderRadius: 20, marginBottom: 10 },
  trialBadge: { fontSize: 11.5, fontWeight: '700', color: COLORS.ink, backgroundColor: COLORS.green, paddingHorizontal: 14, paddingVertical: 6, borderRadius: 20, marginBottom: 14, overflow: 'hidden' },
  headline: { fontSize: 24, fontWeight: '700', color: COLORS.white, marginBottom: 8 },
  sub: { fontSize: 12.5, color: 'rgba(255,255,255,0.75)', textAlign: 'center' },
  sectionTitle: { fontSize: 11, fontWeight: '700', color: COLORS.gray, textTransform: 'uppercase', marginBottom: 10, marginTop: 6, letterSpacing: 0.5 },
  feature: { flexDirection: 'row', gap: 12, backgroundColor: COLORS.white, borderRadius: RADIUS.row, padding: 13, marginBottom: 9, borderWidth: 1, borderColor: COLORS.line },
  featureIcon: { width: 34, height: 34, borderRadius: 10, backgroundColor: COLORS.coralLight, alignItems: 'center', justifyContent: 'center' },
  featureTitle: { fontSize: 13.5, fontWeight: '700', color: COLORS.ink, marginBottom: 2 },
  featureDesc: { fontSize: 11.5, color: COLORS.gray },
  planToggle: { flexDirection: 'row', backgroundColor: COLORS.grayLight, borderRadius: 14, padding: 4, gap: 4, marginBottom: 14 },
  planOpt: { flex: 1, alignItems: 'center', padding: 10, borderRadius: 11 },
  planOptActive: { backgroundColor: COLORS.white },
  planText: { fontSize: 12.5, fontWeight: '700', color: COLORS.gray },
  planTextActive: { fontSize: 12.5, fontWeight: '700', color: COLORS.ink },
  card: { backgroundColor: COLORS.white, borderRadius: RADIUS.card, padding: 18, alignItems: 'center', borderWidth: 1, borderColor: COLORS.line },
  price: { fontSize: 30, fontWeight: '700', color: COLORS.ink },
  priceNote: { fontSize: 11.5, color: COLORS.gray, marginBottom: 16 },
  button: { backgroundColor: COLORS.coral, borderRadius: 14, paddingVertical: 13, paddingHorizontal: 24, width: '100%', alignItems: 'center' },
  buttonText: { color: COLORS.white, fontWeight: '700' },
  activeTag: { backgroundColor: 'rgba(31,190,124,0.1)', borderRadius: 12, paddingVertical: 12, paddingHorizontal: 20 },
  activeTagText: { color: COLORS.green, fontWeight: '700' },
  legalNote: { fontSize: 10.5, color: COLORS.gray, textAlign: 'center', marginTop: 10 },
});
