/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { 
  Database, 
  Cpu, 
  RefreshCw, 
  AlertTriangle, 
  Terminal, 
  Barcode, 
  Send, 
  CheckCircle2, 
  Plus, 
  Minus, 
  ShoppingBag, 
  Bell,
  Clock,
  History,
  AlertCircle
} from 'lucide-react';
import { Product, Appointment } from '../types';

interface AdminViewProps {
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  appointments: Appointment[];
}

interface AuditLog {
  id: string;
  timestamp: string;
  type: 'SMS_NOTIFICATION' | 'INVENTORY_SYNC' | 'SYSTEM';
  description: string;
  payload: any;
}

export default function AdminView({ products, setProducts, appointments }: AdminViewProps) {
  const [activeTab, setActiveTab] = useState<'alerts' | 'pos' | 'logs'>('alerts');
  const [selectedLogDetail, setSelectedLogDetail] = useState<any>(null);
  
  // Local state for POS simulation
  const [selectedProductId, setSelectedProductId] = useState<string>(products[0]?.id || '');
  const [saleQuantity, setSaleQuantity] = useState<number>(2);
  const [posStatus, setPosStatus] = useState<'idle' | 'syncing' | 'success'>('idle');
  const [latency, setLatency] = useState<number>(12);
  const [terminalId, setTerminalId] = useState<string>('POS-TERM-STGO-01');

  // Pre-populate system audit logs with timestamps and payloads
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([
    {
      id: 'log-1',
      timestamp: '2026-06-24 15:10:22',
      type: 'SMS_NOTIFICATION',
      description: 'Recordatorio automático de Cita enviado con éxito a Matías Lagos (Dueño de Oliver)',
      payload: {
        channel: 'SMS_GATEWAY_V2',
        phoneNumber: '+56 9 7654 3210',
        message: 'SGC Vet: Recordatorio de cita para Oliver (Chequeo Anual) el Oct 24 a las 10:30 AM.',
        status: 'DELIVERED',
        retryCount: 0,
        apiLatencyMs: 145
      }
    },
    {
      id: 'log-2',
      timestamp: '2026-06-24 14:05:00',
      type: 'SMS_NOTIFICATION',
      description: 'Recordatorio WhatsApp de Cita enviado con éxito a Catalina Valenzuela (Dueño de Misty)',
      payload: {
        channel: 'WHATSAPP_CLINICAL',
        phoneNumber: '+56 9 6543 2109',
        message: 'SGC Vet: Estimada Catalina, le recordamos su cita quirúrgica para Misty el Nov 02 a las 04:15 PM.',
        status: 'DELIVERED',
        apiLatencyMs: 198
      }
    },
    {
      id: 'log-3',
      timestamp: '2026-06-24 12:30:15',
      type: 'INVENTORY_SYNC',
      description: 'Sincronización periódica automática del stock total de la tienda en línea con ERP central',
      payload: {
        syncType: 'FULL_STOCK_RESOLVER',
        recordsSynchronized: 6,
        status: 'SUCCESS',
        bandwidthKb: 1.8
      }
    },
    {
      id: 'log-4',
      timestamp: '2026-06-24 09:00:00',
      type: 'SYSTEM',
      description: 'Reinicio de servicios de mensajería programada del SGC Vet Core Engine',
      payload: {
        version: 'SGC-V1.2',
        nodeId: 'RUN-CONTAINER-03',
        activeWorkers: 4,
        uptimeSeconds: 86400
      }
    }
  ]);

  // Expose inventory critical threshold (<= 3 units)
  const criticalProducts = useMemo(() => {
    return products.filter(p => p.stockUnits !== undefined && p.stockUnits <= 3);
  }, [products]);

  // Selected product for POS description helper
  const selectedProduct = useMemo(() => {
    return products.find(p => p.id === selectedProductId);
  }, [products, selectedProductId]);

  // Trigger POS Sale
  const handleSimulatePossale = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct) return;

    const currentStock = selectedProduct.stockUnits || 0;
    if (currentStock < saleQuantity) {
      alert(`Error de Inventario: No hay suficiente stock para vender ${saleQuantity} unidades. Stock disponible: ${currentStock}.`);
      return;
    }

    setPosStatus('syncing');
    
    // Simulate connection delay
    setTimeout(() => {
      // Deduct stock in global state
      setProducts(prevProducts => {
        return prevProducts.map(p => {
          if (p.id === selectedProductId) {
            const nextStock = Math.max(0, currentStock - saleQuantity);
            return {
              ...p,
              stockUnits: nextStock,
              outOfStock: nextStock === 0,
              inStock: nextStock > 0
            };
          }
          return p;
        });
      });

      // Add audit log record with JSON payload
      const timestamp = new Date();
      const formattedTime = timestamp.toISOString().replace('T', ' ').substring(0, 19);
      const newStock = Math.max(0, currentStock - saleQuantity);

      const syncPayload = {
        event: 'POS_INVENTORY_SYNC',
        timestamp: timestamp.toISOString(),
        terminalId: terminalId,
        operator: 'Administrador VetSGC',
        payload: {
          productId: selectedProductId,
          productName: selectedProduct.name,
          unitsSold: saleQuantity,
          previousStock: currentStock,
          newStock: newStock,
          transmissionType: 'WEBSOCKET_PUSH',
          compression: 'GZIP_NONE',
          secureHash: 'SHA256_' + Math.random().toString(36).substring(2, 10).toUpperCase()
        }
      };

      const newLog: AuditLog = {
        id: 'log_' + Date.now(),
        timestamp: formattedTime,
        type: 'INVENTORY_SYNC',
        description: `Venta Presencial POS: Se vendieron ${saleQuantity} unidades de "${selectedProduct.name}". Stock disminuyó instantáneamente de ${currentStock} a ${newStock}.`,
        payload: syncPayload
      };

      setAuditLogs(prev => [newLog, ...prev]);
      setPosStatus('success');
      
      // Reset POS feedback
      setTimeout(() => {
        setPosStatus('idle');
      }, 2000);

    }, 800);
  };

  return (
    <div className="space-y-8 animate-fade-in text-left">
      {/* Title */}
      <header className="border-b border-[#c4c8bc]/30 pb-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="text-[10px] bg-[#4a7c59] text-white px-2.5 py-1 rounded-full font-extrabold uppercase tracking-widest">
              Panel Administrativo SGC
            </span>
            <h1 className="text-3xl font-headline font-bold text-[#2e3230] mt-2">Módulo de Administración & POS</h1>
            <p className="text-xs text-[#4a4e4a] mt-1">
              Supervisión clínica, alertas de inventario crítico, simulación POS físico y auditoría de transacciones JSON en tiempo real.
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs font-mono bg-[#f0ece4] px-3.5 py-2 rounded-xl border border-[#c4c8bc]/40 text-[#4a4e4a]">
            <Cpu className="w-4 h-4 text-[#4a7c59] animate-pulse" />
            <span>DB Server: Connected</span>
            <span className="w-2.5 h-2.5 rounded-full bg-[#4a7c59] inline-block ml-1 animate-ping" />
          </div>
        </div>
      </header>

      {/* Critical Stock Alert Banner if any (TC_CS_008) */}
      {criticalProducts.length > 0 && (
        <div id="admin-critical-stock-banner" className="bg-red-50 border-2 border-red-500 rounded-2xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-md animate-pulse">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-red-600 shrink-0">
              <AlertCircle className="w-6 h-6" />
            </div>
            <div className="text-left">
              <h3 className="font-headline font-black text-sm text-red-700 uppercase tracking-wide">
                ⚠️ ALERTA INTERNA: INVENTARIO EN STOCK CRÍTICO
              </h3>
              <p className="text-xs text-red-950 leading-relaxed mt-1">
                Atención personal clínico: Se han detectado productos en la tienda con stock menor a 3 unidades (gatillante de la etiqueta <strong>'ÚLTIMAS UNIDADES'</strong>):
              </p>
              <ul className="list-disc pl-5 mt-1.5 text-xs text-red-900 font-bold space-y-1">
                {criticalProducts.map(p => (
                  <li key={p.id}>
                    {p.name} — <span className="font-mono bg-red-100 text-red-800 px-1.5 py-0.5 rounded text-[10px]">{p.stockUnits} u. disp.</span> (ÚLTIMAS UNIDADES)
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <button 
            onClick={() => setActiveTab('alerts')}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm shrink-0 cursor-pointer"
          >
            Ver Productos Afectados
          </button>
        </div>
      )}

      {/* Tabs Menu */}
      <div className="flex border-b border-[#c4c8bc]/20 gap-2">
        <button
          onClick={() => setActiveTab('alerts')}
          className={`px-5 py-3 text-xs font-bold border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'alerts'
              ? 'border-[#4a7c59] text-[#4a7c59]'
              : 'border-transparent text-[#4a4e4a] hover:text-[#4a7c59]'
          }`}
        >
          <Bell className="w-4 h-4" />
          <span>Alertas de Inventario ({criticalProducts.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('pos')}
          className={`px-5 py-3 text-xs font-bold border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'pos'
              ? 'border-[#4a7c59] text-[#4a7c59]'
              : 'border-transparent text-[#4a4e4a] hover:text-[#4a7c59]'
          }`}
        >
          <Barcode className="w-4 h-4" />
          <span>Simulador POS Físico (Sincronización)</span>
        </button>

        <button
          onClick={() => setActiveTab('logs')}
          className={`px-5 py-3 text-xs font-bold border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'logs'
              ? 'border-[#4a7c59] text-[#4a7c59]'
              : 'border-transparent text-[#4a4e4a] hover:text-[#4a7c59]'
          }`}
        >
          <Terminal className="w-4 h-4" />
          <span>Logs de Auditoría & Transmisión JSON</span>
        </button>
      </div>

      {/* Tab Panels */}
      <div className="bg-[#faf6f0] rounded-2xl border border-[#c4c8bc]/20 p-6 shadow-sm">
        
        {/* PANEL 1: ALERTS */}
        {activeTab === 'alerts' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-headline font-bold text-base text-[#2e3230]">Supervisión de Stock del Catálogo</h3>
                <p className="text-xs text-[#4a4e4a] mt-0.5">Listado completo de productos y advertencias de existencias críticas.</p>
              </div>
              <span className="text-xs font-bold text-[#4a7c59] bg-[#4a7c59]/10 px-2.5 py-1 rounded">
                Límite de Alerta: ≤ 3 unidades
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((p) => {
                const isCritical = p.stockUnits !== undefined && p.stockUnits <= 3;
                return (
                  <div 
                    key={p.id}
                    className={`p-4 rounded-xl border flex flex-col justify-between h-44 transition-all ${
                      isCritical 
                        ? 'border-red-200 bg-red-50/40 hover:bg-red-50' 
                        : 'border-[#c4c8bc]/30 bg-white hover:border-[#4a7c59]/50'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] font-bold bg-[#f0ece4] text-[#4a4e4a] px-2 py-0.5 rounded uppercase">
                          {p.category}
                        </span>
                        {isCritical ? (
                          <span className="text-[9px] font-extrabold bg-red-600 text-white px-2 py-0.5 rounded uppercase animate-pulse">
                            CRÍTICO
                          </span>
                        ) : (
                          <span className="text-[9px] font-bold bg-[#4a7c59]/10 text-[#4a7c59] px-2 py-0.5 rounded uppercase">
                            OK
                          </span>
                        )}
                      </div>
                      
                      <h4 className="font-bold text-[#2e3230] text-sm mt-1">{p.name}</h4>
                      <p className="text-[11px] text-[#4a4e4a] line-clamp-2 mt-0.5 leading-normal">{p.description}</p>
                    </div>

                    <div className="pt-3 border-t border-[#c4c8bc]/15 flex items-center justify-between">
                      <span className="text-xs text-[#4a4e4a] font-bold">Unidades en stock:</span>
                      <div className="flex items-center gap-1.5">
                        <span className={`text-sm font-mono font-bold ${isCritical ? 'text-red-700' : 'text-[#4a7c59]'}`}>
                          {p.stockUnits}
                        </span>
                        <span className="text-[10px] text-[#4a4e4a]/60">unidades</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Quick action block */}
            <div className="bg-[#fbfaf7] border border-[#c4c8bc]/30 rounded-xl p-4 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs font-medium">
              <span>💡 ¿Deseas solicitar reposición automática a los laboratorios autorizados?</span>
              <button
                type="button"
                onClick={() => {
                  setProducts(prev => prev.map(p => {
                    if (p.stockUnits !== undefined && p.stockUnits <= 3) {
                      return { ...p, stockUnits: p.stockUnits + 10, inStock: true, outOfStock: false };
                    }
                    return p;
                  }));
                  // Add log
                  const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 19);
                  setAuditLogs(prev => [{
                    id: 'log_' + Date.now(),
                    timestamp,
                    type: 'SYSTEM',
                    description: 'Orden de reposición de Stock: Se agregaron +10 unidades automáticas a todos los productos con inventario crítico.',
                    payload: { action: 'AUTO_RESTOCK_CRITICAL', restockedCount: criticalProducts.length }
                  }, ...prev]);
                  alert('¡Solicitud enviada! Se han añadido automáticamente +10 unidades de stock a todos los productos críticamente bajos para propósitos de demostración.');
                }}
                className="px-4 py-2 bg-[#4a7c59] hover:bg-[#3d6749] text-white rounded-lg font-bold transition-colors cursor-pointer text-[11px]"
              >
                Reabastecer Todo (+10 unidades)
              </button>
            </div>
          </div>
        )}

        {/* PANEL 2: POS SIMULATOR */}
        {activeTab === 'pos' && (
          <div className="space-y-6">
            <div className="border-b border-[#c4c8bc]/20 pb-4">
              <h3 className="font-headline font-bold text-base text-[#2e3230]">Simulación de Venta Presencial (POS Físico)</h3>
              <p className="text-xs text-[#4a4e4a] mt-0.5">
                Utilice esta herramienta para simular compras realizadas en el mesón físico de la veterinaria. Las ventas disminuirán el inventario de la tienda en línea de forma automática e instantánea.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* Simulator Form */}
              <form onSubmit={handleSimulatePossale} className="lg:col-span-5 bg-white border border-[#c4c8bc]/30 rounded-xl p-5 space-y-4">
                <span className="text-[9px] font-bold bg-[#f0ece4] text-[#4a4e4a] px-2 py-0.5 rounded uppercase tracking-wider block self-start w-fit">
                  Terminal de Venta POS-01
                </span>

                {/* Terminal Select */}
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-[#4a4e4a] uppercase tracking-wider">ID de la Terminal:</label>
                  <input
                    type="text"
                    value={terminalId}
                    onChange={(e) => setTerminalId(e.target.value)}
                    className="w-full bg-[#fbfaf7] border border-[#c4c8bc]/50 rounded-lg p-2 text-xs outline-none focus:ring-1 focus:ring-[#4a7c59]"
                    required
                  />
                </div>

                {/* Product Select */}
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-[#4a4e4a] uppercase tracking-wider">Seleccionar Producto:</label>
                  <select
                    value={selectedProductId}
                    onChange={(e) => setSelectedProductId(e.target.value)}
                    className="w-full bg-[#fbfaf7] border border-[#c4c8bc]/50 rounded-lg p-2.5 text-xs outline-none focus:ring-1 focus:ring-[#4a7c59] font-medium"
                  >
                    {products.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} (Stock: {p.stockUnits} u.)
                      </option>
                    ))}
                  </select>
                </div>

                {/* Quantity selector */}
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-[#4a4e4a] uppercase tracking-wider block">Cantidad a Vender:</label>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setSaleQuantity(prev => Math.max(1, prev - 1))}
                      className="p-1.5 border border-[#c4c8bc]/50 bg-[#faf6f0] hover:bg-[#ebd8b4]/20 rounded-lg text-[#2e3230]"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="font-mono text-sm font-bold w-12 text-center">{saleQuantity}</span>
                    <button
                      type="button"
                      onClick={() => setSaleQuantity(prev => prev + 1)}
                      className="p-1.5 border border-[#c4c8bc]/50 bg-[#faf6f0] hover:bg-[#ebd8b4]/20 rounded-lg text-[#2e3230]"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                    <span className="text-[11px] text-[#4a4e4a]/70">unidades</span>
                  </div>
                </div>

                {/* Selected summary */}
                {selectedProduct && (
                  <div className="bg-[#faf6f0] p-3 rounded-lg border border-[#c4c8bc]/20 text-xs">
                    <div className="flex justify-between items-center font-bold">
                      <span>Valor Unitario:</span>
                      <span>${selectedProduct.price.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center font-bold text-[#4a7c59] text-sm mt-1.5 pt-1.5 border-t border-[#c4c8bc]/20">
                      <span>Total de la Venta (USD):</span>
                      <span>${(selectedProduct.price * saleQuantity).toFixed(2)}</span>
                    </div>
                  </div>
                )}

                {/* POS Trigger Button */}
                <button
                  type="submit"
                  disabled={posStatus === 'syncing'}
                  className={`w-full py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer ${
                    posStatus === 'syncing'
                      ? 'bg-gray-400 text-white cursor-not-allowed'
                      : posStatus === 'success'
                      ? 'bg-green-600 text-white'
                      : 'bg-[#4a7c59] hover:bg-[#3d6749] text-white'
                  }`}
                >
                  {posStatus === 'syncing' ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Sincronizando Stock con la Tienda...</span>
                    </>
                  ) : posStatus === 'success' ? (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>¡Venta y Stock Sincronizados!</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4" />
                      <span>Registrar Venta Presencial POS</span>
                    </>
                  )}
                </button>
              </form>

              {/* Connection Status & Synchronization Diagram Flow */}
              <div className="lg:col-span-7 flex flex-col justify-between space-y-4">
                <div className="bg-[#2e3230] text-emerald-400 font-mono rounded-xl p-5 border border-emerald-500/20 text-xs space-y-3.5 flex-1 shadow-inner relative overflow-hidden">
                  
                  {/* Decorative circuit line design */}
                  <div className="absolute right-0 top-0 w-24 h-24 border border-emerald-500/10 rounded-full -mr-8 -mt-8 animate-pulse" />
                  
                  <div className="flex items-center justify-between border-b border-emerald-500/15 pb-2 mb-2">
                    <span className="font-bold flex items-center gap-1.5 text-emerald-300">
                      <Cpu className="w-4 h-4 text-emerald-400" />
                      SGC_DATABASE_MONITOR (Real-Time Sync)
                    </span>
                    <span className="bg-emerald-500/10 px-2 py-0.5 rounded text-[10px] text-emerald-300 animate-pulse border border-emerald-500/20">
                      ● LIVE WEBSOCKET
                    </span>
                  </div>

                  <div className="space-y-1 leading-relaxed">
                    <p className="text-emerald-300/70">Connecting to Online Database Gateway...</p>
                    <p className="text-emerald-300/70">Terminal Handshake established with SGC-AWS-CLUSTER-04.</p>
                    <p className="text-emerald-400 font-bold">📡 LATENCIA CANAL: {latency}ms | PROTOCOLO: JSON_PAYLOAD_PUSH</p>
                  </div>

                  {/* Flow steps diagram */}
                  <div className="grid grid-cols-5 items-center gap-1 py-4 text-center">
                    <div className="bg-emerald-500/10 border border-emerald-500/30 p-2.5 rounded-lg flex flex-col items-center">
                      <Barcode className="w-4 h-4 text-emerald-300 mb-1" />
                      <span className="text-[8px] font-bold text-emerald-300">POS FISICO</span>
                    </div>
                    <div className="flex justify-center text-emerald-500 animate-pulse font-bold">⟹</div>
                    <div className="bg-emerald-500/20 border-2 border-emerald-500 p-2.5 rounded-lg flex flex-col items-center animate-pulse">
                      <RefreshCw className="w-4 h-4 text-emerald-400 mb-1 animate-spin" />
                      <span className="text-[8px] font-bold text-emerald-200">REAL-TIME BRIDGE</span>
                    </div>
                    <div className="flex justify-center text-emerald-500 animate-pulse font-bold">⟹</div>
                    <div className="bg-emerald-500/10 border border-emerald-500/30 p-2.5 rounded-lg flex flex-col items-center">
                      <Database className="w-4 h-4 text-emerald-300 mb-1" />
                      <span className="text-[8px] font-bold text-emerald-300">ONLINE STOCK</span>
                    </div>
                  </div>

                  <div className="text-[10px] bg-emerald-950/70 border border-emerald-500/30 p-3 rounded-lg text-emerald-300 space-y-1 text-left leading-normal">
                    <p className="font-bold">⚠️ Sincronización Automática Activa:</p>
                    <p>Al procesar la venta en esta terminal física, los hilos de reactividad de React redistribuyen el stock actualizado a todos los componentes de la interfaz de forma inmediata.</p>
                  </div>
                </div>

                <div className="bg-[#f0ece4]/70 p-4 rounded-xl border border-[#c4c8bc]/40 text-xs">
                  <p className="font-bold text-[#2e3230] text-center sm:text-left">📈 Pruébelo usted mismo:</p>
                  <p className="text-[#4a4e4a] text-center sm:text-left mt-0.5">Proceda a simular una venta de 2 unidades del "Alimento Premium Canino" (u otro producto). Inmediatamente después, diríjase a la pestaña "Tienda" en la barra de navegación para corroborar la reducción inmediata de existencias sin recargar la página.</p>
                </div>

              </div>

            </div>
          </div>
        )}

        {/* PANEL 3: AUDIT & JSON LOGS */}
        {activeTab === 'logs' && (
          <div className="space-y-6">
            <div className="border-b border-[#c4c8bc]/20 pb-4">
              <h3 className="font-headline font-bold text-base text-[#2e3230]">Logs de Auditoría Técnica & Transmisión JSON</h3>
              <p className="text-xs text-[#4a4e4a] mt-0.5">
                Historial clínico e informático del SGC. Compruebe las marcas temporales precisas del envío automático de recordatorios de citas de mascotas y la estructura JSON liviana enviada para sincronizaciones POS.
              </p>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
              
              {/* Logs List */}
              <div className="xl:col-span-6 space-y-4 max-h-[500px] overflow-y-auto pr-2 scrollbar-thin">
                <h4 className="font-bold text-xs text-[#2e3230] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <History className="w-4 h-4 text-[#4a7c59]" />
                  Eventos Registrados
                </h4>

                {auditLogs.map((log) => {
                  return (
                    <div 
                      key={log.id}
                      className="bg-white border border-[#c4c8bc]/25 rounded-xl p-4 space-y-2 hover:border-[#4a7c59]/50 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <span className={`text-[9px] px-2 py-0.5 rounded font-extrabold uppercase ${
                          log.type === 'SMS_NOTIFICATION' 
                            ? 'bg-blue-100 text-blue-800' 
                            : log.type === 'INVENTORY_SYNC' 
                            ? 'bg-emerald-100 text-emerald-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {log.type === 'SMS_NOTIFICATION' ? 'CITA MENSAJE' : log.type === 'INVENTORY_SYNC' ? 'SYNC POS' : 'SISTEMA'}
                        </span>
                        
                        <span className="text-[10px] text-[#4a4e4a]/70 font-mono flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          {log.timestamp}
                        </span>
                      </div>

                      <p className="text-xs text-[#2e3230] font-semibold leading-relaxed">{log.description}</p>
                      
                      <button
                        type="button"
                        onClick={() => {
                          // Quick helper to scroll / select JSON payload view
                          const el = document.getElementById('json-view-container');
                          if (el) el.scrollIntoView({ behavior: 'smooth' });
                          // Force set selected log for detail
                          setSelectedLogDetail(log);
                        }}
                        className="text-[10.5px] text-[#4a7c59] hover:underline font-bold flex items-center gap-1 cursor-pointer pt-1"
                      >
                        Ver Estructura de Datos JSON ➜
                      </button>
                    </div>
                  );
                })}
              </div>

              {/* JSON Payload Viewer */}
              <div id="json-view-container" className="xl:col-span-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-xs text-[#2e3230] uppercase tracking-wider flex items-center gap-1.5">
                    <Terminal className="w-4 h-4 text-[#4a7c59]" />
                    Visor de Payloads JSON (Liviano & Eficiente)
                  </h4>
                  <span className="text-[10px] text-[#4a4e4a] font-mono">Formato plano RFC 8259</span>
                </div>

                <div className="bg-[#1e1e1e] text-amber-200 font-mono text-xs rounded-xl overflow-hidden border border-amber-500/10 shadow-lg flex flex-col h-[400px]">
                  
                  {/* JSON Header */}
                  <div className="bg-[#2a2a2a] px-4 py-2 flex items-center justify-between text-[11px] text-[#a8aaa4]">
                    <span>payload_response_audit.json</span>
                    <span className="text-emerald-400 font-bold">UTF-8 • Application/JSON</span>
                  </div>

                  {/* JSON Viewer area */}
                  <pre className="p-4 overflow-auto flex-1 text-left text-[11px] leading-normal scrollbar-thin whitespace-pre-wrap">
                    {JSON.stringify(selectedLogDetail?.payload || auditLogs[0]?.payload, null, 2)}
                  </pre>

                  {/* JSON stats footer */}
                  <div className="bg-[#151515] px-4 py-2.5 flex items-center justify-between text-[10px] text-[#8c8c8c]">
                    <span>Tamaño Estimado: ~{JSON.stringify(selectedLogDetail?.payload || auditLogs[0]?.payload).length} bytes</span>
                    <span>Transmisión Segura</span>
                  </div>
                </div>

                {/* Info Tip about the JSON format efficiency */}
                <div className="bg-blue-50 border border-blue-200 p-4 rounded-xl text-xs space-y-1.5 text-left text-blue-900 leading-normal">
                  <p className="font-bold flex items-center gap-1.5">
                    <AlertCircle className="w-4 h-4 text-blue-600 shrink-0" />
                    Eficiencia Informática Demostrada:
                  </p>
                  <p>La estructura JSON se transmite sin redundancias ni etiquetas pesadas (a diferencia de XML o SOAP), asegurando que el POS presencial veterinario pueda comunicarse con el Catálogo de la Tienda Online incluso en áreas de baja cobertura móvil con una latencia de transmisión promedio menor a 20ms.</p>
                </div>
              </div>

            </div>
          </div>
        )}

      </div>

    </div>
  );
}
