/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { 
  CheckCircle2, 
  Clock, 
  MapPin, 
  PhoneCall, 
  ShieldCheck, 
  UserRoundCheck, 
  Store, 
  FolderHeart, 
  Calendar,
  Sparkles
} from 'lucide-react';
import { View, User } from '../types';

interface HomeViewProps {
  user: User;
  setView: (view: View) => void;
  onEmergencyClick: () => void;
}

export default function HomeView({ user, setView, onEmergencyClick }: HomeViewProps) {
  return (
    <div className="bg-[#faf6f0] min-h-screen flex flex-col font-sans">
      {/* Hero Section */}
      <section className="relative min-h-[750px] flex items-center px-6 sm:px-12 md:px-16 lg:px-24 py-12 overflow-hidden">
        <div className="container mx-auto grid lg:grid-cols-2 gap-12 items-center relative z-10 max-w-7xl">
          <div className="space-y-8 animate-fade-in">
            {/* Tag badge with real motion-like look */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#4a7c59]/10 text-[#4a7c59] rounded-full text-xs font-extrabold tracking-wide uppercase border border-[#4a7c59]/20 shadow-sm">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Cuidado Profesional Garantizado</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-headline font-semibold text-[#2e3230] leading-[1.12] tracking-tight">
              Cuidamos a tu mascota, <span className="text-[#4a7c59] underline decoration-wavy decoration-[#ebd8b4] underline-offset-4">optimizamos tu tiempo.</span>
            </h1>
            
            <p className="text-base sm:text-lg text-[#4a4e4a] max-w-xl leading-relaxed">
              Bienvenido al Sistema de Gestión de Citas Veterinarias (SGC). Simplificamos la de salud de tu mejor amigo con tecnología humana y procesos eficientes.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <button 
                onClick={() => setView('booking')}
                className="px-8 py-4 bg-[#4a7c59] text-white rounded-xl font-bold text-lg shadow-lg hover:bg-[#3d6749] hover:translate-y-[-2px] transition-all cursor-pointer active:scale-95"
              >
                Agendar Cita
              </button>
              <button 
                onClick={() => setView('catalog')}
                className="px-8 py-4 bg-[#eae6de] border border-[#c4c8bc]/40 text-[#2e3230] rounded-xl font-bold text-lg hover:bg-[#ebd8b4]/20 transition-all cursor-pointer active:scale-95"
              >
                Ver Catálogo
              </button>
            </div>
          </div>
          
          {/* Main Visual Frame with Floating Element */}
          <div className="relative flex justify-center items-center">
            {/* Soft Organic Backing Effect */}
            <div className="absolute w-80 h-80 sm:w-[450px] sm:h-[450px] bg-[#78a886]/10 rounded-full organic-shape blur-2xl z-0" />
            
            <div className="relative z-10 w-full max-w-md h-[460px] sm:h-[500px]">
              <img 
                alt="Golden Retriever de SGC" 
                className="w-full h-full object-cover rounded-2xl shadow-xl border-4 border-white"
                src="/src/assets/images/hero_golden_retriever_1782183833247.jpg"
                referrerPolicy="no-referrer"
              />
              
              {/* Floating Appt Status box */}
              <div className="absolute -bottom-4 -left-4 sm:left-[-20px] bg-white p-4 rounded-xl shadow-xl z-20 flex items-center gap-3 border border-[#c4c8bc]/20 group hover:scale-[1.03] transition-transform">
                <div className="bg-[#ebd8b4] p-2.5 rounded-lg text-[#554020]">
                  <Clock className="w-5 h-5 animate-pulse" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-[#4a4e4a] uppercase tracking-wider">Próxima Cita</p>
                  <p className="text-sm font-headline font-bold text-[#2e3230]">Hoy, 15:30 hrs</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6 sm:px-12 md:px-16 lg:px-24 bg-[#f5f1ea]">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-16 space-y-3">
            <h2 className="text-3xl sm:text-4xl font-display font-medium text-[#2e3230]">
              Gestión inteligente para vidas ocupadas
            </h2>
            <p className="text-[#4a4e4a] max-w-2xl mx-auto text-base">
              Diseñamos SGC para ser la herramienta definitiva en el cuidado preventivo y curativo de tus mascotas.
            </p>
          </div>
          
          {/* Bento-grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Feature 1: Booking */}
            <div className="md:col-span-2 bg-[#faf6f0] p-8 rounded-2xl shadow-sm border border-[#c4c8bc]/10 hover:shadow-md transition-shadow flex flex-col sm:flex-row gap-8 items-center">
              <div className="flex-1 space-y-4">
                <div className="w-12 h-12 rounded-xl bg-[#4a7c59]/10 flex items-center justify-center text-[#4a7c59]">
                  <Calendar className="w-6 h-6" />
                </div>
                <h3 className="text-xl sm:text-2xl font-headline font-bold text-[#2e3230]">Reserva en 4 clics</h3>
                <p className="text-sm text-[#4a4e4a] leading-relaxed">
                  Olvídate de las esperas telefónicas. Nuestra interfaz optimizada te permite seleccionar veterinario, servicio y horario en menos de un minuto.
                </p>
                <ul className="space-y-2 text-sm text-[#2e3230] font-medium">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#4a7c59]" />
                    <span>Confirmación inmediata</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#4a7c59]" />
                    <span>Recordatorios vía WhatsApp integrados</span>
                  </li>
                </ul>
              </div>
              <div 
                onClick={() => setView('booking')}
                className="w-full sm:w-64 h-44 bg-[#f0ece4] rounded-xl flex flex-col items-center justify-center p-5 cursor-pointer hover:bg-[#eae6de] transition-colors border border-[#c4c8bc]/20 shadow-inner group"
              >
                <div className="w-full space-y-2 text-center">
                  <div className="h-8 bg-[#4a7c59]/15 rounded flex items-center justify-center text-xs font-bold text-[#4a7c59] group-hover:scale-95 transition-transform">
                    1. Elegir Mascota
                  </div>
                  <div className="h-8 bg-[#4a7c59]/15 rounded flex items-center justify-center text-xs font-bold text-[#4a7c59] group-hover:scale-95 transition-transform">
                    2. Elegir Veterinario
                  </div>
                  <div className="h-8 bg-[#4a7c59] text-white font-bold rounded flex items-center justify-center text-xs shadow-md border border-[#4a7c59] group-hover:scale-105 transition-transform">
                    Agendar Ahora
                  </div>
                </div>
              </div>
            </div>

            {/* Feature 2: Pets Profiles */}
            <div 
              onClick={() => {
                if (user.isLoggedIn) {
                  setView('dashboard');
                } else {
                  setView('signin');
                }
              }}
              className="bg-[#4a7c59] text-white p-8 rounded-2xl shadow-sm hover:shadow-lg transition-transform hover:-translate-y-1 flex flex-col justify-between cursor-pointer group"
            >
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center text-white">
                  <FolderHeart className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-headline font-bold">Perfiles de Mascota</h3>
                <p className="text-[#d8f0de]/95 text-sm leading-relaxed">
                  Centraliza todo: historial médico de vacunaciones, registros de alergias y fotos más queridas, accesible 24/7.
                </p>
              </div>
              
              {/* Pet stack images */}
              <div className="mt-8 flex -space-x-4 overflow-hidden pl-2">
                <img 
                  alt="Beagle de la clínica" 
                  className="inline-block h-12 w-12 rounded-full ring-2 ring-[#4a7c59] bg-[#faf6f0] object-cover"
                  src="/src/assets/images/photo_oliver_beagle_1782183869013.jpg"
                  referrerPolicy="no-referrer"
                />
                <img 
                  alt="Cat orange SGC" 
                  className="inline-block h-12 w-12 rounded-full ring-2 ring-[#4a7c59] bg-[#faf6f0] object-cover"
                  src="/src/assets/images/photo_simba_persian_1782183859259.jpg"
                  referrerPolicy="no-referrer"
                />
                <img 
                  alt="Fluffy puppy SGC" 
                  className="inline-block h-12 w-12 rounded-full ring-2 ring-[#4a7c59] bg-[#faf6f0] object-cover"
                  src="/src/assets/images/photo_luna_golden_1782183847060.jpg"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>

            {/* Feature 3: Online Shop */}
            <div 
              onClick={() => setView('catalog')}
              className="bg-[#c4a66a] text-white p-8 rounded-2xl shadow-sm hover:shadow-lg transition-transform hover:-translate-y-1 flex flex-col justify-between cursor-pointer group"
            >
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center text-white">
                  <Store className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-headline font-bold">Tienda en Línea</h3>
                <p className="text-amber-50/90 text-sm leading-relaxed">
                  Alimento premium y accesorios recomendados por nuestros veterinarios, con envío a domicilio o retiro rápido en clínica.
                </p>
              </div>
              <div className="mt-8 flex justify-center py-2">
                <div className="bg-[#faf6f0]/20 p-5 rounded-full border border-white/20 group-hover:scale-95 transition-all text-[#221a05]">
                  <Store className="w-10 h-10 text-white" />
                </div>
              </div>
            </div>

            {/* Feature 4: Digital Health Records */}
            <div 
              onClick={() => {
                if (user.isLoggedIn) {
                  setView('dashboard');
                } else {
                  setView('signin');
                }
              }}
              className="md:col-span-2 bg-[#faf6f0] p-8 rounded-2xl shadow-sm border border-[#c4c8bc]/10 hover:shadow-md transition-shadow flex flex-col sm:flex-row gap-8 items-center cursor-pointer group"
            >
              <div className="flex-1 space-y-4">
                <div className="w-12 h-12 rounded-xl bg-[#c4a66a]/15 flex items-center justify-center text-[#c4a66a]">
                  <FolderHeart className="w-6 h-6" />
                </div>
                <h3 className="text-xl sm:text-2xl font-headline font-bold text-[#2e3230]">Expediente Médico Digital</h3>
                <p className="text-sm text-[#4a4e4a] leading-relaxed">
                  Toda la evolución clínica de tu mascota digitalizada. Descarga recetas médicas, resultados de laboratorio y diagnósticos al instante.
                </p>
              </div>
              
              <div className="w-full sm:w-64 h-40 flex items-center justify-center bg-[#f0ece4] rounded-xl border-2 border-dashed border-[#c4c8bc]/50 text-center p-4">
                <div className="space-y-1.5 text-center">
                  <span className="text-xs font-semibold text-[#4a4e4a] block font-headline underline">Documento SGC CLINIC</span>
                  <p className="text-[11px] text-[#4a4e4a]/75">Click para ver expedientes clínicos</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Trust & Security Section */}
      <section className="py-24 px-6 sm:px-12 md:px-16 lg:px-24 bg-[#faf6f0]">
        <div className="container mx-auto grid lg:grid-cols-2 gap-16 items-center max-w-7xl">
          <div className="order-2 lg:order-1">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="bg-[#f0ece4] p-6 rounded-xl space-y-3 shadow-inner border border-[#c4c8bc]/20">
                <ShieldCheck className="w-8 h-8 text-[#4a7c59]" />
                <h4 className="font-bold text-lg text-[#2e3230]">Protocolo HTTPS</h4>
                <p className="text-sm text-[#4a4e4a] leading-relaxed">
                  Tus datos personales y los de tus mascotas están cifrados bajo los más altos estándares de protección digital.
                </p>
              </div>
              
              <div className="bg-[#f0ece4] p-6 rounded-xl space-y-3 shadow-inner border border-[#c4c8bc]/20 sm:mt-8">
                <UserRoundCheck className="w-8 h-8 text-[#4a7c59]" />
                <h4 className="font-bold text-lg text-[#2e3230]">Atención Profesional</h4>
                <p className="text-sm text-[#4a4e4a] leading-relaxed">
                  Contamos con un equipo de veterinarios certificados listos para brindar amor y ciencia en cada una de sus visitas.
                </p>
              </div>
            </div>
          </div>
          
          <div className="order-1 lg:order-2 space-y-6">
            <h2 className="text-3.5xl font-display text-[#2e3230]">Confianza en cada paso</h2>
            <p className="text-[#4a4e4a] leading-relaxed">
              En SGC entendemos que tu mascota es un miembro primordial de la familia. Por eso, hemos co-creado un ecosistema digital robusto que no solo optimiza tu agenda diaria, sino que guarda celosamente tu información.
            </p>
            
            <blockquote className="border-l-4 border-[#c4a66a] pl-6 italic text-[#2e3230] py-4 bg-[#f0ece4]/40 rounded-r-lg">
              "SGC cambió mi forma de organizar las vacunas de mi perrita Luna. Todo es tan amigable y visual que ahora nunca olvido una cita médica."
              <footer className="mt-3 font-bold not-italic text-sm text-[#4a7c59]">— María G., Cliente SGC</footer>
            </blockquote>
          </div>
        </div>
      </section>

      {/* CTA Box Section */}
      <section className="py-20 px-6 sm:px-12 md:px-16 lg:px-24">
        <div className="container mx-auto max-w-5xl bg-[#4a7c59] text-white rounded-3xl p-10 sm:p-16 md:p-20 text-center space-y-8 relative overflow-hidden shadow-xl border border-white/10">
          {/* Subtle green overlay art */}
          <div className="absolute inset-0 bg-[#ebd8b4]/5 mix-blend-overlay" />
          
          <div className="relative z-10 max-w-3xl mx-auto space-y-6">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-display leading-[1.12]">
              ¿Listo para darle el mejor cuidado a tu mascota?
            </h2>
            <p className="text-[#d8f0de] text-base sm:text-lg">
              Únete a miles de dueños que ya confían su tiempo y la salud de sus animales en el ecosistema digital SGC.
            </p>
            <div className="pt-4">
              <button 
                onClick={() => setView('booking')}
                className="px-10 py-5 bg-[#ebd8b4] text-[#554020] rounded-xl font-bold text-lg sm:text-xl shadow-2xl hover:scale-105 active:scale-95 transition-all"
              >
                Agendar Cita Ahora
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer is rendered at App-level */}
    </div>
  );
}
