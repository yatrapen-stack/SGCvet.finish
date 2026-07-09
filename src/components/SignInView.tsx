/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Mail, Lock, Sparkles, ArrowLeft, ArrowRight, ShieldCheck, Heart } from 'lucide-react';
import { View } from '../types';

interface SignInViewProps {
  onLogin: (email: string, name: string, role?: 'user' | 'admin') => void;
  setView: (view: View) => void;
}

export default function SignInView({ onLogin, setView }: SignInViewProps) {
  const [email, setEmail] = useState('cuidamostumascota@gmail.com'); // Pre-fill with user email as helper
  const [password, setPassword] = useState('sgcpassword123'); // Custom password default
  const [loading, setLoading] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [fullName, setFullName] = useState('');
  const [passwordError, setPasswordError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      alert('Favor escribir un correo electrónico válido');
      return;
    }

    if (password.length < 8) {
      const errorMsg = 'Error: La contraseña debe tener un mínimo de 8 caracteres.';
      setPasswordError(errorMsg);
      alert(errorMsg);
      return;
    }
    
    setPasswordError(null);
    setLoading(true);
    // Simulate real brief network loading to feel high premium quality
    setTimeout(() => {
      setLoading(false);
      onLogin(email, 'vetSGC');
      setView('dashboard');
    }, 850);
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) {
      alert('Favor recibir un Nombre Completo válido');
      return;
    }
    if (!email) {
      alert('Favor escribir un correo electrónico válido');
      return;
    }
    if (password.length < 8) {
      const errorMsg = 'Error: La contraseña debe tener un mínimo de 8 caracteres.';
      setPasswordError(errorMsg);
      alert(errorMsg);
      return;
    }

    setPasswordError(null);
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onLogin(email, fullName.trim());
      setView('dashboard');
    }, 850);
  };

  return (
    <div className="min-h-screen bg-[#faf6f0] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 font-sans animate-fade-in relative">
      
      {/* Back to Home absolute link */}
      <button 
        onClick={() => setView('home')}
        className="absolute top-6 left-6 flex items-center gap-2 text-sm font-bold text-[#4a4e4a] hover:text-[#4a7c59] transition-colors focus:outline-none focus:ring-1 focus:ring-[#4a7c59] px-3 py-1.5 rounded-lg hover:bg-[#f0ece4]/40"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Volver al Inicio</span>
      </button>

      {/* Login Card Grid Frame matching third screenshot */}
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-xl overflow-hidden grid md:grid-cols-2 border border-[#c4c8bc]/20">
        
        {/* Left column: Full portrait background image overlay */}
        <div className="relative hidden md:block bg-[#4a7c59]">
          <img 
            alt="Mascotas domésticas de SGC" 
            className="w-full h-full object-cover absolute inset-0 mix-blend-overlay opacity-80"
            src="https://images.unsplash.com/photo-1623387641168-d9803ddd3f35?auto=format&fit=crop&q=80&w=800"
          />
          
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          
          <div className="relative z-10 p-10 h-full flex flex-col justify-end text-white space-y-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-[#ffffff]/15 backdrop-blur-md text-xs font-bold w-fit uppercase">
              <Sparkles className="w-3" />
              <span>SGC Vet Portal</span>
            </div>
            
            <h2 className="text-3xl font-display leading-tight">
              Bienvenido de vuelta a SGC
            </h2>
            
            <p className="text-[#ebd8b4] text-xs leading-relaxed max-w-sm font-medium">
              Todo el respaldo de nuestro centro veterinario online. Revisa historiales, compra alimentos premium y agenda visitas al instante.
            </p>
          </div>
        </div>

        {/* Right column: Form */}
        <div className="p-8 sm:p-12 flex flex-col justify-center space-y-8 bg-[#faf6f0]/30">
          {!isRegistering ? (
            <>
              <div>
                <div className="w-10 h-10 rounded-lg bg-[#4a7c59] flex items-center justify-center text-white mb-4 shadow">
                  <Heart className="w-5 h-5 fill-white text-white" />
                </div>
                
                <h3 className="text-2xl font-headline font-semibold text-[#2e3230]">Acceder a SGC</h3>
                <p className="text-xs text-[#4a4e4a] mt-1.5">Introduce tus credenciales para ingresar de forma segura.</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                
                {/* Email input field */}
                <div className="space-y-1">
                  <label className="text-[10px] font-extrabold text-[#4a4e4a] uppercase tracking-wider block">Correo Electrónico</label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#4a4e4a]/60" />
                    <input 
                      type="email" 
                      value={email}
                      required
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-white border border-[#c4c8bc]/50 rounded-xl py-3 pl-11 pr-4 text-sm focus:ring-1 focus:ring-[#4a7c59] focus:border-[#4a7c59] focus:outline-none transition-all placeholder-[#4a4e4a]/55 text-[#2e3230]"
                      placeholder="ejemplo@correo.com" 
                    />
                  </div>
                </div>

                {/* Password input field */}
                <div className="space-y-1">
                  <div className="flex justify-between items-center">
                    <label className="text-[10px] font-extrabold text-[#4a4e4a] uppercase tracking-wider block">Contraseña</label>
                    <button 
                      type="button" 
                      onClick={() => alert('Próximamente disponible recuperación automática. Contactar soporte SGC.')}
                      className="text-[10px] font-bold text-[#4a7c59] hover:underline focus:outline-none cursor-pointer"
                    >
                      ¿Olvidaste tu contraseña?
                    </button>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#4a4e4a]/60" />
                    <input 
                      type="password" 
                      value={password}
                      required
                      onChange={(e) => {
                        setPassword(e.target.value);
                        if (e.target.value.length >= 8) {
                          setPasswordError(null);
                        }
                      }}
                      className="w-full bg-white border border-[#c4c8bc]/50 rounded-xl py-3 pl-11 pr-4 text-sm focus:ring-1 focus:ring-[#4a7c59] focus:border-[#4a7c59] focus:outline-none transition-all text-[#2e3230]"
                      placeholder="••••••••••••" 
                    />
                  </div>
                  {passwordError && (
                    <p className="text-xs text-red-600 font-semibold mt-1">
                      {passwordError}
                    </p>
                  )}
                </div>

                {/* Submit button with loader */}
                <button 
                  type="submit"
                  disabled={loading}
                  className={`w-full py-3 bg-[#4a7c59] hover:bg-[#3d6749] text-white font-bold rounded-xl transition-all shadow text-sm flex items-center justify-center gap-2 active:scale-[0.98] cursor-pointer ${
                    loading ? 'opacity-85 pointer-events-none' : ''
                  }`}
                >
                  {loading ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Verificando...</span>
                    </>
                  ) : (
                    <>
                      <span>Ingresar a SGC (Cliente)</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

                {/* Quick login as Admin for TC_CS_008 */}
                <button 
                  type="button"
                  onClick={() => {
                    setLoading(true);
                    setTimeout(() => {
                      setLoading(false);
                      onLogin('admin@sgcvet.cl', 'Administrador SGC', 'admin');
                      setView('admin');
                    }, 600);
                  }}
                  className="w-full py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl transition-all shadow text-xs flex items-center justify-center gap-2 active:scale-[0.98] cursor-pointer"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>🔑 Simular Ingreso como Administrador</span>
                </button>

                {/* Registration text link */}
                <div className="text-center pt-2 text-xs text-[#4a4e4a]">
                  ¿No tienes una cuenta?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setIsRegistering(true);
                      setPasswordError(null);
                    }}
                    className="text-[#4a7c59] font-bold hover:underline cursor-pointer focus:outline-none"
                  >
                    Regístrate aquí
                  </button>
                </div>

              </form>
            </>
          ) : (
            <>
              <div>
                <div className="w-10 h-10 rounded-lg bg-[#4a7c59] flex items-center justify-center text-white mb-4 shadow">
                  <Heart className="w-5 h-5 fill-white text-white" />
                </div>
                
                <h3 className="text-2xl font-headline font-semibold text-[#2e3230]">Registro</h3>
                <p className="text-xs text-[#4a4e4a] mt-1.5 font-medium">Crea tu cuenta de SGC para acceder al panel veterinario.</p>
              </div>

              <form onSubmit={handleRegisterSubmit} className="space-y-4">
                
                {/* Full Name input field */}
                <div className="space-y-1">
                  <label className="text-[10px] font-extrabold text-[#4a4e4a] uppercase tracking-wider block">Nombre Completo</label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#4a4e4a]/60 text-sm font-semibold">@</span>
                    <input 
                      type="text" 
                      value={fullName}
                      required
                      placeholder="Tu Nombre Completo"
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full bg-white border border-[#c4c8bc]/50 rounded-xl py-3 pl-11 pr-4 text-sm focus:ring-1 focus:ring-[#4a7c59] focus:border-[#4a7c59] focus:outline-none transition-all text-[#2e3230]"
                    />
                  </div>
                </div>

                {/* Email input field */}
                <div className="space-y-1">
                  <label className="text-[10px] font-extrabold text-[#4a4e4a] uppercase tracking-wider block">Correo Electrónico</label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#4a4e4a]/60" />
                    <input 
                      type="email" 
                      value={email}
                      required
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-white border border-[#c4c8bc]/50 rounded-xl py-3 pl-11 pr-4 text-sm focus:ring-1 focus:ring-[#4a7c59] focus:border-[#4a7c59] focus:outline-none transition-all text-[#2e3230]"
                      placeholder="ejemplo@correo.com" 
                    />
                  </div>
                </div>

                {/* Password input field */}
                <div className="space-y-1">
                  <label className="text-[10px] font-extrabold text-[#4a4e4a] uppercase tracking-wider block">Contraseña</label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#4a4e4a]/60" />
                    <input 
                      type="password" 
                      value={password}
                      required
                      onChange={(e) => {
                        setPassword(e.target.value);
                        if (e.target.value.length >= 8) {
                          setPasswordError(null);
                        }
                      }}
                      className="w-full bg-white border border-[#c4c8bc]/50 rounded-xl py-3 pl-11 pr-4 text-sm focus:ring-1 focus:ring-[#4a7c59] focus:border-[#4a7c59] focus:outline-none transition-all text-[#2e3230]"
                      placeholder="••••••••••••" 
                    />
                  </div>
                  {passwordError && (
                    <p className="text-xs text-red-600 font-semibold mt-1">
                      {passwordError}
                    </p>
                  )}
                </div>

                {/* Submit button with loader */}
                <button 
                  type="submit"
                  disabled={loading}
                  className={`w-full py-3 bg-[#4a7c59] hover:bg-[#3d6749] text-white font-bold rounded-xl transition-all shadow text-sm flex items-center justify-center gap-2 active:scale-[0.98] cursor-pointer ${
                    loading ? 'opacity-85 pointer-events-none' : ''
                  }`}
                >
                  {loading ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Creando Cuenta...</span>
                    </>
                  ) : (
                    <>
                      <span>Crear Cuenta</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

                {/* Back to Login link */}
                <div className="text-center pt-2 text-xs text-[#4a4e4a]">
                  ¿Ya tienes una cuenta?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setIsRegistering(false);
                      setPasswordError(null);
                    }}
                    className="text-[#4a7c59] font-bold hover:underline cursor-pointer focus:outline-none"
                  >
                    Inicia sesión aquí
                  </button>
                </div>

              </form>
            </>
          )}

          {/* Secure gateway note */}
          <div className="pt-4 border-t border-[#c4c8bc]/30 flex items-center justify-center gap-2 text-[10px] text-[#4a4e4a] font-semibold">
            <ShieldCheck className="w-4 h-4 text-[#4a7c59]" />
            <span>Encriptado de datos bajo protocolo SSL seguro de SGC</span>
          </div>

        </div>

      </div>

    </div>
  );
}
