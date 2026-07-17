
export type AgeGroup = '0-3' | '3-5' | '6-13' | '14-18';

// ─── Slide types ──────────────────────────────────────────────────────────────

export interface SlideButton {
  text: string;
  image: any;
  targetId: string;
  imagePosition: 'left' | 'right';
}

export interface SpeechBubble {
  text: string;
  targetId: string;
}

export interface ContentSlide {
  text: string;
  image: any;
  toothPosition: 'left' | 'right';
  subtitle?: string;
  photo?: any;
  buttons?: SlideButton[];
  speechBubble?: SpeechBubble;
}

export interface InfoSlide {
  type: 'modal';
  photo: any;
  alertText: string;
  showExclamation: boolean;
}

export interface DetailSlide {
  type: 'detail';
  subtitle: string;
  bodyText: string;
  showInfoIcon: boolean;
}

export interface DiagramSlide {
  type: 'diagram';
  ageGroup?: AgeGroup;
}

export interface TimerSlide {
  type: 'timer';
  ageGroup: AgeGroup;
}

export type Slide = ContentSlide | InfoSlide | DetailSlide | DiagramSlide | TimerSlide;

// ─── Subtopic data (leaf node - has slides) ───────────────────────────────────

export interface SubtopicData {
  id: string;
  title: string;
  menuImage: any;
  slides?: Slide[];
  subtopics?: SubtopicData[];  // supports one extra level: Dientes → Caries/Gingivitis
}

// ─── Topic data (mid node - may have subtopics OR slides directly) ────────────

export interface TopicData {
  id: string;
  title: string;
  menuImage: any;
  subtopics?: SubtopicData[];  // if present → shows sub-menu
  slides?: Slide[];            // if present → goes directly to slides
}

// ─── Age group data ───────────────────────────────────────────────────────────

export interface AgeGroupData {
  title: string;
  introSlides: ContentSlide[];  // 0a3_1..5 info slides before topic menu
  topics: TopicData[];
}
// ─── Image refs ───────────────────────────────────────────────────────────────
// All images are real downloaded assets from assets/images/png's/
// Semantic names describe WHAT the image shows.

const IMG = {
  // ── Diente mágico: 4 poses distintas del personaje principal ─────────────
  toothWand: require("../../assets/images/png's/Tooth1.png"),   // varita mágica
  toothNeutral: require("../../assets/images/png's/Tooth2.png"),   // pose neutra
  toothBrush: require("../../assets/images/png's/Tooth3.png"),   // con cepillo
  toothTrauma: require("../../assets/images/png's/Tooth4.png"),   // con explorador
  toothGray: require("../../assets/images/png's/tooth_gray.png"),

  // ── Iconos de menú ilustrados ─────────────────────────────────────────────
  enciaIcon: require("../../assets/images/png's/Encia.png"),    // diente en encía → Erupción
  bloodCells: require("../../assets/images/png's/Sangre.png"),   // glóbulos → Trauma
  dienteCarie: require("../../assets/images/png's/icon_caries.png"),
  braquet: require("../../assets/images/png's/reten_icon.png"),

  // ── Fotos clínicas reales (modales de alerta) ─────────────────────────────
  enciaFoto: require("../../assets/images/png's/boca1.jpeg"),
  sangradoFoto: require("../../assets/images/png's/sangrado.jpeg"),
  traumaFoto1: require("../../assets/images/png's/trauma_1.jpeg"),
  traumaFoto2: require("../../assets/images/png's/trauma_2.jpeg"),
  traumaFoto3: require("../../assets/images/png's/trauma_3.jpeg"),
  caries1: require("../../assets/images/png's/caries_1.jpeg"),
  caries2: require("../../assets/images/png's/caries_2.jpeg"),
  caries3: require("../../assets/images/png's/caries_3.png"),
  gingivitis1: require("../../assets/images/png's/gingivitis_1.jpeg"),
  gingivitis2: require("../../assets/images/png's/gingivitis_2.jpeg"),
  cordalesFoto: require("../../assets/images/png's/cordales.png"),
  retenedor: require("../../assets/images/png's/retenedor.jpeg"),


  // ── Ilustraciones de personajes ───────────────────────────────────────────
  bebeEnfermo: require("../../assets/images/png's/niño.png"),
  cepilladoBebe: require("../../assets/images/png's/cepillado_bebe.jpeg"),
  medicamento1: require("../../assets/images/png's/medicamento.jpeg"),
  medicamento2: require("../../assets/images/png's/medicamento1.jpeg"),
  mordedor: require("../../assets/images/png's/mordedor.jpeg"),
  tecnica1: require("../../assets/images/png's/tecnica1.jpeg"),
  tecnica2: require("../../assets/images/png's/tecnica2.jpeg"),
  tecnica3: require("../../assets/images/png's/tecnica3.jpeg"),
  tecnica4: require("../../assets/images/png's/tecnica4.jpeg"),
  tecnica5: require("../../assets/images/png's/tecnica5.jpeg"),
  tecnica6: require("../../assets/images/png's/tecnica6.jpeg"),
  tecnica61: require("../../assets/images/png's/tecnica61.jpeg"),


  // ── Ilustraciones de objetos ──────────────────────────────────────────────
  cepillo: require("../../assets/images/png's/cepillo.jpeg"),
  crema1: require("../../assets/images/png's/crema1.jpeg"),
  crema2: require("../../assets/images/png's/crema2.jpeg"),
  crema3: require("../../assets/images/png's/crema3.jpeg"),
  posicionCepillado: require("../../assets/images/png's/posicion_cepillado.jpeg"),
  posicionCepillado1: require("../../assets/images/png's/posicion_cepillado1.jpeg"),
  posicionCepillado2: require("../../assets/images/png's/posicion_cepillado2.jpeg"),

  // ── UI ────────────────────────────────────────────────────────────────────
  fondo: require("../../assets/images/png's/fondo.png"),
};


