import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="documents" options={{ headerShown: true, title: 'Documents' }} />
      <Stack.Screen name="budget" options={{ headerShown: true, title: 'Devise & budget' }} />
      <Stack.Screen name="bagages" options={{ headerShown: true, title: 'Bagages' }} />
      <Stack.Screen name="compte" options={{ headerShown: true, title: 'Compte' }} />
      <Stack.Screen name="filvol" options={{ headerShown: true, title: 'Fil de vol' }} />
      <Stack.Screen name="recompenses" options={{ headerShown: true, title: 'Récompenses' }} />
      <Stack.Screen name="traduction" options={{ headerShown: true, title: 'Traduction' }} />
      <Stack.Screen name="correspondances" options={{ headerShown: true, title: 'Correspondances' }} />
      <Stack.Screen name="premium" options={{ headerShown: true, title: 'Premium' }} />
    </Stack>
  );
}
