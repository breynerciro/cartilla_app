export interface TimerPreset {
  songUri: any;
  songTitle: string;
  quadrantLabels: string[];
  instructions: string[];
  pressureReminder: string;
  bleedingFollowUp: string[];
}

export interface Song {
  id: string;
  title: string;
  uri: any;
}

export const AVAILABLE_SONGS: Song[] = [
  {
    id: 'song1',
    title: 'Niños Alegres',
    uri: require('../../assets/audio/song1.mp3'),
  },
  {
    id: 'song2',
    title: 'Colores Brillan',
    uri: require('../../assets/audio/song2.mp3'),
  },
  {
    id: 'song3',
    title: 'Melodía Infantil',
    uri: require('../../assets/audio/song3.mp3'),
  },
  {
    id: 'song4',
    title: 'Piano para Bebés',
    uri: require('../../assets/audio/song4.mp3'),
  },
  {
    id: 'song5',
    title: 'Canción de Cuna',
    uri: require('../../assets/audio/song5.mp3'),
  },
  {
    id: 'song6',
    title: 'Lullaby Dulce',
    uri: require('../../assets/audio/song6.mp3'),
  },
];

export const timerPreset: TimerPreset = {
  songUri: AVAILABLE_SONGS[0].uri,
  songTitle: 'Niños Alegres',
  quadrantLabels: [
    'Superior Derecho',
    'Superior Izquierdo',
    'Inferior Derecho',
    'Inferior Izquierdo',
  ],
  instructions: [
    'Coloca las cerdas a 45 grados hacia la encía y cepilla con movimientos suaves de barrido.',
    'Continúa con la misma técnica en el lado opuesto, sin olvidar la cara interna.',
    'Limpia las superficies de masticación con movimientos cortos de vaivén.',
    'Finaliza cepillando suavemente la lengua, de atrás hacia adelante.',
  ],
  pressureReminder: 'Recuerda: usa cepillo de cerdas suaves y no presiones con fuerza.',
  bleedingFollowUp: [
    'Haz presión sostenida con una gasa limpia durante 15 minutos.',
    'Aplica ácido tranexámico de forma tópica si lo tienes disponible.',
    'Si el sangrado no cede, comunícate con tu centro de tratamiento o hematólogo.',
  ],
};
