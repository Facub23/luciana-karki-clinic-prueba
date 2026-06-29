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
  image: string;
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
    image: "/images/tratamiento-3.jpeg",
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
    image: "/images/tratamiento-2.jpeg",
  },
];

export const treatmentCategories = Array.from(
  new Set(treatments.map((treatment) => treatment.category)),
);

export function getTreatmentBySlug(slug: string) {
  return treatments.find((treatment) => treatment.slug === slug);
}

export function getTreatmentsByCategory(category: string) {
  return treatments.filter((treatment) => treatment.category === category);
}
