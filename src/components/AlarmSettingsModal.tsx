import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  Switch,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
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

import { Spacing } from '../theme/spacing';
interface AlarmSettingsModalProps {
  visible: boolean;
  onClose: () => void;
}

// Pre-compute common time slots grouped by period.
// `color` es el relleno (el slot seleccionado lleva texto navy encima: 10.5, 7.8 y 5.9:1);
// `ink` es la variante oscura del mismo tono para texto e iconos sobre #F0F2FF / offWhite
// (todas >= 4.6:1), porque el color claro daba 1.50, 2.03 y 2.68:1.
const TIME_PERIODS = [
  {
    label: 'Mañana',
    icon: 'sunny' as const,
    color: '#FBBF24',
    ink: '#8E6703',
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
    ink: '#B15204',
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
    ink: '#4959F5',
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

function getTimeInk(hour: number): string {
  if (hour >= 5 && hour < 12) return '#8E6703';
  if (hour >= 12 && hour < 18) return '#B15204';
  return '#4959F5';
}

export const AlarmSettingsModal: React.FC<AlarmSettingsModalProps> = ({ visible, onClose }) => {
  const [settings, setSettings] = useState<AlarmSettings>(DEFAULT_ALARM_SETTINGS);
  const [editingTimeIndex, setEditingTimeIndex] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const insets = useSafeAreaInsets();

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
              <Ionicons name={period.icon} size={16} color={period.ink} />
              <Text style={[styles.periodLabel, { color: period.ink }]}>{period.label}</Text>
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
                      isSelected && { backgroundColor: period.color, borderColor: Colors.navy },
                    ]}
                    onPress={() => handleTimeSelect(alarmIndex, slot.hour, slot.minute)}
                    activeOpacity={0.6}
                    accessibilityRole="button"
                    accessibilityLabel={`${formatTime(slot.hour, slot.minute)}, ${period.label.toLowerCase()}`}
                    accessibilityState={{ selected: isSelected }}
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
        {/* El mismo gesto lo ofrece el boton Cancelar: aqui no hay nada que anunciar. */}
        <TouchableOpacity
          style={styles.overlayDismiss}
          onPress={onClose}
          activeOpacity={1}
          accessible={false}
          importantForAccessibility="no"
        />

        <View style={styles.container} accessibilityViewIsModal>
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
                    color={settings.enabled ? Colors.success : Colors.textSecondary}
                  />
                  <Text style={styles.toggleLabel}>Recordatorios activos</Text>
                </View>
                <Switch
                  accessibilityLabel="Recordatorios activos"
                  value={settings.enabled}
                  onValueChange={handleToggleEnabled}
                  trackColor={{ false: '#E2E8F0', true: 'rgba(107, 203, 119, 0.4)' }}
                  thumbColor={settings.enabled ? Colors.success : Colors.textSecondary}
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
                        accessibilityRole="button"
                        accessibilityLabel={`${freq} veces al día, ${freq === 2 ? 'mañana y noche' : 'mañana, tarde y noche'}`}
                        accessibilityState={{ selected: settings.frequency === freq }}
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
                              style={{ marginLeft: Spacing.xs }}
                            />
                          )}
                          <Ionicons
                            name="moon"
                            size={freq === 2 ? 16 : 14}
                            color={settings.frequency === freq ? Colors.white : Colors.navy}
                            style={{ marginLeft: Spacing.xs }}
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
                        accessibilityRole="button"
                        accessibilityLabel={`${time.label}, ${formatTime(time.hour, time.minute)}`}
                        accessibilityState={{ expanded: editingTimeIndex === index }}
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
                            color={getTimeInk(time.hour)}
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
                          color={Colors.textSecondary}
                        />
                      </TouchableOpacity>

                      {/* Expanded time picker — no nested ScrollView */}
                      {editingTimeIndex === index && renderTimePicker(index)}
                    </View>
                  ))}
                </View>
              </>
            )}
          </ScrollView>

          {/* ── Footer Actions ── */}
          {/* El footer es lo ultimo de la hoja: suma el inset inferior para no quedar bajo la barra de gestos. */}
          <View style={[styles.footer, { paddingBottom: Spacing.md + insets.bottom }]}>
            <TouchableOpacity
              style={styles.cancelBtn}
              onPress={onClose}
              activeOpacity={0.7}
              accessibilityRole="button"
            >
              <Text style={styles.cancelBtnText}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.saveBtn, saving && { opacity: 0.6 }]}
              onPress={handleSave}
              disabled={saving}
              activeOpacity={0.7}
              accessibilityRole="button"
              accessibilityState={{ disabled: saving }}
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
    backgroundColor: Colors.scrim,
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
    marginTop: Spacing.md,
    marginBottom: Spacing.xs,
  },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.navy,
    marginHorizontal: Spacing.lg,
    borderRadius: 20,
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.xl,
    marginBottom: Spacing.xs,
    gap: Spacing.lg,
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
    ...Typography.scale.subtitle,
    fontFamily: Typography.fonts.ubuntuBold,
    color: Colors.white,
    marginBottom: Spacing.xs,
  },
  subtitle: {
    ...Typography.scale.label,
    fontFamily: Typography.fonts.ubuntu,
    color: Colors.lavender,
  },

  // Body
  scrollBody: {
    flexGrow: 0,
    flexShrink: 1,
  },
  body: {
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.lg, // aire sobre el footer (antes un spacer de 16 mas 8)
  },
  section: {
    marginBottom: Spacing.xl,
  },
  sectionTitle: {
    ...Typography.scale.body,
    fontFamily: Typography.fonts.ubuntuBold,
    color: Colors.navy,
    marginBottom: Spacing.xs,
  },
  sectionHint: {
    ...Typography.scale.caption,
    color: Colors.textSecondary,
    marginBottom: Spacing.md,
  },

  // Toggle
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.offWhite,
    borderRadius: 16,
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.lg,
  },
  toggleInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  toggleLabel: {
    ...Typography.scale.body,
    fontFamily: Typography.fonts.ubuntuBold,
    color: Colors.navy,
  },

  // Frequency
  frequencyRow: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  frequencyOption: {
    flex: 1,
    backgroundColor: Colors.offWhite,
    borderRadius: 18,
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.md,
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
    marginBottom: Spacing.sm,
  },
  frequencyText: {
    ...Typography.scale.bodyLarge,
    fontFamily: Typography.fonts.ubuntuBold,
    color: Colors.navy,
    marginBottom: Spacing.xs,
  },
  frequencyTextSelected: {
    color: Colors.white,
  },
  frequencySubtext: {
    ...Typography.scale.caption,
    color: Colors.textSecondary,
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
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.sm,
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
    marginRight: Spacing.lg,
  },
  alarmInfo: {
    flex: 1,
  },
  alarmLabel: {
    ...Typography.scale.label,
    color: Colors.navy,
    marginBottom: Spacing.xs,
  },
  alarmTime: {
    ...Typography.scale.subtitle,
    fontFamily: Typography.fonts.ubuntuBold,
    color: Colors.primary,
    letterSpacing: 0.5,
  },

  // ── Time Picker (flat, no nested ScrollView) ──
  timePickerContainer: {
    backgroundColor: '#F0F2FF',
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.lg,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderTopWidth: 0,
    borderColor: 'rgba(121, 140, 235, 0.2)',
  },
  periodSection: {
    marginBottom: Spacing.md,
  },
  periodHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  periodLabel: {
    ...Typography.scale.label,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  slotsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  timeSlot: {
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: 10,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: 'rgba(0, 14, 85, 0.06)',
    minWidth: 80,
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  timeSlotText: {
    ...Typography.scale.label,
    fontFamily: Typography.fonts.ubuntu,
    color: Colors.navy,
  },
  timeSlotTextSelected: {
    fontFamily: Typography.fonts.ubuntuBold,
    color: Colors.navy,
  },

  // Footer
  footer: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.md,
    gap: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 14, 85, 0.06)',
    backgroundColor: Colors.white,
  },
  cancelBtn: {
    flex: 1,
    paddingVertical: Spacing.lg,
    borderRadius: 16,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.navy,
  },
  cancelBtnText: {
    ...Typography.scale.body,
    fontFamily: Typography.fonts.ubuntuBold,
    color: Colors.navy,
  },
  saveBtn: {
    flex: 1.5,
    flexDirection: 'row',
    paddingVertical: Spacing.lg,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.success,
    gap: Spacing.sm,
    shadowColor: Colors.success,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  saveBtnText: {
    ...Typography.scale.body,
    fontFamily: Typography.fonts.ubuntuBold,
    color: Colors.onPrimary,
  },
});
