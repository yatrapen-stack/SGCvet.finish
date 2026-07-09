/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  PlusCircle, 
  Trash2, 
  CalendarDays, 
  ShieldAlert, 
  FileText,
  MousePointerClick,
  Activity,
  Heart,
  CheckCircle2,
  AlertTriangle,
  Search,
  ChevronDown,
  ChevronUp,
  X,
  AlertCircle,
  Eye,
  Download,
  Share2,
  Mail
} from 'lucide-react';
import { jsPDF } from 'jspdf';
import { Pet, Appointment, View } from '../types';

interface DashboardViewProps {
  pets: Pet[];
  appointments: Appointment[];
  onCancelAppointment: (id: string, petName?: string, serviceName?: string) => void;
  onOpenHistoryModal: (pet: Pet) => void;
  setView: (view: View) => void;
  setSelectedPet: (pet: Pet | null) => void;
  onAddPet: (name: string, species: 'Perro' | 'Gato' | 'Exótico', breed: string, age: string, image?: string) => void;
}

interface PostOperativeGuide {
  id: string;
  title: string;
  category: 'Cirugía General' | 'Traumatología' | 'Esterilización' | 'Limpieza Dental' | 'Ortopedia';
  alimentation: string;
  medication: string;
  whenToCallVet: string;
}

const POST_OP_GUIDES: PostOperativeGuide[] = [
  {
    id: 'g1',
    title: 'Cuidados tras Esterilización',
    category: 'Esterilización',
    alimentation: 'Ofrecer agua fresca en pequeñas cantidades de 4 a 6 horas después de que la mascota despierte por completo de la anestesia. Al día siguiente, puede reanudar su alimento seco o húmedo habitual, pero sirviendo solo la mitad de la porción recomendada para prevenir posibles náuseas o vómitos por la anestesia residual.',
    medication: 'Administrar puntualmente los analgésicos prescritos (ej. meloxicam) cada 24 horas y los antibióticos orales indicados por el cirujano. No suspender la dosis antes de tiempo y evitar aplicar cremas o ungüentos tópicos directamente sobre la herida quirúrgica a menos que se haya recetado explícitamente.',
    whenToCallVet: 'Sangrado rojo vivo continuo en la zona de la sutura, encías de un tono muy pálido o azulado, letargo profundo o falta de respuesta al estímulo después de 24 horas del procedimiento, fiebre alta, vómitos repetidos, o si se observa desprendimiento evidente de los puntos de sutura.'
  },
  {
    id: 'g2',
    title: 'Recuperación de Cirugía Ortopédica',
    category: 'Ortopedia',
    alimentation: 'Favorecer una dieta rica en proteínas de alta calidad y suplementada con ácidos grasos Omega-3 para acelerar la curación tisular y ósea. Controle estrictamente las porciones: el reposo obligatorio reduce su consumo calórico, por lo que se debe evitar el sobrepeso para no sobrecargar la extremidad intervenida.',
    medication: 'Suministrar analgésicos potentes y antiinflamatorios recetados estrictamente cada 12 o 24 horas. Los protectores articulares (condroprotectores) deben administrarse con constancia. Mantenga la terapia antibiótica completa aunque note que su mascota ya no muestra signos de dolor o cojera evidente.',
    whenToCallVet: 'Cojera extrema repentina en la pata operada tras haber mostrado mejoría, inflamación o calor excesivo en la articulación, llanto o gemidos de dolor agudo al mínimo contacto físico, secreción purulenta con mal olor, o si la herida se torna de un color rojo violáceo muy encendido.'
  },
  {
    id: 'g3',
    title: 'Cuidado Post-Limpieza Dental',
    category: 'Limpieza Dental',
    alimentation: 'Proporcione de forma exclusiva alimento húmedo blando, paté veterinario o croquetas regulares previamente ablandadas con agua tibia durante las primeras 48 a 72 horas. Evite por completo premios rígidos, huesos recreativos o juguetes de morder duros que puedan lesionar las encías sensibles.',
    medication: 'Aplicar el gel de clorhexidina antiséptico recomendado directamente en las encías con un aplicador suave dos veces al día para evitar infecciones bacterianas. Administrar analgésicos suaves según el nivel de sensibilidad o incomodidad que muestre la mascota al intentar comer.',
    whenToCallVet: 'Sangrado bucal continuo o profuso por más de 12 horas seguidas, rechazo absoluto a beber agua o ingerir alimentos blandos pasadas las primeras 24 horas, salivación excesiva (sialorrea) acompañada de quejidos constantes, o hinchazón facial asimétrica en la mejilla.'
  },
  {
    id: 'g4',
    title: 'Tratamiento tras Cirugía General',
    category: 'Cirugía General',
    alimentation: 'Ofrecer una dieta blanda de muy fácil digestión (como pollo hervido sin sal ni condimentos con arroz blanco) en porciones sumamente pequeñas y frecuentes durante las primeras 48 horas. Disponga agua limpia en todo momento, pero controle la velocidad de consumo para evitar espasmos digestivos.',
    medication: 'Administre el antibiótico de amplio espectro recetado cada 12 horas, junto con el tratamiento antiinflamatorio correspondiente. Es obligatorio mantener colocado el collar isabelino o body de protección las 24 horas para impedir que la mascota lama, rasque o muerda la incisión quirúrgica.',
    whenToCallVet: 'Fiebre persistente (temperatura corporal rectal superior a 39.5 °C), vómitos recurrentes que impiden la absorción de medicamentos, letargo severo y desinterés generalizado por más de un día, o si la herida quirúrgica presenta mal olor, enrojecimiento severo o hinchazón.'
  },
  {
    id: 'g5',
    title: 'Rehabilitación en Traumatología',
    category: 'Traumatología',
    alimentation: 'Ofrecer un plan de alimentación equilibrado de fácil masticación. Mantenga el plato de comida y agua elevado a la altura del pecho de la mascota para evitar que deba inclinarse, forzar el cuello o transferir un peso excesivo a los miembros anteriores lesionados o a la columna vertebral.',
    medication: 'Proporcione analgésicos, relajantes musculares y protectores estomacales según las instrucciones veterinarias exactas. Si se recomienda, aplique frío local protegido con un paño limpio sobre la zona inflamada durante un período máximo de 5 minutos, repitiendo según la frecuencia indicada.',
    whenToCallVet: 'Pérdida súbita de sensibilidad o movilidad en las extremidades, si arrastra las patas al intentar reincorporarse, presencia de incontinencia urinaria o fecal repentina, o llanto agudo y persistente que no cede ni con el reposo absoluto ni con la medicación analgésica.'
  }
];

