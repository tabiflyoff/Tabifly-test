import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { COLORS, RADIUS } from '../../theme/colors';

type Item = { id: number; text: string; done: boolean };

const DEFAULT_ITEMS: Item[] = [
  "Passeport / carte d'identité",
  "Billet d'avion / carte d'embarquement",
  'Check-in en ligne effectué',
  'Chargeur + batterie externe',
  'Adaptateur de prise',
  'Liquides ≤ 100ml dans un sac transparent',
  'Assurance voyage',
  'Copie des réservations (hôtel, transport)',
].map((text, id) => ({ id, text, done: false }));

export default function ChecklistScreen() {
  const [items, setItems] = useState<Item[]>(DEFAULT_ITEMS);
  const [newItem, setNewItem] = useState('');

  const done = items.filter((i) => i.done).length;
  const total = items.length;
  const progress = total ? done / total : 0;

  function toggle(id: number) {
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, done: !i.done } : i)));
  }

  function addItem() {
    if (!newItem.trim()) return;
    setItems((prev) => [...prev, { id: Date.now(), text: newItem.trim(), done: false }]);
    setNewItem('');
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.card}>
        <View style={styles.row}>
          <Text style={styles.rowKey}>Progression</Text>
          <Text style={styles.rowValue}>{done}/{total}</Text>
        </View>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
        </View>

        {items.map((item) => (
          <TouchableOpacity key={item.id} style={styles.checkItem} onPress={() => toggle(item.id)}>
            <View style={[styles.checkbox, item.done && styles.checkboxDone]}>
              {item.done && <Text style={styles.checkmark}>✓</Text>}
            </View>
            <Text style={[styles.checkText, item.done && styles.checkTextDone]}>{item.text}</Text>
          </TouchableOpacity>
        ))}

        <View style={styles.addRow}>
          <TextInput style={styles.addInput} placeholder="Ajouter un élément..." value={newItem} onChangeText={setNewItem} onSubmitEditing={addItem} />
          <TouchableOpacity style={styles.addButton} onPress={addItem}>
            <Text style={styles.addButtonText}>+</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.grayLight },
  content: { padding: 20, paddingTop: 50, paddingBottom: 30 },
  card: { backgroundColor: COLORS.white, borderRadius: RADIUS.card, padding: 18, borderWidth: 1, borderColor: COLORS.line },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  rowKey: { fontSize: 12, color: COLORS.gray },
  rowValue: { fontSize: 14, fontWeight: '700', color: COLORS.ink },
  progressBar: { height: 7, backgroundColor: COLORS.grayLight, borderRadius: 4, overflow: 'hidden', marginBottom: 14 },
  progressFill: { height: '100%', backgroundColor: COLORS.coral },
  checkItem: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 11, borderBottomWidth: 1, borderBottomColor: COLORS.line },
  checkbox: { width: 20, height: 20, borderRadius: 5, borderWidth: 2, borderColor: COLORS.line, alignItems: 'center', justifyContent: 'center' },
  checkboxDone: { backgroundColor: COLORS.coral, borderColor: COLORS.coral },
  checkmark: { color: COLORS.white, fontSize: 12, fontWeight: '700' },
  checkText: { fontSize: 13.5, color: COLORS.ink, flex: 1 },
  checkTextDone: { color: COLORS.gray, textDecorationLine: 'line-through' },
  addRow: { flexDirection: 'row', gap: 8, marginTop: 12 },
  addInput: { flex: 1, backgroundColor: COLORS.grayLight, borderRadius: 12, borderWidth: 1, borderColor: COLORS.line, padding: 12, fontSize: 14 },
  addButton: { width: 44, backgroundColor: COLORS.coral, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  addButtonText: { color: COLORS.white, fontSize: 20, fontWeight: '700' },
});
