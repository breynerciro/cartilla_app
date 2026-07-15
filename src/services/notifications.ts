export async function scheduleDailyBrushingReminders() {
  // En Expo Go (Android, SDK 53+), expo-notifications causa un error fatal 
  // al intentar importar o requerir la librería porque se eliminó el soporte nativo.
  // Por lo tanto, simulamos la función para que la app no colapse y 
  // el usuario pueda seguir probando el resto de las funcionalidades.
  console.log("Notificaciones omitidas: Estás en Expo Go (Android). Las notificaciones requieren una Development Build.");
  return;
}

export async function scheduleAppointmentReminder(appointment: any): Promise<string | null> {
  console.log(`Recordatorio simulado para la cita: ${appointment.title}`);
  return "dummy-notification-id";
}

export async function cancelAppointmentReminder(notificationId: string): Promise<void> {
  console.log(`Cancelando recordatorio: ${notificationId}`);
}

