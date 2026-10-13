import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../src/theme/colors';
import { Radius } from '../../src/theme/radius';
import { Shadows } from '../../src/theme/shadows';
import { Spacing, screenPadding } from '../../src/theme/spacing';
import { Typography } from '../../src/theme/typography';
import { Screen } from '../../src/components/Screen';
import { Header } from '../../src/components/Header';
import { FooterLogos } from '../../src/components/FooterLogos';
import { MiniCalendar } from '../../src/components/MiniCalendar';
import { AppointmentCard } from '../../src/components/AppointmentCard';
import { AppointmentFormModal } from '../../src/components/AppointmentFormModal';
import { Button } from '../../src/components/Button';
import { Appointment } from '../../src/data/appointments';
import { getAppointments, saveAppointment, updateAppointment, deleteAppointment } from '../../src/services/storage';
import { scheduleAppointmentReminder, cancelAppointmentReminder } from '../../src/services/notifications';
import { BackButton, BACK_BUTTON_SIZE } from '../../src/components/BackButton';

export default function CalendarScreen() {
  const router = useRouter();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [, setCurrentMonth] = useState(new Date());
  
  const [isModalVisible, setModalVisible] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState<Appointment | null>(null);
  // loading: primera carga al montar (no muestra el spinner de pull-to-refresh).
  // refreshing: solo cuando el usuario jala para actualizar.
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filterType, setFilterType] = useState<'all' | 'pending' | 'completed'>('all');

  const loadAppointments = useCallback(async () => {
    const data = await getAppointments();
    setAppointments(data);
  }, []);

  useEffect(() => {
    loadAppointments().finally(() => setLoading(false));
  }, [loadAppointments]);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await loadAppointments();
    } finally {
      setRefreshing(false);
    }
  }, [loadAppointments]);

  const toISODate = (date: Date) => {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  };

  const markedDates = appointments.map(app => app.date);
  
  const selectedISODate = toISODate(selectedDate);
  const selectedAppointments = appointments
    .filter(app => app.date === selectedISODate)
    .filter(app => {
      if (filterType === 'pending') return !app.completed;
      if (filterType === 'completed') return app.completed;
      return true; // 'all'
    })
    .sort((a, b) => a.time.localeCompare(b.time));

  const handleSaveAppointment = async (appointment: Appointment) => {
    if (editingAppointment) {
      await updateAppointment(appointment.id, appointment);
    } else {
      await saveAppointment(appointment);
    }
    // Lógica para reprogramar notificaciones si estuviera disponible
    await scheduleAppointmentReminder(appointment);
    
    loadAppointments();
    setEditingAppointment(null);
  };

  const handleDeleteAppointment = async (id: string) => {
    await deleteAppointment(id);
    await cancelAppointmentReminder(id); // usamos el id de la cita como id de notificacion por simplicidad
    loadAppointments();
  };

  const handleToggleComplete = async (appointment: Appointment) => {
    await updateAppointment(appointment.id, { completed: !appointment.completed });
    loadAppointments();
  };

  const openNewAppointment = () => {
    setEditingAppointment(null);
    setModalVisible(true);
  };

  const openEditAppointment = (appointment: Appointment) => {
    setEditingAppointment(appointment);
    setModalVisible(true);
  };

  return (
    <Screen>
      <Header 
        title="CALENDARIO DE CITAS" 
        decoration="left" 
      />

      {/* `main` termina donde empieza el pie (y el pie ya esta dentro del area segura de
          Screen): lo flotante nunca pisa los logos ni el inset inferior. */}
      <View style={styles.main}>
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
        >
          <MiniCalendar 
            selectedDate={selectedDate}
            onSelectDate={setSelectedDate}
            markedDates={markedDates}
            onMonthChange={setCurrentMonth}
          />

          {/* Filtro Rápido */}
          <View style={styles.filterContainer}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScroll}>
              <TouchableOpacity 
                style={[styles.filterChip, filterType === 'all' && styles.filterChipActive]}
                onPress={() => setFilterType('all')}
                accessibilityRole="button"
                accessibilityState={{ selected: filterType === 'all' }}
              >
                <Text style={[styles.filterText, filterType === 'all' && styles.filterTextActive]}>Todas</Text>
              </TouchableOpacity>
            
              <TouchableOpacity 
                style={[styles.filterChip, filterType === 'pending' && styles.filterChipActive]}
                onPress={() => setFilterType('pending')}
                accessibilityRole="button"
                accessibilityState={{ selected: filterType === 'pending' }}
              >
                <Text style={[styles.filterText, filterType === 'pending' && styles.filterTextActive]}>Pendientes</Text>
              </TouchableOpacity>
            
              <TouchableOpacity 
                style={[styles.filterChip, filterType === 'completed' && styles.filterChipActive]}
                onPress={() => setFilterType('completed')}
                accessibilityRole="button"
                accessibilityState={{ selected: filterType === 'completed' }}
              >
                <Text style={[styles.filterText, filterType === 'completed' && styles.filterTextActive]}>Completadas</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>

          <View style={styles.listHeader}>
            <Text style={styles.listTitle}>
              {selectedDate.getDate() === new Date().getDate() && selectedDate.getMonth() === new Date().getMonth() && selectedDate.getFullYear() === new Date().getFullYear() 
                ? 'Hoy' 
                : selectedDate.toLocaleDateString('es-ES', { day: 'numeric', month: 'long' })}
            </Text>
            <Text style={styles.countText}>
              {selectedAppointments.length} {selectedAppointments.length === 1 ? 'cita' : 'citas'}
            </Text>
          </View>

          <View style={styles.listContainer}>
            {selectedAppointments.length > 0 ? (
              selectedAppointments.map(app => (
                <AppointmentCard 
                  key={app.id}
                  appointment={app}
                  hideDate={true}
                  onPress={() => openEditAppointment(app)}
                  onToggleComplete={() => handleToggleComplete(app)}
                  onDelete={() => handleDeleteAppointment(app.id)}
                />
              ))
            ) : !loading && (
              <View style={styles.emptyState}>
                <Ionicons name="calendar-clear-outline" size={48} color={Colors.lavender} style={{ opacity: 0.5 }} />
                <Text style={styles.emptyText}>No tienes citas programadas para este día.</Text>
                <Button 
                  title="Agendar Cita Ahora" 
                  variant="outline" 
                  onPress={openNewAppointment} 
                  style={{ marginTop: Spacing.xxl, paddingHorizontal: Spacing.xxl }} 
                />
              </View>
            )}
          </View>
        </ScrollView>

        {/* Fila flotante: Back y FAB centrados entre si, dentro de `main`. */}
        <View style={styles.floatingRow}>
          <BackButton onPress={() => router.back()} />
          <TouchableOpacity
            style={styles.fab}
            onPress={openNewAppointment}
            activeOpacity={0.8}
            accessibilityRole="button"
            accessibilityLabel="Agregar cita"
          >
            <Ionicons name="add" size={32} color={Colors.onPrimary} />
            <Text style={styles.fabText}>Nueva Cita</Text>
          </TouchableOpacity>
        </View>
      </View>

      <FooterLogos />

      <AppointmentFormModal 
        visible={isModalVisible}
        onClose={() => setModalVisible(false)}
        onSave={handleSaveAppointment}
        existingAppointment={editingAppointment}
        initialDate={selectedDate}
      />
    </Screen>
  );
}

