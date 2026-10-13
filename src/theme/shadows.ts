import { Colors } from './colors';

// Tres elevaciones, siempre con sombra navy. Incluyen las props de iOS
// (shadow*) y `elevation` de Android, así que se esparcen directo en el estilo:
//   card: { ...Shadows.md }
//
// Auditoría: 8 elevaciones y 8 opacidades distintas. Se agruparon en tres
// niveles según lo que reemplazan:
//   sm: chips y controles pequeños   (offset 2, radius 4, elevation 2)
//   md: tarjetas en reposo, listas   (offset 4-6, radius 8-10, elevation 3-5, opacity 0.06-0.15)
//   lg: botones y tarjetas navy      (offset 6-8, radius 8-12, elevation 6, opacity 0.25-0.3)
// Al migrar un uso, mira la diferencia con el valor original (offset/radius
// quedan a ≤ 2 pt de los usos de Button, TopicCard y las tarjetas navy).
// No cubre las sombras hacia arriba de barras inferiores (offset negativo).
export const Shadows = {
  sm: {
    shadowColor: Colors.navy,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  md: {
    shadowColor: Colors.navy,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 4,
  },
  lg: {
    shadowColor: Colors.navy,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 6,
  },
};
