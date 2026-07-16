let Notifications: any = null;
try {
  Notifications = require('expo-notifications');
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowBanner: true,
      shouldShowList: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
    }),
  });
} catch (e) {
  console.log("expo-notifications no disponible en este entorno");
}

import { getAlarmSettings, AlarmSettings, AlarmTime } from './alarmSettings';

const BRUSHING_NOTIFICATION_PREFIX = 'brushing-reminder-';

const BRUSHING_MESSAGES: { title: string; body: string }[] = [
  {
    title: "¡Es hora de cepillarse! 🦷",
    body: "Recuerda cepillarte para mantener una sonrisa saludable.",
  },
  {
    title: "¡Hora del cepillado! ✨",
    body: "Una sonrisa saludable empieza con un buen cepillado.",
  },
  {
    title: "¡Buenas noches! A cepillarse 🌙",
    body: "No olvides cepillarte los dientes antes de dormir.",
  },
];

/**
 * Cancela todos los recordatorios de cepillado existentes antes de reprogramarlos.
 */
async function cancelExistingBrushingReminders(): Promise<void> {
  if (!Notifications) return;
  try {
    const scheduled = await Notifications.getAllScheduledNotificationsAsync();
    for (const notification of scheduled) {
      if (notification.identifier?.startsWith(BRUSHING_NOTIFICATION_PREFIX)) {
        await Notifications.cancelScheduledNotificationAsync(notification.identifier);
      }
    }
  } catch (error) {
    console.log("Error al cancelar recordatorios existentes:", error);
  }
}

/**
 * Programa los recordatorios de cepillado usando la configuración del usuario.
 * Si no hay configuración guardada, usa los valores predeterminados.
 */
export async function scheduleDailyBrushingReminders(overrideSettings?: AlarmSettings) {
  if (!Notifications) {
    console.log("Notificaciones omitidas: expo-notifications no disponible.");
    return;
  }
  try {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      console.log('Permiso de notificaciones denegado!');
      return;
    }

    const settings = overrideSettings || await getAlarmSettings();

    if (!settings.enabled) {
      // Si las notificaciones están desactivadas, solo cancelamos las existentes
      await cancelExistingBrushingReminders();
      console.log("Recordatorios de cepillado desactivados por el usuario.");
      return;
    }

    // Cancelar los recordatorios existentes antes de reprogramar
    await cancelExistingBrushingReminders();

    // Programar cada alarma configurada
    for (let i = 0; i < settings.times.length; i++) {
      const time = settings.times[i];
      const message = BRUSHING_MESSAGES[i % BRUSHING_MESSAGES.length];

      await Notifications.scheduleNotificationAsync({
        identifier: `${BRUSHING_NOTIFICATION_PREFIX}${i}`,
        content: {
          title: message.title,
          body: message.body,
          sound: true,
        },
        trigger: {
          type: 'daily',
          hour: time.hour,
          minute: time.minute,
          repeats: true,
          channelId: 'default',
        } as any,
      });
    }

    const timesSummary = settings.times.map(t => `${t.hour.toString().padStart(2, '0')}:${t.minute.toString().padStart(2, '0')}`).join(', ');
    console.log(`Recordatorios diarios de cepillado programados: ${timesSummary}`);
  } catch (error) {
    console.log("Error al programar notificaciones:", error);
  }
}
export async function scheduleAppointmentReminder(appointment: any): Promise<string | null> {
  if (!Notifications) {
    console.log("Notificaciones omitidas: expo-notifications no disponible.");
    return null;
  }

  try {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      console.log('Permiso de notificaciones denegado para la cita!');
      return null;
    }

    const [year, month, day] = appointment.date.split('-');
    const [hour, minute] = appointment.time.split(':');

    const appointmentDate = new Date(
      parseInt(year, 10),
      parseInt(month, 10) - 1,
      parseInt(day, 10),
      parseInt(hour, 10),
      parseInt(minute, 10)
    );

    const timeFormatted = appointmentDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });

    const date1Day = new Date(appointmentDate.getTime() - 24 * 60 * 60 * 1000);
    const date2Hours = new Date(appointmentDate.getTime() - 2 * 60 * 60 * 1000);

    let scheduledAny = false;

    if (date1Day.getTime() > Date.now()) {
      await Notifications.scheduleNotificationAsync({
        identifier: `${appointment.id}-1day`,
        content: {
          title: "¡Mañana es tu Cita Médica!",
          body: `Recuerda tu cita: ${appointment.title} mañana a las ${timeFormatted}.`,
          sound: true,
          data: { appointmentId: appointment.id },
        },
        trigger: {
          type: 'date',
          date: date1Day.getTime(),
          channelId: 'default'
        } as any,
      });
      scheduledAny = true;
    }

    if (date2Hours.getTime() > Date.now()) {
      await Notifications.scheduleNotificationAsync({
        identifier: `${appointment.id}-2hours`,
        content: {
          title: "¡Tu Cita Médica es pronto!",
          body: `Tu cita: ${appointment.title} es en 2 horas (a las ${timeFormatted}).`,
          sound: true,
          data: { appointmentId: appointment.id },
        },
        trigger: {
          type: 'date',
          date: date2Hours.getTime(),
          channelId: 'default'
        } as any,
      });
      scheduledAny = true;
    }

    if (!scheduledAny) {
      console.log("Las fechas de recordatorio ya pasaron, no se programó ninguna alarma.");
      return null;
    }

    console.log(`Recordatorios programados para la cita: ${appointment.title}`);
    return appointment.id;
  } catch (error) {
    console.log("Error al programar recordatorio de cita:", error);
    return null;
  }
}

export async function cancelAppointmentReminder(notificationId: string): Promise<void> {
  if (!Notifications) return;
  try {
    await Notifications.cancelScheduledNotificationAsync(`${notificationId}-1day`);
    await Notifications.cancelScheduledNotificationAsync(`${notificationId}-2hours`);
    console.log(`Recordatorios cancelados para la cita: ${notificationId}`);
  } catch (error) {
    console.log("Error al cancelar el recordatorio:", error);
  }
}
