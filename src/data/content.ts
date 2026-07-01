
export type AgeGroup = '0-3' | '3-5' | '6-13' | '14-18';

// ─── Slide types ──────────────────────────────────────────────────────────────

export interface SlideButton {
  text: string;
  image: any;
  targetId: string;
  imagePosition: 'left' | 'right';
}

export interface ContentSlide {
  text: string;
  image: any;
  toothPosition: 'left' | 'right';
  subtitle?: string;
  photo?: any;
  buttons?: SlideButton[];
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

export type Slide = ContentSlide | InfoSlide | DetailSlide | DiagramSlide;

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

  // ── Fotos clínicas reales (modales de alerta) ─────────────────────────────
  enciaFoto: require("../../assets/images/png's/boca1.jpeg"),
  sangradoFoto: require("../../assets/images/png's/sangrado.png"),
  traumaFoto1: require("../../assets/images/png's/trauma_1.jpeg"),
  traumaFoto2: require("../../assets/images/png's/trauma_2.jpeg"),
  traumaFoto3: require("../../assets/images/png's/trauma_3.png"),
  caries1: require("../../assets/images/png's/caries_1.jpeg"),
  caries2: require("../../assets/images/png's/caries_2.jpeg"),
  caries3: require("../../assets/images/png's/caries_3.png"),
  gingivitis1: require("../../assets/images/png's/gingivitis_1.png"),
  gingivitis2: require("../../assets/images/png's/gingivitis_2.png"),
  cordalesFoto: require("../../assets/images/png's/cordales.png"),

  // ── Ilustraciones de personajes ───────────────────────────────────────────
  bebeEnfermo: require("../../assets/images/png's/niño.png"),
  cepilladoBebe: require("../../assets/images/png's/cepillado_bebe.jpeg"),
  medicamentos: require("../../assets/images/png's/medicamento.jpeg"),
  mordedor: require("../../assets/images/png's/mordedor.jpeg"),

  // ── Ilustraciones de objetos ──────────────────────────────────────────────
  cepillo: require("../../assets/images/png's/cepillo.jpeg"),
  crema1: require("../../assets/images/png's/crema1.jpeg"),
  posicionCepillado: require("../../assets/images/png's/posicion_cepillado.jpeg"),

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
    subtitle: 'ANTE UN GOLPE DENTAL:',
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
    type: 'detail',
    subtitle: '',
    bodyText: 'En la dentición temporal los tratamientos van encaminados a detener el sangrado, preservar la integridad del diente permanente en camino y evitar infecciones.',
    showInfoIcon: true,
  } as DetailSlide,
  {
    type: 'modal',
    photo: IMG.traumaFoto2,
    alertText: 'Si el diente se desaloja de su cavidad: recójalo tomándolo por la corona, enjuáguelo con agua y guárdelo en una gasa húmeda para que el odontólogo lo reposicione.',
    showExclamation: true,
  } as InfoSlide,
];

