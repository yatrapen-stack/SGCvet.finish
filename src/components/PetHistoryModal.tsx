/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { X, Calendar, User, ClipboardList, PenTool } from 'lucide-react';
import { Pet } from '../types';

interface PetHistoryModalProps {
  pet: Pet | null;
  onClose: () => void;
}

export default function PetHistoryModal({ pet, onClose }: PetHistoryModalProps) {
  if (!pet) return null;

  return (
    <div className="fixed inset-0 bg-[#2e3230]/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
      <div 
        className="bg-[#faf6f0] rounded-2xl w-full max-w-2xl max-h-[85vh] overflow-y-auto shadow-2xl relative border border-[#c4c8bc]/30 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header banner */}
        <div className="p-6 bg-[#f0ece4] border-b border-[#c4c8bc]/20 flex justify-between items-center sticky top-0 z-10">
          <div className="flex items-center gap-4">
            <img 
              src={pet.image} 
              alt={pet.name} 
              className="w-14 h-14 rounded-full object-cover border-2 border-[#4a7c59]" 
              referrerPolicy="no-referrer"
            />
            <div>
              <h3 className="font-headline text-2xl font-bold text-[#4a7c59]">Ficha Médica: {pet.name}</h3>
              <p className="text-sm text-[#4a4e4a] font-medium">{pet.breed} • {pet.age}</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-[#eae6de] rounded-full transition-colors text-[#4a4e4a]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content body */}
        <div className="p-6 space-y-6 flex-1">
          {/* History record timeline */}
          <div>
            <h4 className="font-headline text-lg font-bold text-[#2e3230] mb-4 flex items-center gap-2">
              <ClipboardList className="w-5 h-5 text-[#4a7c59]" />
              <span>Historial del Paciente</span>
            </h4>

            {pet.history && pet.history.length > 0 ? (
              <div className="relative border-l-2 border-[#78a886]/40 ml-3 pl-6 space-y-8">
                {pet.history.map((record, index) => (
                  <div key={index} className="relative">
                    {/* Circle timeline decorator */}
                    <div className="absolute -left-[31px] top-1.5 w-4 h-4 rounded-full bg-[#4a7c59] border-4 border-[#faf6f0]" />
                    
                    <div className="bg-[#f5f1ea] p-5 rounded-xl border border-[#c4c8bc]/20 group hover:shadow-md transition-shadow">
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 mb-3">
                        <span className="inline-flex items-center gap-2.5 text-xs font-bold text-[#4a7c59] bg-[#ebd8b4]/30 px-3 py-1 rounded">
                          <Calendar className="w-3 h-3" />
                          {record.date}
                        </span>
                        
                        <span className="inline-flex items-center gap-1.5 text-xs text-[#4a4e4a] font-semibold">
                          <User className="w-3.5 h-3.5 text-[#705c30]" />
                          {record.veterinarian}
                        </span>
                      </div>

                      <h5 className="font-headline font-bold text-base text-[#2e3230] mb-2">
                        Motivo: {record.reason}
                      </h5>

                      <div className="space-y-2 mt-4 text-sm text-[#4a4e4a]">
                        <p>
                          <strong className="text-[#2e3230] font-semibold">Tratamiento & Medicación:</strong> {record.treatment}
                        </p>
                        <p className="bg-[#faf6f0] p-3 rounded-lg text-xs italic border border-[#c4c8bc]/10">
                          <strong className="text-[#2e3230] font-semibold block not-italic mb-1">Notas Clínicas:</strong>
                          {record.notes}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-sm text-[#4a4e4a] bg-[#f5f1ea] rounded-xl border border-[#c4c8bc]/10">
                Aún no hay registros médicos previos para {pet.name}.
              </div>
            )}
          </div>

          {/* Quick tips card inside modal */}
          <div className="bg-[#705c30]/10 p-5 rounded-xl border border-[#705c30]/20 flex items-start gap-4">
            <span className="text-[#705c30] text-3xl font-bold leading-none mt-1">i</span>
            <div>
              <h5 className="font-bold text-[#221a05] text-sm mb-1">Nota importante para dueños</h5>
              <p className="text-xs text-[#554020] leading-relaxed">
                Usted puede solicitar copias certificadas de estas recetas médicas o del historial clínico completo para viajes internacionales dirigiéndose a nuestro mesón de atención física. SGC protege y cifra todos sus expedientes.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-[#f0ece4] border-t border-[#c4c8bc]/20 flex justify-end gap-3 rounded-b-2xl sticky bottom-0">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-[#4a7c59] hover:bg-[#406b4d] text-white rounded-lg text-sm font-bold shadow transition-colors"
          >
            Entendido
          </button>
        </div>
      </div>
    </div>
  );
}
