import { Stack } from 'expo-router';
import { Colors } from '../../../src/theme/colors';

export default function AgeGroupLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: Colors.background.secondary },
        animation: 'slide_from_right',
      }}
    />
  );
}
