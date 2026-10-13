// Design tokens extracted from Figma (MockupsCartilla)
export const Colors = {
  // === Primitive palette (Figma variables) ===
  navy:     '#000E55', // blue1 — fondos de tarjetas, botones primarios
  lavender: '#798CEB', // blue2 — modales de info, decoraciones
  blue:     '#3E8CF2', // blue3 — títulos de grupo, acentos

  // === Aliases para compatibilidad con código existente ===
  blue1: '#000E55',
  blue2: '#798CEB',
  blue3: '#3E8CF2',

  // === Semántica ===
  white:   '#FFFFFF',
  offWhite: '#F5F7FA',

  background: {
    primary:   '#FFFFFF',
    secondary: '#F5F7FA',
    dark:      '#000E55',
  },
  text: {
    primary:   '#000E55',
    secondary: '#798CEB',
    white:     '#FFFFFF',
    groupTitle: '#3E8CF2',
  },
  button: {
    primary:   '#3E8CF2',
    secondary: '#798CEB',
    dark:      '#000E55',
  },
  card: {
    background: '#000E55',
    borderRadius: 27,
  },
  modal: {
    background: '#798CEB',
    border: '#FFFFFF',
  },
  timer: {
    quadrant1: '#4ECDC4',
    quadrant2: '#45B7D1',
    quadrant3: '#96CEB4',
    quadrant4: '#FFEAA7',
    success: '#6BCB77',
    warning: '#FC5939',
  },
  calendar: {
    today: '#3E8CF2',
    selected: '#000E55',
    dot: '#798CEB',
    pastAppointment: '#D0D5E8',
    cardBorder: {
      odontologia: '#3E8CF2',
      hematologia: '#FC5939',
      ortodoncia: '#4ECDC4',
      cirugia: '#798CEB',
      otro: '#96CEB4',
    },
  },

  // === Capa semántica (WCAG 2.x AA, texto normal >= 4.5:1) ===
  // Convive con los tokens de arriba: los usos se migran en B3 y lo muerto se
  // borra en B10. Los ratios sobre surface (#FFFFFF) / surfaceMuted (#F5F7FA):
  surface:      '#FFFFFF', // fondo de pantallas y tarjetas
  surfaceMuted: '#F5F7FA', // fondo de secciones y miniaturas
  border:       '#D0D5E8', // divisores y bordes de tarjeta (decorativo: 1.46:1, no sirve de borde único de un campo)
  scrim: 'rgba(0,14,85,0.55)', // fondo oscuro tras modales; unifica 4 variantes (0.5/0.55/0.6 navy y 0.6 negro)

  // Texto secundario: variante oscura de lavender (mismo tono 230).
  // 5.42:1 sobre surface, 5.05:1 sobre surfaceMuted. lavender queda para decoración.
  textSecondary: '#5464B6',

  // Azul de acción: variante oscura de blue. onPrimary sobre primary 5.11:1;
  // primary como texto 5.11:1 sobre surface, 4.76:1 sobre surfaceMuted.
  primary:   '#0F69DF',
  onPrimary: '#FFFFFF', // también es el texto sobre danger y success
  // Fondo suave de primary: píldora de la pestaña activa. primary encima da 4.50:1.
  primaryTint: '#EAF1FD',

  // Peligro: unifica #FC5939 / #E74C3C / #FF4444. Blanco sobre danger 5.08:1;
  // como texto 5.08:1 sobre surface, 4.73:1 sobre surfaceMuted.
  danger:  '#D62603',
  // Éxito: variante oscura de timer.success. Blanco sobre success 5.07:1;
  // como texto 5.07:1 sobre surface, 4.72:1 sobre surfaceMuted.
  success: '#2C7E36',
};
