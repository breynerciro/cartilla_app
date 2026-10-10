// Radios de borde. Los nombres NO coinciden con Spacing a partir de lg
// (Radius.xl = 24, Spacing.xl = 20): no los intercambies.
//
// Auditoría: 21 radios distintos; los más usados son 16 (20 usos), 20 (18),
// 24 (8), 32 (4) y 30 (4). El 20 no encaja en la escala base, pero es el
// segundo más usado, por eso existe `lgPlus`. Los valores 25-30 se absorben
// en xl (24) o xxl (32).
export const Radius = {
  xs:     4,
  sm:     8,
  md:     12,
  lg:     16,
  lgPlus: 20,
  xl:     24,
  xxl:    32,
  full:   999,
};
