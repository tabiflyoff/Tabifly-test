import { Tabs } from 'expo-router';
import { Text } from 'react-native';
import { COLORS } from '../../theme/colors';

function TabIcon({ emoji, focused }: { emoji: string; focused: boolean }) {
  return <Text style={{ fontSize: 19, opacity: focused ? 1 : 0.4 }}>{emoji}</Text>;
}

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: COLORS.coral,
        tabBarInactiveTintColor: COLORS.gray,
        tabBarLabelStyle: { fontSize: 9.5, fontWeight: '600' },
        tabBarStyle: { borderTopColor: COLORS.line, height: 62, paddingBottom: 8, paddingTop: 6 },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{ title: 'Accueil', tabBarIcon: ({ focused }) => <TabIcon emoji="🏠" focused={focused} /> }}
      />
      <Tabs.Screen
        name="voyage"
        options={{ title: 'Voyage', tabBarIcon: ({ focused }) => <TabIcon emoji="✈️" focused={focused} /> }}
      />
      <Tabs.Screen
        name="checklist"
        options={{ title: 'Checklist', tabBarIcon: ({ focused }) => <TabIcon emoji="☑️" focused={focused} /> }}
      />
      <Tabs.Screen
        name="plus"
        options={{ title: 'Plus', tabBarIcon: ({ focused }) => <TabIcon emoji="⋯" focused={focused} /> }}
      />
    </Tabs>
  );
}
