import { Stack } from 'expo-router';
import { Colors } from '../../../src/theme/colors';

export default function TimerLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: Colors.surface },
      }}
    />
  );
}
