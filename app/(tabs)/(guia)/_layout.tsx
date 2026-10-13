import { Stack } from 'expo-router';
import { Colors } from '../../../src/theme/colors';

// Pila de la pestaña Guía: la guía por edades, el glosario y los temas viven aquí
// para que la barra de pestañas siga visible mientras se navega el contenido.
// El grupo (guia) no cambia las URLs (/guia, /glossary, /age/...).
// Si se abre un tema por deep link, la guía queda debajo para que Volver regrese a ella.
export const unstable_settings = {
  initialRouteName: 'guia',
};

export default function GuiaLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: Colors.surface },
      }}
    />
  );
}