// ─── SHARED SLIDE FACTORIES ───────────────────────────────────────────────────

const traumaCommonSlides = (groupNote?: string): Slide[] => [
  {
    text: 'Si tras una caída o golpe observas sangrado en la boca, puede ser ocasionado por un corte en la lengua o mucosas, incluso por una fractura dental o del hueso.',
    image: IMG.toothTrauma,
    toothPosition: 'left',
  } as ContentSlide,
  {
    text: 'Y en algunos casos, sin presentar sangrado aparente, pueden existir fracturas o hematomas que deben ser atendidos con urgencia.',
    image: IMG.toothTrauma,
    toothPosition: 'right',
  } as ContentSlide,
  {
    type: 'detail',
    bodyText: 'Como primera medida, tras un trauma es indispensable acudir al servicio de urgencias para que se valore si hay lesiones, su severidad, se eleve el factor en caso de necesitarlo y se le dé un adecuado tratamiento.',
    showInfoIcon: true,
  } as DetailSlide,
  {
    type: 'modal',
    photo: IMG.traumaFoto1,
    alertText: 'Si hay sangrado, retire los coágulos para evitar broncoaspiración, haga presión con una gasa durante 15 minutos sobre la zona, y en caso de tener a la mano ácido tranexámico, aplicarlo de forma tópica.',
    showExclamation: true,
  } as InfoSlide,
  {
    text: 'Es necesario que el odontólogo revise detalladamente al paciente y le realice las radiografías necesarias para determinar el tratamiento.',
    image: IMG.toothTrauma,
    toothPosition: 'left',
  } as ContentSlide,
  {
    text: 'En la dentición temporal los tratamientos van encaminados a detener el sangrado, preservar la integridad del diente permanente en camino y evitar infecciones.',
    image: IMG.toothTrauma,
    toothPosition: 'right',
  } as ContentSlide,
  {
    type: 'detail',
    bodyText: 'Estos tratamientos van desde suturas en tejidos blandos, pasando por pulpectomía (quitar la pulpa dañada) y extracción del diente. \nEn algunos casos de fracturas óseas se requiere cirugía maxilofacial.',
    showInfoIcon: true,
  } as DetailSlide,
];

const cariesSlides0_5: Slide[] = [
  {
    text: 'Al retirar la placa bacteriana se previene la caries y los problemas que puede traer, como dolor agudo, infecciones o extracciones prematuras que a su vez pueden provocar sangrado abundante o una situación de urgencia.',
    image: IMG.toothBrush,
    toothPosition: 'left',
  } as ContentSlide,
  {
    text: 'Contrario de la creencia popular, los dientes de leche son muy importantes para la salud de los niños.',
    image: IMG.toothBrush,
    toothPosition: 'right',
    photo: IMG.caries1,
  } as ContentSlide,
  {
    text: 'Los dientes de leche pueden presentar manchas o cavidades, lo cual indica caries dental.',
    image: IMG.toothBrush,
    toothPosition: 'left',
    photo: IMG.caries2,
  } as ContentSlide,
];

const cariesSlides6_18: Slide[] = [
  {
    text: 'Al retirar la placa bacteriana se previene la caries y los problemas que puede traer, como dolor agudo, infecciones o extracciones prematuras que ponen en una situación de urgencia y un sangrado que podría agravarse.',
    image: IMG.toothBrush,
    photo: IMG.caries1,
    toothPosition: 'left',
  } as ContentSlide,
  {
    text: 'Cuando aparece en dientes permanentes también puede llevar a tratamiento de conductos.',
    image: IMG.toothBrush,
    photo: IMG.caries3,
    toothPosition: 'right',
  } as ContentSlide,
];

