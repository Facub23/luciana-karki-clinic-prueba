export type TreatmentDetails = {
  duration: string;
  technique: string;
  comfort: string;
  recovery: string;
  results: string;
  effectDuration: string;
  sessions: string;
  contribution: string;
  care: string;
  precautions: string;
};

export type Treatment = {
  slug: string;
  category: string;
  name: string;
  oldPrice?: string;
  price: string;
  shortDescription: string;
  salesDescription: string;
  benefits: string[];
  idealFor: string[];
  details?: Partial<TreatmentDetails>;
  image: string;
  galleryImages?: {
    src: string;
    title: string;
  }[];
};

export const treatments: Treatment[] = [
  {
    slug: "neuromoduladores",
    category: "Tratamientos Faciales",
    name: "Neuromoduladores",
    oldPrice: "340€",
    price: "299€",
    shortDescription:
      "Tratamiento para suavizar líneas de expresión y conseguir un aspecto descansado sin perder naturalidad.",
    salesDescription:
      "Los neuromoduladores ayudan a relajar zonas concretas del rostro para suavizar arrugas dinámicas y prevenir marcas futuras. La valoración previa permite adaptar el tratamiento a tu expresión facial.",
    benefits: [
      "Resultado natural y progresivo",
      "Tratamiento rápido con mínima recuperación",
      "Plan personalizado según gesticulación",
    ],
    idealFor: [
      "Frente y entrecejo",
      "Patas de gallo",
      "Pacientes que buscan prevención estética",
    ],
    details: {
      duration: "20-30 min aprox.",
      technique: "Técnica inyectable",
      comfort:
        "Molestia mínima. Se utilizan puntos precisos y una pauta pensada para una experiencia tranquila.",
      recovery: "Inmediata, con indicaciones simples durante las primeras horas.",
      results:
        "Suavización progresiva de líneas de expresión manteniendo naturalidad.",
      effectDuration: "3-5 meses según metabolismo y zona tratada",
      sessions: "1 sesión",
      contribution:
        "Ayuda a relajar gestos marcados, prevenir arrugas dinámicas y conseguir una expresión más descansada.",
      care:
        "Evitar ejercicio intenso, calor, alcohol y manipular la zona durante las primeras 24 h.",
      precautions:
        "No se indica durante embarazo, lactancia o determinadas condiciones neuromusculares. Siempre se confirma en valoración médica.",
    },
    image: "/images/tratamiento-1.jpeg",
  },
  {
    slug: "bruxismo",
    category: "Tratamientos Faciales",
    name: "Bruxismo",
    oldPrice: "340€",
    price: "299€",
    shortDescription:
      "Enfoque médico-estético para relajar la musculatura mandibular y mejorar el confort facial.",
    salesDescription:
      "El tratamiento del bruxismo se orienta a disminuir la tensión del músculo masetero y puede ayudar a estilizar la zona mandibular cuando está indicado.",
    benefits: [
      "Valoración facial y funcional",
      "Puede reducir tensión mandibular",
      "Ayuda a armonizar el tercio inferior facial",
    ],
    idealFor: [
      "Tensión mandibular",
      "Maseteros marcados",
      "Personas que aprietan la mandíbula",
    ],
    details: {
      duration: "20-30 min aprox.",
      technique: "Técnica inyectable",
      comfort:
        "Molestia mínima. Se trabaja sobre puntos musculares concretos y con una pauta bien tolerada.",
      recovery: "Inmediata, evitando presión o masaje fuerte en la zona tratada.",
      results:
        "Disminución progresiva de la tensión mandibular y mejora del confort facial.",
      effectDuration: "4-6 meses según fuerza muscular y hábitos",
      sessions: "1 sesión",
      contribution:
        "Puede ayudar a relajar el masetero, reducir la sensación de tensión y armonizar el tercio inferior facial cuando está indicado.",
      care:
        "Evitar ejercicio intenso, calor y manipulación de la mandíbula durante las primeras 24 h.",
      precautions:
        "La indicación se confirma tras valorar mordida, musculatura, antecedentes y síntomas asociados.",
    },
    image: "/images/tratamiento-2.jpeg",
  },
  {
    slug: "hiperhidrosis",
    category: "Tratamientos Faciales",
    name: "Hiperhidrosis",
    price: "590€",
    shortDescription:
      "Tratamiento para sudoración excesiva en axilas, palmas o pies con valoración individual.",
    salesDescription:
      "La hiperhidrosis puede afectar la comodidad diaria. Este tratamiento se enfoca en reducir la sudoración excesiva en zonas concretas con una pauta personalizada.",
    benefits: [
      "Aplicable en axilas, palmas o pies",
      "Consulta previa para definir zonas",
      "Orientado a mejorar comodidad diaria",
    ],
    idealFor: [
      "Sudoración axilar",
      "Sudoración palmar",
      "Sudoración en pies",
    ],
    details: {
      duration: "30-45 min aprox.",
      technique: "Técnica inyectable",
      comfort:
        "Molestia controlada. Se adapta la técnica según zona y sensibilidad.",
      recovery: "Inmediata, con cuidados locales básicos.",
      results:
        "Reducción significativa de la sudoración excesiva en las áreas tratadas",
      effectDuration: "6-9 meses según respuesta individual",
      sessions: "1 sesión",
      contribution:
        "Ayuda a mejorar la comodidad diaria y reducir la humedad excesiva en axilas, palmas o pies.",
      care:
        "Evitar ejercicio intenso, sauna, calor directo y desodorantes irritantes durante las primeras 24 h si se tratan axilas.",
      precautions:
        "Se confirma la indicación en consulta y se revisan antecedentes médicos antes del tratamiento.",
    },
    image: "/images/tratamiento-3.jpeg",
  },
  {
    slug: "peeling-despigmentante-corporal",
    category: "Tratamientos Corporales",
    name: "Peeling despigmentante corporal",
    price: "499€",
    shortDescription:
      "Tratamiento médico-estético para mejorar el tono de axilas, entrepierna y zonas íntimas con un enfoque progresivo y cuidadoso.",
    salesDescription:
      "El peeling despigmentante corporal se diseña para trabajar zonas delicadas con tendencia a hiperpigmentación, buscando una piel más uniforme, luminosa y suave. La pauta se define siempre tras valoración médica para adaptar activos, frecuencia y cuidados a la sensibilidad de cada zona.",
    benefits: [
      "Ayuda a uniformar el tono de la piel",
      "Mejora progresiva de textura y luminosidad",
      "Protocolo adaptado a zonas sensibles",
    ],
    idealFor: [
      "Oscurecimiento en axilas",
      "Entrepierna o zona íntima con tono irregular",
      "Personas que buscan una alternativa sin láser",
    ],
    details: {
      duration: "40 min aprox.",
      technique: "Peeling médico despigmentante con activos aclarantes",
      comfort: "Molestia mínima; se adapta a la sensibilidad de la zona",
      recovery: "Inmediata, con cuidados locales posteriores",
      results: "Progresivos, visibles sesión a sesión",
      effectDuration: "6-12 meses según hábitos y cuidados",
      sessions: "Plan habitual de 3 sesiones",
      contribution:
        "Aporta un tono más uniforme, mejora la suavidad y ayuda a recuperar luminosidad natural en zonas con fricción o pigmentación.",
      care:
        "Evitar sol directo, depilación y exfoliación durante las 48 h posteriores. Mantener hidratación y aplicar la pauta indicada en consulta.",
      precautions:
        "No se recomienda durante embarazo, lactancia o si existen lesiones activas en la zona. La indicación se confirma siempre en valoración médica.",
    },
    image: "/images/peeling-axilas-1.png",
    galleryImages: [
      {
        src: "/images/peeling-axilas-1.png",
        title: "Detalle de axila",
      },
      {
        src: "/images/peeling-axilas-2.png",
        title: "Tratamiento de axilas",
      },
    ],
  },
  {
    slug: "labios-acido-hialuronico",
    category: "Ácido Hialurónico",
    name: "Labios",
    oldPrice: "300€",
    price: "225€",
    shortDescription:
      "Perfilado e hidratación labial con ácido hialurónico para un resultado elegante y proporcionado.",
    salesDescription:
      "El tratamiento de labios busca mejorar forma, hidratación y volumen respetando la anatomía de cada paciente. La prioridad es un resultado armónico, no exagerado.",
    benefits: [
      "Diseño adaptado a tu rostro",
      "Hidratación y definición",
      "Resultado equilibrado y femenino",
    ],
    idealFor: [
      "Labios deshidratados",
      "Asimetrías leves",
      "Perfilado natural",
    ],
    details: {
      duration: "30-45 min aprox.",
      technique: "Técnica inyectable",
      comfort:
        "Se trabaja con anestesia local y con una pauta pensada para que la experiencia sea tranquila.",
      sessions: "1 sesión",
      recovery: "Habitualmente rápida, con posible inflamación inicial.",
      results:
        "Hidratación, definición o volumen progresivo según el diseño acordado.",
      effectDuration: "6-12 meses según producto, metabolismo y hábitos",
      contribution:
        "Mejora la forma, hidratación y proporción labial respetando la anatomía natural.",
      care:
        "Evitar calor, ejercicio intenso, maquillaje labial y presión sobre la zona durante las primeras 24-48 h.",
      precautions:
        "No se realiza con infección activa, herpes sin controlar o contraindicaciones médicas relevantes.",
    },
    image: "/images/tratamiento-1.jpeg",
  },
  {
    slug: "rinomodelacion",
    category: "Ácido Hialurónico",
    name: "Rinomodelación",
    oldPrice: "400€",
    price: "325€",
    shortDescription:
      "Armonización nasal sin cirugía en casos seleccionados, con valoración médica previa.",
    salesDescription:
      "La rinomodelación con ácido hialurónico permite mejorar puntos concretos del perfil nasal sin intervención quirúrgica cuando el caso es adecuado.",
    benefits: [
      "Sin cirugía",
      "Mejora del perfil nasal",
      "Valoración de seguridad antes de tratar",
    ],
    idealFor: [
      "Perfil nasal irregular",
      "Elevación sutil de punta",
      "Armonización facial",
    ],
    details: {
      duration: "30-45 min aprox.",
      technique: "Técnica inyectable",
      comfort:
        "Molestia controlada. Se trabaja con precisión y valoración de seguridad previa.",
      recovery: "Inmediata, con cuidados para evitar presión sobre la nariz.",
      results:
        "Mejora del perfil nasal en casos seleccionados, sin cirugía.",
      effectDuration: "9-12 meses según producto y metabolismo",
      sessions: "1 sesión",
      contribution:
        "Ayuda a corregir puntos concretos del perfil nasal y mejorar la armonía facial sin intervención quirúrgica.",
      care:
        "Evitar gafas pesadas, presión, calor intenso y ejercicio fuerte durante las primeras 24-48 h.",
      precautions:
        "Requiere valoración médica cuidadosa por tratarse de una zona vascularmente delicada.",
    },
    image: "/images/tratamiento-2.jpeg",
  },
  {
    slug: "rinolips",
    category: "Ácido Hialurónico",
    name: "Rinolips",
    price: "Desde 275€",
    shortDescription:
      "Combinación estética para armonizar nariz y labios dentro del equilibrio facial.",
    salesDescription:
      "Rinolips combina una visión integral de nariz y labios para mejorar la proporción del rostro con un plan adaptado a tus rasgos.",
    benefits: [
      "Enfoque facial integral",
      "Plan personalizado",
      "Mejora de proporciones visibles",
    ],
    idealFor: [
      "Armonización de perfil",
      "Nariz y labios en la misma valoración",
      "Resultados naturales",
    ],
    details: {
      duration: "45-60 min aprox.",
      technique: "Técnica inyectable combinada",
      comfort:
        "Se adapta la pauta a nariz y labios para trabajar con calma y precisión.",
      recovery:
        "Habitualmente rápida, con posible inflamación inicial en labios.",
      results:
        "Armonización visible de perfil, nariz y labios respetando proporciones naturales.",
      effectDuration: "6-12 meses según zona, producto y metabolismo",
      sessions: "1 sesión o plan dividido según valoración",
      contribution:
        "Permite trabajar el equilibrio entre nariz y labios en una misma estrategia facial, evitando cambios aislados o exagerados.",
      care:
        "Evitar presión, calor intenso, ejercicio fuerte y maquillaje labial durante las primeras 24-48 h.",
      precautions:
        "Se valora cada zona por separado antes de combinar el tratamiento, especialmente la seguridad nasal.",
    },
    image: "/images/tratamiento-3.jpeg",
  },
  {
    slug: "pomulos",
    category: "Ácido Hialurónico",
    name: "Proyección y armonización de pómulos",
    price: "1 vial: 325€ · 2 viales: 600€",
    shortDescription:
      "Definición y soporte del tercio medio facial para mejorar la armonía del rostro.",
    salesDescription:
      "La proyección de pómulos puede aportar soporte, frescura y estructura facial. Se diseña según tus proporciones para evitar resultados artificiales.",
    benefits: [
      "Mejora del soporte facial",
      "Efecto de rostro más descansado",
      "Diseño proporcional",
    ],
    idealFor: [
      "Pérdida de soporte",
      "Rostros que buscan definición",
      "Armonización facial",
    ],
    details: {
      duration: "30-45 min aprox.",
      technique: "Técnica inyectable con ácido hialurónico",
      comfort:
        "Molestia controlada. Se trabaja con puntos de soporte definidos según anatomía.",
      recovery:
        "Habitualmente inmediata, con posible sensibilidad o inflamación leve.",
      results:
        "Mayor soporte del tercio medio y efecto de rostro más definido o descansado.",
      effectDuration: "9-12 meses según producto, metabolismo y hábitos",
      sessions: "1 sesión",
      contribution:
        "Aporta estructura y soporte facial, ayudando a mejorar proporciones sin perder naturalidad.",
      care:
        "Evitar presión, masaje, calor intenso y ejercicio fuerte durante las primeras 24-48 h.",
      precautions:
        "La cantidad y plano de aplicación se definen tras valorar proporciones, soporte y calidad de piel.",
    },
    image: "/images/tratamiento-1.jpeg",
  },
  {
    slug: "menton",
    category: "Ácido Hialurónico",
    name: "Proyección de mentón",
    price: "300€",
    shortDescription:
      "Tratamiento para equilibrar el perfil y mejorar la proporción del tercio inferior facial.",
    salesDescription:
      "La proyección de mentón ayuda a mejorar el equilibrio del perfil facial, especialmente cuando se busca una armonización sutil del tercio inferior.",
    benefits: [
      "Mejora del perfil",
      "Proporción facial más equilibrada",
      "Resultado adaptado a tu anatomía",
    ],
    idealFor: [
      "Mentón retraído",
      "Perfil poco definido",
      "Armonización facial",
    ],
    details: {
      duration: "30 min aprox.",
      technique: "Técnica inyectable con ácido hialurónico",
      comfort:
        "Molestia mínima o moderada. Se trabaja de forma progresiva y controlada.",
      recovery:
        "Inmediata, con posible sensibilidad local durante las primeras horas.",
      results:
        "Perfil más equilibrado y tercio inferior facial mejor proporcionado.",
      effectDuration: "9-12 meses según producto y metabolismo",
      sessions: "1 sesión",
      contribution:
        "Ayuda a proyectar el mentón y equilibrar el perfil facial respetando la anatomía de cada paciente.",
      care:
        "Evitar presión sobre el mentón, ejercicio intenso y calor directo durante las primeras 24-48 h.",
      precautions:
        "Se revisa mordida, proporción facial y objetivo estético antes de indicar el tratamiento.",
    },
    image: "/images/tratamiento-2.jpeg",
  },
  {
    slug: "sculptra-facial",
    category: "Bioestimuladores",
    name: "Sculptra Facial",
    price: "1 vial: 500€ · 2 viales: 899€",
    shortDescription:
      "Bioestimulación facial para mejorar calidad de piel, firmeza y soporte de forma progresiva.",
    salesDescription:
      "Sculptra estimula la producción de colágeno para conseguir una mejora gradual de firmeza y calidad de piel. Es una opción para quienes buscan resultados progresivos y naturales.",
    benefits: [
      "Estimulación de colágeno",
      "Mejora gradual",
      "Enfoque natural",
    ],
    idealFor: [
      "Flacidez facial",
      "Pérdida de firmeza",
      "Mejora de calidad de piel",
    ],
    details: {
      duration: "45-60 min aprox.",
      technique: "Bioestimulación inyectable con Sculptra",
      comfort:
        "Molestia controlada. Se puede adaptar la preparación para una experiencia más cómoda.",
      recovery:
        "Rápida, con posible inflamación leve o sensibilidad temporal.",
      results:
        "Mejora progresiva de firmeza, textura y calidad de piel.",
      effectDuration: "Hasta 18-24 meses según respuesta individual",
      sessions: "Plan de 1 a 3 sesiones según valoración",
      contribution:
        "Estimula colágeno de forma gradual para mejorar soporte y calidad cutánea sin efecto artificial inmediato.",
      care:
        "Seguir la pauta de masaje indicada, evitar calor intenso y ejercicio fuerte durante las primeras 24-48 h.",
      precautions:
        "La indicación depende de flacidez, calidad de piel, antecedentes y expectativas de mejora progresiva.",
    },
    image: "/images/tratamiento-3.jpeg",
  },
  {
    slug: "sculptra-gluteos",
    category: "Bioestimuladores",
    name: "Sculptra Glúteos",
    price: "1 vial: 500€ · 2 viales: 899€",
    shortDescription:
      "Bioestimulación corporal para mejorar firmeza y calidad de piel en zona glútea.",
    salesDescription:
      "Sculptra corporal se orienta a estimular colágeno y mejorar la apariencia de la zona tratada de forma progresiva.",
    benefits: [
      "Mejora progresiva de firmeza",
      "Tratamiento corporal personalizado",
      "Valoración previa de objetivos",
    ],
    idealFor: [
      "Flacidez leve o moderada",
      "Mejora de textura",
      "Plan corporal progresivo",
    ],
    details: {
      duration: "45-60 min aprox.",
      technique: "Bioestimulación corporal con Sculptra",
      comfort:
        "Molestia controlada. Se trabaja por zonas y con planificación personalizada.",
      recovery:
        "Rápida, con posible sensibilidad o inflamación leve en la zona tratada.",
      results:
        "Mejora gradual de firmeza, textura y calidad de piel glútea.",
      effectDuration: "Hasta 18-24 meses según respuesta individual",
      sessions: "Plan progresivo según valoración",
      contribution:
        "Ayuda a estimular colágeno y mejorar la apariencia de la piel glútea de forma progresiva.",
      care:
        "Seguir pauta de masaje si se indica, evitar ejercicio intenso y calor directo durante las primeras 24-48 h.",
      precautions:
        "Se valora flacidez, calidad de piel, volumen disponible y expectativas antes de definir el plan.",
    },
    image: "/images/tratamiento-1.jpeg",
  },
  {
    slug: "sculptra-abdomen",
    category: "Bioestimuladores",
    name: "Sculptra Abdomen",
    price: "1 vial: 500€ · 2 viales: 899€",
    shortDescription:
      "Tratamiento bioestimulador para mejorar firmeza y calidad de piel abdominal.",
    salesDescription:
      "Sculptra abdomen se diseña para estimular colágeno y trabajar la firmeza de la piel en función de la valoración médica.",
    benefits: [
      "Estimulación de colágeno",
      "Plan adaptado a la zona",
      "Mejora gradual de calidad de piel",
    ],
    idealFor: [
      "Piel con pérdida de firmeza",
      "Mejora de textura abdominal",
      "Tratamientos corporales personalizados",
    ],
    details: {
      duration: "45-60 min aprox.",
      technique: "Bioestimulación corporal con Sculptra",
      comfort:
        "Molestia controlada. Se adapta la pauta a la sensibilidad y extensión de la zona.",
      recovery:
        "Rápida, con indicaciones específicas para las primeras horas.",
      results:
        "Mejora progresiva de firmeza y calidad de piel abdominal.",
      effectDuration: "Hasta 18-24 meses según respuesta individual",
      sessions: "Plan progresivo según valoración",
      contribution:
        "Estimula colágeno para trabajar firmeza y textura abdominal con un enfoque gradual.",
      care:
        "Evitar calor intenso, ejercicio fuerte y manipulación excesiva durante las primeras 24-48 h.",
      precautions:
        "Se revisa calidad de piel, flacidez, antecedentes y objetivos antes de indicar el tratamiento.",
    },
    image: "/images/tratamiento-2.jpeg",
  },
];

export const treatmentCategories = Array.from(
  new Set(treatments.map((treatment) => treatment.category)),
);

const treatmentSlugAliases: Record<string, string> = {
  labios: "labios-acido-hialuronico",
};

export function getTreatmentBySlug(slug: string) {
  const normalizedSlug = treatmentSlugAliases[slug] ?? slug;

  return treatments.find((treatment) => treatment.slug === normalizedSlug);
}

export function getTreatmentsByCategory(category: string) {
  return treatments.filter((treatment) => treatment.category === category);
}
