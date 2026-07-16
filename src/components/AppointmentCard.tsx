import React, { useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../theme/colors';
import { Typography } from '../theme/typography';
import { Appointment, APPOINTMENT_TYPES } from '../data/appointments';

interface AppointmentCardProps {
  appointment: Appointment;
  onPress: () => void;
  onToggleComplete: () => void;
  onDelete: () => void;
  hideDate?: boolean;
}

export const AppointmentCard = ({ appointment, onPress, onToggleComplete, onDelete, hideDate = false }: AppointmentCardProps) => {
  const typeConfig = APPOINTMENT_TYPES[appointment.type] || APPOINTMENT_TYPES.otro;
  const opacityAnim = useRef(new Animated.Value(appointment.completed ? 0.6 : 1)).current;

  const toggleComplete = () => {
    Animated.timing(opacityAnim, {
      toValue: appointment.completed ? 1 : 0.6,
      duration: 300,
      useNativeDriver: true,
    }).start();
    onToggleComplete();
  };

  const confirmDelete = () => {
    Alert.alert(
      "Eliminar cita",
      "¿Estás seguro de que deseas eliminar esta cita?",
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Eliminar", style: "destructive", onPress: onDelete }
      ]
    );
  };

  const dateObj = new Date(appointment.date + 'T' + appointment.time + ':00');
  const dateStr = dateObj.toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' });
  const timeStr = dateObj.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });

  return (
    <Animated.View style={[styles.container, { opacity: opacityAnim, borderLeftColor: typeConfig.color }]}>
      <TouchableOpacity style={styles.content} onPress={onPress} activeOpacity={0.7}>
        <View style={[styles.iconContainer, { backgroundColor: `${typeConfig.color}20` }]}>
          <Ionicons name={typeConfig.icon} size={28} color={typeConfig.color} />
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.title} numberOfLines={1}>{appointment.title}</Text>
          <Text style={styles.subtitle}>{hideDate ? timeStr : `${dateStr} • ${timeStr}`}</Text>
          {appointment.location && (
            <View style={styles.locationRow}>
              <Ionicons name="location-outline" size={14} color={Colors.lavender} />
              <Text style={styles.locationText} numberOfLines={1}>{appointment.location}</Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
      
      <View style={styles.actions}>
        <TouchableOpacity onPress={toggleComplete} style={styles.actionBtn}>
          <Ionicons 
            name={appointment.completed ? "checkmark-circle" : "ellipse-outline"} 
            size={28} 
            color={appointment.completed ? Colors.timer.success : Colors.lavender} 
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={confirmDelete} style={styles.actionBtn}>
          <Ionicons name="trash-outline" size={24} color={Colors.timer.warning} />
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    borderRadius: 20,
    marginBottom: 12,
    borderLeftWidth: 6,
    shadowColor: Colors.navy,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    overflow: 'hidden',
  },
  content: {
    flex: 1,
    flexDirection: 'row',
    padding: 16,
    alignItems: 'center',
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontFamily: Typography.fonts.ubuntuBold,
    fontSize: 18,
    color: Colors.navy,
    marginBottom: 4,
  },
  subtitle: {
    fontFamily: Typography.fonts.ubuntu,
    fontSize: 14,
    color: Colors.lavender,
    marginBottom: 4,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationText: {
    fontFamily: Typography.fonts.ubuntu,
    fontSize: 13,
    color: Colors.lavender,
    marginLeft: 4,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 16,
    gap: 8,
  },
  actionBtn: {
    padding: 8,
  }
});
