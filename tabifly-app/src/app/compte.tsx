import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { COLORS, RADIUS } from '../theme/colors';
import { useAppData } from '../lib/useAppData';

export default function CompteScreen() {
  const { data, update, syncStatus, deleteAccount } = useAppData();
  const [name, setName] = useState(data.account.name);
  const [email, setEmail] = useState(data.account.email);
  const router = useRouter();

  function save() {
    update({ account: { name, email } });
  }

  function confirmDelete() {
    Alert.alert(
      'Supprimer ton compte ?',
      'Cette action est irréversible : checklist, budget, badges et profil seront définitivement effacés.',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer', style: 'destructive',
          onPress: async () => {
            await deleteAccount();
            Alert.alert('Compte supprimé', 'Tes données ont été effacées.');
          },
        },
      ]
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.avatar}><Text style={styles.avatarText}>{name ? name[0].toUpperCase() : '?'}</Text></View>

      <View style={styles.card}>
        <Text style={styles.label}>Nom</Text>
        <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="Ilies" />
        <Text style={styles.label}>Email</Text>
        <TextInput style={styles.input} value={email} onChangeText={setEmail} placeholder="toi@exemple.com" autoCapitalize="none" />
        <TouchableOpacity style={styles.button} onPress={save}>
          <Text style={styles.buttonText}>Enregistrer</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.sectionTitle}>Abonnement</Text>
      <View style={styles.premiumCard}>
        <Text style={styles.premiumStatus}>{data.isPremium ? 'Premium actif ✓' : 'Gratuit (avec pub)'}</Text>
        <Text style={styles.premiumNote}>Le Premium retire la pub et débloque le Fil de vol, la Traduction et le mode hors ligne.</Text>
        <TouchableOpacity style={styles.premiumButton} onPress={() => router.push('/premium' as any)}>
          <Text style={styles.premiumButtonText}>Voir la page Premium</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.sectionTitle}>Sauvegarde</Text>
      <View style={styles.card}>
        <View style={styles.row}>
          <Text style={styles.rowKey}>Statut de synchronisation</Text>
          <Text style={styles.rowValueSmall}>{syncStatus}</Text>
        </View>
        <Text style={styles.note}>Checklist, dépenses et profil sont sauvegardés automatiquement, même app fermée.</Text>
      </View>

      <Text style={styles.sectionTitle}>Zone sensible</Text>
      <View style={[styles.card, { borderColor: 'rgba(255,90,70,0.3)' }]}>
        <TouchableOpacity style={styles.deleteButton} onPress={confirmDelete}>
          <Text style={styles.deleteButtonText}>Supprimer mon compte et mes données</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.grayLight },
  content: { padding: 20, paddingBottom: 30, gap: 4 },
  avatar: { width: 56, height: 56, borderRadius: 28, backgroundColor: COLORS.coral, alignItems: 'center', justifyContent: 'center', marginBottom: 14 },
  avatarText: { color: COLORS.white, fontSize: 20, fontWeight: '700' },
  card: { backgroundColor: COLORS.white, borderRadius: RADIUS.card, padding: 18, borderWidth: 1, borderColor: COLORS.line, marginBottom: 14 },
  label: { fontSize: 10.5, fontWeight: '700', color: COLORS.gray, textTransform: 'uppercase', marginBottom: 6, marginTop: 4 },
  input: { backgroundColor: COLORS.grayLight, borderRadius: 12, borderWidth: 1, borderColor: COLORS.line, padding: 12, fontSize: 14, marginBottom: 10 },
  button: { backgroundColor: COLORS.coral, borderRadius: 14, padding: 13, alignItems: 'center', marginTop: 4 },
  buttonText: { color: COLORS.white, fontWeight: '700', fontSize: 14 },
  sectionTitle: { fontSize: 11, fontWeight: '700', color: COLORS.gray, textTransform: 'uppercase', marginBottom: 10, marginTop: 4, letterSpacing: 0.5 },
  premiumCard: { backgroundColor: COLORS.coral, borderRadius: RADIUS.card, padding: 18, marginBottom: 14 },
  premiumStatus: { color: COLORS.white, fontSize: 15, fontWeight: '700', marginBottom: 6 },
  premiumNote: { color: 'rgba(255,255,255,0.85)', fontSize: 11.5, marginBottom: 14, lineHeight: 16 },
  premiumButton: { backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 12, padding: 12, alignItems: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.5)' },
  premiumButtonText: { color: COLORS.white, fontWeight: '700', fontSize: 13 },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  rowKey: { fontSize: 12, color: COLORS.gray },
  rowValueSmall: { fontSize: 12.5, fontWeight: '700', color: COLORS.ink, flexShrink: 1, textAlign: 'right' },
  note: { fontSize: 11.5, color: COLORS.gray, lineHeight: 16 },
  deleteButton: { backgroundColor: COLORS.white, borderRadius: 14, padding: 13, alignItems: 'center', borderWidth: 1, borderColor: COLORS.coral },
  deleteButtonText: { color: COLORS.coral, fontWeight: '700', fontSize: 13 },
});
