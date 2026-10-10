import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { screenPadding, Spacing } from '../../src/theme/spacing';
import { Screen } from '../../src/components/Screen';
import { Header } from '../../src/components/Header';
import { BrushingTimer } from '../../src/components/BrushingTimer';
import { BackButton } from '../../src/components/BackButton';
import { AlarmSettingsModal } from '../../src/components/AlarmSettingsModal';
import { scheduleDailyBrushingReminders } from '../../src/services/notifications';
import { getAlarmSettings, AlarmSettings } from '../../src/services/alarmSettings';

export default function GlobalTimerScreen() {
  const router = useRouter();
  const [showAlarmSettings, setShowAlarmSettings] = useState(false);
  const [alarmSummary, setAlarmSummary] = useState<string>('');

  useEffect(() => {
    scheduleDailyBrushingReminders();
    loadAlarmSummary();
  }, []);

  const loadAlarmSummary = async () => {
    const settings = await getAlarmSettings();
    updateSummary(settings);
  };

  const updateSummary = (settings: AlarmSettings) => {
    if (!settings.enabled) {
      setAlarmSummary('Off');
      return;
    }
    const timesStr = settings.times
      .map(t => {
        const h = t.hour % 12 || 12;
        const ampm = t.hour < 12 ? 'AM' : 'PM';
        return `${h}:${t.minute.toString().padStart(2, '0')}${ampm}`;
      })
      .join(' · ');
    setAlarmSummary(timesStr);
  };

  const handleAlarmSettingsClose = () => {
    setShowAlarmSettings(false);
    loadAlarmSummary();
  };

  return (
    <Screen>
      <Header 
        title="Temporizador de Cepillado" 
        decoration="left" 
      />
      {/* ScrollView: el contenido del temporizador mide ~530 pt y en un iPhone SE
          (667 pt) solo hay ~453 libres entre el Header y el Back. flexGrow lo centra
          cuando sobra espacio y deja hacer scroll cuando no cabe. */}
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.body}
        showsVerticalScrollIndicator={false}
      >
        <BrushingTimer
          onFinish={() => router.back()}
          onOpenAlarmSettings={() => setShowAlarmSettings(true)}
          alarmSummary={alarmSummary}
        />
      </ScrollView>
      <View style={styles.footer}>
        <BackButton onPress={() => router.back()} />
      </View>

      <AlarmSettingsModal
        visible={showAlarmSettings}
        onClose={handleAlarmSettingsClose}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
  },
  body: {
    flexGrow: 1,
    paddingHorizontal: screenPadding,
    paddingBottom: Spacing.xs,
  },
  footer: {
    alignItems: 'center',
    paddingBottom: Spacing.sm,
  },
});
