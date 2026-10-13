import React, { useEffect, useState } from 'react';
import { StyleSheet, ScrollView } from 'react-native';
import { screenPadding, Spacing } from '../../../src/theme/spacing';
import { Screen } from '../../../src/components/Screen';
import { Header } from '../../../src/components/Header';
import { BrushingTimer } from '../../../src/components/BrushingTimer';
import { AlarmSettingsModal } from '../../../src/components/AlarmSettingsModal';
import { scheduleDailyBrushingReminders } from '../../../src/services/notifications';
import { getAlarmSettings, AlarmSettings } from '../../../src/services/alarmSettings';

export default function GlobalTimerScreen() {
  const [showAlarmSettings, setShowAlarmSettings] = useState(false);
  const [alarmSummary, setAlarmSummary] = useState<string>('');
  // Cambiar la key remonta el temporizador en 2:00. Antes se reiniciaba al salir de
  // la pantalla; como raíz de pestaña ya no se sale, así que se reinicia al terminar.
  const [timerRun, setTimerRun] = useState(0);

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
    <Screen edges={['top', 'left', 'right']}>
      <Header 
        title="Temporizador de Cepillado" 
        decoration="left" 
      />
      {/* ScrollView: el contenido del temporizador mide ~530 pt y en un iPhone SE
          (667 pt) no cabe entre el Header y la barra de pestañas. flexGrow lo centra
          cuando sobra espacio y deja hacer scroll cuando no cabe. */}
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.body}
        showsVerticalScrollIndicator={false}
      >
        <BrushingTimer
          key={timerRun}
          onFinish={() => setTimerRun((run) => run + 1)}
          onOpenAlarmSettings={() => setShowAlarmSettings(true)}
          alarmSummary={alarmSummary}
        />
      </ScrollView>

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
    paddingBottom: Spacing.lg,
  },
});
