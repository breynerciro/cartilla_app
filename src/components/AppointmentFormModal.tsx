import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, Modal, TextInput, TouchableOpacity, ScrollView, Platform,
  KeyboardAvoidingView, Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker, { type DateTimePickerChangeEvent } from '@react-native-community/datetimepicker';
import { Colors } from '../theme/colors';
import { Radius } from '../theme/radius';
import { Typography } from '../theme/typography';
import { Appointment, AppointmentType, APPOINTMENT_TYPES } from '../data/appointments';
import { generateId } from '../utils/uuid';
import { Button } from './Button';

import { Spacing } from '../theme/spacing';
interface AppointmentFormModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (appointment: Appointment) => void;
  existingAppointment?: Appointment | null;
  initialDate?: Date;
}

export const AppointmentFormModal = ({ visible, onClose, onSave, existingAppointment, initialDate }: AppointmentFormModalProps) => {
  const [type, setType] = useState<AppointmentType>('odontologia');
  const [title, setTitle] = useState('');
  const [date, setDate] = useState(new Date());
  const [location, setLocation] = useState('');
  const [notes, setNotes] = useState('');
  const [reminderDays, setReminderDays] = useState(1);
  
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const insets = useSafeAreaInsets();

  useEffect(() => {
    if (existingAppointment) {
      setType(existingAppointment.type);
      setTitle(existingAppointment.title);
      setDate(new Date(`${existingAppointment.date}T${existingAppointment.time}:00`));
      setLocation(existingAppointment.location || '');
      setNotes(existingAppointment.notes || '');
      setReminderDays(existingAppointment.reminderDays);
    } else {
      resetForm();
    }
  }, [existingAppointment, visible, initialDate]);

  const resetForm = () => {
    setType('odontologia');
    setTitle('');
    
    // Si viene una fecha inicial (ej: del calendario), usar esa fecha pero mantener la hora actual
    if (initialDate) {
      const newDate = new Date();
      newDate.setFullYear(initialDate.getFullYear(), initialDate.getMonth(), initialDate.getDate());
      setDate(newDate);
    } else {
      setDate(new Date());
    }
    
    setLocation('');
    setNotes('');
    setReminderDays(1);
  };

  const handleSave = () => {
    if (!title.trim()) {
      Alert.alert('Campo requerido', 'Por favor ingresa un título para la cita');
      return;
    }

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const isoDate = `${year}-${month}-${day}`;
    const hours = String(date.getHours()).padStart(2, '0');
    const mins = String(date.getMinutes()).padStart(2, '0');

    const appointment: Appointment = {
      id: existingAppointment ? existingAppointment.id : generateId(),
      title: title.trim(),
      date: isoDate,
      time: `${hours}:${mins}`,
      location: location.trim() || undefined,
      notes: notes.trim() || undefined,
      reminderDays,
      type,
      completed: existingAppointment ? existingAppointment.completed : false,
    };

    onSave(appointment);
    onClose();
  };

  const onDateChange = (event: DateTimePickerChangeEvent, selectedDate: Date) => {
    setShowDatePicker(false);
    const currentDate = new Date(date);
    currentDate.setFullYear(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate());
    setDate(currentDate);
  };

  const onTimeChange = (event: DateTimePickerChangeEvent, selectedTime: Date) => {
    setShowTimePicker(false);
    const currentDate = new Date(date);
    currentDate.setHours(selectedTime.getHours(), selectedTime.getMinutes());
    setDate(currentDate);
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={true} onRequestClose={onClose}>
      <KeyboardAvoidingView
        style={styles.overlay}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.modalContainer} accessibilityViewIsModal>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>{existingAppointment ? 'Editar Cita' : 'Nueva Cita'}</Text>
            <TouchableOpacity
              onPress={onClose}
              style={styles.closeBtn}
              accessibilityRole="button"
              accessibilityLabel="Cerrar"
            >
              <Ionicons name="close" size={28} color={Colors.navy} />
            </TouchableOpacity>
          </View>

          {/* handled: el primer toque en Guardar/chips actua en vez de solo cerrar el teclado */}
          <ScrollView
            style={styles.content}
            contentContainerStyle={{ paddingBottom: insets.bottom + Spacing.xl }}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <Text style={styles.label}>Tipo de Cita</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
              style={styles.typeScroll}
            >
              {Object.entries(APPOINTMENT_TYPES).map(([key, config]) => {
                const isSelected = type === key;
                return (
                  <TouchableOpacity
                    key={key}
                    style={[styles.typeChip, isSelected && { backgroundColor: config.color, borderColor: config.color }]}
                    onPress={() => setType(key as AppointmentType)}
                    accessibilityRole="button"
                    accessibilityState={{ selected: isSelected }}
                  >
                    <Ionicons name={config.icon} size={20} color={isSelected ? Colors.navy : Colors.textSecondary} />
                    <Text style={[styles.typeText, isSelected && { color: Colors.navy }]}>{config.label}</Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            <Text style={styles.label}>Título</Text>
            <TextInput
              style={styles.input}
              placeholder="Ej: Control odontológico"
              accessibilityLabel="Título"
              value={title}
              onChangeText={setTitle}
              maxLength={40}
            />

            <View style={styles.row}>
              <View style={styles.half}>
                <Text style={styles.label}>Fecha</Text>
                <TouchableOpacity
                  style={styles.dateBtn}
                  onPress={() => setShowDatePicker(true)}
                  accessibilityRole="button"
                  accessibilityLabel={`Fecha: ${date.toLocaleDateString('es-ES')}`}
                >
                  <Ionicons name="calendar-outline" size={20} color={Colors.navy} />
                  <Text style={styles.dateText}>{date.toLocaleDateString('es-ES')}</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.half}>
                <Text style={styles.label}>Hora</Text>
                <TouchableOpacity
                  style={styles.dateBtn}
                  onPress={() => setShowTimePicker(true)}
                  accessibilityRole="button"
                  accessibilityLabel={`Hora: ${date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}`}
                >
                  <Ionicons name="time-outline" size={20} color={Colors.navy} />
                  <Text style={styles.dateText}>{date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}</Text>
                </TouchableOpacity>
              </View>
            </View>

            {(showDatePicker && Platform.OS !== 'web') && (
              <DateTimePicker
                value={date}
                mode="date"
                display="default"
                onValueChange={onDateChange}
                onDismiss={() => setShowDatePicker(false)}
              />
            )}
            
            {(showTimePicker && Platform.OS !== 'web') && (
              <DateTimePicker
                value={date}
                mode="time"
                display="default"
                onValueChange={onTimeChange}
                onDismiss={() => setShowTimePicker(false)}
              />
            )}

            <Text style={styles.label}>Ubicación (Opcional)</Text>
            <TextInput
              style={styles.input}
              placeholder="Ej: HOMI - Consultorio 305"
              accessibilityLabel="Ubicación"
              value={location}
              onChangeText={setLocation}
            />

            <Text style={styles.label}>Notas (Opcional)</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Agrega algún detalle importante..."
              accessibilityLabel="Notas"
              value={notes}
              onChangeText={setNotes}
              multiline
              numberOfLines={3}
            />

            <View style={styles.footer}>
              <View style={styles.footerCell}>
                <Button title="Cancelar" variant="outline" onPress={onClose} style={styles.footerButton} />
              </View>
              <View style={styles.footerCell}>
                <Button title="Guardar" variant="primary" onPress={handleSave} style={styles.footerButton} />
              </View>
            </View>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: Colors.scrim,
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: Radius.xxl,
    borderTopRightRadius: Radius.xxl,
    height: '85%',
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.xl,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  headerTitle: {
    ...Typography.scale.title,
    color: Colors.navy,
  },
  // Area tactil de 44 pt; el margen negativo deja el glifo donde estaba (alineado con el borde).
  closeBtn: {
    minWidth: 44,
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: -Spacing.xs,
  },
  content: {
    flex: 1,
  },
  label: {
    ...Typography.scale.body,
    fontFamily: Typography.fonts.ubuntuBold,
    color: Colors.navy,
    marginBottom: Spacing.sm,
    marginTop: Spacing.lg,
  },
  typeScroll: {
    marginBottom: Spacing.sm,
  },
  typeChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: Colors.lavender,
    marginRight: Spacing.md,
  },
  typeText: {
    ...Typography.scale.label,
    color: Colors.textSecondary,
    marginLeft: Spacing.sm,
  },
  input: {
    backgroundColor: Colors.offWhite,
    borderRadius: 16,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.lg,
    // Tamano de body sin lineHeight: en un TextInput de una linea el lineHeight descentra el texto en Android.
    fontFamily: Typography.scale.body.fontFamily,
    fontSize: Typography.scale.body.fontSize,
    color: Colors.navy,
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  row: {
    flexDirection: 'row',
    gap: Spacing.lg,
  },
  half: {
    flex: 1,
  },
  dateBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.offWhite,
    borderRadius: 16,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.lg,
  },
  dateText: {
    ...Typography.scale.body,
    color: Colors.navy,
    marginLeft: Spacing.md,
  },

  footer: {
    flexDirection: 'row',
    gap: Spacing.lg,
    marginTop: Spacing.xxxl,
  },
  footerCell: {
    flex: 1,
  },
  footerButton: {
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
  },
});
