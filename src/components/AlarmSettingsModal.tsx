import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  Switch,
  FlatList,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../theme/colors';
import { Typography } from '../theme/typography';
import {
  AlarmSettings,
  AlarmTime,
  getAlarmSettings,
  saveAlarmSettings,
  DEFAULT_ALARM_SETTINGS,
} from '../services/alarmSettings';
import { scheduleDailyBrushingReminders } from '../services/notifications';

interface AlarmSettingsModalProps {
  visible: boolean;
  onClose: () => void;
}

// Pre-compute common time slots grouped by period
const TIME_PERIODS = [
  {
    label: 'Mañana',
    icon: 'sunny' as const,
    color: '#FBBF24',
    slots: [
      { hour: 5, minute: 0 }, { hour: 5, minute: 30 },
      { hour: 6, minute: 0 }, { hour: 6, minute: 30 },
      { hour: 7, minute: 0 }, { hour: 7, minute: 30 },
      { hour: 8, minute: 0 }, { hour: 8, minute: 30 },
      { hour: 9, minute: 0 }, { hour: 9, minute: 30 },
      { hour: 10, minute: 0 }, { hour: 10, minute: 30 },
      { hour: 11, minute: 0 }, { hour: 11, minute: 30 },
    ],
  },
  {
    label: 'Tarde',
    icon: 'partly-sunny' as const,
    color: '#FB923C',
    slots: [
      { hour: 12, minute: 0 }, { hour: 12, minute: 30 },
      { hour: 13, minute: 0 }, { hour: 13, minute: 30 },
      { hour: 14, minute: 0 }, { hour: 14, minute: 30 },
      { hour: 15, minute: 0 }, { hour: 15, minute: 30 },
      { hour: 16, minute: 0 }, { hour: 16, minute: 30 },
      { hour: 17, minute: 0 }, { hour: 17, minute: 30 },
    ],
  },
  {
    label: 'Noche',
    icon: 'moon' as const,
    color: '#818CF8',
    slots: [
      { hour: 18, minute: 0 }, { hour: 18, minute: 30 },
      { hour: 19, minute: 0 }, { hour: 19, minute: 30 },
      { hour: 20, minute: 0 }, { hour: 20, minute: 30 },
      { hour: 21, minute: 0 }, { hour: 21, minute: 30 },
      { hour: 22, minute: 0 }, { hour: 22, minute: 30 },
      { hour: 23, minute: 0 },
    ],
  },
];

function formatTime(hour: number, minute: number): string {
  const h = hour % 12 || 12;
  const ampm = hour < 12 ? 'AM' : 'PM';
  return `${h}:${minute.toString().padStart(2, '0')} ${ampm}`;
}

function getTimeIcon(hour: number): 'sunny' | 'partly-sunny' | 'moon' {
  if (hour >= 5 && hour < 12) return 'sunny';
  if (hour >= 12 && hour < 18) return 'partly-sunny';
  return 'moon';
}

function getTimeColor(hour: number): string {
  if (hour >= 5 && hour < 12) return '#FBBF24';
  if (hour >= 12 && hour < 18) return '#FB923C';
  return '#818CF8';
}

