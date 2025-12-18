import { Stack } from 'expo-router';
import { COLORS } from '../../../src/styles/theme';

export default function TaxLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: COLORS.white },
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="filing" />
      <Stack.Screen name="history" />
      <Stack.Screen name="receipts" />
      <Stack.Screen name="settings" />
    </Stack>
  );
}
