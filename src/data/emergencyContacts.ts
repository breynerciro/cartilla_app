import AsyncStorage from '@react-native-async-storage/async-storage';
import { Colors } from '../theme/colors';

export type EmergencyContactType =
  | 'hemofilia'
  | 'emergencia'
  | 'hematologia'
  | 'odontologia'
  | 'bomberos'
  | 'cruzRoja'
  | 'otro';

export interface EmergencyContact {
  id: string;
  name: string;
  subtitle?: string;
  phone: string;
  type: EmergencyContactType;
  icon: string;
  color: string;
  isCustom?: boolean;
}

export const CONTACT_TYPES: Record<EmergencyContactType, { label: string; icon: string; color: string }> = {
  hemofilia: { label: 'Hemofilia', icon: 'water-outline', color: '#FC5939' },
  emergencia: { label: 'Línea de Emergencias', icon: 'warning-outline', color: '#E74C3C' },
  hematologia: { label: 'Hematología', icon: 'medkit-outline', color: '#3E8CF2' },
  odontologia: { label: 'Odontología', icon: 'bandage-outline', color: '#4ECDC4' },
  cruzRoja: { label: 'Cruz Roja', icon: 'medical-outline', color: '#E74C3C' },
  bomberos: { label: 'Bomberos', icon: 'flame-outline', color: '#E67E22' },
  otro: { label: 'Otro Contacto', icon: 'call-outline', color: '#798CEB' },
};

export const DEFAULT_EMERGENCY_CONTACTS: EmergencyContact[] = [
  {
    id: 'homi-tatiana',
    name: 'Línea Hemofilia HOMI',
    subtitle: 'Jefe Tatiana — Hosp. Misericordia',
    phone: '+573153910231',
    type: 'hemofilia',
    icon: 'water-outline',
    color: '#FC5939',
    isCustom: false,
  },
];

const CUSTOM_CONTACTS_KEY = 'custom_emergency_contacts';

export async function getCustomContacts(): Promise<EmergencyContact[]> {
  try {
    const jsonValue = await AsyncStorage.getItem(CUSTOM_CONTACTS_KEY);
    return jsonValue != null ? JSON.parse(jsonValue) : [];
  } catch (e) {
    console.error('Error reading custom emergency contacts', e);
    return [];
  }
}

export async function saveCustomContact(
  contactData: Omit<EmergencyContact, 'id' | 'isCustom'>
): Promise<EmergencyContact[]> {
  try {
    const existing = await getCustomContacts();
    const typeMeta = CONTACT_TYPES[contactData.type] || CONTACT_TYPES.otro;
    const newContact: EmergencyContact = {
      ...contactData,
      id: Date.now().toString(),
      icon: contactData.icon || typeMeta.icon,
      color: contactData.color || typeMeta.color,
      isCustom: true,
    };
    const updated = [...existing, newContact];
    await AsyncStorage.setItem(CUSTOM_CONTACTS_KEY, JSON.stringify(updated));
    return updated;
  } catch (e) {
    console.error('Error saving custom emergency contact', e);
    throw e;
  }
}

export async function deleteCustomContact(id: string): Promise<EmergencyContact[]> {
  try {
    const existing = await getCustomContacts();
    const updated = existing.filter(c => c.id !== id);
    await AsyncStorage.setItem(CUSTOM_CONTACTS_KEY, JSON.stringify(updated));
    return updated;
  } catch (e) {
    console.error('Error deleting custom emergency contact', e);
    throw e;
  }
}