export default function DashboardView({
  pets,
  appointments,
  onCancelAppointment,
  onOpenHistoryModal,
  setView,
  setSelectedPet,
  onAddPet
}: DashboardViewProps) {
  
  // Local state for registering a pet in line
  const [showAddForm, setShowAddForm] = useState(false);
  const [petName, setPetName] = useState('');
  const [petBreed, setPetBreed] = useState('');
  const [petAge, setPetAge] = useState('');
  const [petSpecies, setPetSpecies] = useState<'Perro' | 'Gato' | 'Exótico'>('Perro');
  const [petImage, setPetImage] = useState('https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&q=80&w=300');

  // Cancellation Modal and Audit logs states
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [apptToCancel, setApptToCancel] = useState<{ id: string; petName: string; serviceName: string } | null>(null);
  
  // Custom green success Toast notification
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [cancelSuccessNotification, setCancelSuccessNotification] = useState(false);

  // Dynamically managed state for audit logs
  const [auditLogs, setAuditLogs] = useState<any[]>(() => {
    const logs = localStorage.getItem('sgc_audit_logs');
    return logs ? JSON.parse(logs) : [];
  });

  const activeAppts = appointments.filter(a => a.status !== 'canceled');

  // Post-operative care guides state
  const [searchQueryGuides, setSearchQueryGuides] = useState('');
  const [selectedCategoryGuide, setSelectedCategoryGuide] = useState<string>('Todos');
  const [expandedGuideId, setExpandedGuideId] = useState<string | null>(null);
  const [fullscreenGuide, setFullscreenGuide] = useState<PostOperativeGuide | null>(null);

  const filteredGuides = React.useMemo(() => {
    return POST_OP_GUIDES.filter(guide => {
      const matchesSearch = guide.title.toLowerCase().includes(searchQueryGuides.toLowerCase()) ||
                            guide.alimentation.toLowerCase().includes(searchQueryGuides.toLowerCase()) ||
                            guide.medication.toLowerCase().includes(searchQueryGuides.toLowerCase()) ||
                            guide.whenToCallVet.toLowerCase().includes(searchQueryGuides.toLowerCase());
      const matchesCategory = selectedCategoryGuide === 'Todos' || guide.category === selectedCategoryGuide;
      return matchesSearch && matchesCategory;
    });
  }, [searchQueryGuides, selectedCategoryGuide]);

  // Dynamic PDF download function
  const downloadGuideAsPDF = (guide: PostOperativeGuide) => {
    try {
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      // Colors
      const primaryColor = [74, 124, 89]; // #4a7c59
      const charcoal = [46, 50, 48]; // #2e3230
      const amberDark = [112, 92, 48]; // #705c30
      const redAlert = [184, 50, 48]; // #b83230

      // Header Banner
      doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      doc.rect(0, 0, 210, 32, 'F');

      doc.setTextColor(255, 255, 255);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(16);
      doc.text('SISTEMA DE GESTION CLINICA (SGC)', 15, 12);
      
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9.5);
      doc.text(`Guia Clinica Post-Operatoria Oficial • Procedimiento de ${guide.category}`, 15, 20);
      doc.text(`Fecha de generacion: ${new Date().toLocaleDateString('es-CL')} | Documento Oficial Offline`, 15, 25);

      let currentY = 44;

      // Guide Title
      doc.setTextColor(charcoal[0], charcoal[1], charcoal[2]);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(15);
      doc.text(guide.title, 15, currentY);
      currentY += 7;

      // Category Sub
      doc.setFontSize(9);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(amberDark[0], amberDark[1], amberDark[2]);
      doc.text(`ESTATUS CLINICO: DE ALTA EN RECUPERACION (${guide.category.toUpperCase()})`, 15, currentY);
      currentY += 8;

      // Divider
      doc.setDrawColor(196, 200, 188);
      doc.line(15, currentY, 195, currentY);
      currentY += 8;

      // Helper for sections
      const renderSection = (secTitle: string, secContent: string, titleColor: number[], bgColor: number[]) => {
        // Background card
        doc.setFillColor(bgColor[0], bgColor[1], bgColor[2]);
        doc.rect(15, currentY, 180, 8, 'F');

        // Header text
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(10.5);
        doc.setTextColor(titleColor[0], titleColor[1], titleColor[2]);
        doc.text(secTitle.toUpperCase(), 18, currentY + 5.5);
        currentY += 12;

        // Body content
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9.5);
        doc.setTextColor(charcoal[0], charcoal[1], charcoal[2]);

        const lines = doc.splitTextToSize(secContent, 174);
        lines.forEach((line: string) => {
          if (currentY > 275) {
            doc.addPage();
            currentY = 20;
          }
          doc.text(line, 18, currentY);
          currentY += 5.5;
        });
        currentY += 7;
      };

      // 1. Alimentacion
      renderSection('1. Alimentacion post-anestesia y de soporte', guide.alimentation, amberDark, [254, 243, 199]);

      // 2. Medicamentos
      renderSection('2. Administracion de analgesicos y antibioticos', guide.medication, [0, 102, 204], [239, 246, 255]);

      // 3. Cuándo llamar
      renderSection('3. SIGNOS DE ALERTA (Urgencia de inmediato)', guide.whenToCallVet, redAlert, [254, 242, 242]);

      // Emergency info card
      if (currentY > 255) {
        doc.addPage();
        currentY = 20;
      }
      doc.setFillColor(254, 242, 242);
      doc.setDrawColor(252, 165, 165);
      doc.rect(15, currentY, 180, 18, 'FD');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.setTextColor(redAlert[0], redAlert[1], redAlert[2]);
      doc.text('📞 URGENCIAS VETERINARIAS SGC (24/7): +56 9 1234 5678', 20, currentY + 7);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8.5);
      doc.setTextColor(charcoal[0], charcoal[1], charcoal[2]);
      doc.text('Si observa sangrado abundante, letargo profundo o falta de respuesta, acuda de inmediato.', 20, currentY + 13);

      doc.save(`SGC_Guia_PostOp_${guide.category.replace(/\s+/g, '_')}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  };

  // Share guide action
  const handleShareGuide = async (guide: PostOperativeGuide, method: 'whatsapp' | 'email' | 'native') => {
    const textToShare = `🏥 *Guía Post-Operatoria SGC: ${guide.title}* (${guide.category})\n\n` +
      `🍽️ *Alimentación:* ${guide.alimentation}\n\n` +
      `💊 *Medicamentos:* ${guide.medication}\n\n` +
      `🚨 *Cuándo llamar urgente:* ${guide.whenToCallVet}\n\n` +
      `📞 Urgencias 24h SGC: +56 9 1234 5678`;

    if (method === 'native') {
      if (navigator.share) {
        try {
          await navigator.share({
            title: `Guía Post-Operatoria SGC: ${guide.title}`,
            text: textToShare,
          });
          return;
        } catch (e) {
          console.warn('Navigator share rejected/failed, using fallback:', e);
        }
      }
      // Fallback method
      method = 'whatsapp';
    }

    if (method === 'whatsapp') {
      const encoded = encodeURIComponent(textToShare);
      window.open(`https://api.whatsapp.com/send?text=${encoded}`, '_blank');
    } else if (method === 'email') {
      const subject = encodeURIComponent(`Guía Post-Operatoria SGC: ${guide.title}`);
      const body = encodeURIComponent(
        `Guía Post-Operatoria SGC: ${guide.title}\n` +
        `Categoría: ${guide.category}\n\n` +
        `1. ALIMENTACIÓN:\n${guide.alimentation}\n\n` +
        `2. MEDICAMENTOS:\n${guide.medication}\n\n` +
        `3. CUÁNDO LLAMAR AL VETERINARIO:\n${guide.whenToCallVet}\n\n` +
        `📞 Urgencias Veterinarias SGC (24h): +56 9 1234 5678\n`
      );
      window.open(`mailto:?subject=${subject}&body=${body}`, '_self');
    }
  };

  const handleSubmitPet = (e: React.FormEvent) => {
    e.preventDefault();
    if (!petName || !petBreed || !petAge) {
      alert('Favor completa todos los datos obligatorios.');
      return;
    }
    onAddPet(petName, petSpecies, petBreed, petAge, petImage);
    alert(`¡${petName} ha sido añadido con éxito al sistema!`);
    setPetName('');
    setPetBreed('');
    setPetAge('');
    setPetImage('https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&q=80&w=300');
    setShowAddForm(false);
  };

  const handleBookWithPet = (pet: Pet) => {
    setSelectedPet(pet);
    setView('booking');
  };

  const triggerCancelClick = (apptId: string, petName: string, serviceName: string) => {
    setApptToCancel({ id: apptId, petName, serviceName });
    setShowCancelModal(true);
  };

  const confirmCancellation = () => {
    if (!apptToCancel) return;

    // Trigger parent callback with log support
    onCancelAppointment(apptToCancel.id, apptToCancel.petName, apptToCancel.serviceName);

    // Append to local audit log state for immediate update
    const timestamp = new Date();
    const newLog = {
      id: 'log_' + Date.now(),
      appointmentId: apptToCancel.id,
      petName: apptToCancel.petName,
      serviceName: apptToCancel.serviceName,
      user: 'vetSGC',
      date: timestamp.toLocaleDateString('es-ES'),
      time: timestamp.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
    };

    setAuditLogs(prev => [newLog, ...prev]);

    // Dispatch the custom Toast notification
    setToastMessage(`Cita de ${apptToCancel.serviceName} para ${apptToCancel.petName} fue anulada con éxito.`);
    setShowToast(true);

    // Show top and center visual success notification banner
    setCancelSuccessNotification(true);

    // Auto fade-out after 5 seconds
    setTimeout(() => {
      setShowToast(false);
    }, 5000);

    // Close security dialog and redirect after exactly 3 seconds
    setTimeout(() => {
      setCancelSuccessNotification(false);
      setShowCancelModal(false);
      setApptToCancel(null);
    }, 3000);
  };

  return (
    <div className="space-y-10 animate-fade-in">
      {/* SGC Welcome Dashboard message */}
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-headline font-bold text-[#2e3230]">Panel del Propietario</h1>
          <p className="text-[#4a4e4a] text-sm mt-1">Monitorea las horas agendadas y mantén al día la salud de todos tus seres amados.</p>
        </div>
        
        <button 
          onClick={() => {
            setSelectedPet(null);
            setView('booking');
          }}
          className="px-6 py-3 bg-[#4a7c59] text-white rounded-xl font-bold flex items-center gap-2 shadow hover:bg-[#3d6749] transition-all cursor-pointer active:scale-95 text-sm"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Nueva Cita</span>
        </button>
      </header>

      {/* Grid containing Left: Mis Mascotas & Próximas Citas; Right: Guía y Consejos */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Columns (span 2) */}
        <div className="lg:col-span-2 space-y-10">
          
          {/* Section: Mis Mascotas list card layout */}
          <section className="space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-[#c4c8bc]/25">
              <h3 className="text-lg font-headline font-bold text-[#2e3230] flex items-center gap-2">
                <Heart className="w-5 h-5 text-[#4a7c59]" />
                Mis Mascotas
              </h3>
              
              <button 
                onClick={() => setShowAddForm(true)}
                className="text-xs font-bold text-[#4a7c59] hover:underline flex items-center gap-1 cursor-pointer focus:outline-none"
              >
                + Registrar Nueva
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {pets.map((pet) => (
                <div 
                  key={pet.id} 
                  className="bg-[#faf6f0] p-5 rounded-2xl border border-[#c4c8bc]/25 flex gap-4 hover:shadow-md transition-shadow group relative overflow-hidden"
                >
                  <img 
                    src={pet.image} 
                    alt={pet.name} 
                    className="w-16 h-16 rounded-full object-cover border-2 border-[#78a886]/40 bg-[#ebd8b4]/10 shadow-sm"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.onerror = null;
                      target.src = pet.species === 'Gato' 
                        ? 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&q=80&w=300'
                        : pet.species === 'Exótico'
                        ? 'https://images.unsplash.com/photo-1531804055935-76f44d7c3621?auto=format&fit=crop&q=80&w=300'
                        : 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&q=80&w=300';
                    }}
                  />
                  
                  <div className="flex-1 space-y-3">
                    <div>
                      <h4 className="font-headline font-bold text-base text-[#2e3230]">{pet.name}</h4>
                      <p className="text-xs text-[#4a4e4a]">{pet.breed} • {pet.age}</p>
                    </div>

                    <div className="flex gap-2 text-xs">
                      <button 
                        onClick={() => onOpenHistoryModal(pet)}
                        className="px-3 py-1.5 bg-[#f0ece4] hover:bg-[#ebd8b4]/30 text-[#4a4e4a] rounded-lg font-bold border border-[#c4c8bc]/20 transition-all font-label"
                      >
                        Historia Clínica
                      </button>
                      
                      <button 
                        onClick={() => handleBookWithPet(pet)}
                        className="px-3 py-1.5 bg-[#4a7c59] hover:bg-[#3d6749] text-white rounded-lg font-bold transition-all shadow-sm font-label"
                      >
                        Nueva Cita
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Section: Próximas Citas (Reservations list) */}
          <section className="space-y-4">
            <h3 className="text-lg font-headline font-bold text-[#2e3230] pb-2 border-b border-[#c4c8bc]/25 flex items-center gap-2">
              <CalendarDays className="w-5 h-5 text-[#4a7c59]" />
              Próximas Citas Agendadas
            </h3>

            {activeAppts.length > 0 ? (
              <div className="space-y-4">
                {activeAppts.map((appt) => (
                  <div 
                    key={appt.id}
                    className="bg-[#faf6f0] p-5 rounded-2xl border border-[#c4c8bc]/25 flex flex-col sm:flex-row justify-between sm:items-center gap-4 hover:shadow-sm"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-11 h-11 rounded-xl bg-[#4a7c59]/10 flex items-center justify-center text-[#4a7c59] shrink-0 font-headline font-bold">
                        {appt.date.substring(0, 3)}
                      </div>
                      
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-headline font-bold text-base text-[#2e3230]">{appt.serviceName}</h4>
                          <span className="text-xs font-bold text-[#4a4e4a]">para {appt.petName}</span>
                        </div>
                        
                        <div className="flex items-center gap-4 text-xs text-[#4a4e4a] mt-1 font-semibold">
                          <span className="flex items-center gap-1">
                            <span className="w-2 h-2 rounded-full bg-[#ebd8b4]" />
                            {appt.date}
                          </span>
                          <span>•</span>
                          <span>{appt.time}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-6 border-t sm:border-t-0 pt-3 sm:pt-0">
                      <div>
                        <p className="text-xs text-[#4a4e4a] font-semibold text-left sm:text-right">Costo Estimado</p>
                        <p className="font-headline font-bold text-base text-[#4a7c59]">{appt.price}</p>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="px-3 py-1.5 bg-[#d8f0de] text-[#2a6038] rounded-full text-[10px] font-bold uppercase tracking-wider">
                          Confirmada
                        </span>
                        
                        <button 
                          onClick={() => triggerCancelClick(appt.id, appt.petName, appt.serviceName)}
                          className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                          title="Cancelar Cita"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-[#faf6f0] border-2 border-dashed border-[#c4c8bc] rounded-2xl p-10 text-center text-[#4a4e4a]">
                <ShieldAlert className="w-10 h-10 text-[#ebd8b4] mx-auto mb-2" />
                <p className="text-sm font-bold">No tienes ninguna cita agendada en este momento.</p>
                <button 
                  onClick={() => setView('booking')}
                  className="mt-3 px-5 py-2 bg-[#4a7c59] text-white text-xs font-bold rounded-lg shadow-sm hover:bg-[#3d6749]"
                >
                  Agendar una Cita Ahora
                </button>
              </div>
            )}
          </section>

          {/* Audit Logs section (Local storage audit logging simulation) */}
          <section className="space-y-4">
            <h3 className="text-lg font-headline font-bold text-[#2e3230] pb-2 border-b border-[#c4c8bc]/25 flex items-center gap-2">
              <FileText className="w-5 h-5 text-[#4a7c59]" />
              Registro de Auditoría de Anulaciones (Logs SGC)
            </h3>

            {auditLogs.length > 0 ? (
              <div className="bg-[#faf6f0] rounded-xl border border-[#c4c8bc]/25 overflow-hidden divide-y divide-[#c4c8bc]/15 shadow-sm">
                {auditLogs.slice(0, 5).map((log) => (
                  <div key={log.id} className="p-4 flex flex-col sm:flex-row justify-between sm:items-center text-xs text-[#4a4e4a] gap-2 hover:bg-[#ebd8b4]/5 transition-colors">
                    <div className="space-y-1">
                      <p className="font-bold text-[#2e3230]">
                        ID Cita: <span className="font-mono text-[10.5px] bg-[#f0ece4] px-1 py-0.5 rounded text-[#4a4e4a]/90">{log.appointmentId.substring(0, 15)}...</span> • Mascota: <span className="text-[#4a7c59] font-bold">{log.petName}</span> • ({log.serviceName})
                      </p>
                      <p className="text-[10px] text-[#4a4e4a]/85">
                        Ejecutor administrativo: <span className="font-bold text-[#2e3230]">{log.user}</span>
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="font-semibold text-[#2e3230]">{log.date}</p>
                      <p className="text-[10.5px] text-[#78a886] font-bold">{log.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-[#faf6f0]/50 border-2 border-dashed border-[#c4c8bc]/30 rounded-2xl p-8 text-center text-xs text-[#4a4e4a]/70">
                <FileText className="w-8 h-8 text-[#c4c8bc]/50 mx-auto mb-1.5" />
                <p>No se han registrado auditorías de cancelación de citas en esta sesión.</p>
              </div>
            )}
          </section>

        </div>

        {/* Right column sidebar widgets (span 1) */}
        <div className="space-y-8">
          
          {/* Widget 1: Daily advice */}
          <div className="bg-[#705c30]/10 p-6 rounded-2xl border border-[#705c30]/20 space-y-3">
            <div className="w-9 h-9 rounded-lg bg-[#705c30]/15 flex items-center justify-center text-[#705c30]">
              <Activity className="w-5 h-5 animate-pulse" />
            </div>
            
            <h4 className="font-headline font-bold text-lg text-[#221a05]">Consejo Veterinario del Día</h4>
            <p className="text-xs text-[#554020] leading-relaxed">
              Durante épocas calurosas o secas, mantén platos de agua limpia y templada en diferentes habitaciones de tu casa. Esto disminuye drásticamente el riesgo de cálculos renales y fatigas térmicas en felinos senior de raza persa.
            </p>
          </div>

          {/* Widget 2: Guías Post-Operatorias */}
          <div className="bg-[#faf6f0] p-6 rounded-2xl border border-[#c4c8bc]/25 space-y-4 shadow-sm text-left">
            <h4 className="font-headline font-bold text-base text-[#2e3230] pb-2 border-b border-[#c4c8bc]/25 flex items-center justify-between">
              <span className="flex items-center gap-2">
                <FileText className="w-4.5 h-4.5 text-[#4a7c59]" />
                Guías Post-Operatorias
              </span>
              <span className="text-[10px] bg-red-100 text-red-800 px-2 py-0.5 rounded font-bold uppercase tracking-wider animate-pulse">
                Urgente / Clínico
              </span>
            </h4>

            <p className="text-[11px] text-[#4a4e4a] leading-relaxed">
              Consulte instrucciones de cuidado y recuperación tras procedimientos de anestesia e intervenciones quirúrgicas.
            </p>

            {/* Search bar inside the guides widget */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#4a4e4a]/60 w-3.5 h-3.5" />
              <input 
                type="text"
                value={searchQueryGuides}
                onChange={(e) => setSearchQueryGuides(e.target.value)}
                className="w-full bg-[#f0ece4] border-none rounded-xl py-2 pl-9 pr-3 text-xs placeholder-[#4a4e4a]/60 text-[#2e3230] outline-none focus:ring-1 focus:ring-[#4a7c59] focus:bg-white transition-all"
                placeholder="Buscar pautas o síntomas..."
              />
              {searchQueryGuides && (
                <button 
                  onClick={() => setSearchQueryGuides('')} 
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 hover:bg-[#e4e0d8] rounded-full text-[#4a4e4a]"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>

            {/* Quick Category Filters Dropdown or scrollable pills */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-[#4a4e4a] uppercase tracking-wider block">Filtrar por Procedimiento:</label>
              <div className="flex flex-wrap gap-1">
                {['Todos', 'Cirugía General', 'Traumatología', 'Esterilización', 'Limpieza Dental', 'Ortopedia'].map((cat) => {
                  const isSelected = selectedCategoryGuide === cat;
                  return (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setSelectedCategoryGuide(cat)}
                      className={`px-2 py-1 rounded text-[10px] font-bold transition-all ${
                        isSelected 
                          ? 'bg-[#4a7c59] text-white shadow-sm' 
                          : 'bg-[#f0ece4] text-[#4a4e4a] hover:bg-[#ebd8b4]/20 hover:text-[#4a7c59]'
                      }`}
                    >
                      {cat}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* List of guides */}
            <div className="space-y-3.5 text-xs">
              {filteredGuides.length > 0 ? (
                filteredGuides.map((guide) => {
                  const isExpanded = expandedGuideId === guide.id;
                  return (
                    <div 
                      key={guide.id}
                      className={`border rounded-xl overflow-hidden transition-all duration-200 ${
                        isExpanded 
                          ? 'border-[#ebd8b4] bg-white shadow-md' 
                          : 'border-[#c4c8bc]/30 bg-[#f0ece4]/40 hover:bg-[#ebd8b4]/10'
                      }`}
                    >
                      {/* Accordion Trigger Header */}
                      <div 
                        onClick={() => setExpandedGuideId(isExpanded ? null : guide.id)}
                        className="p-3.5 flex items-center justify-between cursor-pointer select-none"
                      >
                        <div className="space-y-0.5">
                          <span className="text-[9px] bg-[#f0ece4] text-[#4a4e4a] px-1.5 py-0.5 rounded font-extrabold uppercase tracking-wide">
                            {guide.category}
                          </span>
                          <h5 className="font-bold text-[#2e3230] mt-1 group-hover:text-[#4a7c59]">{guide.title}</h5>
                        </div>
                        <div className="flex items-center gap-2">
                          {isExpanded ? (
                            <ChevronUp className="w-4 h-4 text-[#4a7c59]" />
                          ) : (
                            <ChevronDown className="w-4 h-4 text-[#4a4e4a]/60" />
                          )}
                        </div>
                      </div>

                      {/* Accordion Expanded Body */}
                      {isExpanded && (
                        <div className="p-4 border-t border-[#c4c8bc]/20 bg-[#faf6f0]/30 space-y-5 animate-fade-in">
                          
                          {/* 1. ALIMENTACIÓN BLOCK */}
                          <div className="space-y-1.5 p-3.5 bg-[#fbfaf7] rounded-xl border border-amber-200/50">
                            <div className="flex items-center gap-1.5 text-[#705c30]">
                              <span className="w-2 h-2 rounded-full bg-amber-500" />
                              <span className="font-headline font-bold text-[11px] uppercase tracking-wider">Alimentación</span>
                            </div>
                            <p className="text-[11px] text-[#4a4e4a] leading-relaxed text-justify">
                              {guide.alimentation}
                            </p>
                          </div>

                          {/* 2. MEDICAMENTOS BLOCK */}
                          <div className="space-y-1.5 p-3.5 bg-[#fbfaf7] rounded-xl border border-blue-200/50">
                            <div className="flex items-center gap-1.5 text-blue-700">
                              <span className="w-2 h-2 rounded-full bg-blue-500" />
                              <span className="font-headline font-bold text-[11px] uppercase tracking-wider">Medicamentos</span>
                            </div>
                            <p className="text-[11px] text-[#4a4e4a] leading-relaxed text-justify">
                              {guide.medication}
                            </p>
                          </div>

                          {/* 3. EMERGENCY SIGNS BLOCK */}
                          <div className="space-y-1.5 p-3.5 bg-red-50/75 border border-red-200 rounded-xl">
                            <div className="flex items-center gap-1.5 text-red-700">
                              <AlertCircle className="w-4 h-4 text-red-600 animate-pulse" />
                              <span className="font-headline font-bold text-[11px] uppercase tracking-wider">Cuándo llamar al veterinario</span>
                            </div>
                            <p className="text-[11.5px] text-red-950 font-medium leading-relaxed text-justify">
                              {guide.whenToCallVet}
                            </p>
                          </div>

                          {/* Actions Bar (Download PDF, Share) */}
                          <div className="grid grid-cols-2 gap-2 pt-1">
                            <button
                              type="button"
                              onClick={() => downloadGuideAsPDF(guide)}
                              className="py-2.5 bg-[#4a7c59] hover:bg-[#3d6749] text-white rounded-lg font-bold text-[10.5px] flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-sm"
                            >
                              <Download className="w-3.5 h-3.5" />
                              <span>Descargar PDF</span>
                            </button>
                            
                            <button
                              type="button"
                              onClick={() => setFullscreenGuide(guide)}
                              className="py-2.5 bg-white hover:bg-[#f0ece4] border border-[#c4c8bc]/60 text-[#2e3230] rounded-lg font-bold text-[10.5px] flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                            >
                              <Eye className="w-3.5 h-3.5" />
                              <span>Pantalla Completa</span>
                            </button>
                          </div>

                          {/* Share Options */}
                          <div className="bg-[#f0ece4]/50 border border-[#c4c8bc]/20 rounded-xl p-2.5 flex flex-col gap-2">
                            <span className="text-[9px] font-bold text-[#4a4e4a] uppercase tracking-wider block text-left">Compartir Guía Rápida:</span>
                            <div className="grid grid-cols-3 gap-1.5">
                              <button
                                type="button"
                                onClick={() => handleShareGuide(guide, 'whatsapp')}
                                className="py-1.5 px-2 bg-[#25d366]/10 hover:bg-[#25d366]/20 text-[#128c7e] rounded-lg font-bold text-[10px] flex items-center justify-center gap-1 transition-all cursor-pointer"
                              >
                                <span>WhatsApp</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => handleShareGuide(guide, 'email')}
                                className="py-1.5 px-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg font-bold text-[10px] flex items-center justify-center gap-1 transition-all cursor-pointer"
                              >
                                <Mail className="w-3 h-3" />
                                <span>Email</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => handleShareGuide(guide, 'native')}
                                className="py-1.5 px-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-bold text-[10px] flex items-center justify-center gap-1 transition-all cursor-pointer"
                              >
                                <Share2 className="w-3 h-3" />
                                <span>Compartir</span>
                              </button>
                            </div>
                          </div>

                        </div>
                      )}
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-6 text-[#4a4e4a]/75 bg-[#f0ece4]/40 rounded-xl border border-dashed border-[#c4c8bc]/50">
                  <p className="font-bold text-[11px]">No se encontraron pautas post-operatorias.</p>
                  <p className="text-[10px] mt-0.5">Intenta buscar con otros términos.</p>
                </div>
              )}
            </div>
          </div>

          {/* Widget 3: Emergency support cards */}
          <div className="bg-[#faf6f0] p-6 rounded-2xl border border-[#c4c8bc]/25 space-y-3 shadow-sm">
            <h4 className="font-headline font-bold text-sm text-red-600">Contacto de Urgencias SGC</h4>
            <p className="text-xs text-[#4a4e4a] leading-relaxed">
              Atención médica de urgencia disponible las 24 horas del día en nuestras dependencias físicas, o comunícate telefónicamente para primeros auxilios previos al viaje.
            </p>
            <div className="bg-[#b83230]/5 border border-red-200 p-3 rounded-lg text-red-700 text-xs font-bold flex items-center justify-center gap-2">
              <span>Llamar al SGC: +56 9 1234 5678</span>
            </div>
          </div>

        </div>

      </div>

      {/* Embedded inline Add Pet Modal Form (Standard) */}
      {showAddForm && (
        <div className="fixed inset-0 bg-[#2e3230]/40 backdrop-blur-sm z-[110] flex items-center justify-center p-4">
          <div className="bg-[#faf6f0] rounded-2xl w-full max-w-md p-6 shadow-2xl relative border border-[#c4c8bc]/30">
            <h3 className="text-xl font-headline font-bold text-[#4a7c59] mb-4 flex items-center gap-2">
              <PlusCircle className="w-5 h-5" />
              <span>Registrar Mascota</span>
            </h3>
            
            <form onSubmit={handleSubmitPet} className="space-y-4 text-left">
              <div className="space-y-1">
                <label className="text-xs font-bold text-[#4a4e4a] uppercase">Nombre Mascota</label>
                <input 
                  type="text" 
                  value={petName} 
                  required
                  onChange={(e) => setPetName(e.target.value)} 
                  className="w-full bg-white border border-[#c4c8bc]/50 rounded-lg p-2.5 text-sm focus:outline-[#4a7c59]" 
                  placeholder="Ej: Bruno" 
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-[#4a4e4a] uppercase">Especie</label>
                <select 
                  value={petSpecies} 
                  onChange={(e) => {
                    const val = e.target.value as 'Perro' | 'Gato' | 'Exótico';
                    setPetSpecies(val);
                    if (val === 'Gato') {
                      setPetImage('https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&q=80&w=300');
                    } else if (val === 'Exótico') {
                      setPetImage('https://images.unsplash.com/photo-1531804055935-76f44d7c3621?auto=format&fit=crop&q=80&w=300');
                    } else {
                      setPetImage('https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&q=80&w=300');
                    }
                  }} 
                  className="w-full bg-white border border-[#c4c8bc]/50 rounded-lg p-2.5 text-sm focus:outline-[#4a7c59]"
                >
                  <option value="Perro">Perro</option>
                  <option value="Gato">Gato</option>
                  <option value="Exótico">Exótico</option>
                </select>
              </div>

              {/* Photo Selector & Preview component (SGC Quality Control) */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#4a4e4a] uppercase block">Foto de Perfil de la Mascota</label>
                <div className="flex items-center gap-4 bg-[#faf6f0] p-3.5 rounded-xl border border-[#c4c8bc]/40">
                  <div className="relative shrink-0">
                    <img 
                      src={petImage} 
                      alt="Vista previa" 
                      className="w-16 h-16 rounded-full object-cover border-2 border-[#4a7c59] bg-[#ebd8b4]/20 shadow-sm"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.onerror = null;
                        target.src = petSpecies === 'Gato' 
                          ? 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&q=80&w=300'
                          : petSpecies === 'Exótico'
                          ? 'https://images.unsplash.com/photo-1531804055935-76f44d7c3621?auto=format&fit=crop&q=80&w=300'
                          : 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&q=80&w=300';
                      }}
                    />
                    <span className="absolute -bottom-1 -right-1 bg-[#4a7c59] text-white text-[8px] font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wider scale-90">SGC</span>
                  </div>
                  <div className="flex-1 space-y-1.5">
                    <p className="text-[10px] text-[#4a4e4a] leading-tight font-medium">Asigna una foto predefinida o ingresa una URL personalizada:</p>
                    
                    <div className="flex gap-1.5 overflow-x-auto py-0.5 max-w-[220px]">
                      {(petSpecies === 'Gato' ? [
                        'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&q=80&w=300',
                        'https://images.unsplash.com/photo-1533738363-b7f9aef128ce?auto=format&fit=crop&q=80&w=300',
                        'https://images.unsplash.com/photo-1618826411640-d6df44dd3f7a?auto=format&fit=crop&q=80&w=300'
                      ] : petSpecies === 'Exótico' ? [
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
                          onClick={() => setPetImage(url)}
                          className={`w-8 h-8 rounded-full border-2 overflow-hidden transition-all shrink-0 ${petImage === url ? 'border-[#4a7c59] scale-110 shadow-sm' : 'border-[#c4c8bc]/40'}`}
                        >
                          <img src={url} className="w-full h-full object-cover" />
                        </button>
                      ))}
                    </div>

                    <input 
                      type="text" 
                      value={petImage}
                      onChange={(e) => setPetImage(e.target.value)}
                      className="w-full bg-white border border-[#c4c8bc]/50 rounded-lg px-2 py-1 text-[10px] font-mono focus:outline-[#4a7c59]"
                      placeholder="URL personalizada de imagen"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-[#4a4e4a] uppercase">Raza / Familia</label>
                <input 
                  type="text" 
                  value={petBreed} 
                  required
                  onChange={(e) => setPetBreed(e.target.value)} 
                  className="w-full bg-white border border-[#c4c8bc]/50 rounded-lg p-2.5 text-sm focus:outline-[#4a7c59]" 
                  placeholder="Ej: Pastor Alemán" 
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-[#4a4e4a] uppercase">Edad / Ciclo Vital</label>
                <input 
                  type="text" 
                  value={petAge} 
                  required
                  onChange={(e) => setPetAge(e.target.value)} 
                  className="w-full bg-white border border-[#c4c8bc]/50 rounded-lg p-2.5 text-sm focus:outline-[#4a7c59]" 
                  placeholder="Ej: 1 año y 3 meses" 
                />
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <button 
                  type="button" 
                  onClick={() => setShowAddForm(false)} 
                  className="px-4 py-2 border border-[#c4c8bc] text-[#4a4e4a] rounded-lg text-sm font-bold font-label"
                >
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  className="px-5 py-2 bg-[#4a7c59] text-white rounded-lg text-sm font-bold shadow hover:bg-[#3d6749] font-label"
                >
                  Guardar Perfil
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* Security Cancellation modal */}
      {showCancelModal && apptToCancel && (
        <div className="fixed inset-0 bg-[#2e3230]/40 backdrop-blur-sm z-[110] flex items-center justify-center p-4">
          <div className="bg-[#faf6f0] rounded-2xl w-full max-w-md p-6 shadow-2xl relative border border-[#c4c8bc]/30 animate-fade-in text-left">
            {!cancelSuccessNotification ? (
              <>
                <h3 className="text-xl font-headline font-bold text-red-600 mb-2 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                  <span>Confirmar Anulación</span>
                </h3>
                
                <p className="text-sm text-[#4a4e4a] leading-relaxed mb-4 text-left">
                  Estás a punto de anular permanentemente la cita de <strong className="text-[#2e3230] font-bold">{apptToCancel?.serviceName}</strong> agendada para la mascota <strong className="text-[#2e3230] font-bold">{apptToCancel?.petName}</strong>.
                </p>

                <div className="bg-[#b83230]/5 border border-red-200 p-3.5 rounded-xl text-[11px] text-red-800 leading-normal font-medium mb-5 text-left">
                  ⚠️ <strong>Control de Calidad (Auditoría SGC):</strong> Esta acción registrará inmediatamente el código de cita, usuario operador (<span className="font-bold underline">vetSGC</span>), dirección IP de nodo y marca temporal.
                </div>

                <div className="flex justify-end gap-2 text-xs font-bold font-label">
                  <button 
                    type="button" 
                    onClick={() => {
                      setShowCancelModal(false);
                      setApptToCancel(null);
                    }} 
                    className="px-4 py-2 border border-[#c4c8bc] text-[#4a4e4a] rounded-lg transition-colors hover:bg-[#ebd8b4]/10 cursor-pointer"
                  >
                    Volver Atrás
                  </button>
                  
                  <button 
                    type="button" 
                    onClick={confirmCancellation} 
                    className="px-5 py-2 bg-red-600 text-white rounded-lg shadow-sm hover:bg-red-700 transition-all cursor-pointer active:scale-95"
                  >
                    Confirmar Anulación
                  </button>
                </div>
              </>
            ) : (
              <div className="py-8 text-center space-y-4 animate-fade-in">
                <div className="w-16 h-16 bg-emerald-100 text-[#4a7c59] rounded-full flex items-center justify-center mx-auto mb-2 animate-bounce">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h4 className="font-headline font-extrabold text-lg text-emerald-800">¡Acción Exitosa!</h4>
                <div className="bg-emerald-50 border-2 border-emerald-500 p-4 rounded-xl shadow-inner">
                  <p className="font-extrabold text-emerald-800 text-sm leading-relaxed">
                    La hora fue cancelada con éxito
                  </p>
                </div>
                <p className="text-[10px] text-gray-400 font-mono">Cerrando flujo y actualizando base de datos...</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Persistent floating banner at the upper part of the screen */}
      {cancelSuccessNotification && (
        <div className="fixed inset-x-0 top-10 z-[250] flex justify-center px-4 pointer-events-none">
          <div className="bg-[#4a7c59] text-white px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 max-w-md w-full animate-slide-in border border-emerald-500/30">
            <CheckCircle2 className="w-6 h-6 text-white shrink-0" />
            <span className="font-extrabold text-sm tracking-wide">La hora fue cancelada con éxito</span>
          </div>
        </div>
      )}

      {/* Dynamic Toast Feedback Notification */}
      {showToast && (
        <div className="fixed bottom-6 right-6 z-[200] max-w-sm w-full bg-[#faf6f0] border-l-4 border-[#4a7c59] rounded-xl shadow-xl p-4 animate-slide-in flex items-start gap-3 border border-[#c4c8bc]/30 text-left">
          <div className="w-8 h-8 rounded-full bg-emerald-50 text-[#4a7c59] flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-5 h-5 shrink-0 text-[#4a7c59]" />
          </div>
          <div className="flex-grow text-left">
            <h5 className="font-bold text-sm text-[#2e3230]">Cita Cancelada</h5>
            <p className="text-xs text-[#4a4e4a] mt-0.5 leading-relaxed">{toastMessage}</p>
          </div>
          <button 
            type="button"
            onClick={() => setShowToast(false)}
            className="text-[#4a4e4a]/60 hover:text-[#4a4e4a] text-xs font-bold focus:outline-none p-1 shrink-0"
          >
            ✕
          </button>
        </div>
      )}

      {/* DETAILED FULLSCREEN LECTURA/STRESS MODAL FOR POST-OPERATIVE GUIDES */}
      {fullscreenGuide && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-md z-[150] flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-2xl p-8 shadow-2xl relative border-2 border-red-200/50 max-h-[90vh] overflow-y-auto">
            
            {/* Close button */}
            <button 
              onClick={() => setFullscreenGuide(null)}
              className="absolute top-6 right-6 p-2.5 hover:bg-[#f0ece4] rounded-full transition-colors text-[#4a4e4a] cursor-pointer"
              title="Cerrar Guía"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Header */}
            <div className="border-b border-[#c4c8bc]/30 pb-4 mb-6 text-left">
              <span className="text-[11px] bg-amber-100 text-amber-800 px-2.5 py-1 rounded-full font-extrabold uppercase tracking-wide">
                Guía Post-Operatoria Oficial SGC • {fullscreenGuide.category}
              </span>
              <h3 className="text-2xl font-headline font-bold text-[#2e3230] mt-3">
                {fullscreenGuide.title}
              </h3>
              <p className="text-xs text-[#4a4e4a]/80 mt-1">
                Siga meticulosamente las siguientes instrucciones clínicas para asegurar una recuperación óptima y libre de complicaciones de su mascota.
              </p>
            </div>

            {/* Big readable blocks for high-stress scenarios */}
            <div className="space-y-6 text-left">
              
              {/* Section 1: Alimentación */}
              <div className="bg-[#fcfbf9] border border-amber-200 rounded-2xl p-5 space-y-2.5 shadow-sm">
                <h4 className="font-headline font-bold text-sm text-amber-800 flex items-center gap-2 uppercase tracking-wide pb-1.5 border-b border-amber-100">
                  <span className="w-3 h-3 rounded-full bg-amber-500 block shrink-0" />
                  1. Alimentación y Consumo de Agua
                </h4>
                <p className="text-sm text-[#2e3230] font-medium leading-relaxed text-justify">
                  {fullscreenGuide.alimentation}
                </p>
              </div>

              {/* Section 2: Medicamentos */}
              <div className="bg-[#fafbff] border border-blue-200 rounded-2xl p-5 space-y-2.5 shadow-sm">
                <h4 className="font-headline font-bold text-sm text-blue-800 flex items-center gap-2 uppercase tracking-wide pb-1.5 border-b border-blue-100">
                  <span className="w-3 h-3 rounded-full bg-blue-500 block shrink-0" />
                  2. Suministro de Medicamentos y Horarios
                </h4>
                <p className="text-sm text-[#2e3230] font-medium leading-relaxed text-justify">
                  {fullscreenGuide.medication}
                </p>
              </div>

              {/* Section 3: Cuándo llamar urgente */}
              <div className="bg-red-50 border-2 border-red-300 rounded-2xl p-5 space-y-2.5 shadow-sm">
                <h4 className="font-headline font-bold text-sm text-red-800 flex items-center gap-2 uppercase tracking-wide pb-1.5 border-b border-red-100">
                  <AlertCircle className="w-5 h-5 text-red-600 shrink-0 animate-pulse" />
                  3. SIGNOS DE ALERTA (Llamar de Inmediato al Veterinario)
                </h4>
                <p className="text-sm text-red-950 font-bold leading-relaxed text-justify">
                  {fullscreenGuide.whenToCallVet}
                </p>
                <div className="mt-3 bg-white/85 p-3.5 rounded-xl border border-red-200 flex flex-col sm:flex-row justify-between items-center gap-3 text-[11.5px] font-bold text-red-800">
                  <span>📞 Urgencias Veterinarias SGC (24h):</span>
                  <a href="tel:+56912345678" className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                    Llamar ahora: +56 9 1234 5678
                  </a>
                </div>
              </div>

            </div>

            {/* Footer buttons / Actions */}
            <div className="mt-8 pt-5 border-t border-[#c4c8bc]/30 flex flex-col sm:flex-row justify-between items-center gap-4">
              {/* Left: Share & PDF actions */}
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => downloadGuideAsPDF(fullscreenGuide)}
                  className="px-4 py-2 bg-[#4a7c59] hover:bg-[#3d6749] text-white rounded-xl font-bold text-xs flex items-center gap-1.5 shadow-md transition-all cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>Guardar PDF Offline</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleShareGuide(fullscreenGuide, 'whatsapp')}
                  className="px-3 py-2 bg-[#25d366]/10 hover:bg-[#25d366]/20 text-[#128c7e] rounded-xl font-bold text-xs flex items-center gap-1 transition-all cursor-pointer"
                >
                  <span>WhatsApp</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleShareGuide(fullscreenGuide, 'email')}
                  className="px-3 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-xl font-bold text-xs flex items-center gap-1 transition-all cursor-pointer"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>Email</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleShareGuide(fullscreenGuide, 'native')}
                  className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
                  title="Compartir vía sistema operativo"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Compartir</span>
                </button>
              </div>

              {/* Right: Close button */}
              <button
                type="button"
                onClick={() => setFullscreenGuide(null)}
                className="w-full sm:w-auto px-6 py-2.5 bg-[#ebd8b4] hover:bg-[#dec8a0] text-[#221a05] rounded-xl font-bold text-xs shadow transition-all cursor-pointer"
              >
                Cerrar Guía
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
