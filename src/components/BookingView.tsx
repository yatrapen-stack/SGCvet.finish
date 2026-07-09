/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Check, 
  ArrowLeft, 
  ArrowRight, 
  PlusCircle, 
  Calendar as CalendarIcon, 
  Clock, 
  Info,
  CheckCircle2,
  AlertTriangle,
  Download
} from 'lucide-react';
import { Pet, Service, Appointment } from '../types';
import { SERVICES } from '../data';

interface BookingViewProps {
  pets: Pet[];
  onAddPet: (name: string, species: 'Perro' | 'Gato' | 'Exótico', breed: string, age: string, image?: string) => void;
  onAddAppointment: (appointment: Appointment) => void;
  setView: (view: any) => void;
}

export default function BookingView({ pets, onAddPet, onAddAppointment, setView }: BookingViewProps) {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [selectedPet, setSelectedPet] = useState<Pet | null>(pets[0] || null);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [isConfirmed, setIsConfirmed] = useState(false);
  
  // Dynamic system calendar tracking
  const [selectedDateObj, setSelectedDateObj] = useState<Date>(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return today;
  });
  const [currentCalendarDate, setCurrentCalendarDate] = useState<Date>(() => new Date());

  // Show "Añadir Mascota" modal/form
  const [showAddPetForm, setShowAddPetForm] = useState(false);
  const [newPetName, setNewPetName] = useState('');
  const [newPetBreed, setNewPetBreed] = useState('');
  const [newPetAge, setNewPetAge] = useState('');
  const [newPetSpecies, setNewPetSpecies] = useState<'Perro' | 'Gato' | 'Exótico'>('Perro');
  const [newPetImage, setNewPetImage] = useState('https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&q=80&w=300');

  const handleAddPetSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPetName || !newPetBreed || !newPetAge) {
      alert('Por favor complete todos los datos.');
      return;
    }
    onAddPet(newPetName, newPetSpecies, newPetBreed, newPetAge, newPetImage);
    // Select the newly added pet optionally
    alert('Mascota registrada con éxito!');
    setNewPetName('');
    setNewPetBreed('');
    setNewPetAge('');
    setNewPetImage('https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&q=80&w=300');
    setShowAddPetForm(false);
  };

  const getFormattedDate = (date: Date) => {
    const options: Intl.DateTimeFormatOptions = { weekday: 'long', day: 'numeric', month: 'long' };
    const localeString = date.toLocaleDateString('es-ES', options);
    return localeString.charAt(0).toUpperCase() + localeString.slice(1);
  };

  const handleConfirmReservation = () => {
    if (!selectedPet) {
      alert('Favor seleccionar una mascota primero.');
      return;
    }

    if (!selectedService || !selectedTime) {
      alert('Favor seleccionar de forma obligatoria el tipo de servicio y un bloque horario disponible.');
      return;
    }
    
    const newAppt: Appointment = {
      id: 'appt_' + Date.now(),
      petName: selectedPet.name,
      serviceName: selectedService.name,
      date: getFormattedDate(selectedDateObj),
      time: selectedTime,
      price: selectedService.price,
      status: 'confirmed'
    };

    onAddAppointment(newAppt);
    setIsConfirmed(true);

    // Save automatic audit log for WhatsApp and booking simulation (TC_CS_004 & TC_CS_007)
    try {
      const newLog = {
        evento: `Reserva de Cita - ${selectedService.name}`,
        canal: "WhatsApp",
        timestamp: new Date().toISOString(),
        estado: "Completado",
        detalles: {
          mascota: selectedPet.name,
          especie: selectedPet.species,
          servicio: selectedService.name,
          fecha: getFormattedDate(selectedDateObj),
          hora: selectedTime,
          total: selectedService.price
        }
      };
      const existingBookingLogs = localStorage.getItem('sgc_booking_logs');
      const bookingLogs = existingBookingLogs ? JSON.parse(existingBookingLogs) : [];
      bookingLogs.unshift(newLog);
      localStorage.setItem('sgc_booking_logs', JSON.stringify(bookingLogs));
    } catch (e) {
      console.error('Error saving sgc_booking_logs:', e);
    }
  };

  const handleDownloadReceipt = () => {
    if (!selectedPet || !selectedService) return;
    
    const text = `==================================================
        COMPROBANTE DE RESERVA - SGC VET
==================================================
Mascota:         ${selectedPet.name}
Especie/Raza:    ${selectedPet.species} (${selectedPet.breed})
Servicio:        ${selectedService.name}
Fecha:           ${getFormattedDate(selectedDateObj)}
Hora:            ${selectedTime || ''}
Total Estimado:  ${selectedService.price}
==================================================
¡Gracias por confiar en SGC Veterinary Clinic!
Para modificar o cancelar, avísenos con 24 hrs.
==================================================`;

    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `comprobante_reserva_${selectedPet.name.toLowerCase()}_${Date.now()}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    alert('Comprobante descargado con éxito.');
    setView('dashboard');
  };

  const handleNoDownload = () => {
    setView('dashboard');
  };

  // Calendar setup helpers
  const year = currentCalendarDate.getFullYear();
  const month = currentCalendarDate.getMonth(); // 0-11
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const monthNames = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  const handlePrevMonth = () => {
    setCurrentCalendarDate(new Date(year, month - 1, 1));
  };
  
  const handleNextMonth = () => {
    setCurrentCalendarDate(new Date(year, month + 1, 1));
  };

  const firstDayIndex = new Date(year, month, 1).getDay();
  const totalDays = new Date(year, month + 1, 0).getDate();

  const prevMonthTotalDays = new Date(year, month, 0).getDate();
  const prevMonthEmptyDays = [];
  for (let i = firstDayIndex - 1; i >= 0; i--) {
    prevMonthEmptyDays.push(prevMonthTotalDays - i);
  }

  const daysInMonth = Array.from({ length: totalDays }, (_, i) => i + 1);

  const isValid = selectedService !== null && selectedTime !== null;

  const times = ['09:00 AM', '10:30 AM', '11:00 AM', '02:00 PM', '03:30 PM', '04:45 PM'];

  return (
    <div className="space-y-10 animate-fade-in">
      {/* Header view descriptive */}
      <div className="text-center lg:text-left">
        <h1 className="text-3xl font-headline font-semibold text-[#2e3230] mb-2">Reserva de Cita</h1>
        <p className="text-[#4a4e4a] text-sm">Sigue los pasos para agendar la atención de tu querida mascota.</p>
      </div>

      {/* Modern Stepper Indicator */}
      <div className="flex justify-between items-center relative px-2 max-w-xl mx-auto lg:mx-0">
        <div className="absolute h-[2px] bg-[#e4e0d8] top-1/2 left-0 w-full -z-10 -translate-y-1/2" />
        
        {/* Step 1 badge */}
        <button 
          onClick={() => !isConfirmed && setStep(1)}
          disabled={isConfirmed}
          className="flex flex-col items-center gap-2 group cursor-pointer focus:outline-none disabled:opacity-50"
        >
          <div className={`w-11 h-11 rounded-full flex items-center justify-center font-bold border-4 border-[#faf6f0] z-10 transition-all ${
            step === 1 
              ? 'bg-[#4a7c59] text-white shadow-md' 
              : step > 1 
              ? 'bg-[#78a886] text-white' 
              : 'bg-[#e4e0d8] text-[#4a4e4a]'
          }`}>
            <span>1</span>
          </div>
          <span className={`text-[11px] font-bold uppercase tracking-wider ${
            step === 1 ? 'text-[#4a7c59]' : 'text-[#4a4e4a]'
          }`}>Mascota</span>
        </button>

        {/* Step 2 badge */}
        <button 
          onClick={() => !isConfirmed && selectedPet && setStep(2)}
          disabled={isConfirmed || !selectedPet}
          className="flex flex-col items-center gap-2 group cursor-pointer focus:outline-none disabled:opacity-50"
        >
          <div className={`w-11 h-11 rounded-full flex items-center justify-center font-bold border-4 border-[#faf6f0] z-10 transition-all ${
            step === 2 
              ? 'bg-[#4a7c59] text-white shadow-md' 
              : step > 2 
              ? 'bg-[#78a886] text-white' 
              : 'bg-[#e4e0d8] text-[#4a4e4a]'
          }`}>
            <span>2</span>
          </div>
          <span className={`text-[11px] font-bold uppercase tracking-wider ${
            step === 2 ? 'text-[#4a7c59]' : 'text-[#4a4e4a]'
          }`}>Servicio</span>
        </button>

        {/* Step 3 badge */}
        <button 
          onClick={() => !isConfirmed && selectedPet && setStep(3)}
          disabled={isConfirmed || !selectedPet}
          className="flex flex-col items-center gap-2 group cursor-pointer focus:outline-none disabled:opacity-50"
        >
          <div className={`w-11 h-11 rounded-full flex items-center justify-center font-bold border-4 border-[#faf6f0] z-10 transition-all ${
            step === 3 
              ? 'bg-[#4a7c59] text-white shadow-md' 
              : 'bg-[#e4e0d8] text-[#4a4e4a]'
          }`}>
            <span>3</span>
          </div>
          <span className={`text-[11px] font-bold uppercase tracking-wider ${
            step === 3 ? 'text-[#4a7c59]' : 'text-[#4a4e4a]'
          }`}>Confirmar</span>
        </button>
      </div>

      {/* Main Reservation panel */}
      <div className="bg-[#f0ece4]/40 p-6 sm:p-8 rounded-2xl border border-[#c4c8bc]/30 shadow-sm">
        
        {/* STEP 1 CONTENT: SELECT/ADD PET */}
        {step === 1 && (
          <div className="space-y-6">
            <h3 className="text-xl font-headline font-bold text-[#2e3230]">Selecciona tu mascota</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pets.map((pet) => (
                <div 
                  key={pet.id}
                  onClick={() => {
                    setSelectedPet(pet);
                    setStep(2);
                  }}
                  className={`bg-[#faf6f0] rounded-xl p-5 border-2 cursor-pointer transition-all hover:shadow-md flex items-center gap-4 group ${
                    selectedPet?.id === pet.id 
                      ? 'border-[#4a7c59] bg-[#4a7c59]/5' 
                      : 'border-transparent'
                  }`}
                >
                  <img 
                    src={pet.image} 
                    alt={pet.name} 
                    className="w-14 h-14 rounded-full object-cover border border-[#c4c8bc]/30 group-hover:scale-105 transition-transform"
                    referrerPolicy="no-referrer"
                  />
                  <div className="flex-1">
                    <h4 className="font-headline font-bold text-base text-[#2e3230] group-hover:text-[#4a7c59] transition-colors">
                      {pet.name}
                    </h4>
                    <p className="text-xs text-[#4a4e4a]">{pet.breed} • {pet.age}</p>
                  </div>
                  
                  {selectedPet?.id === pet.id && (
                    <CheckCircle2 className="w-5 h-5 text-[#4a7c59] shrink-0" />
                  )}
                </div>
              ))}

              {/* Add New Pet Card Button */}
              <button 
                onClick={() => setShowAddPetForm(true)}
                className="bg-[#faf6f0]/40 rounded-xl p-5 border-2 border-dashed border-[#c4c8bc] text-[#4a4e4a] hover:border-[#4a7c59] hover:bg-[#faf6f0] transition-all flex flex-col items-center justify-center gap-2 group h-full cursor-pointer focus:outline-none"
              >
                <PlusCircle className="w-6 h-6 text-[#5e5548] group-hover:text-[#4a7c59] group-hover:scale-110 transition-transform" />
                <span className="text-xs font-bold font-label group-hover:text-[#4a7c59]">Añadir Mascota</span>
              </button>
            </div>
          </div>
        )}

        {/* STEP 2 CONTENT: SELECT SERVICE & SCHEDULER */}
        {step === 2 && (
          <div className="space-y-8 animate-fade-in">
            <div className="flex flex-col lg:flex-row gap-10">
              
              {/* Service list and times slots */}
              <div className="flex-1 space-y-6">
                <div>
                  <h3 className="text-lg font-headline font-bold text-[#2e3230] mb-4">Tipo de Servicio</h3>
                  <div className="space-y-4">
                    {SERVICES.map((srv) => (
                      <label 
                        key={srv.id}
                        className={`flex items-center p-4 bg-[#faf6f0] rounded-xl border-2 cursor-pointer transition-all ${
                          selectedService?.id === srv.id
                            ? 'border-[#4a7c59] bg-[#4a7c59]/5'
                            : 'border-[#c4c8bc]/20 hover:border-[#4a7c59]/40'
                        }`}
                      >
                        <input 
                          type="radio" 
                          name="service"
                          className="w-4 h-4 text-[#4a7c59] focus:ring-[#4a7c59] mr-4 cursor-pointer"
                          checked={selectedService?.id === srv.id}
                          onChange={() => setSelectedService(srv)}
                        />
                        <div className="flex-grow">
                          <div className="flex justify-between items-center mb-1">
                            <span className="font-bold text-base text-[#2e3230]">{srv.name}</span>
                            <span className="text-[#4a7c59] font-bold">{srv.price}</span>
                          </div>
                          <p className="text-xs text-[#4a4e4a]">{srv.description}</p>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Hour slots */}
                <div>
                  <h4 className="font-bold text-sm text-[#2e3230] mb-3">Horarios Disponibles</h4>
                  <div className="grid grid-cols-3 gap-3">
                    {times.map((t) => {
                      const isBooked = t === '11:00 AM'; // Mimics screenshot's layout exactly
                      return (
                        <button
                          key={t}
                          disabled={isBooked}
                          type="button"
                          onClick={() => setSelectedTime(t)}
                          className={`p-2.5 text-xs font-bold rounded-lg border text-center transition-all ${
                            isBooked
                              ? 'bg-[#e4e0d8]/50 text-[#4a4e4a]/40 cursor-not-allowed line-through border-[#c4c8bc]/20'
                              : selectedTime === t
                              ? 'bg-[#4a7c59] text-white border-[#4a7c59] shadow-sm'
                              : 'bg-[#faf6f0] border-[#c4c8bc]/40 text-[#4a4e4a] hover:bg-[#78a886]/10 hover:border-[#4a7c59]'
                          }`}
                        >
                          {t}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Dynamic Calendar Frame Card with System Date Capturing */}
              <div className="lg:w-80 bg-[#faf6f0] rounded-2xl p-6 border border-[#c4c8bc]/30 shadow-sm shrink-0">
                <div className="flex justify-between items-center mb-4">
                  <span className="font-headline font-bold text-sm text-[#2e3230]">
                    {monthNames[month]} {year}
                  </span>
                  <div className="flex gap-1">
                    <button 
                      type="button" 
                      onClick={handlePrevMonth} 
                      className="p-1.5 hover:bg-[#f0ece4] rounded transition-colors text-sm font-bold cursor-pointer"
                    >
                      &lt;
                    </button>
                    <button 
                      type="button" 
                      onClick={handleNextMonth} 
                      className="p-1.5 hover:bg-[#f0ece4] rounded transition-colors text-sm font-bold cursor-pointer"
                    >
                      &gt;
                    </button>
                  </div>
                </div>

                {/* Calendar Days weekdays label */}
                <div className="grid grid-cols-7 text-center text-[10px] font-bold text-[#4a4e4a] mb-2 uppercase tracking-wide">
                  <div>D</div><div>L</div><div>M</div><div>X</div><div>J</div><div>V</div><div>S</div>
                </div>

                {/* Calendar grid */}
                <div className="grid grid-cols-7 gap-1 text-center text-xs">
                  {/* Past trailing days of previous month */}
                  {prevMonthEmptyDays.map((pDay, idx) => (
                    <div key={`prev-${idx}`} className="p-2 text-[#ebd8b4]/30 cursor-not-allowed">
                      {pDay}
                    </div>
                  ))}
                  
                  {/* Clickable Current Month Days (Enforces dynamic disabling of past days) */}
                  {daysInMonth.map((day) => {
                    const dayDate = new Date(year, month, day);
                    const isPast = dayDate < today;
                    const isSelected = selectedDateObj.getFullYear() === year &&
                                       selectedDateObj.getMonth() === month &&
                                       selectedDateObj.getDate() === day;
                    
                    let styleClasses = "p-2 rounded-full font-semibold transition-all relative ";
                    if (isPast) {
                      styleClasses += "text-[#c4c8bc]/40 cursor-not-allowed line-through hover:bg-transparent";
                    } else if (isSelected) {
                      styleClasses += "bg-[#4a7c59] text-white shadow-sm cursor-pointer";
                    } else {
                      styleClasses += "hover:bg-[#78a886]/10 text-[#4a4e4a] cursor-pointer";
                    }

                    return (
                      <button
                        key={`day-${day}`}
                        type="button"
                        disabled={isPast}
                        onClick={() => setSelectedDateObj(dayDate)}
                        className={styleClasses}
                      >
                        {day}
                        {day === today.getDate() && month === today.getMonth() && year === today.getFullYear() && !isSelected && (
                          <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-[#4a7c59] rounded-full" />
                        )}
                      </button>
                    );
                  })}
                </div>

                <div className="mt-4 pt-4 border-t border-[#c4c8bc]/20 flex items-center gap-2 text-[10px] text-[#4a4e4a] font-semibold">
                  <span className="w-2 h-2 bg-[#4a7c59] rounded-full" />
                  <span>Citas Disponibles Hoy y Futuros</span>
                </div>
              </div>

            </div>

            {/* Step navigation buttons (Conditional Disabled State Enforced) */}
            <div className="mt-8 pt-4 border-t border-[#c4c8bc]/20 flex justify-between">
              <button 
                type="button"
                onClick={() => setStep(1)}
                className="px-5 py-2.5 border-2 border-[#4a7c59] text-[#4a7c59] font-bold rounded-lg hover:bg-[#4a7c59]/5 transition-colors flex items-center gap-2 text-sm"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Atrás</span>
              </button>
              
              <button 
                type="button"
                onClick={() => {
                  if (isValid) setStep(3);
                }}
                disabled={!isValid}
                className={`px-8 py-2.5 font-bold rounded-lg transition-all flex items-center gap-2 text-sm shadow ${
                  isValid
                    ? 'bg-[#4a7c59] text-white hover:bg-[#3d6749] active:scale-95 cursor-pointer'
                    : 'bg-[#e4e0d8] text-[#4a4e4a]/40 cursor-not-allowed opacity-60'
                }`}
              >
                <span>Continuar</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3 CONTENT: DETAILED VERIFICATION RESUMEN */}
        {step === 3 && (
          <div className="text-center py-4 space-y-6 max-w-xl mx-auto animate-fade-in">
            <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 scale-110 transition-all ${
              isConfirmed 
                ? 'bg-[#4a7c59] text-white shadow-lg animate-bounce' 
                : 'bg-[#4a7c59]/10 text-[#4a7c59]'
            }`}>
              <Check className="w-8 h-8" strokeWidth={3} />
            </div>
            
            <div>
              <h3 className="text-2xl font-headline font-bold text-[#2e3230]">
                {isConfirmed ? '¡Cita Reservada con Éxito!' : 'Resumen de Cita'}
              </h3>
              <p className="text-xs text-[#4a4e4a]">
                {isConfirmed 
                  ? 'Tu reserva ha sido registrada de forma segura en nuestro sistema de atención.' 
                  : 'Por favor, verifica los detalles antes de registrar tu cita formal.'}
              </p>
            </div>

            {/* Recipt view details */}
            <div className="bg-[#faf6f0] p-6 rounded-xl border border-[#c4c8bc]/30 text-left space-y-4 shadow-sm relative overflow-hidden">
              {isConfirmed && (
                <div className="absolute top-0 right-0 bg-[#4a7c59] text-white text-[9px] font-bold px-3 py-1 uppercase tracking-wider rounded-bl-lg shadow-sm">
                  CONFIRMADO
                </div>
              )}
              <div className="flex justify-between pb-3 border-b border-[#c4c8bc]/20">
                <span className="text-xs font-bold text-[#4a4e4a] uppercase">Mascota</span>
                <span className="font-bold text-[#2e3230]">{selectedPet?.name}</span>
              </div>
              
              <div className="flex justify-between pb-3 border-b border-[#c4c8bc]/20">
                <span className="text-xs font-bold text-[#4a4e4a] uppercase">Especie</span>
                <span className="font-semibold text-[#4a4e4a]">{selectedPet?.species} ({selectedPet?.breed})</span>
              </div>

              <div className="flex justify-between pb-3 border-b border-[#c4c8bc]/20">
                <span className="text-xs font-bold text-[#4a4e4a] uppercase">Servicio</span>
                <span className="font-bold text-[#2e3230]">{selectedService?.name || ''}</span>
              </div>

              <div className="flex justify-between pb-3 border-b border-[#c4c8bc]/20">
                <span className="text-xs font-bold text-[#4a4e4a] uppercase">Fecha y Hora</span>
                <div className="text-right">
                  <p className="font-bold text-[#2e3230]">{getFormattedDate(selectedDateObj)}</p>
                  <p className="text-xs text-[#4a7c59] font-bold">{selectedTime || ''}</p>
                </div>
              </div>

              <div className="flex justify-between pt-2 items-center">
                <span className="text-sm font-bold text-[#2e3230]">Total Estimado</span>
                <span className="text-2xl font-headline font-bold text-[#4a7c59]">{selectedService?.price || ''}</span>
              </div>
            </div>

            {/* Action panel triggers with enforced state compliance */}
            {!isConfirmed ? (
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                <button 
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-6 py-3 border-2 border-[#4a7c59] text-[#4a7c59] rounded-lg font-bold hover:bg-[#4a7c59]/5 transition-colors text-sm cursor-pointer animate-fade-in"
                >
                  Modificar Datos
                </button>
                
                <button 
                  type="button"
                  onClick={handleConfirmReservation}
                  disabled={!isValid}
                  className={`px-10 py-3 rounded-lg font-bold shadow-md transition-all text-sm ${
                    isValid
                      ? 'bg-[#4a7c59] text-white hover:bg-[#3d6749] cursor-pointer active:scale-95'
                      : 'bg-[#e4e0d8] text-[#4a4e4a]/40 cursor-not-allowed opacity-60'
                  }`}
                >
                  Confirmar Reserva
                </button>
              </div>
            ) : (
              <div className="bg-[#4a7c59]/5 border border-[#4a7c59]/20 rounded-xl p-5 space-y-4 animate-fade-in text-center">
                <p className="text-xs font-bold text-[#2e3230]">
                  ¿Deseas descargar el comprobante de reserva en tu dispositivo?
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <button 
                    type="button"
                    onClick={handleDownloadReceipt}
                    className="px-8 py-2.5 bg-[#4a7c59] hover:bg-[#3d6749] text-white rounded-lg font-bold transition-all text-xs flex items-center justify-center gap-2 shadow-md cursor-pointer active:scale-95"
                  >
                    <Download className="w-4 h-4" />
                    <span>Descargar</span>
                  </button>
                  <button 
                    type="button"
                    onClick={handleNoDownload}
                    className="px-6 py-2.5 border border-[#c4c8bc] bg-white hover:bg-[#f0ece4] text-[#4a4e4a] rounded-lg font-bold transition-colors text-xs cursor-pointer"
                  >
                    No descargar
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

      </div>

      {/* Cancellation Policy Banner */}
      <section className="bg-[#f0ece4] p-6 sm:p-8 rounded-2xl border border-[#c4c8bc]/20">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-full bg-[#c4a66a]/10 text-[#705c30] flex items-center justify-center shrink-0">
            <Info className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-headline font-bold text-[#2e3230] mb-2">Cancelación de Citas</h3>
            <p className="text-xs sm:text-sm text-[#4a4e4a] leading-relaxed mb-4">
              En SGC Veterinary Clinic valoramos enormemente tu tiempo y el de nuestros especialistas. Si necesitas cancelar o reprogramar tu cita, te solicitamos amablemente que lo hagas con al menos <strong className="text-[#2e3230]">24 horas de antelación</strong>.
            </p>
            <ul className="space-y-2 text-xs text-[#4a4e4a] list-disc list-inside">
              <li>
                Las cancelaciones con menos de 24 horas podrán incurrir en un recargo del 20% del valor total del servicio.
              </li>
              <li>
                Las cirugías de alta complejidad requieren cancelación con un plazo mínimo de 48 horas de anticipación.
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Manual Pet Registration Modal popup */}
      {showAddPetForm && (
        <div className="fixed inset-0 bg-[#2e3230]/40 backdrop-blur-sm z-[110] flex items-center justify-center p-4">
          <div className="bg-[#faf6f0] rounded-2xl w-full max-w-md p-6 shadow-2xl relative border border-[#c4c8bc]/30">
            <h3 className="text-xl font-headline font-bold text-[#4a7c59] mb-4 flex items-center gap-2">
              <PlusCircle className="w-5 h-5" />
              <span>Registrar Nueva Mascota</span>
            </h3>
            
            <form onSubmit={handleAddPetSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-[#4a4e4a] uppercase">Nombre Mascota</label>
                <input 
                  type="text" 
                  value={newPetName} 
                  onChange={(e) => setNewPetName(e.target.value)} 
                  className="w-full bg-white border border-[#c4c8bc]/50 rounded-lg p-2.5 text-sm focus:outline-[#4a7c59] focus:ring-1 focus:ring-[#4a7c59]" 
                  placeholder="Ej: Max" 
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-[#4a4e4a] uppercase">Especie</label>
                <select 
                  value={newPetSpecies} 
                  onChange={(e) => {
                    const val = e.target.value as 'Perro' | 'Gato' | 'Exótico';
                    setNewPetSpecies(val);
                    if (val === 'Gato') {
                      setNewPetImage('https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&q=80&w=300');
                    } else if (val === 'Exótico') {
                      setNewPetImage('https://images.unsplash.com/photo-1531804055935-76f44d7c3621?auto=format&fit=crop&q=80&w=300');
                    } else {
                      setNewPetImage('https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&q=80&w=300');
                    }
                  }} 
                  className="w-full bg-white border border-[#c4c8bc]/50 rounded-lg p-2.5 text-sm focus:outline-[#4a7c59]"
                >
                  <option value="Perro">Perro</option>
                  <option value="Gato">Gato</option>
                  <option value="Exótico">Exótico</option>
                </select>
              </div>

              {/* Photo Selector & Preview component (Booking form) */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#4a4e4a] uppercase block">Foto de Perfil de la Mascota</label>
                <div className="flex items-center gap-4 bg-[#faf6f0] p-3.5 rounded-xl border border-[#c4c8bc]/40 text-left">
                  <div className="relative shrink-0">
                    <img 
                      src={newPetImage} 
                      alt="Vista previa" 
                      className="w-16 h-16 rounded-full object-cover border-2 border-[#4a7c59] bg-[#ebd8b4]/20 shadow-sm"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.onerror = null;
                        target.src = newPetSpecies === 'Gato' 
                          ? 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&q=80&w=300'
                          : newPetSpecies === 'Exótico'
                          ? 'https://images.unsplash.com/photo-1531804055935-76f44d7c3621?auto=format&fit=crop&q=80&w=300'
                          : 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&q=80&w=300';
                      }}
                    />
                    <span className="absolute -bottom-1 -right-1 bg-[#4a7c59] text-white text-[8px] font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wider scale-90">SGC</span>
                  </div>
                  <div className="flex-1 space-y-1.5">
                    <p className="text-[10px] text-[#4a4e4a] leading-tight font-medium">Asigna una foto predefinida o ingresa una URL personalizada:</p>
                    
                    <div className="flex gap-1.5 overflow-x-auto py-0.5 max-w-[220px]">
                      {(newPetSpecies === 'Gato' ? [
                        'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&q=80&w=300',
                        'https://images.unsplash.com/photo-1533738363-b7f9aef128ce?auto=format&fit=crop&q=80&w=300',
                        'https://images.unsplash.com/photo-1618826411640-d6df44dd3f7a?auto=format&fit=crop&q=80&w=300'
                      ] : newPetSpecies === 'Exótico' ? [
                        'https://images.unsplash.com/photo-1531804055935-76f44d7c3621?auto=format&fit=crop&q=80&w=300',
                        'https://images.unsplash.com/photo-1425082661705-1834bfd09dca?auto=format&fit=crop&q=80&w=300',
                        'https://images.unsplash.com/photo-1507666480-1a484deeec80?auto=format&fit=crop&q=80&w=300'
                      ] : [
                        'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&q=80&w=300',
                        'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&q=80&w=300',
                        'https://images.unsplash.com/photo-1534361960057-19889db9621e?auto=format&fit=crop&q=80&w=300',
                        'https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&q=80&w=300'
                      ]).map((url, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => setNewPetImage(url)}
                          className={`w-8 h-8 rounded-full border-2 overflow-hidden transition-all shrink-0 ${newPetImage === url ? 'border-[#4a7c59] scale-110 shadow-sm' : 'border-[#c4c8bc]/40'}`}
                        >
                          <img src={url} className="w-full h-full object-cover" />
                        </button>
                      ))}
                    </div>

                    <input 
                      type="text" 
                      value={newPetImage}
                      onChange={(e) => setNewPetImage(e.target.value)}
                      className="w-full bg-white border border-[#c4c8bc]/50 rounded-lg px-2 py-1 text-[10px] font-mono focus:outline-[#4a7c59]"
                      placeholder="URL personalizada de imagen"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-[#4a4e4a] uppercase">Raza</label>
                <input 
                  type="text" 
                  value={newPetBreed} 
                  onChange={(e) => setNewPetBreed(e.target.value)} 
                  className="w-full bg-white border border-[#c4c8bc]/50 rounded-lg p-2.5 text-sm focus:outline-[#4a7c59] focus:ring-1 focus:ring-[#4a7c59]" 
                  placeholder="Ej: Pug / Siames" 
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-[#4a4e4a] uppercase">Edad / Descripción</label>
                <input 
                  type="text" 
                  value={newPetAge} 
                  onChange={(e) => setNewPetAge(e.target.value)} 
                  className="w-full bg-white border border-[#c4c8bc]/50 rounded-lg p-2.5 text-sm" 
                  placeholder="Ej: 2 años / 6 meses" 
                />
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <button 
                  type="button" 
                  onClick={() => setShowAddPetForm(false)} 
                  className="px-4 py-2 border border-[#c4c8bc] text-[#4a4e4a] rounded-lg text-sm"
                >
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  className="px-5 py-2 bg-[#4a7c59] text-white rounded-lg text-sm font-bold shadow-md hover:bg-[#3d6749]"
                >
                  Registrar
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