export const AlarmSettingsModal: React.FC<AlarmSettingsModalProps> = ({ visible, onClose }) => {
  const [settings, setSettings] = useState<AlarmSettings>(DEFAULT_ALARM_SETTINGS);
  const [editingTimeIndex, setEditingTimeIndex] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (visible) {
      loadSettings();
      setEditingTimeIndex(null);
    }
  }, [visible]);

  const loadSettings = async () => {
    const loaded = await getAlarmSettings();
    setSettings(loaded);
  };

  const handleFrequencyChange = (freq: 2 | 3) => {
    setSettings(prev => {
      let newTimes: AlarmTime[];
      if (freq === 3) {
        if (prev.times.length === 2) {
          newTimes = [
            prev.times[0],
            { hour: 13, minute: 0, label: 'Tarde' },
            prev.times[1],
          ];
        } else {
          newTimes = prev.times;
        }
      } else {
        if (prev.times.length === 3) {
          newTimes = [prev.times[0], prev.times[2]];
        } else {
          newTimes = prev.times;
        }
      }
      return { ...prev, frequency: freq, times: newTimes };
    });
    setEditingTimeIndex(null);
  };

  const handleTimeSelect = (index: number, hour: number, minute: number) => {
    setSettings(prev => {
      const newTimes = [...prev.times];
      const labels = ['Mañana', 'Tarde', 'Noche'];
      newTimes[index] = {
        hour,
        minute,
        label: labels[index] || `Alarma ${index + 1}`,
      };
      return { ...prev, times: newTimes };
    });
    setEditingTimeIndex(null);
  };

  const handleToggleEnabled = (value: boolean) => {
    setSettings(prev => ({ ...prev, enabled: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    await saveAlarmSettings(settings);
    try {
      await scheduleDailyBrushingReminders(settings);
    } catch (error) {
      console.log("Error al reprogramar alarmas:", error);
    }
    setSaving(false);
    onClose();
  };

  // ─── Inline time picker for a single alarm ───
  const renderTimePicker = (alarmIndex: number) => {
    const currentTime = settings.times[alarmIndex];
    if (!currentTime) return null;

    return (
      <View style={styles.timePickerContainer}>
        {TIME_PERIODS.map((period) => (
          <View key={period.label} style={styles.periodSection}>
            {/* Period header */}
            <View style={styles.periodHeader}>
              <Ionicons name={period.icon} size={16} color={period.color} />
              <Text style={[styles.periodLabel, { color: period.color }]}>{period.label}</Text>
            </View>
            {/* Time slots in a wrap layout */}
            <View style={styles.slotsWrap}>
              {period.slots.map((slot) => {
                const isSelected = currentTime.hour === slot.hour && currentTime.minute === slot.minute;
                return (
                  <TouchableOpacity
                    key={`${slot.hour}-${slot.minute}`}
                    style={[
                      styles.timeSlot,
                      isSelected && { backgroundColor: period.color },
                    ]}
                    onPress={() => handleTimeSelect(alarmIndex, slot.hour, slot.minute)}
                    activeOpacity={0.6}
                  >
                    <Text style={[
                      styles.timeSlotText,
                      isSelected && styles.timeSlotTextSelected,
                    ]}>
                      {formatTime(slot.hour, slot.minute)}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        ))}
      </View>
    );
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.overlay}>
        {/* Tap outside to close */}
        <TouchableOpacity style={styles.overlayDismiss} onPress={onClose} activeOpacity={1} />

        <View style={styles.container}>
          {/* Drag handle */}
          <View style={styles.dragHandle} />

          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerIcon}>
              <Ionicons name="alarm" size={26} color={Colors.white} />
            </View>
            <View style={styles.headerTextGroup}>
              <Text style={styles.title}>Configurar Alarmas</Text>
              <Text style={styles.subtitle}>Personaliza tus recordatorios de cepillado</Text>
            </View>
          </View>

          {/* Body — single ScrollView, no nesting */}
          <ScrollView
            style={styles.scrollBody}
            contentContainerStyle={styles.body}
            showsVerticalScrollIndicator={false}
            nestedScrollEnabled={true}
            keyboardShouldPersistTaps="handled"
          >
            {/* ── Toggle ── */}
            <View style={styles.section}>
              <View style={styles.toggleRow}>
                <View style={styles.toggleInfo}>
                  <Ionicons
                    name="notifications"
                    size={22}
                    color={settings.enabled ? Colors.timer.success : '#94A3B8'}
                  />
                  <Text style={styles.toggleLabel}>Recordatorios activos</Text>
                </View>
                <Switch
                  value={settings.enabled}
                  onValueChange={handleToggleEnabled}
                  trackColor={{ false: '#E2E8F0', true: 'rgba(107, 203, 119, 0.4)' }}
                  thumbColor={settings.enabled ? Colors.timer.success : '#94A3B8'}
                />
              </View>
            </View>

            {settings.enabled && (
              <>
                {/* ── Frequency ── */}
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>¿Cuántas veces al día?</Text>
                  <Text style={styles.sectionHint}>
                    Los odontólogos recomiendan cepillarse después de cada comida
                  </Text>
                  <View style={styles.frequencyRow}>
                    {([2, 3] as const).map(freq => (
                      <TouchableOpacity
                        key={freq}
                        style={[
                          styles.frequencyOption,
                          settings.frequency === freq && styles.frequencyOptionSelected,
                        ]}
                        onPress={() => handleFrequencyChange(freq)}
                        activeOpacity={0.7}
                      >
                        <View style={styles.frequencyIconRow}>
                          <Ionicons
                            name="sunny"
                            size={freq === 2 ? 20 : 18}
                            color={settings.frequency === freq ? Colors.white : Colors.navy}
                          />
                          {freq === 3 && (
                            <Ionicons
                              name="partly-sunny"
                              size={16}
                              color={settings.frequency === freq ? Colors.white : Colors.navy}
                              style={{ marginLeft: 3 }}
                            />
                          )}
                          <Ionicons
                            name="moon"
                            size={freq === 2 ? 16 : 14}
                            color={settings.frequency === freq ? Colors.white : Colors.navy}
                            style={{ marginLeft: 3 }}
                          />
                        </View>
                        <Text style={[
                          styles.frequencyText,
                          settings.frequency === freq && styles.frequencyTextSelected,
                        ]}>
                          {freq} veces
                        </Text>
                        <Text style={[
                          styles.frequencySubtext,
                          settings.frequency === freq && styles.frequencySubtextSelected,
                        ]}>
                          {freq === 2 ? 'Mañana y Noche' : 'Mañana, Tarde y Noche'}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>

                {/* ── Alarm cards ── */}
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Horarios de alarma</Text>
                  <Text style={styles.sectionHint}>Toca una alarma para cambiar la hora</Text>

                  {settings.times.map((time, index) => (
                    <View key={`alarm-${index}`}>
                      <TouchableOpacity
                        style={[
                          styles.alarmCard,
                          editingTimeIndex === index && styles.alarmCardEditing,
                        ]}
                        onPress={() =>
                          setEditingTimeIndex(editingTimeIndex === index ? null : index)
                        }
                        activeOpacity={0.7}
                      >
                        <View
                          style={[
                            styles.alarmIconCircle,
                            { backgroundColor: getTimeColor(time.hour) + '20' },
                          ]}
                        >
                          <Ionicons
                            name={getTimeIcon(time.hour)}
                            size={24}
                            color={getTimeColor(time.hour)}
                          />
                        </View>
                        <View style={styles.alarmInfo}>
                          <Text style={styles.alarmLabel}>{time.label}</Text>
                          <Text style={styles.alarmTime}>
                            {formatTime(time.hour, time.minute)}
                          </Text>
                        </View>
                        <Ionicons
                          name={editingTimeIndex === index ? 'chevron-up' : 'chevron-down'}
                          size={20}
                          color={Colors.lavender}
                        />
                      </TouchableOpacity>

                      {/* Expanded time picker — no nested ScrollView */}
                      {editingTimeIndex === index && renderTimePicker(index)}
                    </View>
                  ))}
                </View>
              </>
            )}

            {/* Extra bottom padding so content isn't hidden behind footer */}
            <View style={{ height: 16 }} />
          </ScrollView>

          {/* ── Footer Actions ── */}
          <View style={styles.footer}>
            <TouchableOpacity style={styles.cancelBtn} onPress={onClose} activeOpacity={0.7}>
              <Text style={styles.cancelBtnText}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.saveBtn, saving && { opacity: 0.6 }]}
              onPress={handleSave}
              disabled={saving}
              activeOpacity={0.7}
            >
              <Ionicons name="checkmark-circle" size={20} color={Colors.white} />
              <Text style={styles.saveBtnText}>
                {saving ? 'Guardando...' : 'Guardar'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

// ─── Styles ──────────────────────────────────────────────────
const { height: SCREEN_HEIGHT } = Dimensions.get('window');

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 14, 85, 0.55)',
    justifyContent: 'flex-end',
  },
  overlayDismiss: {
    flex: 1,
  },
  container: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    maxHeight: SCREEN_HEIGHT * 0.88,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 16,
  },
  dragHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#D1D5DB',
    alignSelf: 'center',
    marginTop: 10,
    marginBottom: 4,
  },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.navy,
    marginHorizontal: 16,
    borderRadius: 20,
    paddingVertical: 16,
    paddingHorizontal: 18,
    marginBottom: 4,
    gap: 14,
  },
  headerIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(121, 140, 235, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTextGroup: {
    flex: 1,
  },
  title: {
    fontFamily: Typography.fonts.ubuntuBold,
    fontSize: 20,
    color: Colors.white,
    marginBottom: 2,
  },
  subtitle: {
    fontFamily: Typography.fonts.ubuntu,
    fontSize: 13,
    color: Colors.lavender,
  },

  // Body
  scrollBody: {
    flexGrow: 0,
    flexShrink: 1,
  },
  body: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontFamily: Typography.fonts.ubuntuBold,
    fontSize: 15,
    color: Colors.navy,
    marginBottom: 3,
  },
  sectionHint: {
    fontFamily: Typography.fonts.ubuntu,
    fontSize: 12,
    color: '#94A3B8',
    marginBottom: 12,
  },

  // Toggle
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.offWhite,
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  toggleInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  toggleLabel: {
    fontFamily: Typography.fonts.ubuntuBold,
    fontSize: 15,
    color: Colors.navy,
  },

  // Frequency
  frequencyRow: {
    flexDirection: 'row',
    gap: 12,
  },
  frequencyOption: {
    flex: 1,
    backgroundColor: Colors.offWhite,
    borderRadius: 18,
    paddingVertical: 14,
    paddingHorizontal: 10,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  frequencyOptionSelected: {
    backgroundColor: Colors.navy,
    borderColor: Colors.lavender,
  },
  frequencyIconRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  frequencyText: {
    fontFamily: Typography.fonts.ubuntuBold,
    fontSize: 17,
    color: Colors.navy,
    marginBottom: 2,
  },
  frequencyTextSelected: {
    color: Colors.white,
  },
  frequencySubtext: {
    fontFamily: Typography.fonts.ubuntu,
    fontSize: 11,
    color: '#94A3B8',
    textAlign: 'center',
  },
  frequencySubtextSelected: {
    color: Colors.lavender,
  },

  // Alarm cards
  alarmCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.offWhite,
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginBottom: 8,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  alarmCardEditing: {
    borderColor: Colors.lavender,
    backgroundColor: '#F0F2FF',
    marginBottom: 0,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  alarmIconCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  alarmInfo: {
    flex: 1,
  },
  alarmLabel: {
    fontFamily: Typography.fonts.ubuntuBold,
    fontSize: 13,
    color: Colors.navy,
    marginBottom: 2,
  },
  alarmTime: {
    fontFamily: Typography.fonts.ubuntuBold,
    fontSize: 20,
    color: Colors.blue,
    letterSpacing: 0.5,
  },

  // ── Time Picker (flat, no nested ScrollView) ──
  timePickerContainer: {
    backgroundColor: '#F0F2FF',
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    paddingHorizontal: 14,
    paddingTop: 12,
    paddingBottom: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderTopWidth: 0,
    borderColor: 'rgba(121, 140, 235, 0.2)',
  },
  periodSection: {
    marginBottom: 10,
  },
  periodHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  periodLabel: {
    fontFamily: Typography.fonts.ubuntuBold,
    fontSize: 13,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  slotsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  timeSlot: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: 'rgba(0, 14, 85, 0.06)',
    minWidth: 80,
    alignItems: 'center',
  },
  timeSlotText: {
    fontFamily: Typography.fonts.ubuntu,
    fontSize: 13,
    color: Colors.navy,
  },
  timeSlotTextSelected: {
    fontFamily: Typography.fonts.ubuntuBold,
    color: Colors.white,
  },

  // Footer
  footer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 14,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 14, 85, 0.06)',
    backgroundColor: Colors.white,
  },
  cancelBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.navy,
  },
  cancelBtnText: {
    fontFamily: Typography.fonts.ubuntuBold,
    fontSize: 15,
    color: Colors.navy,
  },
  saveBtn: {
    flex: 1.5,
    flexDirection: 'row',
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.timer.success,
    gap: 8,
    shadowColor: Colors.timer.success,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  saveBtnText: {
    fontFamily: Typography.fonts.ubuntuBold,
    fontSize: 15,
    color: Colors.white,
  },
});
