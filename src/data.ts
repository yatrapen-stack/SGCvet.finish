/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Pet, Product, Service } from './types';

export const INITIAL_PETS: Pet[] = [
  {
    id: 'luna',
    name: 'Luna',
    species: 'Perro',
    breed: 'Golden Retriever',
    age: '3 años',
    image: 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&q=80&w=300',
    rutDni: '19.876.543-2',
    bloodGroup: 'DEA 1.1 Positivo',
    allergies: 'Sensibilidad alimentaria a la carne de pollo',
    chronicDiseases: 'Displasia leve de cadera izquierda (en tratamiento preventivo)',
    emergencyContact: '+56 9 9876 5432 (Juan Pablo)',
    history: [
      {
        date: '2026-03-10',
        time: '11:30',
        type: 'Control',
        reason: 'Vacunación Semestral & Control de Rutina del año',
        veterinarian: 'Dra. Camila Fuentes',
        diagnosis: 'Paciente sana, esquema de vacunación al día con evolución de peso favorable.',
        treatment: 'Vacuna óctuple y desparasitante interno (Milbemycina)',
        notes: 'Luna se encuentra en óptimas condiciones físicas. Peso actual: 28.5 kg. Se recomienda continuar con dieta habitual y paseos controlados para cuidar su cadera.'
      },
      {
        date: '2025-09-15',
        time: '09:15',
        type: 'Consulta Médica',
        reason: 'Consulta General - Control de Peso e Inflamación articular',
        veterinarian: 'Dr. Francisco Aravena',
        diagnosis: 'Leve sobrepeso (30.0 kg) con dolor moderado a la palpación de cadera.',
        treatment: 'Ajuste de dosis alimentaria ración diaria y suplementación con condroprotectores.',
        notes: 'Buen pelaje y dentadura limpia. Se programó dieta de reducción calórica. Receta de condroprotector por 3 meses.'
      }
    ]
  },
  {
    id: 'simba',
    name: 'Simba',
    species: 'Gato',
    breed: 'Gato Persa',
    age: '5 años',
    image: 'https://images.unsplash.com/photo-1618826411640-d6df44dd3f7a?auto=format&fit=crop&q=80&w=300',
    rutDni: '15.432.987-6',
    bloodGroup: 'Tipo A',
    allergies: 'Ninguna conocida',
    chronicDiseases: 'Ninguna conocida',
    emergencyContact: '+56 9 8765 4321 (Sofía Castro)',
    history: [
      {
        date: '2026-04-02',
        time: '15:00',
        type: 'Cirugía',
        reason: 'Limpieza dental por sarro severo',
        veterinarian: 'Dr. Francisco Aravena',
        diagnosis: 'Periodontitis moderada grado II con acumulación severa de placas de sarro.',
        treatment: 'Profilaxis dental ultrasónica profunda bajo anestesia general inhalatoria.',
        notes: 'Remoción de sarro exitosa sin necesidad de extracciones dentales. Encías algo inflamadas y sensibles, se receta gel de clorhexidina dos veces al día por una semana.'
      }
    ]
  },
  {
    id: 'oliver',
    name: 'Oliver',
    species: 'Perro',
    breed: 'Beagle',
    age: '4 años',
    image: 'https://images.unsplash.com/photo-1505628346881-b72b27e84530?auto=format&fit=crop&q=80&w=300',
    rutDni: '22.345.678-9',
    bloodGroup: 'DEA 1.2 Negativo',
    allergies: 'Picadura de pulgas (Dermatitis Alérgica DAPP)',
    chronicDiseases: 'Ninguna conocida',
    emergencyContact: '+56 9 7654 3210 (Matías Lagos)',
    history: [
      {
        date: '2026-05-20',
        time: '10:00',
        type: 'Consulta Médica',
        reason: 'Otitis bilateral, rascado frecuente de orejas',
        veterinarian: 'Dra. Camila Fuentes',
        diagnosis: 'Otitis externa aguda de carácter fúngico en ambos canales auditivos.',
        treatment: 'Limpieza ótica clínica profunda externa + gotas de Gentamicina/Ketoconazol cada 12 hrs por 10 días.',
        notes: 'Canal auditivo inflamado por retención de humedad. Se prohíbe mojar las orejas en el baño. Control agendado en 7 días para verificar efectividad.'
      }
    ]
  },
  {
    id: 'misty',
    name: 'Misty',
    species: 'Gato',
    breed: 'Maine Coon',
    age: '2 años',
    image: 'https://images.unsplash.com/photo-1533738363-b7f9aef128ce?auto=format&fit=crop&q=80&w=300',
    rutDni: '18.543.210-4',
    bloodGroup: 'Tipo B',
    allergies: 'Penicilina y derivados (reacción alérgica cutánea)',
    chronicDiseases: 'Ninguna conocida',
    emergencyContact: '+56 9 6543 2109 (Catalina Valenzuela)',
    history: [
      {
        date: '2026-01-18',
        time: '08:30',
        type: 'Cirugía',
        reason: 'Esterilización programada de la mascota',
        veterinarian: 'Dr. Francisco Aravena',
        diagnosis: 'Madurez reproductiva alcanzada, apta para procedimiento quirúrgico preventivo.',
        treatment: 'Ovariohisterectomía estándar programada con sutura intradérmica absorbible.',
        notes: 'Procedimiento exitoso sin complicaciones post-operatorias. Se retiran analgésicos orales en casa. Control de suturas y retiro a los 10 días normales.'
      }
    ]
  }
];

