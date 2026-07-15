import AsyncStorage from '@react-native-async-storage/async-storage';
import { Appointment } from '../data/appointments';

const STORAGE_KEY = 'hemodent_appointments';

export async function getAppointments(): Promise<Appointment[]> {
  try {
    const jsonValue = await AsyncStorage.getItem(STORAGE_KEY);
    return jsonValue != null ? JSON.parse(jsonValue) : [];
  } catch (e) {
    console.error('Error reading appointments from storage', e);
    return [];
  }
}

export async function saveAppointment(appointment: Appointment): Promise<void> {
  try {
    const currentAppointments = await getAppointments();
    const newAppointments = [...currentAppointments, appointment];
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newAppointments));
  } catch (e) {
    console.error('Error saving appointment', e);
  }
}

export async function updateAppointment(id: string, updates: Partial<Appointment>): Promise<void> {
  try {
    const currentAppointments = await getAppointments();
    const newAppointments = currentAppointments.map(app => 
      app.id === id ? { ...app, ...updates } : app
    );
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newAppointments));
  } catch (e) {
    console.error('Error updating appointment', e);
  }
}

export async function deleteAppointment(id: string): Promise<void> {
  try {
    const currentAppointments = await getAppointments();
    const newAppointments = currentAppointments.filter(app => app.id !== id);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newAppointments));
  } catch (e) {
    console.error('Error deleting appointment', e);
  }
}
