import AsyncStorage from '@react-native-async-storage/async-storage';

const ALARM_SETTINGS_KEY = 'hemodent_alarm_settings';

export interface AlarmTime {
  hour: number;   // 0-23
  minute: number;  // 0-59
  label: string;   // e.g. "Mañana", "Tarde", "Noche"
}

export interface AlarmSettings {
  frequency: 2 | 3;         // Number of daily reminders
  times: AlarmTime[];        // The configured alarm times
  enabled: boolean;          // Whether reminders are active
}

export const DEFAULT_ALARM_SETTINGS: AlarmSettings = {
  frequency: 2,
  enabled: true,
  times: [
    { hour: 8, minute: 0, label: 'Mañana' },
    { hour: 20, minute: 0, label: 'Noche' },
  ],
};

export const DEFAULT_3X_TIMES: AlarmTime[] = [
  { hour: 7, minute: 0, label: 'Mañana' },
  { hour: 13, minute: 0, label: 'Tarde' },
  { hour: 20, minute: 0, label: 'Noche' },
];

export async function getAlarmSettings(): Promise<AlarmSettings> {
  try {
    const jsonValue = await AsyncStorage.getItem(ALARM_SETTINGS_KEY);
    if (jsonValue != null) {
      return JSON.parse(jsonValue);
    }
    return DEFAULT_ALARM_SETTINGS;
  } catch (e) {
    console.error('Error reading alarm settings from storage', e);
    return DEFAULT_ALARM_SETTINGS;
  }
}

export async function saveAlarmSettings(settings: AlarmSettings): Promise<void> {
  try {
    await AsyncStorage.setItem(ALARM_SETTINGS_KEY, JSON.stringify(settings));
  } catch (e) {
    console.error('Error saving alarm settings', e);
  }
}
