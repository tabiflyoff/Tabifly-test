import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { useState, useEffect } from 'react';
import { COLORS, RADIUS } from '../theme/colors';
import { useAppData } from '../lib/useAppData';

const CURRENCIES = ['USD', 'GBP', 'JPY', 'CAD'];

export default function BudgetScreen() {
  const { data, update } = useAppData();
  const [amount, setAmount] = useState('100');
  const [currency, setCurrency] = useState('USD');
  const [rates, setRates] = useState<Record<string, number> | null>(null);
  const [fxError, setFxError] = useState(false);
  const [label, setLabel] = useState('');
  const [expAmount, setExpAmount] = useState('');

  useEffect(() => {
    fetch(`https://api.frankfurter.dev/v1/latest?from=EUR&to=${CURRENCIES.join(',')}`)
      .then((res) => { if (!res.ok) throw new Error(); return res.json(); })
      .then((json) => setRates(json.rates))
      .catch(() => setFxError(true));
  }, []);

  const result = rates ? (parseFloat(amount || '0') * rates[currency]).toFixed(2) : null;
  const total = data.expenses.reduce((s, e) => s + e.amount, 0);

  function addExpense() {
    const value = parseFloat(expAmount);
    if (!label.trim() || isNaN(value)) return;
    update({ expenses: [...data.expenses, { label: label.trim(), amount: value }] });
    setLabel('');
    setExpAmount('');
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.card}>
        <Text style={styles.label}>Convertisseur</Text>
        <View style={styles.fxRow}>
          <TextInput style={[styles.input, { flex: 1 }]} value={amount} onChangeText={setAmount} keyboardType="numeric" />
          <View style={styles.currencyPicker}>
            {CURRENCIES.map((c) => (
              <TouchableOpacity key={c} style={[styles.currencyOpt, currency === c && styles.currencyOptActive]} onPress={() => setCurrency(c)}>
                <Text style={currency === c ? styles.currencyTextActive : styles.currencyText}>{c}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
        <View style={styles.row}>
          <Text style={styles.rowKey}>Résultat</Text>
          <Text style={styles.rowValue}>{fxError ? '⚠️ indisponible' : result ? `${result} ${currency}` : '...'}</Text>
        </View>
        <Text style={styles.note}>Taux en temps réel via l'API Frankfurter (source BCE).</Text>
      </View>

      <Text style={styles.sectionTitle}>Dépenses du voyage</Text>
      <View style={styles.card}>
        <View style={styles.row}>
          <Text style={styles.rowKey}>Total dépensé</Text>
          <Text style={styles.rowValue}>{total.toFixed(2)} €</Text>
        </View>
        {data.expenses.map((e, i) => (
          <View key={i} style={styles.row}>
            <Text style={styles.rowKey}>{e.label}</Text>
            <Text style={styles.rowValueSmall}>{e.amount.toFixed(2)} €</Text>
          </View>
        ))}
        <View style={styles.addRow}>
          <TextInput style={[styles.input, { flex: 2 }]} placeholder="Libellé" value={label} onChangeText={setLabel} />
          <TextInput style={[styles.input, { flex: 1 }]} placeholder="€" value={expAmount} onChangeText={setExpAmount} keyboardType="numeric" />
          <TouchableOpacity style={styles.addButton} onPress={addExpense}>
            <Text style={styles.addButtonText}>+</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.grayLight },
  content: { padding: 20, paddingBottom: 30, gap: 4 },
  card: { backgroundColor: COLORS.white, borderRadius: RADIUS.card, padding: 18, borderWidth: 1, borderColor: COLORS.line, marginBottom: 14 },
  label: { fontSize: 10.5, fontWeight: '700', color: COLORS.gray, textTransform: 'uppercase', marginBottom: 8 },
  sectionTitle: { fontSize: 11, fontWeight: '700', color: COLORS.gray, textTransform: 'uppercase', marginBottom: 10, letterSpacing: 0.5 },
  input: { backgroundColor: COLORS.grayLight, borderRadius: 12, borderWidth: 1, borderColor: COLORS.line, padding: 12, fontSize: 14 },
  fxRow: { flexDirection: 'row', gap: 8, marginBottom: 10 },
  currencyPicker: { flexDirection: 'row', flex: 1.3, gap: 4 },
  currencyOpt: { flex: 1, backgroundColor: COLORS.grayLight, borderRadius: 10, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: COLORS.line },
  currencyOptActive: { backgroundColor: COLORS.coralLight, borderColor: COLORS.coral },
  currencyText: { fontSize: 11, color: COLORS.gray, fontWeight: '600' },
  currencyTextActive: { fontSize: 11, color: COLORS.coralDark, fontWeight: '700' },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  rowKey: { fontSize: 12, color: COLORS.gray, flexShrink: 1 },
  rowValue: { fontSize: 15, fontWeight: '700', color: COLORS.ink },
  rowValueSmall: { fontSize: 13, fontWeight: '700', color: COLORS.ink },
  note: { fontSize: 11, color: COLORS.gray, marginTop: 4 },
  addRow: { flexDirection: 'row', gap: 8, marginTop: 12 },
  addButton: { width: 44, backgroundColor: COLORS.coral, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  addButtonText: { color: COLORS.white, fontSize: 20, fontWeight: '700' },
});
