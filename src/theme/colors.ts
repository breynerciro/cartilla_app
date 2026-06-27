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
};