const cariesSlides: Slide[] = [
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

const gingivitisSlides: Slide[] = [
  {
    text: 'La gingivitis es la inflamación de las encías causada por la placa bacteriana. Se caracteriza por encías rojas, hinchadas y que sangran al cepillarse.',
    image: IMG.gingivitis1,
    toothPosition: 'left',
  } as ContentSlide,
  {
    type: 'detail',
    subtitle: 'GINGIVITIS EN HEMOFILIA:',
    bodyText: 'El sangrado de encías en pacientes con hemofilia puede ser más prolongado. Una higiene oral rigurosa (cepillado 2 veces/día + hilo dental) es la principal herramienta de prevención.',
    showInfoIcon: true,
  } as DetailSlide,
  {
    type: 'modal',
    photo: IMG.enciaFoto,
    alertText: 'Si el sangrado de encías no se detiene en 10 minutos con presión, o es recurrente, consulta al odontólogo y al hematólogo de inmediato.',
    showExclamation: true,
  } as InfoSlide,
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
        text: 'Aprenden a caminar y a interactuar con el mundo; esto les hace susceptibles a caídas que pueden causar lesiones en su lengua, mucosas, encias o dientes.',
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
                bodyText: 'Este proceso causa normalmente: irritabilidad, cambios en los ciclos de sueño, aumento de la salivación y sensación de "picazón" en las encías.\n\nTambién puede presentarse fiebre ligera, pero esto sucede por un cambio en el tipo de bacterias en la boca del bebé. Solo en caso de fiebre, sangrado que no para o dolor intenso que no le permita comer, es necesario administrarle medicamentos.',
                showInfoIcon: true,
              } as DetailSlide,
              {
                type: 'modal',
                photo: IMG.medicamentos,
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
                bodyText: 'La erupción dental rara vez provoca hemorragias, pero si las encías presentan sangrado leve que no para, es necesario acudir a consulta odontológica..',
                showInfoIcon: true,
              } as DetailSlide,
              {
                type: 'modal',
                photo: IMG.mordedor,
                alertText: 'No dejes objetos duros o juguetes a su alcance sin supervisión, y que, en busca de aliviar las molestias en sus encías, los bebés introducen objetos en su boca para moder, los cuales pueden causar sangrado de importancia.',
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
            text: 'En esta estapa, la forma de realizar la higiene se divide en dos:',
            image: IMG.toothWand,
            toothPosition: 'left',
          } as ContentSlide,
          {
            text: '- Limpieza de las encías, cuando no hay ningun diente presente. \n\n- Limpieza de los dientes tan pronto erupcionan.',
            image: IMG.toothWand,
            toothPosition: 'right',
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
                text: 'Se cree que si el bebé no tiene dientes, no es necesario limpiarle las encías. ¡Esto es falso!',
                image: IMG.toothWand,
                toothPosition: 'left',
              } as ContentSlide,
              {
                text: 'Es importante mantenerlo libre de placa para que esté saludable, además de acostumbrarle al ejercicio de limpiar su boca.',
                image: IMG.toothWand,
                toothPosition: 'right',
              } as ContentSlide,
              {
                type: 'detail',
                subtitle: 'CUIDADO DE LAS ENCÍAS:',
                bodyText: 'La limpieza se puede realizar con un cepillo dental de dedo o con una gasa húmeda, pasándolos por todas las superficies de las encías con el fin de retirar placa excepto en el paladar ya que pude causarle ganas de vomitar..',
                showInfoIcon: true,
              } as DetailSlide,
              {
                type: 'modal',
                photo: IMG.cepilladoBebe,
                alertText: 'Recuerda que puedes iniciar este tipo de higiene a los 5 mese de edad. Hazlo con mucha suavidad, para no causar lesiones y sangrado que pueda agravarse.',
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
                text: 'Se realiza desde que podamos ver que el primer diente está saliendo.',
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
                    text: 'Cepillado',
                    image: IMG.toothBrush,
                    targetId: 'cepillado',
                    imagePosition: 'right'
                  }
                ]
              } as ContentSlide,
            ],
            subtopics: [
              {
                id: 'caries',
                title: 'Prevenir las Caries',
                menuImage: IMG.traumaFoto2,
                slides: cariesSlides,
              },
              {
                id: 'cepillado',
                title: 'Cepillado',
                menuImage: IMG.toothBrush,
                slides: [
                  {
                    text: 'Para realizar la higiene ya puedes usar un cepillo de dientes pequeño y suave.',
                    image: IMG.toothBrush,
                    toothPosition: 'right',
                    photo: IMG.cepillo
                  } as ContentSlide,
                  {
                    text: 'Crema de dientes con flúor (cantidad: menor que el tamaño de un grano de arroz) y seda dental.',
                    image: IMG.toothBrush,
                    toothPosition: 'right',
                    photo: IMG.crema1
                  } as ContentSlide,
                  {
                    text: 'Posición adecuada para el cepillado.',
                    image: IMG.toothBrush,
                    toothPosition: 'right',
                    photo: IMG.posicionCepillado
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
        slides: traumaCommonSlides('0-3'),
      },
    ],
  },

  '3-5': {
    title: 'DE 3 A 5 AÑOS',
    introSlides: [
      {
        text: 'En esta etapa el niño ya tiene todos sus dientes temporales y empieza a desarrollar hábitos que influirán en su salud oral a largo plazo.',
        image: IMG.toothWand,
        toothPosition: 'left',
      },
      {
        text: 'El niño puede comenzar a cepillarse solo, pero siempre bajo supervisión de un adulto. Usa pasta con flúor del tamaño de un chícharo.',
        image: IMG.toothNeutral,
        toothPosition: 'right',
      },
      {
        text: 'Limita los alimentos azucarados y ácidos. Prefiere frutas, verduras y lácteos que fortalecen el esmalte dental.',
        image: IMG.toothWand,
        toothPosition: 'left',
      },
      {
        text: 'Los niños de esta edad son muy activos. Los traumatismos dentales son frecuentes. Ante cualquier golpe fuerte, consulta al odontólogo.',
        image: IMG.toothTrauma,
        toothPosition: 'right',
      },
    ],
    topics: [
      {
        id: 'higiene',
        title: 'Higiene Oral',
        menuImage: IMG.toothBrush,
        subtopics: [
          {
            id: 'higiene-general',
            title: 'Higiene General',
            menuImage: IMG.toothBrush,
            slides: [
              {
                text: 'A esta edad el niño puede comenzar a cepillarse solo, pero siempre bajo supervisión. Use pasta con flúor del tamaño de un chícharo.',
                image: IMG.toothBrush,
                toothPosition: 'left',
              } as ContentSlide,
              {
                type: 'detail',
                subtitle: 'TIPS DE HIGIENE ORAL 3-5 AÑOS:',
                bodyText: 'Cepille los dientes de su hijo al menos dos veces al día.\n\nUse hilo dental una vez al día cuando los dientes estén juntos.\n\nRecuerde que el sangrado al usar el hilo dental en niños con hemofilia debe consultarse con el odontólogo.',
                showInfoIcon: true,
              } as DetailSlide,
              {
                text: 'Visita al odontólogo cada 6 meses para revisiones preventivas. La detección temprana de caries evita tratamientos más complejos.',
                image: IMG.toothNeutral,
                toothPosition: 'right',
              } as ContentSlide,
            ],
          },
          {
            id: 'caries',
            title: 'Caries',
            menuImage: IMG.caries1,
            slides: cariesSlides,
          },
          {
            id: 'gingivitis',
            title: 'Gingivitis',
            menuImage: IMG.gingivitis1,
            slides: gingivitisSlides,
          },
        ],
      },
      {
        id: 'trauma',
        title: 'Trauma Dental',
        menuImage: IMG.bloodCells,
        slides: traumaCommonSlides('3-5'),
      },
    ],
  },

  '6-13': {
    title: 'DE 6 A 13 AÑOS',
    introSlides: [
      {
        text: 'En esta etapa ocurre el recambio dental: los dientes temporales son reemplazados por los permanentes.',
        image: IMG.toothWand,
        toothPosition: 'left',
      },
      {
        text: 'Alrededor de los 6 años empiezan a caerse los dientes de leche. Este proceso es normal y no debería causar sangrado prolongado.',
        image: IMG.toothNeutral,
        toothPosition: 'right',
      },
      {
        text: 'En niños con hemofilia, si un diente sangra al caerse y no se detiene en 15 minutos con presión, consulta al médico.',
        image: IMG.toothWand,
        toothPosition: 'left',
      },
      {
        text: 'Con los dientes permanentes es fundamental el uso correcto del cepillo y el hilo dental.',
        image: IMG.toothBrush,
        toothPosition: 'right',
      },
    ],
    topics: [
      {
        id: 'erupcion',
        title: 'Erupción Dental',
        menuImage: IMG.enciaIcon,
        slides: [
          {
            text: 'Es normal que los dientes permanentes salgan torcidos al principio. El maxilar crece y los dientes se van alineando solos en muchos casos.',
            image: IMG.toothWand,
            toothPosition: 'left',
          } as ContentSlide,
          {
            text: 'Si la desalineación es marcada, el odontólogo puede recomendar ortodoncia interceptiva para guiar el crecimiento.',
            image: IMG.toothNeutral,
            toothPosition: 'right',
          } as ContentSlide,
          {
            type: 'detail',
            subtitle: 'DIENTES TORCIDOS:',
            bodyText: 'La malooclusión puede tener causas genéticas o funcionales (hábitos como chupar dedo, uso prolongado de biberón). La evaluación temprana por un ortodoncista es recomendada.',
            showInfoIcon: true,
          } as DetailSlide,
          {
            type: 'modal',
            photo: IMG.bebeEnfermo,
            alertText: 'En pacientes con hemofilia, cualquier procedimiento de ortodoncia debe coordinarse con el hematólogo para prevenir sangrados durante los ajustes.',
            showExclamation: true,
          } as InfoSlide,
          {
            text: 'El cambio dental (recambio) es el proceso por el cual los dientes de leche caen para dar paso a los permanentes.',
            image: IMG.toothWand,
            toothPosition: 'left',
          } as ContentSlide,
          {
            type: 'modal',
            photo: IMG.enciaFoto,
            alertText: 'En niños con hemofilia, el proceso de caída de dientes de leche debe vigilarse. Si hay sangrado excesivo que no cede en 15 minutos, consulta al médico.',
            showExclamation: true,
          } as InfoSlide,
          {
            text: 'Los dientes permanentes son más grandes y tienen que ocupar el espacio correcto. Este proceso puede durar hasta los 13 años.',
            image: IMG.toothTrauma,
            toothPosition: 'right',
          } as ContentSlide,
          {
            type: 'modal',
            photo: IMG.traumaFoto2,
            alertText: 'Los dientes permanentes no son reemplazados: cuídalos toda la vida. Una caries en un diente permanente debe tratarse de inmediato.',
            showExclamation: true,
          } as InfoSlide,
          { type: 'diagram', ageGroup: '6-13' } as DiagramSlide,
        ],
      },
      {
        id: 'higiene',
        title: 'Higiene Oral',
        menuImage: IMG.toothBrush,
        subtopics: [
          {
            id: 'higiene-general',
            title: 'Higiene General',
            menuImage: IMG.toothBrush,
            slides: [
              {
                text: 'Con los dientes permanentes es fundamental el uso correcto del cepillo y el hilo dental para prevenir caries y enfermedades de las encías.',
                image: IMG.toothBrush,
                toothPosition: 'left',
              } as ContentSlide,
              {
                type: 'detail',
                subtitle: 'HIGIENE ORAL 6-13 AÑOS:',
                bodyText: 'Cepilla los dientes 3 veces al día (después de cada comida). Usa hilo dental una vez al día. Los enjuagues con flúor son recomendados para fortalecer el esmalte de los dientes permanentes.',
                showInfoIcon: true,
              } as DetailSlide,
              {
                text: 'Si hay aparatos ortopédicos, el cuidado debe ser aún más minucioso. Usa cepillos interdentales para limpiar alrededor de los brackets.',
                image: IMG.toothNeutral,
                toothPosition: 'right',
              } as ContentSlide,
            ],
          },
          {
            id: 'caries',
            title: 'Caries',
            menuImage: IMG.caries1,
            slides: cariesSlides,
          },
          {
            id: 'gingivitis',
            title: 'Gingivitis',
            menuImage: IMG.gingivitis1,
            slides: gingivitisSlides,
          },
        ],
      },
      {
        id: 'trauma',
        title: 'Trauma Dental',
        menuImage: IMG.bloodCells,
        slides: traumaCommonSlides('6-13'),
      },
    ],
  },

  '14-18': {
    title: 'DE 14 A 18 AÑOS',
    introSlides: [
      {
        text: 'En la adolescencia aparecen nuevos retos para la salud oral: los terceros molares, los hábitos de higiene autónomos y los tratamientos de ortodoncia definitivos.',
        image: IMG.toothWand,
        toothPosition: 'left',
      },
      {
        text: 'Las muelas del juicio (cordales) suelen erupcionar entre los 17 y 25 años. En pacientes con hemofilia, su extracción requiere preparación especial.',
        image: IMG.toothNeutral,
        toothPosition: 'right',
      },
      {
        text: 'El tabaco, el alcohol y el piercing oral son especialmente peligrosos en pacientes con hemofilia.',
        image: IMG.toothWand,
        toothPosition: 'left',
      },
      {
        text: 'Mantén una dieta balanceada, baja en azúcares, y visita al odontólogo cada 6 meses.',
        image: IMG.toothWand,
        toothPosition: 'right',
      },
      {
        text: 'La ortodoncia en pacientes con hemofilia es posible, pero requiere coordinación entre el ortodoncista y el hematólogo.',
        image: IMG.toothBrush,
        toothPosition: 'left',
      },
    ],
    topics: [
      {
        id: 'cordales',
        title: 'Cordales (Muelas del Juicio)',
        menuImage: IMG.cordalesFoto,
        slides: [
          {
            text: 'Las muelas del juicio suelen erupcionar entre los 17 y 25 años. Pueden salir en posición incorrecta (impactadas) y causar dolor e infección.',
            image: IMG.cordalesFoto,
            toothPosition: 'left',
          } as ContentSlide,
          {
            text: 'En pacientes con hemofilia, la extracción de cordales es un procedimiento de alto riesgo que requiere coordinación con el hematólogo.',
            image: IMG.medicamentos,
            toothPosition: 'right',
          } as ContentSlide,
          {
            type: 'detail',
            subtitle: 'CORDALES Y HEMOFILIA:',
            bodyText: 'Antes de cualquier extracción, incluyendo las muelas del juicio, el hematólogo debe evaluar al paciente y definir si se necesita elevar el factor de coagulación.\n\nLa cirugía debe hacerse en un centro especializado.',
            showInfoIcon: true,
          } as DetailSlide,
        ],
      },
      {
        id: 'higiene',
        title: 'Higiene Oral',
        menuImage: IMG.toothBrush,
        subtopics: [
          {
            id: 'higiene-general',
            title: 'Higiene General',
            menuImage: IMG.toothBrush,
            slides: [
              {
                text: 'En la adolescencia, la autonomía en la higiene oral es clave. Cepilla después de cada comida y usa hilo dental diariamente.',
                image: IMG.toothBrush,
                toothPosition: 'left',
              } as ContentSlide,
              {
                type: 'detail',
                subtitle: 'HIGIENE ORAL ADOLESCENTE:',
                bodyText: 'El tabaco y el alcohol deterioran las encías y dificultan la coagulación natural. Evítalos. Los piercing orales pueden causar sangrados difíciles de controlar en pacientes con hemofilia.',
                showInfoIcon: true,
              } as DetailSlide,
            ],
          },
          {
            id: 'caries',
            title: 'Caries',
            menuImage: IMG.caries1,
            slides: cariesSlides,
          },
          {
            id: 'gingivitis',
            title: 'Gingivitis',
            menuImage: IMG.gingivitis1,
            slides: gingivitisSlides,
          },
        ],
      },
      {
        id: 'trauma',
        title: 'Trauma Dental',
        menuImage: IMG.bloodCells,
        slides: traumaCommonSlides('14-18'),
      },
    ],
  },
};
