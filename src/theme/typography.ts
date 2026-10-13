import { Dimensions } from 'react-native';

const { width } = Dimensions.get('window');
const scale = width / 390;

const normalize = (size: number) => {
  const newSize = size * scale;
  return Math.round(Math.max(size * 0.75, Math.min(newSize, size * 1.2)));
};

const fonts = {
  ubuntu:      'UbuntuSans_400Regular',
  ubuntuBold:  'UbuntuSans_700Bold',
};

// Interlineado de la escala semántica: 1.3 para texto de lectura, 1.2 para
// títulos. RN usa lineHeight absoluto, por eso se redondea a pt enteros.
const BODY_LINE = 1.3;
const TITLE_LINE = 1.2;
const lineHeightFor = (fontSize: number, ratio: number) => Math.round(fontSize * ratio);

export const Typography = {
  fonts,
  sizes: {
    // Sizes are calculated dynamically based on the device width on load
    small:    normalize(12),
    base:     normalize(16),
    subtitle: normalize(20),
    body:     normalize(22),
    title:    normalize(26),
    heading:  normalize(28),
    card:     normalize(22),
    display:  normalize(38),
  },
  lineHeight: {
    tight: 0.95,
    normal: 1.25,
  },
  // Tope de la fuente grande del sistema en textos dentro de contenedores de tamano fijo o acotado
  // (botones de ancho fijo, celdas del calendario, reloj del timer...). Se pasa a maxFontSizeMultiplier.
  maxFontScale: 1.3,
  // Escala semántica: se esparce directo en el estilo ({ ...Typography.scale.body }).
  // Los tamaños son FIJOS (sin normalize); el escalado por ancho de pantalla lo
  // resuelve B3. Auditoría: los fontSize reales son 11-20, 22, 24, 36 y 48.
  // `title` es 24 (valor real de intro y Button) y no 26, para separarlo de heading 28.
  // Solo Ubuntu Sans regular/bold: texto de lectura en regular, label y títulos en bold.
  scale: {
    caption:   { fontSize: 12, lineHeight: lineHeightFor(12, BODY_LINE),  fontFamily: fonts.ubuntu },
    label:     { fontSize: 14, lineHeight: lineHeightFor(14, BODY_LINE),  fontFamily: fonts.ubuntuBold },
    body:      { fontSize: 16, lineHeight: lineHeightFor(16, BODY_LINE),  fontFamily: fonts.ubuntu },
    bodyLarge: { fontSize: 18, lineHeight: lineHeightFor(18, BODY_LINE),  fontFamily: fonts.ubuntu },
    subtitle:  { fontSize: 20, lineHeight: lineHeightFor(20, BODY_LINE),  fontFamily: fonts.ubuntu },
    title:     { fontSize: 24, lineHeight: lineHeightFor(24, TITLE_LINE), fontFamily: fonts.ubuntuBold },
    heading:   { fontSize: 28, lineHeight: lineHeightFor(28, TITLE_LINE), fontFamily: fonts.ubuntuBold },
    display:   { fontSize: 38, lineHeight: lineHeightFor(38, TITLE_LINE), fontFamily: fonts.ubuntuBold },
  },
};
