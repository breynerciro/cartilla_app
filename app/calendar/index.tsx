import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../src/theme/colors';
import { Typography } from '../../src/theme/typography';
import { Header } from '../../src/components/Header';
import { FooterLogos } from '../../src/components/FooterLogos';
import { MiniCalendar } from '../../src/components/MiniCalendar';
import { AppointmentCard } from '../../src/components/AppointmentCard';
import { AppointmentFormModal } from '../../src/components/AppointmentFormModal';
import { Button } from '../../src/components/Button';
import { Appointment } from '../../src/data/appointments';
import { getAppointments, saveAppointment, updateAppointment, deleteAppointment } from '../../src/services/storage';
import { scheduleAppointmentReminder, cancelAppointmentReminder } from '../../src/services/notifications';

export default function CalendarScreen() {
  const router = useRouter();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date());
  
  const [isModalVisible, setModalVisible] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState<Appointment | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [filterType, setFilterType] = useState<'all' | 'pending' | 'completed'>('all');

  const loadAppointments = useCallback(async () => {
    setRefreshing(true);
    const data = await getAppointments();
    setAppointments(data);
    setRefreshing(false);
  }, []);

  useEffect(() => {
    loadAppointments();
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
    <SafeAreaView style={styles.container}>
      <Header 
        title="CALENDARIO DE CITAS" 
        decoration="left" 
        showBack={true}
        onBack={() => router.back()}
      />

      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={loadAppointments} />}
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
            >
              <Text style={[styles.filterText, filterType === 'all' && styles.filterTextActive]}>Todas</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.filterChip, filterType === 'pending' && styles.filterChipActive]}
              onPress={() => setFilterType('pending')}
            >
              <Text style={[styles.filterText, filterType === 'pending' && styles.filterTextActive]}>Pendientes</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.filterChip, filterType === 'completed' && styles.filterChipActive]}
              onPress={() => setFilterType('completed')}
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
          ) : (
            <View style={styles.emptyState}>
              <Ionicons name="calendar-clear-outline" size={48} color={Colors.lavender} style={{ opacity: 0.5 }} />
              <Text style={styles.emptyText}>No tienes citas programadas para este día.</Text>
              <Button 
                title="Agendar Cita Ahora" 
                variant="outline" 
                onPress={openNewAppointment} 
                style={{ marginTop: 24, paddingHorizontal: 24 }} 
              />
            </View>
          )}
        </View>

        <View style={{ height: 80 }} />
      </ScrollView>

      <TouchableOpacity style={styles.fab} onPress={openNewAppointment} activeOpacity={0.8}>
        <Ionicons name="add" size={32} color={Colors.white} />
        <Text style={styles.fabText}>Nueva Cita</Text>
      </TouchableOpacity>

      <View style={styles.footerContainer}>
        <FooterLogos />
      </View>

      <AppointmentFormModal 
        visible={isModalVisible}
        onClose={() => setModalVisible(false)}
        onSave={handleSaveAppointment}
        existingAppointment={editingAppointment}
        initialDate={selectedDate}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.offWhite,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  filterContainer: {
    marginVertical: 16,
  },
  filterScroll: {
    gap: 12,
  },
  filterChip: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: 'rgba(121, 140, 235, 0.3)',
  },
  filterChipActive: {
    backgroundColor: Colors.lavender,
    borderColor: Colors.lavender,
  },
  filterText: {
    fontFamily: Typography.fonts.ubuntuBold,
    fontSize: 14,
    color: Colors.lavender,
  },
  filterTextActive: {
    color: Colors.white,
  },
  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 16,
  },
  listTitle: {
    fontFamily: Typography.fonts.ubuntuBold,
    fontSize: 22,
    color: Colors.navy,
  },
  countText: {
    fontFamily: Typography.fonts.ubuntu,
    fontSize: 16,
    color: Colors.lavender,
  },
  listContainer: {
    minHeight: 200,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
    backgroundColor: Colors.white,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(121, 140, 235, 0.2)',
    borderStyle: 'dashed',
  },
  emptyText: {
    fontFamily: Typography.fonts.ubuntu,
    fontSize: 16,
    color: Colors.lavender,
    textAlign: 'center',
    marginTop: 12,
    paddingHorizontal: 32,
  },
  fab: {
    position: 'absolute',
    bottom: 80,
    right: 20,
    backgroundColor: Colors.blue,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 30,
    shadowColor: Colors.navy,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
    zIndex: 10,
  },
  fabText: {
    fontFamily: Typography.fonts.ubuntuBold,
    fontSize: 16,
    color: Colors.white,
    marginLeft: 8,
  },
  footerContainer: {
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
  }
});
