import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Modal, TextInput, TouchableOpacity, ScrollView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Colors } from '../theme/colors';
import { Typography } from '../theme/typography';
import { Appointment, AppointmentType, APPOINTMENT_TYPES } from '../data/appointments';
import { generateId } from '../utils/uuid';
import { Button } from './Button';

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
      alert("Por favor ingresa un título para la cita");
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

  const onDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      const currentDate = new Date(date);
      currentDate.setFullYear(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate());
      setDate(currentDate);
    }
  };

  const onTimeChange = (event: any, selectedTime?: Date) => {
    setShowTimePicker(false);
    if (selectedTime) {
      const currentDate = new Date(date);
      currentDate.setHours(selectedTime.getHours(), selectedTime.getMinutes());
      setDate(currentDate);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={true} onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>{existingAppointment ? 'Editar Cita' : 'Nueva Cita'}</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Ionicons name="close" size={28} color={Colors.navy} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            <Text style={styles.label}>Tipo de Cita</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.typeScroll}>
              {Object.entries(APPOINTMENT_TYPES).map(([key, config]) => {
                const isSelected = type === key;
                return (
                  <TouchableOpacity
                    key={key}
                    style={[styles.typeChip, isSelected && { backgroundColor: config.color, borderColor: config.color }]}
                    onPress={() => setType(key as AppointmentType)}
                  >
                    <Ionicons name={config.icon} size={20} color={isSelected ? Colors.white : config.color} />
                    <Text style={[styles.typeText, isSelected && { color: Colors.white }]}>{config.label}</Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            <Text style={styles.label}>Título</Text>
            <TextInput
              style={styles.input}
              placeholder="Ej: Control odontológico"
              value={title}
              onChangeText={setTitle}
              maxLength={40}
            />

            <View style={styles.row}>
              <View style={styles.half}>
                <Text style={styles.label}>Fecha</Text>
                <TouchableOpacity style={styles.dateBtn} onPress={() => setShowDatePicker(true)}>
                  <Ionicons name="calendar-outline" size={20} color={Colors.navy} />
                  <Text style={styles.dateText}>{date.toLocaleDateString('es-ES')}</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.half}>
                <Text style={styles.label}>Hora</Text>
                <TouchableOpacity style={styles.dateBtn} onPress={() => setShowTimePicker(true)}>
                  <Ionicons name="time-outline" size={20} color={Colors.navy} />
                  <Text style={styles.dateText}>{date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}</Text>
                </TouchableOpacity>
              </View>
            </View>

            {(showDatePicker && Platform.OS !== 'web') && (
              <DateTimePicker
                value={date}
                mode="date"
                display="default"
                onChange={onDateChange}
              />
            )}
            
            {(showTimePicker && Platform.OS !== 'web') && (
              <DateTimePicker
                value={date}
                mode="time"
                display="default"
                onChange={onTimeChange}
              />
            )}

            <Text style={styles.label}>Ubicación (Opcional)</Text>
            <TextInput
              style={styles.input}
              placeholder="Ej: HOMI - Consultorio 305"
              value={location}
              onChangeText={setLocation}
            />

            <Text style={styles.label}>Notas (Opcional)</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Agrega algún detalle importante..."
              value={notes}
              onChangeText={setNotes}
              multiline
              numberOfLines={3}
            />

            <Text style={styles.label}>Recordatorio</Text>
            <View style={styles.remindersContainer}>
              {[1, 3, 7].map(days => (
                <TouchableOpacity
                  key={days}
                  style={[styles.reminderChip, reminderDays === days && styles.reminderChipActive]}
                  onPress={() => setReminderDays(days)}
                >
                  <Text style={[styles.reminderText, reminderDays === days && styles.reminderTextActive]}>
                    {days} {days === 1 ? 'día' : 'días'} antes
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.footer}>
              <Button title="Cancelar" variant="outline" onPress={onClose} style={{ flex: 1, paddingVertical: 12 }} />
              <View style={{ width: 16 }} />
              <Button title="Guardar" variant="primary" onPress={handleSave} style={{ flex: 1, paddingVertical: 12 }} />
            </View>
            <View style={{ height: 40 }} />
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,14,85,0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    height: '85%',
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerTitle: {
    fontFamily: Typography.fonts.ubuntuBold,
    fontSize: 24,
    color: Colors.navy,
  },
  closeBtn: {
    padding: 4,
  },
  content: {
    flex: 1,
  },
  label: {
    fontFamily: Typography.fonts.ubuntuBold,
    fontSize: 16,
    color: Colors.navy,
    marginBottom: 8,
    marginTop: 16,
  },
  typeScroll: {
    marginBottom: 8,
  },
  typeChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: Colors.lavender,
    marginRight: 12,
  },
  typeText: {
    fontFamily: Typography.fonts.ubuntuBold,
    fontSize: 14,
    color: Colors.lavender,
    marginLeft: 8,
  },
  input: {
    backgroundColor: Colors.offWhite,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontFamily: Typography.fonts.ubuntu,
    fontSize: 16,
    color: Colors.navy,
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  row: {
    flexDirection: 'row',
    gap: 16,
  },
  half: {
    flex: 1,
  },
  dateBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.offWhite,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  dateText: {
    fontFamily: Typography.fonts.ubuntu,
    fontSize: 16,
    color: Colors.navy,
    marginLeft: 12,
  },
  remindersContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  reminderChip: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.lavender,
    alignItems: 'center',
  },
  reminderChipActive: {
    backgroundColor: Colors.lavender,
  },
  reminderText: {
    fontFamily: Typography.fonts.ubuntuBold,
    fontSize: 14,
    color: Colors.lavender,
  },
  reminderTextActive: {
    color: Colors.white,
  },
  footer: {
    flexDirection: 'row',
    marginTop: 32,
    marginBottom: 20,
  }
});
