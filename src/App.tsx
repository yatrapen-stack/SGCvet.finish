/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Menu, 
  X, 
  PawPrint, 
  Phone, 
  ShoppingBag, 
  User as UserIcon,
  HelpCircle,
  Clock,
  Sparkles,
  MapPin,
  CalendarCheck
} from 'lucide-react';
import { View, User, Pet, Appointment, CartItem, Product, ClinicalRecord } from './types';
import { INITIAL_PETS, INITIAL_APPOINTMENTS, PRODUCTS } from './data';

// Component imports
import Sidebar from './components/Sidebar';
import HomeView from './components/HomeView';
import BookingView from './components/BookingView';
import CatalogView from './components/CatalogView';
import DashboardView from './components/DashboardView';
import SignInView from './components/SignInView';
import PetHistoryModal from './components/PetHistoryModal';
import RecordsView from './components/RecordsView';
import AdminView from './components/AdminView';
import AuditLogsView from './components/AuditLogsView';

export default function App() {
  const [view, setView] = useState<View>('home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // App global state
  const [user, setUser] = useState<User>({
    email: 'cuidamostumascota@gmail.com',
    name: 'vetSGC',
    avatar: 'https://lh3.googleusercontent.com/aida/AP1WRLvzDxpqObZM0Yne_WPRIiKh6gEwMqtxpevnPhWgDm1Jj5O96vqLEbegw97QLicxdI7lFa9Iqa0Ouvb__kUlTsuc_243dsgIed3-NbmiRe0ggfZJIFFEDVk5VVnJ29uxQK0RUA103KdTCccsMccymxPxEC7Fij_WsCaDyU5GT7coj5mb2UOvwnLTbJJ6nKcEi7kOJHIn4jX_bj4qXIAair3zlxzuS7JRWEfr6NqhoQcEOaEDPesQW3lrCjM',
    isLoggedIn: false,
    role: 'user'
  });

  const [pets, setPets] = useState<Pet[]>(INITIAL_PETS);
  const [appointments, setAppointments] = useState<Appointment[]>(INITIAL_APPOINTMENTS as any);
  const [products, setProducts] = useState<Product[]>(PRODUCTS);
  const [cart, setCart] = useState<CartItem[]>([]);
  
  const [selectedPetForBooking, setSelectedPetForBooking] = useState<Pet | null>(null);
  const [historyModalPet, setHistoryModalPet] = useState<Pet | null>(null);
  const [showEmergencyModal, setShowEmergencyModal] = useState(false);

  // Authentication callbacks
  const handleLogin = (email: string, name: string, role: 'user' | 'admin' = 'user') => {
    setUser({
      email,
      name,
      avatar: role === 'admin'
        ? 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=200'
        : 'https://lh3.googleusercontent.com/aida/AP1WRLvzDxpqObZM0Yne_WPRIiKh6gEwMqtxpevnPhWgDm1Jj5O96vqLEbegw97QLicxdI7lFa9Iqa0Ouvb__kUlTsuc_243dsgIed3-NbmiRe0ggfZJIFFEDVk5VVnJ29uxQK0RUA103KdTCccsMccymxPxEC7Fij_WsCaDyU5GT7coj5mb2UOvwnLTbJJ6nKcEi7kOJHIn4jX_bj4qXIAair3zlxzuS7JRWEfr6NqhoQcEOaEDPesQW3lrCjM',
      isLoggedIn: true,
      role: role
    });
  };

  const handleLogout = () => {
    setUser(prev => ({ ...prev, isLoggedIn: false }));
    setView('home');
  };

  // Pets logic
  const handleAddPet = (name: string, species: 'Perro' | 'Gato' | 'Exótico', breed: string, age: string, image?: string) => {
    const randomRut = `${Math.floor(Math.random() * 12 + 10)}.${Math.floor(Math.random() * 899 + 100)}.${Math.floor(Math.random() * 899 + 100)}-${Math.floor(Math.random() * 9)}`;
    const randomPhone = `+56 9 ${Math.floor(50000000 + Math.random() * 40000000)}`;
    const newPet: Pet = {
      id: 'pet_' + Date.now(),
      name,
      species,
      breed,
      age,
      // Fallback cute standard images depending on species using robust Unsplash images
      image: image || (species === 'Gato' 
        ? 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&q=80&w=300'
        : species === 'Exótico'
        ? 'https://images.unsplash.com/photo-1531804055935-76f44d7c3621?auto=format&fit=crop&q=80&w=300'
        : 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&q=80&w=300'),
      rutDni: randomRut,
      bloodGroup: species === 'Gato' ? 'Tipo A' : 'DEA 1.1 Positivo',
      allergies: 'Ninguna conocida',
      chronicDiseases: 'Ninguna conocida',
      emergencyContact: randomPhone,
      history: []
    };
    setPets(prev => [...prev, newPet]);
  };

  const handleAddClinicalRecord = (petId: string, record: ClinicalRecord) => {
    setPets(prev => 
      prev.map(pet => pet.id === petId 
        ? { ...pet, history: [record, ...pet.history] } 
        : pet
      )
    );
  };

  // Appointment callbacks
  const handleAddAppointment = (appt: Appointment) => {
    setAppointments(prev => [appt, ...prev]);
  };

  const handleCancelAppointment = (id: string, petName: string = 'Mascota', serviceName: string = 'Servicio') => {
    setAppointments(prev => 
      prev.map(a => a.id === id ? { ...a, status: 'canceled' as const } : a)
    );

    // Create Audit Log record
    const timestamp = new Date();
    const newLog = {
      id: 'log_' + Date.now(),
      appointmentId: id,
      petName,
      serviceName,
      user: user.name || 'vetSGC',
      date: timestamp.toLocaleDateString('es-ES'),
      time: timestamp.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
    };

    // Save to local storage audit logs
    const existingLogs = localStorage.getItem('sgc_audit_logs');
    const logs = existingLogs ? JSON.parse(existingLogs) : [];
    logs.unshift(newLog);
    localStorage.setItem('sgc_audit_logs', JSON.stringify(logs));
  };

  // Cart operations
  const handleAddToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item => 
          item.product.id === product.id 
            ? { ...item, quantity: item.quantity + 1 } 
            : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
  };

  const handleUpdateCartQty = (productId: string, delta: number) => {
    setCart(prev => {
      return prev.map(item => {
        if (item.product.id === productId) {
          const newQty = item.quantity + delta;
          return { ...item, quantity: Math.max(1, newQty) };
        }
        return item;
      });
    });
  };

  const handleRemoveFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
  };

  const handleClearCart = () => {
    setCart([]);
  };

  // Quick navigation setup
  const navigateTo = (newView: View) => {
    setView(newView);
    setMobileMenuOpen(false);
  };

  // Rendering Layouts
  const renderHeader = () => {
    // Elegant floating Top nav bar matching screenshots
    return (
      <header className="bg-[#f0ece4] border-b border-[#c4c8bc]/30 py-4 px-6 sm:px-12 md:px-16 lg:px-24 sticky top-0 z-[80] flex justify-between items-center h-20">
        
        {/* Left Side: Brand Logo */}
        <div 
          onClick={() => navigateTo('home')}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-lg bg-[#4a7c59] flex items-center justify-center text-white transition-all group-hover:scale-105 active:scale-95 shadow">
            <PawPrint className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-headline text-[#4a7c59] text-xl font-bold tracking-tight leading-none group-hover:opacity-90">SGC Vet</h1>
            <p className="text-[10px] text-[#4a4e4a] font-bold">Gestión de Citas Veterinarias</p>
          </div>
        </div>

        {/* Center Side: Main Public Actions (Not logged in) */}
        {!user.isLoggedIn ? (
          <nav className="hidden md:flex items-center gap-8 text-sm font-bold text-[#4e4538]">
            <button onClick={() => navigateTo('home')} className={`hover:text-[#4a7c59] transition-all cursor-pointer ${view === 'home' ? 'text-[#4a7c59] underline underline-offset-4 decoration-2' : ''}`}>Inicio</button>
            <button onClick={() => navigateTo('booking')} className={`hover:text-[#4a7c59] transition-all cursor-pointer ${view === 'booking' ? 'text-[#4a7c59] underline underline-offset-4 decoration-2' : ''}`}>Reservar Cita</button>
            <button onClick={() => navigateTo('catalog')} className={`hover:text-[#4a7c59] transition-all cursor-pointer ${view === 'catalog' ? 'text-[#4a7c59] underline underline-offset-4 decoration-2' : ''}`}>Tienda</button>
          </nav>
        ) : (
          <nav className="hidden md:flex items-center gap-8 text-sm font-bold text-[#4e4538]">
            <button onClick={() => navigateTo('dashboard')} className="hover:text-[#4a7c59] transition-all cursor-pointer">Mi Panel</button>
            <button onClick={() => navigateTo('booking')} className="hover:text-[#4a7c59] transition-all cursor-pointer">Agendar</button>
            <button onClick={() => navigateTo('catalog')} className="hover:text-[#4a7c59] transition-all cursor-pointer">Tienda</button>
          </nav>
        )}

        {/* Right Side Actions */}
        <div className="hidden md:flex items-center gap-4">
          
          <button 
            onClick={() => setShowEmergencyModal(true)}
            className="text-xs font-bold text-red-600 border border-red-200 bg-red-50 hover:bg-red-100 transition-colors px-4 py-2 rounded-xl flex items-center gap-1.5 cursor-pointer shadow-sm"
          >
            <Phone className="w-3.5 h-3.5" />
            <span>Urgencia 24h</span>
          </button>

          {!user.isLoggedIn ? (
            <button 
              onClick={() => navigateTo('signin')}
              className="px-6 py-2.5 bg-[#4a7c59] hover:bg-[#3d6749] text-white rounded-xl font-bold text-xs shadow-md hover:translate-y-[-1px] transition-all active:translate-y-0 cursor-pointer"
            >
              Iniciar Sesión
            </button>
          ) : (
            <div className="flex items-center gap-3">
              {/* Role Simulator Selector (TC_CS_008) */}
              <div className="flex items-center gap-1.5 bg-[#ebd8b4]/20 border border-[#ebd8b4]/40 px-3 py-1 rounded-xl shadow-sm">
                <span className="text-[9px] font-extrabold text-[#705c30] uppercase">Simular:</span>
                <select
                  id="role-simulator-header-select"
                  value={user.role || 'user'}
                  onChange={(e) => {
                    const selectedRole = e.target.value as 'user' | 'admin';
                    setUser(prev => ({ ...prev, role: selectedRole }));
                    if (selectedRole === 'admin') {
                      navigateTo('admin');
                    } else {
                      navigateTo('dashboard');
                    }
                  }}
                  className="bg-transparent border-none text-xs font-bold text-[#4e4538] outline-none cursor-pointer focus:ring-0 p-0"
                >
                  <option value="user">👤 Cliente</option>
                  <option value="admin">🔑 Administrador</option>
                </select>
              </div>

              {/* Logged In User Pill display exactly like screenshot top bar details */}
              <div 
                onClick={() => navigateTo(user.role === 'admin' ? 'admin' : 'dashboard')}
                className="flex items-center gap-2.5 bg-[#faf6f0] border border-[#c4c8bc]/30 p-1.5 pl-3 rounded-full shadow-sm cursor-pointer hover:bg-[#faf6f0]/80 group"
              >
                <div className="text-right">
                  <p className="text-xs font-bold text-[#2e3230] leading-none group-hover:text-[#4a7c59] transition-colors">{user.name}</p>
                  <p className="text-[9px] text-[#4a4e4a] leading-none mt-0.5">{user.email}</p>
                </div>
                <img 
                  src={user.avatar} 
                  alt={user.name} 
                  className="w-8 h-8 rounded-full border-2 border-[#4a7c59] object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>
          )}

        </div>

        {/* Hamburger Mobile controller */}
        <button 
          onClick={() => setMobileMenuOpen(prev => !prev)}
          className="md:hidden p-2 text-[#4a4e4a] hover:bg-[#faf6f0]/40 rounded-lg transition-colors focus:outline-none focus:ring-1 focus:ring-[#4a7c59]"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>

      </header>
    );
  };

  const renderMobileMenu = () => {
    if (!mobileMenuOpen) return null;
    return (
      <div className="md:hidden bg-[#f0ece4] border-b border-[#c4c8bc]/30 p-6 flex flex-col gap-4 animate-fade-in absolute w-full left-0 z-50 shadow-lg">
        <button onClick={() => navigateTo('home')} className="text-left font-bold text-[#4a4e4a] py-1 border-b border-[#ebd8b4]/20 hover:text-[#4a7c59]">Inicio</button>
        <button onClick={() => navigateTo('booking')} className="text-left font-bold text-[#4a4e4a] py-1 border-b border-[#ebd8b4]/20 hover:text-[#4a7c59]">Reservar Cita</button>
        <button onClick={() => navigateTo('catalog')} className="text-left font-bold text-[#4a4e4a] py-1 border-b border-[#ebd8b4]/20 hover:text-[#4a7c59]">Tienda</button>
        
        {user.isLoggedIn && (
          <button onClick={() => navigateTo('dashboard')} className="text-left font-bold text-[#4a4e4a] py-1 border-b border-[#ebd8b4]/20 hover:text-[#4a7c59]">Mi Panel SGC</button>
        )}

        <div className="pt-2 flex flex-col gap-3">
          <button 
            onClick={() => {
              setShowEmergencyModal(true);
              setMobileMenuOpen(false);
            }}
            className="py-2.5 rounded-lg border border-red-200 bg-red-50 text-red-600 font-bold text-xs shadow-sm flex items-center justify-center gap-2"
          >
            <Phone className="w-3.5 h-3.5" />
            <span>Contacto Urgencia</span>
          </button>

          {!user.isLoggedIn ? (
            <button 
              onClick={() => navigateTo('signin')}
              className="py-2.5 rounded-lg bg-[#4a7c59] text-white font-bold text-xs shadow-md"
            >
              Iniciar Sesión
            </button>
          ) : (
            <button 
              onClick={handleLogout}
              className="py-2.5 rounded-lg border border-[#c4c8bc] text-red-600 font-semibold text-xs bg-white"
            >
              Cerrar Sesión SGC
            </button>
          )}
        </div>
      </div>
    );
  };

  const renderFooter = () => {
    return (
      <footer className="bg-[#2e3230] text-[#e4e0d8] border-t border-white/5 py-12 px-6 sm:px-12 md:px-16 lg:px-24">
        <div className="container mx-auto max-w-7xl grid grid-cols-1 md:grid-cols-4 gap-8">
          
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#4a7c59] flex items-center justify-center text-white">
                <PawPrint className="w-5 h-5 animate-pulse" />
              </div>
              <h1 className="font-headline text-xl font-bold text-white">SGC Vet</h1>
            </div>
            <p className="text-xs text-[#a8aaa4] leading-relaxed">
              La plataforma líder en el agendamiento y control médico de mascotas. Tecnología de vanguardia y amor veterinario.
            </p>
          </div>

          <div className="space-y-3">
            <h4 className="font-headline font-bold text-sm text-white">Servicios</h4>
            <ul className="space-y-2 text-xs text-[#a8aaa4]">
              <li>Consulta General</li>
              <li>Cirugía Preventiva & Compleja</li>
              <li>Limpieza Dental Avanzada</li>
              <li>Programas de Vacunación</li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="font-headline font-bold text-sm text-white">Contacto Principal</h4>
            <ul className="space-y-2 text-xs text-[#a8aaa4]">
              <li className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-[#78a886]" /> Av. Vitacura 1234, Santiago, Chile</li>
              <li className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5 text-[#78a886]" /> +56 9 1234 5678</li>
              <li className="flex items-center gap-1.5"><CalendarCheck className="w-3.5 h-3.5 text-[#78a886]" /> Lunes a Sábado: 09:00 - 19:30</li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="font-headline font-bold text-sm text-white">Seguridad Integral</h4>
            <p className="text-xs text-[#a8aaa4] leading-relaxed">
              Todos tus historiales médicos clínicos y datos personales de contacto se almacenan bajo cifrado informático de máxima seguridad.
            </p>
            <div className="bg-white/5 border border-white/10 px-3 py-1.5 rounded text-[10px] text-white font-bold inline-block">
              SGC SECURE SYSTEM V1.2
            </div>
          </div>

        </div>

        <div className="container mx-auto max-w-7xl border-t border-white/5 mt-10 pt-6 text-center text-xs text-[#a8aaa4]">
          <p>© 2026 SGC Veterinary & Medical Management. Todos los derechos reservados. Creado para {user.email}</p>
        </div>
      </footer>
    );
  };

  const renderActiveView = () => {
    switch (view) {
      case 'home':
        return (
          <HomeView 
            user={user} 
            setView={navigateTo} 
            onEmergencyClick={() => setShowEmergencyModal(true)} 
          />
        );
      case 'booking':
        return (
          <BookingView 
            pets={pets} 
            onAddPet={handleAddPet} 
            onAddAppointment={handleAddAppointment} 
            setView={navigateTo} 
          />
        );
      case 'catalog':
        return (
          <CatalogView 
            products={products}
            setProducts={setProducts}
            cart={cart}
            onAddToCart={handleAddToCart}
            onUpdateCartQty={handleUpdateCartQty}
            onRemoveFromCart={handleRemoveFromCart}
            onClearCart={handleClearCart}
          />
        );
      case 'dashboard':
        return (
          <DashboardView 
            pets={pets} 
            appointments={appointments} 
            onCancelAppointment={handleCancelAppointment} 
            onOpenHistoryModal={(p) => setHistoryModalPet(p)} 
            setView={navigateTo} 
            setSelectedPet={setSelectedPetForBooking}
            onAddPet={handleAddPet}
          />
        );
      case 'admin':
        return (
          <AdminView 
            products={products} 
            setProducts={setProducts} 
            appointments={appointments} 
          />
        );
      case 'signin':
        return (
          <SignInView 
            onLogin={handleLogin} 
            setView={navigateTo} 
          />
        );
      case 'records':
        return (
          <RecordsView 
            pets={pets} 
            onAddClinicalRecord={handleAddClinicalRecord} 
          />
        );
      case 'logs':
        return (
          <AuditLogsView />
        );
      default:
        return <HomeView user={user} setView={navigateTo} onEmergencyClick={() => setShowEmergencyModal(true)} />;
    }
  };

  // Logged-in screens gets left sidebar (layout split)
  const isDashboardLayout = user.isLoggedIn && (view === 'dashboard' || view === 'booking' || view === 'catalog' || view === 'records' || view === 'admin' || view === 'logs');

  return (
    <div className="bg-[#faf6f0] text-[#2e3230] min-h-screen flex flex-col font-sans">
      
      {/* Top Floating bar */}
      {renderHeader()}
      {renderMobileMenu()}

      {/* Main workspace container splitter */}
      {isDashboardLayout ? (
        <div className="flex-1 w-full flex">
          {/* SGC Sidebar */}
          <Sidebar 
            currentView={view} 
            setView={navigateTo} 
            user={user} 
            onLogout={handleLogout} 
            onOpenBooking={() => navigateTo('booking')} 
          />
          
          {/* Split Right Content Workspace */}
          <main className="flex-1 min-w-0 p-6 sm:p-12 md:p-16 lg:pl-72 lg:pr-12 py-10">
            <div className="max-w-6xl mx-auto">
              {renderActiveView()}
            </div>
          </main>
        </div>
      ) : (
        <main className="flex-1">
          {renderActiveView()}
        </main>
      )}

      {/* Flat Footer */}
      {!isDashboardLayout && view !== 'signin' && renderFooter()}

      {/* Pet Clinical History modal sheet */}
      {historyModalPet && (
        <PetHistoryModal 
          pet={historyModalPet} 
          onClose={() => setHistoryModalPet(null)} 
        />
      )}

      {/* Emergency notification details popup */}
      {showEmergencyModal && (
        <div className="fixed inset-0 bg-[#2e3230]/40 backdrop-blur-sm z-[115] flex items-center justify-center p-4">
          <div className="bg-[#faf6f0] rounded-2xl w-full max-w-md p-6 shadow-2xl relative border border-[#c4c8bc]/30 text-center space-y-4">
            <div className="w-14 h-14 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-2 animate-bounce">
              <Phone className="w-7 h-7" />
            </div>
            
            <h3 className="text-xl font-headline font-bold text-red-600">Contacto de Urgencias SGC</h3>
            
            <p className="text-xs text-[#4a4e4a] leading-relaxed">
              Nuestro equipo médico está preparado para recibir cualquier eventualidad de carácter vital las 24 horas en nuestra clínica de Av. Vitacura 1234.
            </p>

            <div className="bg-[#f0ece4] p-4 rounded-xl border border-[#c4c8bc]/20 group hover:bg-[#ebd8b4]/20 transition-all cursor-pointer">
              <p className="text-[10px] font-bold text-[#4a4e4a] uppercase">Línea Telefónica Directa</p>
              <p className="text-lg font-bold text-red-600 mt-1">+56 9 1234 5678</p>
            </div>

            <button 
              onClick={() => setShowEmergencyModal(false)}
              className="w-full py-2.5 bg-[#4a7c59] text-white font-bold rounded-lg hover:bg-opacity-90 transition-all text-sm cursor-pointer"
            >
              Entendido, volver
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
