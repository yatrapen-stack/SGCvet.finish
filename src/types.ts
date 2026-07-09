/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface ClinicalRecord {
  date: string;
  time?: string;
  type?: 'Consulta Médica' | 'Cirugía' | 'Control' | string;
  veterinarian: string;
  reason: string; // Motivo de consulta
  diagnosis?: string; // Diagnóstico
  treatment: string; // Tratamiento / Receta Médica
  notes: string; // Observaciones / Indicaciones
}

export interface Pet {
  id: string;
  name: string;
  species: 'Perro' | 'Gato' | 'Exótico';
  breed: string;
  age: string;
  image: string;
  rutDni?: string; // RUT/DNI para buscar
  bloodGroup?: string; // Grupo Sanguíneo
  allergies?: string; // Alergias conocidas
  chronicDiseases?: string; // Enfermedades crónicas
  emergencyContact?: string; // Contacto de emergencia
  history: ClinicalRecord[];
}

export interface Service {
  id: string;
  name: string;
  price: string;
  description: string;
}

export interface Appointment {
  id: string;
  petName: string;
  serviceName: string;
  date: string;
  time: string;
  price: string;
  status: 'pending' | 'confirmed' | 'canceled';
}

export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  description: string;
  image: string;
  recommended?: boolean;
  outOfStock?: boolean;
  inStock?: boolean;
  stockUnits?: number;
  category: 'Comida' | 'Juguetes' | 'Higiene' | 'Accesorios';
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface User {
  email: string;
  name: string;
  avatar: string;
  isLoggedIn: boolean;
  role?: 'user' | 'admin';
}

export type View = 'home' | 'booking' | 'catalog' | 'dashboard' | 'signin' | 'records' | 'admin' | 'logs';
