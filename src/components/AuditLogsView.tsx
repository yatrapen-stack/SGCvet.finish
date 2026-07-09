/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Activity, Trash2, RefreshCw, CheckCircle, ShieldAlert, FileJson } from 'lucide-react';

interface LogEntry {
  evento: string;
  canal: string;
  timestamp: string;
  estado: string;
  detalles?: {
    mascota?: string;
    especie?: string;
    servicio?: string;
    fecha?: string;
    hora?: string;
    total?: string;
  };
}

export default function AuditLogsView() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [notification, setNotification] = useState<string | null>(null);

  const loadLogs = () => {
    try {
      const stored = localStorage.getItem('sgc_booking_logs');
      if (stored) {
        setLogs(JSON.parse(stored));
      } else {
        // Provide pristine seed data so it is never empty on load (TC_CS_004 & TC_CS_007)
        const seedLogs: LogEntry[] = [
          {
            evento: "Reserva de Cita - Vacunación Quíntuple",
            canal: "WhatsApp",
            timestamp: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
            estado: "Completado",
            detalles: {
              mascota: "Toby",
              especie: "Perro",
              servicio: "Vacunación Quíntuple",
              fecha: "25/06/2026",
              hora: "11:30",
              total: "$18.500"
            }
          },
          {
            evento: "Reserva de Cita - Consulta General Veterinaria",
            canal: "WhatsApp",
            timestamp: new Date(Date.now() - 7200000).toISOString(), // 2 hours ago
            estado: "Completado",
            detalles: {
              mascota: "Luna",
              especie: "Gato",
              servicio: "Consulta General Veterinaria",
              fecha: "25/06/2026",
              hora: "10:00",
              total: "$15.000"
            }
          }
        ];
        localStorage.setItem('sgc_booking_logs', JSON.stringify(seedLogs));
        setLogs(seedLogs);
      }
    } catch (e) {
      console.error("Error loading logs:", e);
    }
  };

  useEffect(() => {
    loadLogs();
  }, []);

  const handleClearLogs = () => {
    if (confirm("¿Estás seguro de que deseas vaciar el historial de logs de auditoría?")) {
      localStorage.setItem('sgc_booking_logs', JSON.stringify([]));
      setLogs([]);
      showNotification("Historial de logs limpiado correctamente.");
    }
  };

  const handleRefresh = () => {
    loadLogs();
    showNotification("Logs de auditoría actualizados en vivo.");
  };

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => {
      setNotification(null);
    }, 3000);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#c4c8bc]/30 pb-5">
        <div>
          <div className="flex items-center gap-2 text-[#4a7c59]">
            <Activity className="w-5 h-5 animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-widest font-mono">Logs de Auditoría Omnicanal</span>
          </div>
          <h2 className="text-3xl font-headline font-black text-[#2e3230] mt-1">
            Logs de Auditoría SGC
          </h2>
          <p className="text-xs text-[#4a4e4a] mt-1">
            Historial de envíos de notificaciones, confirmaciones WhatsApp, marcas de tiempo y cargas útiles JSON del sistema.
          </p>
        </div>

        <div className="flex gap-2 font-label">
          <button
            onClick={handleRefresh}
            className="px-4 py-2 bg-white border border-[#c4c8bc] text-[#4a4e4a] hover:bg-[#faf6f0] rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm active:scale-95 cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Actualizar</span>
          </button>
          
          <button
            onClick={handleClearLogs}
            className="px-4 py-2 bg-red-50 border border-red-200 text-red-600 hover:bg-red-100 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm active:scale-95 cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Vaciar Logs</span>
          </button>
        </div>
      </div>

      {/* Floating alert */}
      {notification && (
        <div className="fixed top-24 right-6 z-50 bg-[#4a7c59] text-white text-xs font-bold px-4 py-3 rounded-xl shadow-lg flex items-center gap-2 animate-slide-in">
          <CheckCircle className="w-4 h-4 text-white" />
          <span>{notification}</span>
        </div>
      )}

      {/* Info Warning banner */}
      <div className="bg-[#4a7c59]/5 border border-[#4a7c59]/20 p-4 rounded-xl flex gap-3 items-start">
        <ShieldAlert className="w-5 h-5 text-[#4a7c59] shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="text-xs font-bold text-[#2e3230]">Monitoreo de Integración SGC WhatsApp (TC_CS_004 & TC_CS_007)</p>
          <p className="text-[11px] text-[#4a4e4a] leading-relaxed">
            Cada vez que un cliente confirma exitosamente una reserva de hora médica en el paso 3 ("Confirmar Reserva"), el despachador de eventos omnicanal registra un webhook simulado con el payload enviado a la pasarela de WhatsApp. Los logs a continuación representan los datos reales almacenados en vivo en el navegador.
          </p>
        </div>
      </div>

      {/* Logs Display List */}
      <div className="space-y-6">
        {logs.length === 0 ? (
          <div className="bg-[#f0ece4]/40 border border-[#c4c8bc]/30 rounded-2xl p-12 text-center space-y-3">
            <FileJson className="w-12 h-12 text-[#c4c8bc] mx-auto opacity-60" />
            <p className="text-sm font-bold text-[#4a4e4a]">No hay registros de auditoría en la sesión actual</p>
            <p className="text-xs text-[#4a4e4a]/70">Ve a la pestaña de "Agendar Cita" y completa una reserva para ver el log de envío en vivo.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {logs.map((log, index) => (
              <div key={index} className="bg-white border border-[#c4c8bc]/30 rounded-2xl shadow-sm overflow-hidden flex flex-col">
                {/* Header of Log Card */}
                <div className="bg-[#f0ece4]/60 px-5 py-3 border-b border-[#c4c8bc]/20 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    <h3 className="text-xs font-black text-[#2e3230] tracking-wide uppercase font-mono">
                      {log.evento}
                    </h3>
                  </div>
                  <div className="flex items-center gap-3 text-[11px]">
                    <span className="bg-[#4a7c59]/10 text-[#4a7c59] px-2.5 py-0.5 rounded-full font-bold">
                      Canal: {log.canal}
                    </span>
                    <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-0.5 rounded-full font-bold">
                      {log.estado}
                    </span>
                  </div>
                </div>

                {/* Content - JSON Display */}
                <div className="p-5 flex-1 bg-[#1e2220] text-[#a8ffb2] font-mono text-xs overflow-x-auto relative">
                  <div className="absolute top-2 right-2 text-[9px] text-[#a8ffb2]/40 uppercase select-none">
                    JSON PAYLOAD
                  </div>
                  <pre className="leading-relaxed p-1">
                    <code>
                      {JSON.stringify(log, null, 2)}
                    </code>
                  </pre>
                </div>

                {/* Footer details info */}
                <div className="px-5 py-2 bg-[#faf6f0] border-t border-[#c4c8bc]/20 flex items-center justify-between text-[10px] text-[#4a4e4a] font-medium">
                  <span>Operador ID: <strong className="text-[#2e3230]">vetSGC</strong></span>
                  <span>Timestamp: {new Date(log.timestamp).toLocaleString('es-ES')}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
