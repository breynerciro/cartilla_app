import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
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
        title="Temporizador Clínico" 
        decoration="left" 
      />
      <View style={styles.body}>
        <BrushingTimer
          onFinish={() => router.back()}
          onOpenAlarmSettings={() => setShowAlarmSettings(true)}
          alarmSummary={alarmSummary}
        />
      </View>
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
  body: {
    flex: 1,
    paddingHorizontal: screenPadding,
    paddingBottom: Spacing.xs,
  },
  footer: {
    alignItems: 'center',
    paddingBottom: Spacing.sm,
  },
});
