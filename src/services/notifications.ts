let Notifications: any = null;
try {
  Notifications = require('expo-notifications');
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
    }),
  });
} catch (e) {
  console.log("expo-notifications no disponible en este entorno");
}

export async function scheduleDailyBrushingReminders() {
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

    // Programar para la mañana (8:00 AM)
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "¡Es hora de cepillarse! 🦷",
        body: "Recuerda cepillarte por 2 minutos para mantener una sonrisa saludable.",
        sound: true,
      },
      trigger: {
        hour: 8,
        minute: 0,
        repeats: true,
      },
    });

    // Programar para la noche (8:00 PM)
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "¡Buenas noches! A cepillarse 🌙",
        body: "No olvides cepillarte los dientes antes de dormir.",
        sound: true,
      },
      trigger: {
        hour: 20,
        minute: 0,
        repeats: true,
      },
    });
    console.log("Recordatorios diarios de cepillado programados.");
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
    
    // Restar los días de recordatorio
    appointmentDate.setDate(appointmentDate.getDate() - appointment.reminderDays);

    if (appointmentDate.getTime() < Date.now()) {
      console.log("La fecha del recordatorio ya pasó, no se programará.");
      return null;
    }

    const id = await Notifications.scheduleNotificationAsync({
      identifier: appointment.id,
      content: {
        title: "¡Recordatorio de Cita Médica! 📅",
        body: `Recuerda tu cita: ${appointment.title} programada para el ${appointment.date} a las ${appointment.time}.`,
        sound: true,
        data: { appointmentId: appointment.id },
      },
      trigger: { date: appointmentDate },
    });

    console.log(`Recordatorio programado para la cita: ${appointment.title} en ${appointmentDate.toLocaleString()}`);
    return id;
  } catch (error) {
    console.log("Error al programar recordatorio de cita:", error);
    return null;
  }
}

export async function cancelAppointmentReminder(notificationId: string): Promise<void> {
  if (!Notifications) return;
  try {
    await Notifications.cancelScheduledNotificationAsync(notificationId);
    console.log(`Recordatorio cancelado: ${notificationId}`);
  } catch (error) {
    console.log("Error al cancelar el recordatorio:", error);
  }
}

