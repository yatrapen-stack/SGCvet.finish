/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Search, 
  User as UserIcon, 
  Plus, 
  Clock, 
  Stethoscope, 
  ChevronDown, 
  ChevronUp, 
  HeartHandshake, 
  AlertOctagon, 
  ShieldAlert, 
  Phone, 
  Calendar, 
  Sparkles,
  FileSpreadsheet,
  Activity,
  Award
} from 'lucide-react';
import { Pet, ClinicalRecord } from '../types';

interface RecordsViewProps {
  pets: Pet[];
  onAddClinicalRecord: (petId: string, record: ClinicalRecord) => void;
}

export default function RecordsView({ pets, onAddClinicalRecord }: RecordsViewProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPetId, setSelectedPetId] = useState<string>(pets[0]?.id || '');

  // Form states for simulating new medical attentions
  const [showAddForm, setShowAddForm] = useState(false);
  const [formType, setFormType] = useState<'Consulta Médica' | 'Cirugía' | 'Control'>('Consulta Médica');
  const [formVet, setFormVet] = useState('Dra. Camila Fuentes');
  const [formReason, setFormReason] = useState('');
  const [formDiagnosis, setFormDiagnosis] = useState('');
  const [formTreatment, setFormTreatment] = useState('');
  const [formNotes, setFormNotes] = useState('');

  // Track expanded clinical record indices (e.g., "date-index")
  const [expandedCards, setExpandedCards] = useState<Record<string, boolean>>({
    '0': true // expand the most recent one by default
  });

  const toggleCard = (indexKey: string) => {
    setExpandedCards(prev => ({
      ...prev,
      [indexKey]: !prev[indexKey]
    }));
  };

  // Filter pets by name or rutDni
  const filteredPets = pets.filter(pet => {
    const searchLower = searchTerm.toLowerCase();
    const nameMatch = pet.name.toLowerCase().includes(searchLower);
    const rutMatch = pet.rutDni?.toLowerCase().includes(searchLower) || false;
    const breedMatch = pet.breed.toLowerCase().includes(searchLower);
    return nameMatch || rutMatch || breedMatch;
  });

  // Target pet record
  const selectedPet = pets.find(pet => pet.id === selectedPetId) || pets[0];

  const handleSubmitRecord = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPet) return;

    if (!formReason.trim() || !formDiagnosis.trim() || !formTreatment.trim() || !formNotes.trim()) {
      alert('Por favor complete todos los campos mandatorios de la ficha clínica.');
      return;
    }

    const newRecord: ClinicalRecord = {
      date: new Date().toISOString().split('T')[0],
      time: new Date().toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' }),
      type: formType,
      veterinarian: formVet,
      reason: formReason,
      diagnosis: formDiagnosis,
      treatment: formTreatment,
      notes: formNotes
    };

    onAddClinicalRecord(selectedPet.id, newRecord);

    // Reset Form
    setFormReason('');
    setFormDiagnosis('');
    setFormTreatment('');
    setFormNotes('');
    setShowAddForm(false);

    // Dynamic toast simulation / notice
    alert(`¡Ficha de atención registrada con éxito para ${selectedPet.name}!`);
    
    // Automatically open the newly added first record
    setExpandedCards(prev => ({ ...prev, '0': true }));
  };

  // Get service icons based on type
  const getServiceIcon = (type?: string) => {
    switch (type) {
      case 'Cirugía':
        return <Activity className="w-4 h-4 text-red-600" />;
      case 'Control':
        return <Award className="w-4 h-4 text-emerald-600" />;
      default:
        return <Stethoscope className="w-4 h-4 text-blue-600" />;
    }
  };

  const getServiceBadgeColor = (type?: string) => {
    switch (type) {
      case 'Cirugía':
        return 'bg-red-50 text-red-700 border-red-200';
      case 'Control':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      default:
        return 'bg-blue-50 text-blue-700 border-blue-200';
    }
  };

  return (
    <div className="space-y-8 animate-fade-in text-left">
      
      {/* View Title */}
      <div className="border-b border-[#c4c8bc]/30 pb-5">
        <h2 className="font-headline text-3xl font-bold text-[#2e3230] flex items-center gap-3">
          <FileSpreadsheet className="w-8 h-8 text-[#4a7c59]" />
          <span>Fichas Médicas de Pacientes</span>
        </h2>
        <p className="text-sm text-[#4a4e4a] mt-1.5 font-medium leading-relaxed">
          Buscador interactivo del expediente clínico integrado SGC. Filtre por mascota o identifique mediante RUT/DNI para consultar historiales de vacunas, diagnósticos, recetas y cirugías en tiempo real.
        </p>
      </div>

      {/* Main Grid: Search Column & Main Detail Column */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Hand: Search & Select Sidebar Panel (span 4) */}
        <div className="lg:col-span-4 space-y-4">
          
          <div className="bg-[#faf6f0] border border-[#c4c8bc]/40 rounded-2xl p-4 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-[#2e3230] uppercase tracking-wider flex items-center gap-1.5">
              <Search className="w-4 h-4 text-[#4a7c59]" />
              <span>Buscador SGC</span>
            </h3>

            {/* Input Searcher */}
            <div className="relative">
              <input
                type="text"
                placeholder="Nombre, raza o RUT/DNI..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-[#f0ece4] border border-[#c4c8bc]/60 rounded-xl py-2.5 pl-9 pr-4 text-xs font-medium text-[#2e3230] placeholder-[#a8aaa4] focus:outline-none focus:ring-1 focus:ring-[#4a7c59]"
              />
              <Search className="absolute left-3 top-3 w-4 h-4 text-[#4a4e4a]/60" />
            </div>

            {/* Patients list filtered */}
            <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
              {filteredPets.length > 0 ? (
                filteredPets.map(pet => {
                  const isActive = pet.id === selectedPetId;
                  return (
                    <button
                      key={pet.id}
                      onClick={() => {
                        setSelectedPetId(pet.id);
                        setExpandedCards({ '0': true }); // Auto-expand first item
                      }}
                      className={`w-full text-left p-3 rounded-xl border flex items-center gap-3 transition-all cursor-pointer ${
                        isActive 
                          ? 'bg-[#78a886]/15 border-[#78a886] shadow-sm' 
                          : 'bg-[#faf6f0] hover:bg-[#f0ece4]/60 border-[#c4c8bc]/25'
                      }`}
                    >
                      <img
                        src={pet.image}
                        alt={pet.name}
                        className={`w-11 h-11 rounded-full object-cover border-2 shrink-0 ${
                          isActive ? 'border-[#4a7c59]' : 'border-transparent'
                        }`}
                        referrerPolicy="no-referrer"
                      />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="font-bold text-xs text-[#2e3230] truncate">{pet.name}</h4>
                          <span className="text-[10px] bg-[#f0ece4] px-1.5 py-0.5 rounded font-bold text-[#4a4e4a]">
                            {pet.species}
                          </span>
                        </div>
                        <p className="text-[10px] text-[#4a4e4a] truncate font-medium mt-0.5">
                          {pet.breed} • {pet.age}
                        </p>
                        {pet.rutDni && (
                          <p className="text-[9px] font-mono text-[#a8aaa4] mt-0.5 truncate">
                            RUT: {pet.rutDni}
                          </p>
                        )}
                      </div>
                    </button>
                  );
                })
              ) : (
                <div className="text-center py-6 text-xs text-[#a8aaa4] font-medium border border-dashed border-[#c4c8bc]/30 rounded-xl">
                  No se encontraron coincidencias.
                </div>
              )}
            </div>

            {/* Help guidelines */}
            <div className="border-t border-[#c4c8bc]/20 pt-3 text-[10px] text-[#4a4e4a]/80 leading-normal">
              💡 <strong>Integración en vivo:</strong> Agrega pacientes desde "Mis Mascotas" o "Agendar Cita". Se indexan inmediatamente en el buscador.
            </div>

          </div>

        </div>

        {/* Right Hand: Detailed Patient File & Medical Timeline (span 8) */}
        <div className="lg:col-span-8 space-y-6">
          
          {selectedPet ? (
            <div className="space-y-6">
              
              {/* Profile Card component */}
              <div className="bg-[#faf6f0] border border-[#c4c8bc]/40 rounded-2xl p-6 shadow-sm overflow-hidden relative">
                
                {/* Visual accent top line */}
                <div className="absolute top-0 left-0 right-0 h-1.5 bg-[#4a7c59]" />

                <div className="flex flex-col sm:flex-row gap-5 items-start sm:items-center justify-between pb-5 border-b border-[#c4c8bc]/25">
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <img
                        src={selectedPet.image}
                        alt={selectedPet.name}
                        className="w-16 h-16 rounded-full object-cover border-4 border-[#faf6f0] ring-2 ring-[#4a7c59]"
                        referrerPolicy="no-referrer"
                      />
                      <span className="absolute bottom-1 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-[#faf6f0]" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-headline text-2xl font-bold text-[#2e3230]">{selectedPet.name}</h3>
                        <span className="px-2.5 py-0.5 text-[10.5px] font-bold rounded-full bg-[#4a7c59]/10 text-[#4a7c59]">
                          ID: {selectedPet.id}
                        </span>
                      </div>
                      <p className="text-xs text-[#4a4e4a] font-semibold mt-0.5">
                        {selectedPet.species} • {selectedPet.breed} • <span className="text-[#4a7c59] font-bold">{selectedPet.age}</span>
                      </p>
                    </div>
                  </div>

                  {/* Button registrar atencion */}
                  <button
                    onClick={() => setShowAddForm(prev => !prev)}
                    className="px-4 py-2 bg-[#4a7c59] hover:bg-[#3d6749] text-white rounded-xl font-bold text-xs shadow-sm flex items-center gap-1.5 cursor-pointer transition-all shrink-0 self-stretch sm:self-auto justify-center"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>{showAddForm ? 'Cancelar' : 'Registrar Atención'}</span>
                  </button>
                </div>

                {/* Sub Metadata Grid with requested records data */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-y-4 gap-x-6 pt-5 text-xs text-[#4a4e4a]">
                  
                  <div className="space-y-1">
                    <p className="text-[10px] text-[#2e3230]/60 font-bold uppercase tracking-wider">Documento RUT / DNI</p>
                    <p className="font-mono font-bold text-[#2e3230]">{selectedPet.rutDni || '19.876.543-2'}</p>
                  </div>

                  <div className="space-y-1">
                    <p className="text-[10px] text-[#2e3230]/60 font-bold uppercase tracking-wider">Grupo Sanguíneo</p>
                    <p className="font-semibold text-red-600 flex items-center gap-1">
                      <HeartHandshake className="w-3.5 h-3.5" />
                      <span>{selectedPet.bloodGroup || 'DEA 1.1 Positivo'}</span>
                    </p>
                  </div>

                  <div className="space-y-1">
                    <p className="text-[10px] text-[#2e3230]/60 font-bold uppercase tracking-wider">Contacto Emergencia</p>
                    <p className="font-semibold text-[#2e3230] flex items-center gap-1">
                      <Phone className="w-3.5 h-3.5 text-[#4a7c59]" />
                      <span>{selectedPet.emergencyContact || '+56 9 9876 5432'}</span>
                    </p>
                  </div>

                  <div className="space-y-1 sm:col-span-2 md:col-span-1">
                    <p className="text-[10px] text-[#2e3230]/60 font-bold uppercase tracking-wider flex items-center gap-1 text-amber-700">
                      <ShieldAlert className="w-3.5 h-3.5" />
                      <span>Alergias conocidas</span>
                    </p>
                    <p className="font-medium text-[#2e3230] bg-amber-50 border border-amber-200/50 px-2 py-1 rounded">
                      {selectedPet.allergies || 'Ninguna conocida'}
                    </p>
                  </div>

                  <div className="space-y-1 sm:col-span-2 md:col-span-2">
                    <p className="text-[10px] text-[#2e3230]/60 font-bold uppercase tracking-wider flex items-center gap-1 text-red-700">
                      <AlertOctagon className="w-3.5 h-3.5" />
                      <span>Enfermedades crónicas</span>
                    </p>
                    <p className="font-medium text-[#2e3230] bg-[#b83230]/5 border border-red-200/50 px-2 py-1 rounded">
                      {selectedPet.chronicDiseases || 'Ninguna crónica diagnosticada'}
                    </p>
                  </div>

                </div>

              </div>

              {/* Simulation Addition Form drawer collapse */}
              {showAddForm && (
                <form
                  onSubmit={handleSubmitRecord}
                  className="bg-[#faf6f0] border-2 border-[#78a886] rounded-2xl p-5 shadow-md animate-fade-in space-y-4"
                >
                  <div className="flex items-center gap-2 border-b border-[#c4c8bc]/25 pb-3">
                    <Sparkles className="w-4 h-4 text-[#4a7c59]" />
                    <h4 className="font-headline font-bold text-[#2e3230] text-sm">Registrar Nueva Ficha Clínica de Atención</h4>
                  </div>

                  {/* Form fields config */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-[#4a4e4a] uppercase">Tipo de Atención *</label>
                      <select
                        value={formType}
                        onChange={(e: any) => setFormType(e.target.value)}
                        className="w-full bg-[#f0ece4] border border-[#c4c8bc]/60 rounded-xl p-2.5 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-[#4a7c59]"
                      >
                        <option value="Consulta Médica">Consulta Médica</option>
                        <option value="Cirugía">Cirugía</option>
                        <option value="Control">Control</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-[#4a4e4a] uppercase">Veterinario Tratante *</label>
                      <select
                        value={formVet}
                        onChange={(e) => setFormVet(e.target.value)}
                        className="w-full bg-[#f0ece4] border border-[#c4c8bc]/60 rounded-xl p-2.5 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-[#4a7c59]"
                      >
                        <option value="Dra. Camila Fuentes">Dra. Camila Fuentes</option>
                        <option value="Dr. Francisco Aravena">Dr. Francisco Aravena</option>
                        <option value="Vicedirector Médico vetSGC">Vicedirector Médico vetSGC</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-[#4a4e4a] uppercase">Fecha y Hora</label>
                      <input
                        type="text"
                        disabled
                        value="Hoy (Tiempo Real)"
                        className="w-full bg-[#f0ece4]/50 border border-[#c4c8bc]/40 rounded-xl p-2.5 text-xs font-bold text-[#4a4e4a]/60 cursor-not-allowed"
                      />
                    </div>

                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-[#4a4e4a] uppercase">Motivo de consulta *</label>
                    <textarea
                      placeholder="Ej. Síntomas reportados por el tutor, rascado crónico, programada anual..."
                      value={formReason}
                      onChange={(e) => setFormReason(e.target.value)}
                      rows={2}
                      className="w-full bg-[#f0ece4] border border-[#c4c8bc]/60 rounded-xl p-3 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-[#4a7c59]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-[#4a4e4a] uppercase">Diagnóstico Clínico *</label>
                    <textarea
                      placeholder="Ej. Conclusión clínica del profesional veterinario tras anamnesis..."
                      value={formDiagnosis}
                      onChange={(e) => setFormDiagnosis(e.target.value)}
                      rows={2}
                      className="w-full bg-[#f0ece4] border border-[#c4c8bc]/60 rounded-xl p-3 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-[#4a7c59]"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-[#4a4e4a] uppercase">Tratamiento / Receta Médica *</label>
                      <textarea
                        placeholder="Ej. Antiinflamatorio, dosis en ml, pastillas cada 12 hrs por 5 días..."
                        value={formTreatment}
                        onChange={(e) => setFormTreatment(e.target.value)}
                        rows={2.5}
                        className="w-full bg-[#f0ece4] border border-[#c4c8bc]/60 rounded-xl p-3 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-[#4a7c59]"
                      />
                    </div>
                    
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-[#4a4e4a] uppercase">Observaciones / Indicaciones adicionales *</label>
                      <textarea
                        placeholder="Ej. Reposo absoluto, control de heridas, cita post-op en 10 días fijos..."
                        value={formNotes}
                        onChange={(e) => setFormNotes(e.target.value)}
                        rows={2.5}
                        className="w-full bg-[#f0ece4] border border-[#c4c8bc]/60 rounded-xl p-3 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-[#4a7c59]"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 text-xs font-bold pt-2">
                    <button
                      type="button"
                      onClick={() => setShowAddForm(false)}
                      className="px-4 py-2 border border-[#c4c8bc] text-[#4a4e4a] rounded-lg hover:bg-[#ebd8b4]/10 cursor-pointer"
                    >
                      Volver
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 bg-[#4a7c59] text-white rounded-lg hover:bg-[#3d6749] cursor-pointer"
                    >
                      Guardar Ficha Médica
                    </button>
                  </div>
                </form>
              )}

              {/* TIMELINE SECTION CONTAINER (ordered chronologically) */}
              <div className="space-y-4">
                <h3 className="font-headline font-bold text-lg text-[#2e3230] flex items-center gap-2 pb-2 border-b border-[#c4c8bc]/25">
                  <Clock className="w-5 h-5 text-[#4a7c59]" />
                  <span>Línea de Tiempo del Historial Histórico</span>
                </h3>

                {selectedPet.history && selectedPet.history.length > 0 ? (
                  <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-[2px] before:bg-[#c4c8bc]/40">
                    
                    {selectedPet.history.map((record, index) => {
                      const cardId = index.toString();
                      const isOpen = expandedCards[cardId] || false;
                      const treatmentClean = record.treatment;
                      const typeVal = record.type || 'Consulta Médica';

                      return (
                        <div key={index} className="relative">
                          
                          {/* Circle Timeline Bullet icon node */}
                          <span className={`absolute -left-[23px] top-4 w-5 h-5 rounded-full border-2 bg-[#faf6f0] flex items-center justify-center z-10 shadow-sm ${
                            typeVal === 'Cirugía' ? 'border-red-500' : typeVal === 'Control' ? 'border-emerald-500' : 'border-blue-500'
                          }`}>
                            {getServiceIcon(typeVal)}
                          </span>

                          {/* Collapse Box Container wrapper */}
                          <div className={`bg-[#faf6f0] border rounded-2xl shadow-sm transition-all overflow-hidden ${
                            isOpen ? 'border-[#78a886]' : 'border-[#c4c8bc]/30 hover:bg-[#f0ece4]/30'
                          }`}>
                            
                            {/* Card top banner header (Interactive trigger click) */}
                            <button
                              type="button"
                              onClick={() => toggleCard(cardId)}
                              className="w-full p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between text-left gap-3 focus:outline-none cursor-pointer"
                            >
                              <div className="space-y-1">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <span className="text-[10px] font-bold text-[#4a4e4a] flex items-center gap-1">
                                    <Calendar className="w-3.5 h-3.5 text-[#4a7c59]" />
                                    {record.date} {record.time ? `• ${record.time} hrs` : ''}
                                  </span>
                                  
                                  <span className={`px-2 py-0.5 rounded text-[9.5px] font-bold border ${getServiceBadgeColor(typeVal)}`}>
                                    {typeVal}
                                  </span>
                                </div>
                                <h4 className="font-bold text-sm text-[#2e3230] leading-snug line-clamp-1">
                                  Motivo: <span className="font-medium text-[#4a4e4a]">{record.reason}</span>
                                </h4>
                              </div>

                              <div className="flex items-center gap-3 self-stretch sm:self-auto justify-between border-t sm:border-t-0 border-[#c4c8bc]/20 pt-2 sm:pt-0">
                                <span className="text-xs font-semibold text-[#4a4e4a]/90 flex items-center gap-1 font-sans">
                                  <UserIcon className="w-3.5 h-3.5 text-[#4a7c59]" />
                                  {record.veterinarian}
                                </span>
                                {isOpen ? (
                                  <ChevronUp className="w-4 h-4 text-[#4a4e4a]" />
                                ) : (
                                  <ChevronDown className="w-4 h-4 text-[#4a4e4a]" />
                                )}
                              </div>
                            </button>

                            {/* Card Expanded Detail Panels */}
                            {isOpen && (
                              <div className="p-5 bg-white/70 border-t border-[#c4c8bc]/20 space-y-4 text-xs leading-relaxed text-[#4a4e4a] animate-fade-in">
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  
                                  {/* Motivo de Consulta */}
                                  <div className="space-y-1 bg-[#faf6f0]/55 p-3.5 rounded-xl border border-[#c4c8bc]/10">
                                    <h5 className="font-bold text-[10.5px] text-[#2e3230] uppercase tracking-wider">
                                      Motivo de Consulta / Síntomas
                                    </h5>
                                    <p className="font-medium text-[#4a4e4a] leading-normal">{record.reason}</p>
                                  </div>

                                  {/* Diagnóstico conclusion */}
                                  <div className="space-y-1 bg-[#faf6f0]/55 p-3.5 rounded-xl border border-[#c4c8bc]/10">
                                    <h5 className="font-bold text-[10.5px] text-red-700 uppercase tracking-wider flex items-center gap-1">
                                      <Stethoscope className="w-3.5 h-3.5" />
                                      <span>Diagnóstico Clínico</span>
                                    </h5>
                                    <p className="font-semibold text-[#2e3230] leading-normal">
                                      {record.diagnosis || 'Esquema general o diagnóstico clínico sano de control preventivo.'}
                                    </p>
                                  </div>

                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  
                                  {/* Tratamiento / Receta médica */}
                                  <div className="space-y-1.5 bg-emerald-50/20 p-4 rounded-xl border border-emerald-100/50">
                                    <h5 className="font-bold text-[10.5px] text-[#4a7c59] uppercase tracking-wider flex items-center gap-1">
                                      <HeartHandshake className="w-3.5 h-3.5" />
                                      <span>Tratamiento / Receta Prescrita</span>
                                    </h5>
                                    <p className="font-bold text-[#2e3230] leading-normal bg-[#faf6f0] p-2.5 rounded border border-[#c4c8bc]/15">
                                      {record.treatment}
                                    </p>
                                  </div>

                                  {/* Observaciones / Indicaciones */}
                                  <div className="space-y-1.5 bg-[#faf6f0]/55 p-4 rounded-xl border border-[#c4c8bc]/10">
                                    <h5 className="font-bold text-[10.5px] text-[#2e3230]/80 uppercase tracking-wider">
                                      Observaciones & Próximas Indicaciones
                                    </h5>
                                    <p className="text-xs text-[#4a4e4a]/90 whitespace-pre-line leading-normal">
                                      {record.notes}
                                    </p>
                                  </div>

                                </div>

                                {/* Operator verification audit stamps */}
                                <div className="pt-2 text-[9px] font-mono text-[#a8aaa4] text-right flex items-center justify-end gap-1 border-t border-dashed border-[#c4c8bc]/20">
                                  <span>REGISTRADO POR SGC MEDICAL SYSTEM • OK SECURE VERIFIED</span>
                                </div>

                              </div>
                            )}

                          </div>

                        </div>
                      );
                    })}

                  </div>
                ) : (
                  <div className="bg-[#faf6f0]/50 border-2 border-dashed border-[#c4c8bc]/30 rounded-2xl p-10 text-center text-xs text-[#4a4e4a]">
                    <FileSpreadsheet className="w-9 h-9 text-[#c4c8bc]/60 mx-auto mb-2" />
                    <p className="font-bold text-[#2e3230]">Ficha de paciente vacía</p>
                    <p className="text-[#a8aaa4]/90 mt-1 max-w-sm mx-auto">
                      Esta mascota no posee registros de atención médica histórica en nuestra base de datos SGC todavía.
                    </p>
                    <button
                      type="button"
                      onClick={() => setShowAddForm(true)}
                      className="mt-4 px-4 py-1.5 bg-[#4a7c59] text-white rounded-lg font-bold hover:bg-[#3d6749] text-[10px]"
                    >
                      Añadir Primera Atención
                    </button>
                  </div>
                )}

              </div>

            </div>
          ) : (
            <div className="bg-[#faf6f0]/60 border border-dashed border-[#c4c8bc]/40 rounded-2xl p-12 text-center text-sm text-[#4a4e4a]">
              Por favor seleccione una mascota para visualizar.
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
