import { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { COLORS, RADIUS } from '../../theme/colors';
import { useAppData } from '../../lib/useAppData';

type FlightData = {
  flightNo: string; status: string; terminal: string; gate: string;
  boardingTime: string; origin: string; destination: string;
};

const POSITIONS = [
  { label: 'Contrôle sûreté (juste passé)', minutes: 0 },
  { label: 'Zone A — Restaurants', minutes: 4 },
  { label: 'Zone B — Boutiques', minutes: 7 },
  { label: 'Zone C — Duty free', minutes: 10 },
  { label: "Salle d'embarquement", minutes: 2 },
];

// Table de distances connues entre aéroports (approche "villes connues",
// suffisante pour les badges — pas besoin de précision GPS ici).
const DISTANCE_TABLE: Record<string, number> = {
  'CDG-JFK': 5837, 'JFK-CDG': 5837, 'CDG-LAX': 9124, 'CDG-NRT': 9714,
  'CDG-DXB': 5240, 'CDG-BKK': 9540, 'CDG-MRS': 660, 'MRS-CDG': 660,
  'CDG-TLS': 590, 'TLS-CDG': 590, 'CDG-BCN': 830, 'BCN-CDG': 830,
};
function estimateDistance(origin: string, destination: string) {
  return DISTANCE_TABLE[`${origin}-${destination}`] || 1500;
}

export default function VoyageScreen() {
  const { data, update } = useAppData();
  const [flightNo, setFlightNo] = useState('');
  const [date, setDate] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [tracking, setTracking] = useState(false);
  const [flight, setFlight] = useState<FlightData | null>(null);
  const [positionIndex, setPositionIndex] = useState(0);
  const [log, setLog] = useState<string[]>([]);
  const lastGateRef = useRef<string | null>(null);
  const simTicksRef = useRef(0);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  function addLog(msg: string) {
    const t = new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
    setLog((prev) => [`[${t}] ${msg}`, ...prev]);
  }

  async function fetchFlightStatus(): Promise<FlightData> {
    if (apiKey.trim().length > 0) {
      const url = `https://aerodatabox.p.rapidapi.com/flights/number/${encodeURIComponent(flightNo)}/${date}`;
      const res = await fetch(url, {
        headers: { 'X-RapidAPI-Key': apiKey, 'X-RapidAPI-Host': 'aerodatabox.p.rapidapi.com' },
      });
      if (!res.ok) throw new Error(`Erreur API (${res.status})`);
      const json = await res.json();
      const f = Array.isArray(json) ? json[0] : json;
      return {
        flightNo, status: f?.status || 'Inconnu', terminal: f?.departure?.terminal || '—',
        gate: f?.departure?.gate || '—', boardingTime: f?.departure?.scheduledTime?.local || '—',
        origin: f?.departure?.airport?.iata || '—', destination: f?.arrival?.airport?.iata || '—',
      };
    }
    simTicksRef.current += 1;
    const gateChanged = simTicksRef.current === 3;
    return {
      flightNo, status: "À l'heure", terminal: '2E', gate: gateChanged ? 'B34' : 'B12',
      boardingTime: '14:35', origin: 'CDG', destination: 'JFK',
    };
  }

  async function checkFlight() {
    try {
      const flightData = await fetchFlightStatus();
      setFlight(flightData);

      if (lastGateRef.current === null) {
        lastGateRef.current = flightData.gate;
        addLog(`Suivi démarré — porte actuelle : ${flightData.gate}`);

        // Alimente les statistiques de récompenses, comme sur le prototype web
        const dist = estimateDistance(flightData.origin, flightData.destination);
        const destKey = `${flightData.origin}-${flightData.destination}`;
        const newDestinations = data.stats.destinations.includes(destKey)
          ? data.stats.destinations
          : [...data.stats.destinations, destKey];
        const newStats = {
          ...data.stats,
          flightsCount: data.stats.flightsCount + 1,
          totalKm: data.stats.totalKm + dist,
          destinations: newDestinations,
        };
        update({
          stats: newStats,
          lastFlightContext: { flightNo: flightData.flightNo, date: date || new Date().toISOString().slice(0, 10), origin: flightData.origin, destination: flightData.destination },
        });
      } else if (flightData.gate !== lastGateRef.current) {
        addLog(`🔔 Porte changée : ${lastGateRef.current} → ${flightData.gate}`);
        lastGateRef.current = flightData.gate;
      } else {
        addLog(`Vérification OK — porte inchangée (${flightData.gate})`);
      }
    } catch (err: any) {
      addLog(`Erreur : ${err.message}`);
    }
  }

  function startTracking() {
    if (!flightNo.trim()) return;
    setTracking(true);
    checkFlight();
    pollRef.current = setInterval(checkFlight, 180000);
  }

  useEffect(() => {
    return () => { if (pollRef.current) clearInterval(pollRef.current); };
  }, []);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {flight && (
        <View style={styles.flightHero}>
          <View style={styles.fhCircle}><Text style={{ fontSize: 32, transform: [{ rotate: '45deg' }] }}>✈️</Text></View>
          <Text style={styles.fhCodes}>{flight.origin}  →  {flight.destination}</Text>
        </View>
      )}

      {!tracking && (
        <View style={styles.card}>
          <Text style={styles.label}>Numéro de vol</Text>
          <TextInput style={styles.input} placeholder="ex: AF006" value={flightNo} onChangeText={setFlightNo} autoCapitalize="characters" />
          <Text style={styles.label}>Date du vol (AAAA-MM-JJ)</Text>
          <TextInput style={styles.input} placeholder="2026-09-21" value={date} onChangeText={setDate} />
          <Text style={styles.label}>Clé API AeroDataBox — optionnel</Text>
          <TextInput style={styles.input} placeholder="laisse vide pour tester en simulation" value={apiKey} onChangeText={setApiKey} secureTextEntry />
          <TouchableOpacity style={styles.button} onPress={startTracking}>
            <Text style={styles.buttonText}>Suivre ce vol</Text>
          </TouchableOpacity>
        </View>
      )}

      {flight && (
        <View style={styles.card}>
          <Row k="Vol" v={flight.flightNo} />
          <Row k="Statut" v={flight.status} />
          <Row k="Terminal" v={flight.terminal} />
          <Row k="Porte" v={flight.gate} />
          <Row k="Heure embarquement" v={flight.boardingTime} />
        </View>
      )}

      {tracking && (
        <View style={styles.card}>
          <Text style={styles.label}>Où es-tu dans le terminal ?</Text>
          {POSITIONS.map((p, i) => (
            <TouchableOpacity key={p.label} style={[styles.posOption, i === positionIndex && styles.posOptionActive]} onPress={() => setPositionIndex(i)}>
              <Text style={i === positionIndex ? styles.posTextActive : styles.posText}>{p.label}</Text>
            </TouchableOpacity>
          ))}
          <Row k="Temps de marche estimé" v={`${POSITIONS[positionIndex].minutes} min`} />
        </View>
      )}

      {tracking && (
        <View style={styles.card}>
          <Text style={styles.label}>Journal des vérifications</Text>
          {log.slice(0, 8).map((line, i) => <Text key={i} style={styles.logLine}>{line}</Text>)}
          <TouchableOpacity style={[styles.button, styles.buttonSecondary]} onPress={checkFlight}>
            <Text style={styles.buttonSecondaryText}>Vérifier maintenant</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <View style={styles.row}>
      <Text style={styles.rowKey}>{k}</Text>
      <Text style={styles.rowValue}>{v}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.grayLight },
  content: { padding: 20, paddingTop: 50, paddingBottom: 30, gap: 14 },
  flightHero: { backgroundColor: COLORS.coral, borderRadius: RADIUS.card, padding: 24, alignItems: 'center' },
  fhCircle: { width: 80, height: 80, borderRadius: 40, backgroundColor: 'rgba(255,255,255,0.9)', alignItems: 'center', justifyContent: 'center', marginBottom: 14 },
  fhCodes: { color: COLORS.white, fontSize: 18, fontWeight: '700' },
  card: { backgroundColor: COLORS.white, borderRadius: RADIUS.card, padding: 18, borderWidth: 1, borderColor: COLORS.line, gap: 4 },
  label: { fontSize: 10.5, fontWeight: '700', color: COLORS.gray, textTransform: 'uppercase', marginBottom: 6, marginTop: 4 },
  input: { backgroundColor: COLORS.grayLight, borderRadius: 12, borderWidth: 1, borderColor: COLORS.line, padding: 12, fontSize: 14, marginBottom: 10 },
  button: { backgroundColor: COLORS.coral, borderRadius: 14, padding: 13, alignItems: 'center', marginTop: 4 },
  buttonText: { color: COLORS.white, fontWeight: '700', fontSize: 14 },
  buttonSecondary: { backgroundColor: COLORS.grayLight, borderWidth: 1, borderColor: COLORS.line },
  buttonSecondaryText: { color: COLORS.ink, fontWeight: '600', fontSize: 14 },
  row: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 5 },
  rowKey: { fontSize: 12, color: COLORS.gray },
  rowValue: { fontSize: 14, fontWeight: '700', color: COLORS.ink },
  posOption: { padding: 12, borderRadius: 10, marginBottom: 6, backgroundColor: COLORS.grayLight },
  posOptionActive: { backgroundColor: COLORS.coralLight, borderWidth: 1, borderColor: COLORS.coral },
  posText: { fontSize: 13, color: COLORS.ink },
  posTextActive: { fontSize: 13, color: COLORS.coralDark, fontWeight: '700' },
  logLine: { fontSize: 10.5, color: COLORS.gray, paddingVertical: 3, borderBottomWidth: 1, borderBottomColor: COLORS.line },
});