export const SERVICES: Service[] = [
  {
    id: 'consulta',
    name: 'Consulta General',
    price: '$45',
    description: 'Revisión general exhaustiva, vacunas o chequeos clínicos rutinarios.'
  },
  {
    id: 'cirugia',
    name: 'Cirugía',
    price: 'Desde $150',
    description: 'Procedimientos quirúrgicos programados y esterilizaciones seguras.'
  },
  {
    id: 'dental',
    name: 'Profilaxis Dental',
    price: '$85',
    description: 'Limpieza dental profunda ultrasónica y pulido protector para encías sanas.'
  }
];

export const PRODUCTS: Product[] = [
  {
    id: 'p1',
    name: 'Alimento Premium Canino',
    price: 45.00,
    description: 'Nutrición balanceada con ingredientes 100% orgánicos para perros adultos de todas las razas.',
    image: '/src/assets/images/dog_food_premium_1782184112054.jpg',
    recommended: true,
    inStock: true,
    stockUnits: 15,
    category: 'Comida'
  },
  {
    id: 'p2',
    name: 'Pack Juguetes Interactivos',
    price: 22.50,
    originalPrice: 22.50,
    description: 'Set de 3 juguetes de caucho natural diseñados para estimular la mente y la agilidad de tu mascota.',
    image: '/src/assets/images/dog_chew_toys_1782184124211.jpg',
    outOfStock: true,
    inStock: false,
    stockUnits: 0,
    category: 'Juguetes'
  },
  {
    id: 'p3',
    name: 'Shampoo Orgánico Aloe',
    price: 18.90,
    description: 'Fórmula hipoalergénica con extracto natural de aloe vera y lavanda ideal para pieles muy sensibles.',
    image: '/src/assets/images/pet_shampoo_aloe_1782184136137.jpg',
    inStock: true,
    stockUnits: 2,
    category: 'Higiene'
  },
  {
    id: 'p4',
    name: 'Alimento Gatos Grain-Free',
    price: 38.00,
    description: 'Proteína de alta calidad libre de cereales para una absorción nutricional y digestión óptimas.',
    image: '/src/assets/images/cat_food_premium_1782184149341.jpg',
    inStock: true,
    stockUnits: 1,
    category: 'Comida'
  },
  {
    id: 'p5',
    name: 'Correa de Cuero Artesanal',
    price: 29.50,
    description: 'Resistente, elegante y duradera. Fabricada a mano con cuero curtido vegetal y firmes herrajes de latón.',
    image: '/src/assets/images/leather_dog_leash_1782184159110.jpg',
    inStock: true,
    stockUnits: 3,
    category: 'Accesorios'
  },
  {
    id: 'p6',
    name: 'Cama Ortopédica "Cloud"',
    price: 65.00,
    description: 'Espuma viscoelástica premium de alta densidad, idónea para el confort y salud articular de tus mascotas.',
    image: '/src/assets/images/orthopedic_pet_bed_1782184171089.jpg',
    inStock: true,
    stockUnits: 8,
    category: 'Accesorios'
  }
];

export const INITIAL_APPOINTMENTS = [
  {
    id: 'ap1',
    petName: 'Oliver',
    serviceName: 'Chequeo Anual',
    date: 'Oct 24',
    time: '10:30 AM',
    price: '$45',
    status: 'pending' as const
  },
  {
    id: 'ap2',
    petName: 'Misty',
    serviceName: 'Vacunación',
    date: 'Nov 02',
    time: '04:15 PM',
    price: '$35',
    status: 'pending' as const
  }
];
