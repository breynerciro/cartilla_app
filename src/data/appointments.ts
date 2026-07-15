export type AppointmentType =
  | 'odontologia'
  | 'hematologia'
  | 'ortodoncia'
  | 'cirugia'
  | 'otro';

export interface Appointment {
  id: string;
  title: string;
  date: string;
  time: string;
  location?: string;
  notes?: string;
  reminderDays: number;
  type: AppointmentType;
  completed: boolean;
}

export const APPOINTMENT_TYPES: Record<AppointmentType, {
  label: string;
  icon: any; // using any for Ionicons name type compatibility across the app for now
  color: string;
}> = {
  odontologia:  { label: 'Odontología',          icon: 'medkit-outline',    color: '#3E8CF2' },
  hematologia:  { label: 'Hematología',           icon: 'water-outline',     color: '#FC5939' },
  ortodoncia:   { label: 'Ortodoncia',            icon: 'construct-outline', color: '#4ECDC4' },
  cirugia:      { label: 'Cirugía Maxilofacial',  icon: 'cut-outline',       color: '#798CEB' },
  otro:         { label: 'Otro',                  icon: 'ellipsis-horizontal', color: '#96CEB4' },
};
