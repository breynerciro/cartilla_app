import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Colors } from '../../src/theme/colors';
import { Header } from '../../src/components/Header';
import { BrushingTimer } from '../../src/components/BrushingTimer';
import { BackButton } from '../../src/components/BackButton';
import { scheduleDailyBrushingReminders } from '../../src/services/notifications';

export default function GlobalTimerScreen() {
  const router = useRouter();

  useEffect(() => {
    scheduleDailyBrushingReminders();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <Header 
        title="Temporizador Clínico" 
        decoration="left" 
      />
      <View style={styles.body}>
        <BrushingTimer onFinish={() => router.back()} />
      </View>
      <View style={styles.footer}>
        <BackButton onPress={() => router.back()} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.white },
  body: {
    flex: 1,
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
  footer: {
    alignItems: 'center',
    paddingBottom: 12,
  },
});