const gingivitisSlides: Slide[] = [
  {
    text: 'Al retirar la placa bacteriana se previene la inflamación de las encías o también conocida como gingivitis.',
    image: IMG.toothBrush,
    toothPosition: 'left',
  } as ContentSlide,
  {
    text: 'Esta inflamación puede generar sangrado leve que no puede detenerse (depende del nivel de factor en sangre).',
    image: IMG.toothBrush,
    subtitle: "GINGIVITIS EN HEMOFILIA",
    photo: IMG.gingivitis1,
    toothPosition: 'right',
  } as ContentSlide,
  {
    text: 'Además, puede generar molestias a la hora de alimentarse.',
    photo: IMG.gingivitis2,
    image: IMG.toothBrush,
    toothPosition: 'left',
  } as ContentSlide,
];

// ─── CONTENT ─────────────────────────────────────────────────────────────────

export const ageGroupData: Record<AgeGroup, AgeGroupData> = {
  '0-3': {
    title: 'DE 0 A 3 AÑOS',
    introSlides: [
      {
        text: 'En esta etapa ocurren transiciones muy importantes en el desarrollo general y aspecto dental de los niños, como:',
        image: IMG.toothWand,
        toothPosition: 'left',
      },
      {
        text: 'La erupción de los dientes temporales, más conocidos como "dientes de leche"',
        image: IMG.toothWand,
        toothPosition: 'right',
      },
      {
        text: 'La forma en que se realiza la higiene oral, cuando los niños pasan de no tener dientes a tener su primer diente erupcionado',
        image: IMG.toothWand,
        toothPosition: 'left',
      },
      {
        text: 'Aprenden a caminar y a interactuar con el mundo; esto les hace susceptibles a caídas que pueden causar lesiones en su lengua, mucosas, encías o dientes.',
        image: IMG.toothWand,
        toothPosition: 'right',
      },
    ],
    topics: [
      {
        id: 'erupcion',
        title: '¿Qué cuidados tener durante la erupción dental?',
        menuImage: IMG.toothNeutral,
        subtopics: [
          {
            id: 'erupcionOption1',
            title: '¿A qué edad sale cada diente?',
            menuImage: IMG.toothNeutral,
            slides: [
              { type: 'diagram', ageGroup: '0-3' } as DiagramSlide
            ]
          },
          {
            id: 'erupcionOption2',
            title: '¿Es normal que se inflame?',
            menuImage: IMG.enciaIcon,
            slides: [
              {
                type: 'detail',
                subtitle: 'LO QUE DEBES SABER SOBRE LA ERUPCIÓN DENTAL:',
                bodyText: 'Poco antes de erupcionar el diente; debido al flujo de sangre, las encías pueden hincharse e incluso tomar un color azulado. Sin embargo, esto no tiene nada que ver con la hemofilia y suele resolverse por sí solo.',
                showInfoIcon: true,
              } as DetailSlide,
              {
                type: 'modal',
                photo: IMG.enciaFoto,
                alertText: 'Usar los conocidos "mordedores" puede causar sangrado al momento de ser mordido. No está indicado para los bebés con hemofilia.',
                showExclamation: true,
              } as InfoSlide,
            ]
          },
          {
            id: 'erupcionOption3',
            title: '¿Le debo dar medicamentos al bebé?',
            menuImage: IMG.bebeEnfermo,
            slides: [
              {
                type: 'detail',
                subtitle: 'LO QUE DEBES SABER SOBRE LA ERUPCIÓN DENTAL:',
                bodyText: 'Este proceso causa normalmente: irritabilidad, cambios en los ciclos de sueño, aumento de la salivación y sensación de "picazón" en las encías. También puede presentarse fiebre ligera, pero esto sucede por un cambio en el tipo de bacterias en la boca del bebé. Solo en caso de fiebre, sangrado que no para o dolor intenso que no le permita comer, es necesario administrarle medicamentos.',
                showInfoIcon: true,
              } as DetailSlide,
              {
                type: 'modal',
                photo: IMG.medicamento1,
                alertText: 'Recuerda: NO automediques a tu bebé, los medicamentos deben ser formulados por tu médico u odontólogo.',
                showExclamation: true,
              } as InfoSlide,
            ]
          },
          {
            id: 'erupcionOption4',
            title: '¿Es normal que sangre?',
            menuImage: IMG.bloodCells,
            slides: [
              {
                type: 'detail',
                subtitle: 'LO QUE DEBES SABER SOBRE LA ERUPCIÓN DENTAL:',
                bodyText: 'La erupción dental rara vez provoca hemorragias, pero si las encías presentan sangrado leve que no para, es necesario acudir a consulta odontológica.',
                showInfoIcon: true,
              } as DetailSlide,
              {
                type: 'modal',
                photo: IMG.mordedor,
                alertText: 'No dejes objetos duros o juguetes a su alcance sin supervisión, ya que, en busca de aliviar las molestias en sus encías, los bebés introducen objetos en su boca para morder, los cuales pueden causar sangrado de importancia.',
                showExclamation: true,
              } as InfoSlide,
            ]
          }
        ],
      },
      {
        id: 'higiene',
        title: '¿Cómo se debe realizar la higiene oral?',
        menuImage: IMG.toothBrush,
        slides: [
          {
            text: 'En esta etapa, la forma de realizar la higiene se divide en dos: \n\n* Limpieza de las encías, cuando no hay ningún diente presente. \n\n* Limpieza de los dientes tan pronto erupcionan.',
            image: IMG.toothWand,
            toothPosition: 'left',
          } as ContentSlide,
          {
            text: 'Se diferencian en cuanto a la técnica, pero la finalidad es la misma: remover la placa bacteriana presente, que es la responsable de distintas enfermedades de la cavidad oral.',
            image: IMG.toothWand,
            toothPosition: 'left',
          } as ContentSlide,
        ],
        subtopics: [
          {
            id: 'encias',
            title: 'Higiene Oral en Encías',
            menuImage: IMG.enciaIcon,
            slides: [
              {
                text: 'Se cree que si el bebé no tiene dientes, no es necesario limpiarle las encías. ¡Esto es falso! Es importante mantenerlo libre de placa para que esté saludable, además de acostumbrarle al ejercicio de limpiar su boca.',
                image: IMG.toothWand,
                toothPosition: 'left',
              } as ContentSlide,
              {
                type: 'detail',
                subtitle: 'CUIDADO DE LAS ENCÍAS:',
                bodyText: 'La limpieza se puede realizar con un cepillo dental de dedo o con una gasa húmeda, pasándolos por todas las superficies de las encías con el fin de retirar placa excepto en el paladar ya que puede causarle ganas de vomitar.',
                showInfoIcon: true,
              } as DetailSlide,
              {
                type: 'modal',
                photo: IMG.cepilladoBebe,
                alertText: 'Recuerda que puedes iniciar este tipo de higiene a los 5 meses de edad. Hazlo con mucha suavidad, para no causar lesiones y sangrado que pueda agravarse.',
                showExclamation: true,
              } as InfoSlide,
            ],
          },
          {
            id: 'dientes',
            title: 'Higiene Oral en Dientes',
            menuImage: IMG.toothNeutral,
            slides: [
              {
                text: 'Se realiza desde que podamos ver que el primer diente está saliendo. \n\nLa higiene es muy importante por varias razones, entre ellas:',
                image: IMG.toothWand,
                toothPosition: 'right',
                buttons: [
                  {
                    text: 'Prevenir las Caries',
                    image: IMG.dienteCarie,
                    targetId: 'caries',
                    imagePosition: 'left'
                  }
                ],
                speechBubble: {
                  text: '¡HAZ CLICK AQUÍ PARA VER TÉCNICA DE CEPILLADO!',
                  targetId: 'cepillado'
                }
              } as ContentSlide,
            ],
            subtopics: [
              {
                id: 'caries',
                title: 'Prevenir las Caries',
                menuImage: IMG.traumaFoto2,
                slides: cariesSlides0_5,
              },
              {
                id: 'cepillado',
                title: 'Cepillado',
                menuImage: IMG.toothBrush,
                slides: [
                  {
                    text: 'Para realizar la higiene ya puedes usar un cepillo de dientes pequeño y suave.',
                    image: IMG.toothBrush,
                    photo: IMG.cepillo
                  } as ContentSlide,
                  {
                    text: 'Crema de dientes con flúor (cantidad: menor que el tamaño de un grano de arroz) y seda dental.',
                    image: IMG.toothBrush,
                    photo: IMG.crema1
                  } as ContentSlide,
                  {
                    text: 'Posición adecuada para el cepillado.',
                    image: IMG.toothBrush,
                    photo: IMG.posicionCepillado
                  } as ContentSlide,
                  {
                    text: 'Paso 1: Coloca las cerdas a 45 grados hacia la encía.',
                    image: IMG.toothBrush,
                    photo: IMG.tecnica1,
                  } as ContentSlide,
                  {
                    text: 'Paso 2: realiza pequeños movimientos vibratorios circulares, suavemente.',
                    image: IMG.toothBrush,
                    photo: IMG.tecnica2,
                  } as ContentSlide,
                  {
                    text: 'Paso 3: limpia hacia abajo/ arriba (barrido), cubriendo de la encía al borde del diente.',
                    image: IMG.toothBrush,
                    photo: IMG.tecnica3,
                  } as ContentSlide,
                  {
                    text: 'Paso 4: repite el movimiento de vibraciones y barrido en la cara interna de todos los dientes.',
                    image: IMG.toothBrush,
                    photo: IMG.tecnica4,
                  } as ContentSlide,
                  {
                    text: 'Paso 5: limpia las superficies de masticación con movimientos de vaivén.',
                    image: IMG.toothBrush,
                    photo: IMG.tecnica5,
                  } as ContentSlide,
                  {
                    text: 'Resultados felices: ¡Cepillado completo! Una sonrisa brillante y saludable',
                    image: IMG.toothBrush,
                    photo: IMG.tecnica6,
                  } as ContentSlide,
                ]
              },
            ],
          },
        ],
      },
      {
        id: 'trauma',
        title: '¿Qué hacer en caso de trauma?',
        menuImage: IMG.toothTrauma,
        slides: [
          ...traumaCommonSlides('0-3'),
          {
            type: 'modal',
            photo: IMG.traumaFoto2,
            alertText: 'Si el diente se cae, no lo vuelva a introducir en el espacio que lo alojaba. Esto puede dañar al diente permanente que viene en camino.',
            showExclamation: true,
          } as InfoSlide,
        ],
      },
    ],
  },

  '3-5': {
    title: 'DE 3 A 5 AÑOS',
    introSlides: [
      {
        text: 'En esta etapa se espera que se hayan erupcionado todos los dientes temporales y que no se empiecen a aflojar hasta los 6 años. Por esto es muy importante tener en cuenta:',
        image: IMG.toothWand,
        toothPosition: 'left',
      },
      {
        text: 'El cuidado y la higiene de los conocidos "dientes de leche" es igual de importante que el de los dientes permanentes.',
        image: IMG.toothNeutral,
        toothPosition: 'right',
      },
      {
        text: 'El niño inicia su etapa escolar, donde tiene más interacción con otros niños y el entorno. Es importante saber qué se debe hacer en caso de una lesión en la cavidad oral.',
        image: IMG.toothWand,
        toothPosition: 'left',
      },
    ],
    topics: [
      {
        id: 'higiene',
        title: '¿Cómo se debe realizar la higiene oral?',
        menuImage: IMG.toothBrush,
        slides: [
          {
            text: 'Este se realiza siempre en compañía de un adulto. \nEs importante por varias razones entre ellas:',
            image: IMG.toothWand,
            toothPosition: 'right',
            buttons: [
              {
                text: 'Prevenir las Caries',
                image: IMG.dienteCarie,
                targetId: 'caries',
                imagePosition: 'left'
              },
              {
                text: 'Prevenir la Gingivitis',
                image: IMG.enciaIcon,
                targetId: 'gingivitis',
                imagePosition: 'right'
              }
            ],
            speechBubble: {
              text: '¡HAZ CLICK AQUÍ PARA VER TÉCNICA DE CEPILLADO!',
              targetId: 'cepillado'
            }
          } as ContentSlide,
        ],
        subtopics: [
          {
            id: 'caries',
            title: 'Caries',
            menuImage: IMG.dienteCarie,
            slides: cariesSlides0_5,
          },
          {
            id: 'gingivitis',
            title: 'Gingivitis',
            menuImage: IMG.enciaIcon,
            slides: gingivitisSlides,
          },
          {
            id: 'cepillado',
            title: 'Cepillado',
            menuImage: IMG.toothBrush,
            slides: [
              {
                text: 'Para realizar la higiene ya puedes usar un cepillo de dientes pequeño y suave.',
                image: IMG.toothBrush,
                photo: IMG.cepillo
              } as ContentSlide,
              {
                text: 'Crema de dientes con flúor (cantidad: del tamaño de un grano de arroz) y seda dental.',
                image: IMG.toothBrush,
                photo: IMG.crema2
              } as ContentSlide,
              {
                text: 'Posición adecuada para el cepillado.',
                image: IMG.toothBrush,
                photo: IMG.posicionCepillado1
              } as ContentSlide,
              {
                text: 'Paso 1: Coloca las cerdas a 45 grados hacia la encía.',
                image: IMG.toothBrush,
                photo: IMG.tecnica1,
              } as ContentSlide,
              {
                text: 'Paso 2: realiza pequeños movimientos vibratorios circulares, suavemente.',
                image: IMG.toothBrush,
                photo: IMG.tecnica2,
              } as ContentSlide,
              {
                text: 'Paso 3: limpia hacia abajo/ arriba (barrido), cubriendo de la encía al borde del diente.',
                image: IMG.toothBrush,
                photo: IMG.tecnica3,
              } as ContentSlide,
              {
                text: 'Paso 4: repite el movimiento de vibraciones y barrido en la cara interna de todos los dientes.',
                image: IMG.toothBrush,
                photo: IMG.tecnica4,
              } as ContentSlide,
              {
                text: 'Paso 5: limpia las superficies de masticación con movimientos de vaivén.',
                image: IMG.toothBrush,
                photo: IMG.tecnica5,
              } as ContentSlide,
              {
                text: 'Resultados felices: ¡Cepillado completo! Una sonrisa brillante y saludable',
                image: IMG.toothBrush,
                photo: IMG.tecnica6,
              } as ContentSlide,
            ]
          },
        ],
      },
      {
        id: 'trauma',
        title: '¿Qué hacer en caso de trauma?',
        menuImage: IMG.toothTrauma,
        slides: [
          ...traumaCommonSlides('3-5'),
          {
            type: 'modal',
            photo: IMG.traumaFoto2,
            alertText: 'Si el diente se cae, no lo vuelva a introducir en el espacio que lo alojaba. Esto puede dañar al diente permanente que viene en camino.',
            showExclamation: true,
          } as InfoSlide,
        ]
      },
    ],
  },

  '6-13': {
    title: 'DE 6 A 13 AÑOS',
    introSlides: [
      {
        text: 'En esta etapa se espera que ocurra todo el recambio dental, es decir que se caigan los dientes temporales y erupcionen los permanentes (excepto las cordales). Por eso es necesario tener en cuenta:',
        image: IMG.toothWand,
        toothPosition: 'left',
      },
      {
        text: 'El cuidado y la higiene de los conocidos "dientes de leche" es igual de importante que el de los dientes permanentes.',
        image: IMG.toothNeutral,
        toothPosition: 'right',
      },
      {
        text: 'El niño tiene una mayor interacción con otros niños y el entorno, jugando o practicando deportes. Es importante saber qué se debe hacer en caso de una lesión en la cavidad oral.',
        image: IMG.toothWand,
        toothPosition: 'left',
      },
    ],
    topics: [
      {
        id: 'erupcion',
        title: '¿Qué cuidados tener durante el recambio dental?',
        menuImage: IMG.toothNeutral,
        subtopics: [
          {
            id: 'torcidos',
            title: '¿Qué hacer si salen torcidos?',
            menuImage: IMG.braquet,
            slides: [
              {
                text: 'Debido a muchos factores al momento de la erupción de dientes permanentes, pueden salir en mala posición. \n\nPara corregir esta condición, es necesario el uso de aparatos de ortopedia y ortodoncia, los cuales no están contraindicados en niños con hemofilia.',
                image: IMG.toothWand,
                toothPosition: 'left',
              } as ContentSlide,
              {
                text: 'Sin embargo, es importante informarle al ortodoncista sobre el trastorno hemofílico, para que tenga todas las precauciones y evitar lesiones.',
                image: IMG.toothWand,
                photo: IMG.retenedor,
                toothPosition: 'right',
              } as ContentSlide,
            ]
          },
          {
            id: 'medicamentos',
            title: '¿Debo darle medicamentos?',
            menuImage: IMG.bebeEnfermo,
            slides: [
              {
                type: 'detail',
                bodyText: 'Este proceso causa normalmente: sensación de "picazón" en las encías y dolor. \n\nSolo en caso de fiebre, sangrado que no para o dolor intenso que no le permita comer, es necesario administrarle medicamentos.',
                showInfoIcon: true,
              } as DetailSlide,
              {
                type: 'modal',
                photo: IMG.medicamento2,
                alertText: 'Recuerda: NO automediques a tu niño, los medicamentos deben ser formulados por tu médico u odontólogo.',
                showExclamation: true,
              } as InfoSlide,
            ]
          },
          {
            id: 'sangre',
            title: '¿Es normal que sangre?',
            menuImage: IMG.bloodCells,
            slides: [
              {
                type: 'detail',
                bodyText: 'La erupción del diente permanente como tal rara vez provoca hemorragias, pero el diente temporal al ser retirado sí genera sangrado leve.',
                showInfoIcon: true,
              } as DetailSlide,
              {
                type: 'modal',
                photo: IMG.sangradoFoto,
                alertText: 'Es recomendado que al aflojarse un diente sea retirado por el odontólogo después de haber administrado el factor, para evitar complicaciones si se hace en casa.',
                showExclamation: true,
              } as InfoSlide,
            ]
          },
          {
            id: 'salenDientes',
            title: '¿A qué edad sale cada diente?',
            menuImage: IMG.toothNeutral,
            slides: [
              { type: 'diagram', ageGroup: '6-13' } as DiagramSlide
            ]
          },
        ]
      },
      {
        id: 'higiene',
        title: '¿Cómo se debe realizar la higiene oral?',
        menuImage: IMG.toothBrush,
        slides: [
          {
            text: 'Este se realiza siempre en compañía de un adulto hasta que el niño desarrolle la habilidad para hacerlo solo.',
            image: IMG.toothWand,
            toothPosition: 'left',
          } as ContentSlide,
          {
            text: 'Es importante por varias razones entre ellas:',
            image: IMG.toothWand,
            toothPosition: 'right',
            buttons: [
              {
                text: 'Prevenir las Caries',
                image: IMG.dienteCarie,
                targetId: 'caries',
                imagePosition: 'left'
              },
              {
                text: 'Prevenir la Gingivitis',
                image: IMG.enciaIcon,
                targetId: 'gingivitis',
                imagePosition: 'right'
              }
            ],
            speechBubble: {
              text: '¡HAZ CLICK AQUÍ PARA VER TÉCNICA DE CEPILLADO!',
              targetId: 'cepillado'
            }
          } as ContentSlide,
        ],
        subtopics: [
          {
            id: 'caries',
            title: 'Caries',
            menuImage: IMG.caries1,
            slides: cariesSlides6_18,
          },
          {
            id: 'gingivitis',
            title: 'Gingivitis',
            menuImage: IMG.gingivitis1,
            slides: gingivitisSlides,
          },
          {
            id: 'cepillado',
            title: 'Cepillado',
            menuImage: IMG.toothBrush,
            slides: [
              {
                text: 'Para realizar la higiene ya puedes usar un cepillo de dientes pequeño y suave.',
                image: IMG.toothBrush,
                photo: IMG.cepillo
              } as ContentSlide,
              {
                text: 'Crema de dientes con flúor (cantidad: menor que el tamaño de una arveja) y seda dental.',
                image: IMG.toothBrush,
                photo: IMG.crema3
              } as ContentSlide,
              {
                text: 'Compañía de un adulto.',
                image: IMG.toothBrush,
                photo: IMG.posicionCepillado2
              } as ContentSlide,
              {
                text: 'Paso 1: Coloca las cerdas a 45 grados hacia la encía.',
                image: IMG.toothBrush,
                photo: IMG.tecnica1,
              } as ContentSlide,
              {
                text: 'Paso 2: realiza pequeños movimientos vibratorios circulares, suavemente.',
                image: IMG.toothBrush,
                photo: IMG.tecnica2,
              } as ContentSlide,
              {
                text: 'Paso 3: limpia hacia abajo/ arriba (barrido), cubriendo de la encía al borde del diente.',
                image: IMG.toothBrush,
                photo: IMG.tecnica3,
              } as ContentSlide,
              {
                text: 'Paso 4: repite el movimiento de vibraciones y barrido en la cara interna de todos los dientes.',
                image: IMG.toothBrush,
                photo: IMG.tecnica4,
              } as ContentSlide,
              {
                text: 'Paso 5: limpia las superficies de masticación con movimientos de vaivén.',
                image: IMG.toothBrush,
                photo: IMG.tecnica5,
              } as ContentSlide,
              {
                text: 'Resultados felices: ¡Cepillado completo! Una sonrisa brillante y saludable',
                image: IMG.toothBrush,
                photo: IMG.tecnica61,
              } as ContentSlide,
            ]
          },
        ],
      },
      {
        id: 'trauma',
        title: '¿Qué hacer en caso de trauma?',
        menuImage: IMG.toothTrauma,
        slides: [
          ...traumaCommonSlides('6-13'),
          {
            type: 'modal',
            photo: IMG.traumaFoto3,
            alertText: 'Si el diente se desaloja de su cavidad. Recójalo tomándolo por la corona, enjuáguelo con agua y guárdelo en una gasa húmeda. Esto ayuda a conservarlo, para que el odontólogo lo reposicione.',
            showExclamation: true,
          } as InfoSlide,
        ],
      },
    ],
  },

  '14-18': {
    title: 'DE 14 A 18 AÑOS',
    introSlides: [
      {
        text: 'En esta etapa normalmente ya se tiene la dentición permanente completa (excepto las cordales). Por ello es importante:',
        image: IMG.toothWand,
        toothPosition: 'left',
      },
      {
        text: '-El cuidado y la higiene de los dientes permanentes para evitar diferentes enfermedades. \n\n-Monitoreo constante a la posición y erupción de las cordales.',
        image: IMG.toothNeutral,
        toothPosition: 'right',
      },
      {
        text: 'Los jóvenes tienen interacción con otros jóvenes usualmente en el entorno deportivo o peleas. Es importante saber qué se debe hacer en caso de una lesión en la cavidad oral.',
        image: IMG.toothWand,
        toothPosition: 'left',
      },
    ],
    topics: [
      {
        id: 'cordales',
        title: '¿Qué cuidados tener si erupcionan las cordales?',
        menuImage: IMG.toothNeutral,
        slides: [
          {
            text: 'Su erupción empieza por lo general a la edad de 17 años. Al salir, estos dientes cortan las encías, causando en algunas ocasiones hemorragias prolongadas en jóvenes hemofílicos. Si esto sucede, es necesario acudir al servicio de urgencias.',
            image: IMG.toothWand,
            toothPosition: 'left',
          } as ContentSlide,
          {
            text: 'Cuando los dientes no se encuentran en buena posición, podría ser necesario extraerlos. Este procedimiento debe ser coordinado con el programa institucional de oncohematología.',
            image: IMG.toothNeutral,
            photo: IMG.cordalesFoto,
            toothPosition: 'right',
          } as ContentSlide,
        ],
      },
      {
        id: 'higiene',
        title: '¿Cómo se debe realizar la higiene oral?',
        menuImage: IMG.toothBrush,
        slides: [
          {
            text: 'Es recomendado realizarla 3 veces al día. Es importante por varias razones entre ellas:',
            image: IMG.toothWand,
            toothPosition: 'right',
            buttons: [
              {
                text: 'Prevenir las Caries',
                image: IMG.dienteCarie,
                targetId: 'caries',
                imagePosition: 'left'
              },
              {
                text: 'Prevenir la Gingivitis',
                image: IMG.enciaIcon,
                targetId: 'gingivitis',
                imagePosition: 'right'
              }
            ],
            speechBubble: {
              text: '¡HAZ CLICK AQUÍ PARA VER TÉCNICA DE CEPILLADO!',
              targetId: 'cepillado'
            }
          } as ContentSlide,
        ],
        subtopics: [
          {
            id: 'caries',
            title: 'Caries',
            menuImage: IMG.caries1,
            slides: cariesSlides6_18,
          },
          {
            id: 'gingivitis',
            title: 'Gingivitis',
            menuImage: IMG.gingivitis1,
            slides: gingivitisSlides,
          },
          {
            id: 'cepillado',
            title: 'Cepillado',
            menuImage: IMG.toothBrush,
            slides: [
              {
                text: 'Para realizar la higiene debes usar un cepillo de dientes para adulto de cerdas suaves.',
                image: IMG.toothBrush,
                photo: IMG.cepillo
              } as ContentSlide,
              {
                text: 'Crema de dientes con flúor (cantidad: del tamaño de una arveja) y seda dental.',
                image: IMG.toothBrush,
                photo: IMG.crema3
              } as ContentSlide,
              {
                text: 'Paso 1: Coloca las cerdas a 45 grados hacia la encía.',
                image: IMG.toothBrush,
                photo: IMG.tecnica1,
              } as ContentSlide,
              {
                text: 'Paso 2: realiza pequeños movimientos vibratorios circulares, suavemente.',
                image: IMG.toothBrush,
                photo: IMG.tecnica2,
              } as ContentSlide,
              {
                text: 'Paso 3: limpia hacia abajo/ arriba (barrido), cubriendo de la encía al borde del diente.',
                image: IMG.toothBrush,
                photo: IMG.tecnica3,
              } as ContentSlide,
              {
                text: 'Paso 4: repite el movimiento de vibraciones y barrido en la cara interna de todos los dientes.',
                image: IMG.toothBrush,
                photo: IMG.tecnica4,
              } as ContentSlide,
              {
                text: 'Paso 5: limpia las superficies de masticación con movimientos de vaivén.',
                image: IMG.toothBrush,
                photo: IMG.tecnica5,
              } as ContentSlide,
              {
                text: 'Resultados felices: ¡Cepillado completo! Una sonrisa brillante y saludable',
                image: IMG.toothBrush,
                photo: IMG.tecnica61,
              } as ContentSlide,
            ]
          },
        ],
      },
      {
        id: 'trauma',
        title: 'Trauma Dental',
        menuImage: IMG.bloodCells,
        slides: [
          {
            text: 'Si tras una caída o golpe observas sangrado en la boca, puede ser ocasionado por un corte en la lengua o mucosas, incluso por una fractura dental o del hueso.',
            image: IMG.toothTrauma,
            toothPosition: 'left',
          } as ContentSlide,
          {
            text: 'Y en algunos casos, sin presentar sangrado aparente, pueden existir fracturas o hematomas que deben ser atendidos con urgencia.',
            image: IMG.toothTrauma,
            toothPosition: 'right',
          } as ContentSlide,
          {
            type: 'detail',
            bodyText: 'Como primera medida, tras un trauma es indispensable acudir al servicio de urgencias para que se valore si hay lesiones, su severidad, se eleve el factor en caso de necesitarlo y se le dé un adecuado tratamiento.',
            showInfoIcon: true,
          } as DetailSlide,
          {
            type: 'modal',
            photo: IMG.traumaFoto1,
            alertText: 'Si hay sangrado, retire los coágulos para evitar broncoaspiración, haga presión con una gasa durante 15 minutos sobre la zona, y en caso de tener a la mano ácido tranexámico, aplicarlo de forma tópica.',
            showExclamation: true,
          } as InfoSlide,
          {
            text: 'Es necesario que el odontólogo revise detalladamente al paciente y le realice las radiografías necesarias para determinar el tratamiento.',
            image: IMG.toothTrauma,
            toothPosition: 'left',
          } as ContentSlide,
          {
            text: 'En la dentición permanente los tratamientos van encaminados a detener el sangrado, preservar la integridad del diente en boca promover su desarrollo si es un diente inmaduro.',
            image: IMG.toothTrauma,
            toothPosition: 'right',
          } as ContentSlide,
          {
            type: 'detail',
            bodyText: 'Estos tratamientos van desde suturas en tejidos blandos, pasando por inmovilización del diente, tratamiento de conductos y extracción del diente. \nEn algunos casos de fracturas óseas se requiere cirugía maxilofacial.',
            showInfoIcon: true,
          } as DetailSlide,
          {
            type: 'modal',
            photo: IMG.traumaFoto3,
            alertText: 'Si el diente se desaloja de su cavidad. Recójalo tomándolo por la corona, enjuáguelo con agua y guárdelo en una gasa húmeda. Esto ayuda a conservarlo, para que el odontólogo lo reposicione.',
            showExclamation: true,
          } as InfoSlide,
        ],
      },
    ],
  },
};