// Distancia de la fila flotante al borde inferior de `main` (justo sobre el pie).
const FLOATING_BOTTOM = Spacing.sm;

const styles = StyleSheet.create({
  main: {
    flex: 1,
  },
  scroll: {
    flex: 1,
  },
  // El margen lateral va en el contenido para que el ScrollView llegue al borde
  // y no recorte las sombras de las tarjetas. El paddingBottom reserva el alto real
  // de la fila flotante (Back 82) para que el ultimo item nunca quede tapado.
  content: {
    paddingHorizontal: screenPadding,
    paddingTop: Spacing.lg,
    paddingBottom: BACK_BUTTON_SIZE + FLOATING_BOTTOM + Spacing.lg,
  },
  filterContainer: {
    marginVertical: Spacing.lg,
  },
  filterScroll: {
    gap: Spacing.md,
  },
  filterChip: {
    minHeight: 44,
    justifyContent: 'center',
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.lg,
    borderRadius: Radius.lgPlus,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.lavender,
  },
  filterChipActive: {
    backgroundColor: Colors.textSecondary,
    borderColor: Colors.textSecondary,
  },
  filterText: {
    ...Typography.scale.label,
    color: Colors.textSecondary,
  },
  filterTextActive: {
    color: Colors.white,
  },
  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: Spacing.lg,
  },
  listTitle: {
    ...Typography.scale.title,
    color: Colors.navy,
  },
  countText: {
    ...Typography.scale.body,
    color: Colors.textSecondary,
  },
  listContainer: {
    minHeight: 200,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.huge,
    backgroundColor: Colors.white,
    borderRadius: Radius.lgPlus,
    borderWidth: 1,
    borderColor: 'rgba(121, 140, 235, 0.2)',
    borderStyle: 'dashed',
  },
  emptyText: {
    ...Typography.scale.body,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: Spacing.md,
    paddingHorizontal: Spacing.xxxl,
  },
  floatingRow: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: FLOATING_BOTTOM,
    pointerEvents: 'box-none', // los huecos entre botones dejan pasar el toque al scroll
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: screenPadding,
    zIndex: 10,
  },
  fab: {
    backgroundColor: Colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xl,
    borderRadius: Radius.xxl,
    ...Shadows.lg,
  },
  fabText: {
    ...Typography.scale.body,
    fontFamily: Typography.fonts.ubuntuBold,
    color: Colors.onPrimary,
    marginLeft: Spacing.sm,
  },
});
