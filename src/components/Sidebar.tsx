/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  LayoutDashboard,
  PawPrint,
  CalendarDays,
  ShoppingBag,
  ClipboardList,
  Settings,
  HelpCircle,
  PlusCircle,
  LogOut,
  ShieldCheck,
  Activity
} from 'lucide-react';
import { View, User } from '../types';

interface SidebarProps {
  currentView: View;
  setView: (view: View) => void;
  user: User;
  onLogout: () => void;
  onOpenBooking: () => void;
}

export default function Sidebar({ currentView, setView, user, onLogout, onOpenBooking }: SidebarProps) {
  if (!user.isLoggedIn) return null;

  return (
    <aside className="hidden lg:flex flex-col h-screen p-4 border-r border-[#c4c8bc]/30 bg-[#f0ece4] w-64 fixed top-0 left-0">
      {/* SGC Header */}
      <div className="flex items-center gap-3 px-2 mb-8">
        <div className="w-10 h-10 rounded-lg bg-[#4a7c59] flex items-center justify-center text-white">
          <PawPrint className="w-5 h-5" />
        </div>
        <div>
          <h1 className="font-headline text-xl text-[#4a7c59] font-bold leading-none">SGC Vet</h1>
          <p className="text-xs text-[#4a4e4a] font-medium">Cuidado Profesional</p>
        </div>
      </div>

      {/* Navigation menu */}
      <nav className="flex-1 space-y-1">
        <button
          onClick={() => setView('dashboard')}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-all text-left ${
            currentView === 'dashboard'
              ? 'bg-[#78a886] text-white font-bold'
              : 'text-[#4a4e4a] hover:bg-[#faf6f0]/60 hover:text-[#4a7c59]'
          }`}
        >
          <LayoutDashboard className="w-4 h-4" />
          <span>Dashboard</span>
        </button>

        <button
          onClick={() => setView('dashboard')} // Scrolls or highlights pets
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm text-[#4a4e4a] hover:bg-[#faf6f0]/60 hover:text-[#4a7c59] transition-all text-left"
        >
          <PawPrint className="w-4 h-4" />
          <span>Mis Mascotas</span>
        </button>

        <button
          onClick={() => setView('booking')}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-all text-left ${
            currentView === 'booking'
              ? 'bg-[#78a886] text-white font-bold'
              : 'text-[#4a4e4a] hover:bg-[#faf6f0]/60 hover:text-[#4a7c59]'
          }`}
        >
          <CalendarDays className="w-4 h-4" />
          <span>Agendar Cita</span>
        </button>

        <button
          onClick={() => setView('catalog')}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-all text-left ${
            currentView === 'catalog'
              ? 'bg-[#78a886] text-white font-bold'
              : 'text-[#4a4e4a] hover:bg-[#faf6f0]/60 hover:text-[#4a7c59]'
          }`}
        >
          <ShoppingBag className="w-4 h-4" />
          <span>Tienda</span>
        </button>

        <button
          onClick={() => setView('records')}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-all text-left ${
            currentView === 'records'
              ? 'bg-[#78a886] text-white font-bold'
              : 'text-[#4a4e4a] hover:bg-[#faf6f0]/60 hover:text-[#4a7c59]'
          }`}
        >
          <ClipboardList className="w-4 h-4" />
          <span>Fichas Médicas</span>
        </button>

        <button
          onClick={() => setView('logs')}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-all text-left ${
            currentView === 'logs'
              ? 'bg-[#78a886] text-white font-bold'
              : 'text-[#4a4e4a] hover:bg-[#faf6f0]/60 hover:text-[#4a7c59]'
          }`}
        >
          <Activity className="w-4 h-4" />
          <span>Logs de Auditoría</span>
        </button>

        <button
          onClick={() => setView('admin')}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-all text-left ${
            currentView === 'admin'
              ? 'bg-[#4a7c59] text-white font-bold'
              : 'text-[#4a4e4a] hover:bg-[#faf6f0]/60 hover:text-[#4a7c59] font-semibold border border-dashed border-[#4a7c59]/20 bg-[#4a7c59]/5'
          }`}
        >
          <ShieldCheck className={`w-4 h-4 ${currentView === 'admin' ? 'text-white' : 'text-[#4a7c59]'}`} />
          <span>Administración</span>
        </button>
      </nav>

      {/* Footer support + logout */}
      <div className="mt-auto pt-6 space-y-1 border-t border-[#c4c8bc]/30">
        <button
          onClick={onOpenBooking}
          className="w-full mb-4 py-3 px-4 bg-[#4a7c59] text-white rounded-xl font-bold flex items-center justify-center gap-2 shadow-sm hover:opacity-95 transition-all text-sm active:scale-95"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Agendar Ahora</span>
        </button>

        <button
          onClick={() => {
            alert('Configuración disponible próximamente.');
          }}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm text-[#4a4e4a] hover:bg-[#faf6f0]/60 hover:text-[#4a7c59] transition-all text-left"
        >
          <Settings className="w-4 h-4" />
          <span>Ajustes</span>
        </button>

        <button
          onClick={() => {
            alert('Soporte SGC 24/7 disponible: +56 9 1234 5678');
          }}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm text-[#4a4e4a] hover:bg-[#faf6f0]/60 hover:text-[#4a7c59] transition-all text-left"
        >
          <HelpCircle className="w-4 h-4" />
          <span>Soporte</span>
        </button>

        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm text-red-600 hover:bg-red-50 hover:text-red-700 transition-all text-left font-medium"
        >
          <LogOut className="w-4 h-4" />
          <span>Cerrar Sesión</span>
        </button>
      </div>
    </aside>
  );
}
