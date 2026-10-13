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

// Cada color se usa como texto (telefono) sobre offWhite y como fondo del boton de llamada con
// icono blanco, asi que todos dan >= 4.7:1 en ambos usos (los colores anteriores daban 1.80 a 3.82).
export const CONTACT_TYPES: Record<EmergencyContactType, { label: string; icon: string; color: string }> = {
  hemofilia: { label: 'Hemofilia', icon: 'water-outline', color: Colors.danger },
  emergencia: { label: 'Línea de Emergencias', icon: 'warning-outline', color: Colors.danger },
  hematologia: { label: 'Hematología', icon: 'medkit-outline', color: Colors.primary },
  odontologia: { label: 'Odontología', icon: 'bandage-outline', color: '#227973' },
  cruzRoja: { label: 'Cruz Roja', icon: 'medical-outline', color: Colors.danger },
  bomberos: { label: 'Bomberos', icon: 'flame-outline', color: '#A65813' },
  otro: { label: 'Otro Contacto', icon: 'call-outline', color: Colors.textSecondary },
};

// Los contactos personalizados guardan su color al crearse, y los de antes del cambio traen los
// colores claros. Se resuelve por tipo para que tambien esos usen la variante accesible.
export const contactColor = (contact: EmergencyContact): string =>
  CONTACT_TYPES[contact.type]?.color ?? contact.color;

export const DEFAULT_EMERGENCY_CONTACTS: EmergencyContact[] = [
  {
    id: 'homi-tatiana',
    name: 'Línea Hemofilia HOMI',
    subtitle: 'Jefe Tatiana — Hosp. Misericordia',
    phone: '+573153910231',
    type: 'hemofilia',
    icon: 'water-outline',
    color: Colors.danger,
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
