
export type AgeGroup = '0-3' | '3-5' | '6-13' | '14-18';

// ─── Slide types ──────────────────────────────────────────────────────────────

export interface ContentSlide {
  text: string;
  image: any;
  toothPosition: 'left' | 'right';
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

const IMG = {
  tooth1:     require('../../assets/images/png\'s/Tooth1.png'),
  tooth2:     require('../../assets/images/png\'s/Tooth2.png'),
  tooth3:     require('../../assets/images/png\'s/Tooth3.png'),
  tooth4:     require('../../assets/images/png\'s/Tooth4.png'),
  encia:      require('../../assets/images/png\'s/Encia.png'),
  sangre:     require('../../assets/images/png\'s/Sangre.png'),
  boca:       require('../../assets/images/png\'s/boca1.png'),
  nino:       require('../../assets/images/png\'s/niño.png'),
  toothGray:  require('../../assets/images/png\'s/tooth_gray.png'),
};

// ─── SHARED SLIDE FACTORIES ───────────────────────────────────────────────────

const traumaCommonSlides = (groupNote?: string): Slide[] => [
  {
    text: 'Si tras una caída o golpe observas sangrado en la boca, puede ser ocasionado por un corte en la lengua o mucosas, incluso por una fractura dental o del hueso.',
    image: IMG.tooth3,
    toothPosition: 'left',
  } as ContentSlide,
  {
    text: 'En algunos casos, sin presentar sangrado aparente, pueden existir fracturas o hematomas que deben ser atendidos con urgencia.',
    image: IMG.tooth3,
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
    photo: IMG.boca,
    alertText: 'Si hay sangrado, retire los coágulos para evitar broncoaspiración, haga presión con una gasa durante 15 minutos sobre la zona, y en caso de tener a la mano ácido tranexámico, aplicarlo de forma tópica.',
    showExclamation: true,
  } as InfoSlide,
  {
    type: 'detail',
    subtitle: 'LO QUE DEBES SABER:',
    bodyText: 'Es necesario que el odontólogo revise detalladamente al paciente y le realice las radiografías necesarias para determinar el tratamiento.',
    showInfoIcon: true,
  } as DetailSlide,
  {
    type: 'modal',
    photo: IMG.tooth4,
    alertText: 'Si el diente se desaloja de su cavidad: recójalo tomándolo por la corona, enjuáguelo con agua y guárdelo en una gasa húmeda para que el odontólogo lo reposicione.',
    showExclamation: true,
  } as InfoSlide,
];

const cariesSlides: Slide[] = [
  {
    text: 'Las caries son lesiones producidas por ácidos de bacterias que destruyen el esmalte. En pacientes con hemofilia, el tratamiento debe planificarse con el hematólogo.',
    image: IMG.tooth1,
    toothPosition: 'left',
  } as ContentSlide,
  {
    type: 'detail',
    subtitle: 'PREVENCIÓN DE CARIES:',
    bodyText: 'Cepilla los dientes después de cada comida. Usa pasta con flúor. Evita azúcares entre comidas. Visita al odontólogo cada 6 meses para revisión y aplicación de sellantes si es necesario.',
    showInfoIcon: true,
  } as DetailSlide,
  {
    type: 'modal',
    photo: IMG.boca,
    alertText: 'Ante cualquier tratamiento odontológico que pueda generar sangrado (extracciones, exodoncias), el hematólogo debe evaluar y elevar el factor de coagulación previamente.',
    showExclamation: true,
  } as InfoSlide,
];

const gingivitisSlides: Slide[] = [
  {
    text: 'La gingivitis es la inflamación de las encías causada por la placa bacteriana. Se caracteriza por encías rojas, hinchadas y que sangran al cepillarse.',
    image: IMG.encia,
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
    photo: IMG.encia,
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
        text: 'En esta etapa ocurren transiciones muy importantes en el desarrollo general y aspecto dental de los niños.',
        image: IMG.tooth1,
        toothPosition: 'left',
      },
      {
        text: 'La erupción de los dientes temporales, más conocidos como "dientes de leche", es el evento más importante de esta etapa.',
        image: IMG.tooth2,
        toothPosition: 'right',
      },
      {
        text: 'La higiene oral debe comenzar desde antes de erupcionar el primer diente, limpiando las encías con una gasa húmeda.',
        image: IMG.tooth1,
        toothPosition: 'left',
      },
      {
        text: 'Cuando aparezca el primer diente, usa un cepillo suave para bebés con pasta sin flúor del tamaño de un grano de arroz.',
        image: IMG.tooth2,
        toothPosition: 'right',
      },
      {
        text: 'Recuerda: el cepillado debe hacerse dos veces al día y siempre con supervisión de un adulto.',
        image: IMG.tooth1,
        toothPosition: 'left',
      },
    ],
    topics: [
      {
        id: 'erupcion',
        title: '¿A qué edad sale cada diente?',
        menuImage: IMG.tooth1,
        slides: [
          {
            text: 'Erupción de los dientes temporales, más conocidos como "dientes de leche". Este proceso es completamente normal.',
            image: IMG.tooth1,
            toothPosition: 'left',
          } as ContentSlide,
          {
            type: 'detail',
            subtitle: 'LO QUE DEBES SABER SOBRE LA ERUPCIÓN DENTAL:',
            bodyText: 'Este proceso causa normalmente: irritabilidad, cambios en los ciclos de sueño, aumento de la salivación y sensación de "picazón" en las encías.\n\nTambién puede presentarse fiebre ligera. Solo en caso de fiebre alta, sangrado que no para o dolor intenso, es necesario administrar medicamentos.',
            showInfoIcon: true,
          } as DetailSlide,
          {
            type: 'modal',
            photo: IMG.nino,
            alertText: 'No dejes objetos duros o juguetes a su alcance sin supervisión. Los bebés introducen objetos en su boca para morder, los cuales pueden causar sangrado de importancia.',
            showExclamation: true,
          } as InfoSlide,
          {
            type: 'detail',
            subtitle: 'LO QUE DEBES SABER SOBRE LA ERUPCIÓN DENTAL:',
            bodyText: 'Poco antes de erupcionar el diente, debido al flujo de sangre, las encías pueden hincharse e incluso tomar un color azulado. Esto no tiene nada que ver con la hemofilia y suele resolverse por sí solo.',
            showInfoIcon: true,
          } as DetailSlide,
          {
            type: 'modal',
            photo: IMG.boca,
            alertText: 'Usar los conocidos "mordedores" puede causar sangrado al momento de ser mordido. No está indicado para los bebés con hemofilia.',
            showExclamation: true,
          } as InfoSlide,
          { type: 'diagram', ageGroup: '0-3' } as DiagramSlide,
        ],
      },
      {
        id: 'higiene',
        title: 'Higiene Oral',
        menuImage: IMG.encia,
        subtopics: [
          {
            id: 'higiene-general',
            title: 'Higiene General',
            menuImage: IMG.tooth2,
            slides: [
              {
                text: 'Antes de que aparezca el primer diente, limpia las encías del bebé con una gasa húmeda después de cada toma.',
                image: IMG.tooth2,
                toothPosition: 'left',
              } as ContentSlide,
              {
                text: 'Cuando erupcione el primer diente, cepíllalo con un cepillo de dientes suave para bebés y pasta dental sin flúor.',
                image: IMG.tooth2,
                toothPosition: 'right',
              } as ContentSlide,
              {
                type: 'detail',
                subtitle: 'HIGIENE ORAL EN BEBÉS:',
                bodyText: 'El cepillado debe realizarse dos veces al día: en la mañana y antes de dormir.\n\nEvita que el bebé se duerma tomando leche o jugo, ya que el azúcar en la boca durante la noche puede causar caries.',
                showInfoIcon: true,
              } as DetailSlide,
            ],
          },
          {
            id: 'encias',
            title: 'Encías',
            menuImage: IMG.encia,
            slides: [
              {
                text: 'Las encías del bebé son sensibles y pueden irritarse durante la erupción. Una buena higiene desde el inicio previene problemas futuros.',
                image: IMG.encia,
                toothPosition: 'left',
              } as ContentSlide,
              {
                text: 'Masajea suavemente las encías con una gasa limpia y húmeda para aliviar las molestias de la erupción.',
                image: IMG.encia,
                toothPosition: 'right',
              } as ContentSlide,
              {
                type: 'detail',
                subtitle: 'CUIDADO DE LAS ENCÍAS:',
                bodyText: 'Las encías sanas son de color rosa pálido y firmes. Si notas encías muy rojas, hinchadas o con sangrado frecuente, consulta al odontólogo.',
                showInfoIcon: true,
              } as DetailSlide,
              {
                type: 'modal',
                photo: IMG.encia,
                alertText: 'En pacientes con hemofilia, el sangrado de encías puede ser más difícil de controlar. Ante cualquier sangrado persistente, consulta de inmediato al médico u odontólogo.',
                showExclamation: true,
              } as InfoSlide,
            ],
          },
          {
            id: 'dientes',
            title: 'Dientes',
            menuImage: IMG.tooth1,
            subtopics: [
              {
                id: 'caries',
                title: 'Caries',
                menuImage: IMG.tooth1,
                slides: cariesSlides,
              },
              {
                id: 'gingivitis',
                title: 'Gingivitis',
                menuImage: IMG.encia,
                slides: gingivitisSlides,
              },
            ],
          },
        ],
      },
      {
        id: 'trauma',
        title: 'Trauma Dental',
        menuImage: IMG.sangre,
        slides: traumaCommonSlides('0-3'),
      },
    ],
  },

  '3-5': {
    title: 'DE 3 A 5 AÑOS',
    introSlides: [
      {
        text: 'En esta etapa el niño ya tiene todos sus dientes temporales y empieza a desarrollar hábitos que influirán en su salud oral a largo plazo.',
        image: IMG.tooth1,
        toothPosition: 'left',
      },
      {
        text: 'El niño puede comenzar a cepillarse solo, pero siempre bajo supervisión de un adulto. Usa pasta con flúor del tamaño de un chícharo.',
        image: IMG.tooth2,
        toothPosition: 'right',
      },
      {
        text: 'Limita los alimentos azucarados y ácidos. Prefiere frutas, verduras y lácteos que fortalecen el esmalte dental.',
        image: IMG.tooth1,
        toothPosition: 'left',
      },
      {
        text: 'Los niños de esta edad son muy activos. Los traumatismos dentales son frecuentes. Ante cualquier golpe fuerte, consulta al odontólogo.',
        image: IMG.tooth3,
        toothPosition: 'right',
      },
    ],
    topics: [
      {
        id: 'higiene',
        title: 'Higiene Oral',
        menuImage: IMG.tooth2,
        subtopics: [
          {
            id: 'higiene-general',
            title: 'Higiene General',
            menuImage: IMG.tooth2,
            slides: [
              {
                text: 'A esta edad el niño puede comenzar a cepillarse solo, pero siempre bajo supervisión. Use pasta con flúor del tamaño de un chícharo.',
                image: IMG.tooth2,
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
                image: IMG.tooth2,
                toothPosition: 'right',
              } as ContentSlide,
            ],
          },
          {
            id: 'caries',
            title: 'Caries',
            menuImage: IMG.tooth1,
            slides: cariesSlides,
          },
          {
            id: 'gingivitis',
            title: 'Gingivitis',
            menuImage: IMG.encia,
            slides: gingivitisSlides,
          },
        ],
      },
      {
        id: 'trauma',
        title: 'Trauma Dental',
        menuImage: IMG.sangre,
        slides: traumaCommonSlides('3-5'),
      },
    ],
  },

  '6-13': {
    title: 'DE 6 A 13 AÑOS',
    introSlides: [
      {
        text: 'En esta etapa ocurre el recambio dental: los dientes temporales son reemplazados por los permanentes.',
        image: IMG.tooth1,
        toothPosition: 'left',
      },
      {
        text: 'Alrededor de los 6 años empiezan a caerse los dientes de leche. Este proceso es normal y no debería causar sangrado prolongado.',
        image: IMG.tooth2,
        toothPosition: 'right',
      },
      {
        text: 'En niños con hemofilia, si un diente sangra al caerse y no se detiene en 15 minutos con presión, consulta al médico.',
        image: IMG.tooth1,
        toothPosition: 'left',
      },
      {
        text: 'Con los dientes permanentes es fundamental el uso correcto del cepillo y el hilo dental.',
        image: IMG.tooth2,
        toothPosition: 'right',
      },
    ],
    topics: [
      {
        id: 'erupcion',
        title: 'Erupción Dental',
        menuImage: IMG.tooth1,
        slides: [
          {
            text: 'Es normal que los dientes permanentes salgan torcidos al principio. El maxilar crece y los dientes se van alineando solos en muchos casos.',
            image: IMG.tooth1,
            toothPosition: 'left',
          } as ContentSlide,
          {
            text: 'Si la desalineación es marcada, el odontólogo puede recomendar ortodoncia interceptiva para guiar el crecimiento.',
            image: IMG.tooth2,
            toothPosition: 'right',
          } as ContentSlide,
          {
            type: 'detail',
            subtitle: 'DIENTES TORCIDOS:',
            bodyText: 'La maloclusión puede tener causas genéticas o funcionales (hábitos como chupar dedo, uso prolongado de biberón). La evaluación temprana por un ortodoncista es recomendada.',
            showInfoIcon: true,
          } as DetailSlide,
          {
            type: 'modal',
            photo: IMG.nino,
            alertText: 'En pacientes con hemofilia, cualquier procedimiento de ortodoncia debe coordinarse con el hematólogo para prevenir sangrados durante los ajustes.',
            showExclamation: true,
          } as InfoSlide,
          {
            text: 'El cambio dental (recambio) es el proceso por el cual los dientes de leche caen para dar paso a los permanentes.',
            image: IMG.tooth2,
            toothPosition: 'left',
          } as ContentSlide,
          {
            type: 'modal',
            photo: IMG.boca,
            alertText: 'En niños con hemofilia, el proceso de caída de dientes de leche debe vigilarse. Si hay sangrado excesivo que no cede en 15 minutos, consulta al médico.',
            showExclamation: true,
          } as InfoSlide,
          {
            text: 'Los dientes permanentes son más grandes y tienen que ocupar el espacio correcto. Este proceso puede durar hasta los 13 años.',
            image: IMG.tooth3,
            toothPosition: 'right',
          } as ContentSlide,
          {
            type: 'modal',
            photo: IMG.tooth4,
            alertText: 'Los dientes permanentes no son reemplazados: cuídalos toda la vida. Una caries en un diente permanente debe tratarse de inmediato.',
            showExclamation: true,
          } as InfoSlide,
          { type: 'diagram', ageGroup: '6-13' } as DiagramSlide,
        ],
      },
      {
        id: 'higiene',
        title: 'Higiene Oral',
        menuImage: IMG.encia,
        subtopics: [
          {
            id: 'higiene-general',
            title: 'Higiene General',
            menuImage: IMG.tooth2,
            slides: [
              {
                text: 'Con los dientes permanentes es fundamental el uso correcto del cepillo y el hilo dental para prevenir caries y enfermedades de las encías.',
                image: IMG.tooth2,
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
                image: IMG.tooth2,
                toothPosition: 'right',
              } as ContentSlide,
            ],
          },
          {
            id: 'caries',
            title: 'Caries',
            menuImage: IMG.tooth1,
            slides: cariesSlides,
          },
          {
            id: 'gingivitis',
            title: 'Gingivitis',
            menuImage: IMG.encia,
            slides: gingivitisSlides,
          },
        ],
      },
      {
        id: 'trauma',
        title: 'Trauma Dental',
        menuImage: IMG.sangre,
        slides: traumaCommonSlides('6-13'),
      },
    ],
  },

  '14-18': {
    title: 'DE 14 A 18 AÑOS',
    introSlides: [
      {
        text: 'En la adolescencia aparecen nuevos retos para la salud oral: los terceros molares, los hábitos de higiene autónomos y los tratamientos de ortodoncia definitivos.',
        image: IMG.tooth1,
        toothPosition: 'left',
      },
      {
        text: 'Las muelas del juicio (cordales) suelen erupcionar entre los 17 y 25 años. En pacientes con hemofilia, su extracción requiere preparación especial.',
        image: IMG.tooth2,
        toothPosition: 'right',
      },
      {
        text: 'El tabaco, el alcohol y el piercing oral son especialmente peligrosos en pacientes con hemofilia.',
        image: IMG.tooth3,
        toothPosition: 'left',
      },
      {
        text: 'Mantén una dieta balanceada, baja en azúcares, y visita al odontólogo cada 6 meses.',
        image: IMG.tooth1,
        toothPosition: 'right',
      },
      {
        text: 'La ortodoncia en pacientes con hemofilia es posible, pero requiere coordinación entre el ortodoncista y el hematólogo.',
        image: IMG.tooth2,
        toothPosition: 'left',
      },
    ],
    topics: [
      {
        id: 'cordales',
        title: 'Cordales (Muelas del Juicio)',
        menuImage: IMG.tooth1,
        slides: [
          {
            text: 'Las muelas del juicio suelen erupcionar entre los 17 y 25 años. Pueden salir en posición incorrecta (impactadas) y causar dolor e infección.',
            image: IMG.tooth1,
            toothPosition: 'left',
          } as ContentSlide,
          {
            text: 'En pacientes con hemofilia, la extracción de cordales es un procedimiento de alto riesgo que requiere coordinación con el hematólogo.',
            image: IMG.tooth2,
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
        menuImage: IMG.encia,
        subtopics: [
          {
            id: 'higiene-general',
            title: 'Higiene General',
            menuImage: IMG.tooth2,
            slides: [
              {
                text: 'En la adolescencia, la autonomía en la higiene oral es clave. Cepilla después de cada comida y usa hilo dental diariamente.',
                image: IMG.tooth2,
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
            menuImage: IMG.tooth1,
            slides: cariesSlides,
          },
          {
            id: 'gingivitis',
            title: 'Gingivitis',
            menuImage: IMG.encia,
            slides: gingivitisSlides,
          },
        ],
      },
      {
        id: 'trauma',
        title: 'Trauma Dental',
        menuImage: IMG.sangre,
        slides: traumaCommonSlides('14-18'),
      },
    ],
  },
};
