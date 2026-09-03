import { createContext, useContext, useEffect, useRef, useState, ReactNode } from 'react';
import { auth, db, doc, getDoc, setDoc, serverTimestamp, signIn } from './firebase';

export type ChecklistItem = { id: number; text: string; done: boolean };
export type Expense = { label: string; amount: number };
export type Stats = {
  flightsCount: number;
  totalKm: number;
  destinations: string[];
  checklistCompleted: boolean;
  luggageDocumented: boolean;
};
export type FlightContext = { flightNo: string; date: string; origin: string; destination: string } | null;

type AppData = {
  checklist: ChecklistItem[];
  expenses: Expense[];
  account: { name: string; email: string };
  isPremium: boolean;
  stats: Stats;
  badgeUnlockDetails: Record<string, string>;
  lastFlightContext: FlightContext;
};

const DEFAULT_CHECKLIST: ChecklistItem[] = [
  "Passeport / carte d'identité",
  "Billet d'avion / carte d'embarquement",
  'Check-in en ligne effectué',
  'Chargeur + batterie externe',
  'Adaptateur de prise',
  'Liquides ≤ 100ml dans un sac transparent',
  'Assurance voyage',
  'Copie des réservations (hôtel, transport)',
].map((text, id) => ({ id, text, done: false }));

const DEFAULT_DATA: AppData = {
  checklist: DEFAULT_CHECKLIST,
  expenses: [],
  account: { name: '', email: '' },
  isPremium: false,
  stats: { flightsCount: 0, totalKm: 0, destinations: [], checklistCompleted: false, luggageDocumented: false },
  badgeUnlockDetails: {},
  lastFlightContext: null,
};

type Ctx = {
  data: AppData;
  loading: boolean;
  syncStatus: string;
  uid: string | null;
  update: (partial: Partial<AppData>) => void;
  deleteAccount: () => Promise<void>;
};

const AppDataContext = createContext<Ctx | null>(null);

export function AppDataProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<AppData>(DEFAULT_DATA);
  const [loading, setLoading] = useState(true);
  const [syncStatus, setSyncStatus] = useState('Connexion...');
  const [uid, setUid] = useState<string | null>(null);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    signIn()
      .then(async (user) => {
        setUid(user.uid);
        const snap = await getDoc(doc(db, 'users', user.uid));
        if (snap.exists()) {
          const remote = snap.data() as Partial<AppData>;
          setData((prev) => ({ ...prev, ...remote }));
        }
        setSyncStatus('Synchronisé ✓');
        setLoading(false);
      })
      .catch((err) => {
        setSyncStatus('Erreur : ' + err.message);
        setLoading(false);
      });
  }, []);

  function update(partial: Partial<AppData>) {
    setData((prev) => {
      const next = { ...prev, ...partial };
      scheduleSave(next);
      return next;
    });
  }

  function scheduleSave(next: AppData) {
    if (!uid) return;
    setSyncStatus('Enregistrement...');
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(async () => {
      try {
        await setDoc(doc(db, 'users', uid), { ...next, updatedAt: serverTimestamp() }, { merge: true });
        setSyncStatus('Synchronisé ✓');
      } catch (err: any) {
        setSyncStatus('Erreur écriture : ' + err.message);
      }
    }, 800);
  }

  async function deleteAccount() {
    if (!uid) return;
    await setDoc(doc(db, 'users', uid), { deleted: true }, { merge: true });
    // La suppression complète (Auth + document) nécessite en pratique une
    // Cloud Function côté serveur pour être faite proprement et en sécurité
    // depuis un compte anonyme — voir functions/index.js du projet web.
    setData(DEFAULT_DATA);
  }

  return (
    <AppDataContext.Provider value={{ data, loading, syncStatus, uid, update, deleteAccount }}>
      {children}
    </AppDataContext.Provider>
  );
}

export function useAppData() {
  const ctx = useContext(AppDataContext);
  if (!ctx) throw new Error('useAppData doit être utilisé à l\'intérieur de <AppDataProvider>');
  return ctx;
}
