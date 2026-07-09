/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { 
  Search, 
  ShoppingCart, 
  ChevronRight, 
  Plus, 
  Minus, 
  X, 
  Check, 
  Trash2,
  PackageCheck,
  Tag
} from 'lucide-react';
import { Product, CartItem } from '../types';
import { PRODUCTS } from '../data';

interface CatalogViewProps {
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  cart: CartItem[];
  onAddToCart: (product: Product) => void;
  onUpdateCartQty: (productId: string, delta: number) => void;
  onRemoveFromCart: (productId: string) => void;
  onClearCart: () => void;
}

export default function CatalogView({ 
  products,
  setProducts,
  cart, 
  onAddToCart, 
  onUpdateCartQty, 
  onRemoveFromCart,
  onClearCart
}: CatalogViewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Todos');
  const [showCartDrawer, setShowCartDrawer] = useState(false);
  const [selectedDetailProduct, setSelectedDetailProduct] = useState<Product | null>(null);
  
  // Track clicking state for nice button animation feedback
  const [addingId, setAddingId] = useState<string | null>(null);

  const handleSimulatePOSSale = () => {
    // Find Alimento Premium Canino (p1)
    const p1 = products.find(p => p.id === 'p1');
    const currentStock = p1 ? (p1.stockUnits !== undefined ? p1.stockUnits : 15) : 15;
    
    if (currentStock < 2) {
      alert(`No hay stock suficiente para simular la venta física de 2 unidades de Alimento Premium Canino (Stock actual: ${currentStock}). ¡Restableciendo stock a 15 u. para poder simular de nuevo!`);
      setProducts(prevProducts => {
        return prevProducts.map(p => {
          if (p.id === 'p1') {
            return {
              ...p,
              stockUnits: 15,
              inStock: true,
              outOfStock: false
            };
          }
          return p;
        });
      });
      return;
    }

    setProducts(prevProducts => {
      return prevProducts.map(p => {
        if (p.id === 'p1') {
          const nextStock = currentStock - 2;
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

    // Save POS audit log
    try {
      const timestamp = new Date();
      const posLog = {
        evento: "Venta Física POS - Alimento Premium Canino",
        canal: "Sincronización POS Local",
        timestamp: timestamp.toISOString(),
        estado: "Completado",
        detalles: {
          productoId: "p1",
          productoName: "Alimento Premium Canino",
          unidadesVendidas: 2,
          stockAnterior: currentStock,
          stockNuevo: currentStock - 2
        }
      };
      const existingBookingLogs = localStorage.getItem('sgc_booking_logs');
      const bookingLogs = existingBookingLogs ? JSON.parse(existingBookingLogs) : [];
      bookingLogs.unshift(posLog);
      localStorage.setItem('sgc_booking_logs', JSON.stringify(bookingLogs));
    } catch (e) {
      console.error('Error saving POS log:', e);
    }

    alert(`Simulación POS: Compra presencial de 2 unidades de "Alimento Premium Canino" registrada con éxito. Sincronización en vivo completada. Stock disminuyó de ${currentStock} a ${currentStock - 2} unidades.`);
  };

  const categories = ['Todos', 'Comida', 'Juguetes', 'Higiene', 'Accesorios'];

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          product.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchCategory = selectedCategory === 'Todos' || product.category === selectedCategory;
      return matchSearch && matchCategory;
    });
  }, [products, searchQuery, selectedCategory]);

  const handleAddToCartWithFeedback = (product: Product) => {
    if (product.outOfStock) return;
    setAddingId(product.id);
    onAddToCart(product);
    setTimeout(() => {
      setAddingId(null);
    }, 1200);
  };

  const cartTotal = useMemo(() => {
    return cart.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  }, [cart]);

  const cartCount = useMemo(() => {
    return cart.reduce((count, item) => count + item.quantity, 0);
  }, [cart]);

  const handleCheckoutMock = () => {
    alert(`¡Compra procesada con éxito! Has reservado ${cartCount} productos por un total de $${cartTotal.toFixed(2)}. Puedes retirar y pagar tus compras en el mesón principal de SGC.`);
    onClearCart();
    setShowCartDrawer(false);
  };

  return (
    <div className="space-y-10 animate-fade-in relative min-h-screen">
      {/* Catalog Title and description */}
      <header className="text-center lg:text-left">
        <h1 className="text-3xl sm:text-4xl font-headline font-bold text-[#2e3230] mb-3">Catálogo de Productos</h1>
        <p className="text-[#4a4e4a] text-sm max-w-2xl leading-relaxed">
          Seleccionamos cuidadosamente los mejores alimentos y juguetes orgánicos para asegurar la felicidad y óptima nutrición digestiva de tus compañeros de hogar.
        </p>
      </header>

      {/* POS Simulation Widget for TC_CS_005 */}
      <div id="pos-simulation-widget" className="bg-[#4a7c59]/5 border border-[#4a7c59]/20 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
        <div className="space-y-1 text-left flex-1">
          <div className="flex items-center gap-2 text-[#4a7c59]">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-xs font-bold uppercase tracking-wider font-mono">Control de Sincronización Omnicanal en Vivo (TC_CS_005)</span>
          </div>
          <h3 className="font-headline font-extrabold text-lg text-[#2e3230]">
            Venta Física en Local (Simulación POS)
          </h3>
          <p className="text-xs text-[#4a4e4a] leading-relaxed">
            Representa una compra presencial en nuestra veterinaria. Al hacer clic en este botón para simular la compra presencial de 2 unidades de <strong>"Alimento Premium Canino"</strong>, la etiqueta de la interfaz web se actualizará automáticamente en tiempo real disminuyendo inmediatamente de 15 a 13 unidades disponibles.
          </p>
        </div>
        <button
          id="btn-simulate-pos"
          onClick={handleSimulatePOSSale}
          className="px-6 py-3 bg-[#4a7c59] hover:bg-[#3d6749] text-white rounded-xl text-xs font-bold transition-all shadow hover:translate-y-[-1px] active:translate-y-0 flex items-center gap-2 shrink-0 cursor-pointer"
        >
          <span>🛒 Venta Física en Local (POS)</span>
        </button>
      </div>

      {/* Filter and Search segment */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        
        {/* Rounded custom input */}
        <div className="relative w-full md:w-96 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#4a4e4a]/60 group-focus-within:text-[#4a7c59] w-4 h-4 transition-colors" />
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#f0ece4] border-none rounded-2xl py-3 pl-12 pr-4 text-sm focus:ring-2 focus:ring-[#4a7c59] focus:bg-white transition-all placeholder-[#4a4e4a]/60 text-[#2e3230] outline-none" 
            placeholder="Buscar productos..." 
          />
        </div>

        {/* Categories pills */}
        <div className="flex gap-2 overflow-x-auto pb-2 w-full md:w-auto scrollbar-thin">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`whitespace-nowrap px-5 py-2 rounded-full text-xs font-bold transition-all ${
                  isSelected
                    ? 'bg-[#4a7c59] text-white shadow-sm'
                    : 'bg-[#f0ece4] text-[#4a4e4a] hover:bg-[#e4e0d8] hover:text-[#4a7c59]'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Product Card grid */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredProducts.map((prod) => {
            const isAdding = addingId === prod.id;
            return (
              <div 
                key={prod.id}
                className="bg-[#faf6f0] rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 flex flex-col h-full border border-[#c4c8bc]/20 group"
              >
                {/* Product image container layout */}
                <div 
                  onClick={() => setSelectedDetailProduct(prod)}
                  className={`relative aspect-square overflow-hidden bg-[#faf6f0] cursor-pointer ${prod.outOfStock ? 'grayscale opacity-75' : ''}`}
                >
                  <img 
                    src={prod.image} 
                    alt={prod.name} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    referrerPolicy="no-referrer"
                  />
                  
                  {prod.recommended && (
                    <span className="absolute top-3 left-3 bg-[#705c30] text-white px-2.5 py-1 rounded text-[10px] font-bold shadow-sm uppercase tracking-wider">
                      Recomendado
                    </span>
                  )}

                  {prod.stockUnits !== undefined && prod.stockUnits > 0 && prod.stockUnits <= 3 && (
                    <span className="absolute top-3 right-3 bg-amber-500 text-white px-2.5 py-1 rounded text-[10px] font-extrabold shadow-md uppercase tracking-wider animate-pulse z-10">
                      Últimas unidades
                    </span>
                  )}

                  {prod.outOfStock && (
                    <div className="absolute inset-0 bg-black/5 flex items-center justify-center">
                      <span className="bg-[#b83230] text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-md">
                        Agotado
                      </span>
                    </div>
                  )}
                </div>

                {/* Details layout */}
                <div className="p-4 flex flex-col flex-1">
                  <div className="flex justify-between items-start gap-1 mb-1">
                    <h3 
                      onClick={() => setSelectedDetailProduct(prod)}
                      className="font-headline text-base font-bold text-[#2e3230] leading-snug group-hover:text-[#4a7c59] transition-colors cursor-pointer flex-1 text-left"
                    >
                      {prod.name}
                    </h3>
                    <span className="text-[#4a7c59] font-bold text-base shrink-0">${prod.price.toFixed(2)}</span>
                  </div>

                  <p className="text-xs text-[#4a4e4a] mb-4 line-clamp-2 flex-1 text-left">
                    {prod.description}
                  </p>

                  <div className="mt-auto">
                    {/* Stock dot */}
                    <div className="flex flex-col gap-1 mb-3 text-left">
                      <div className="flex items-center gap-1.5">
                        <div className={`w-2 h-2 rounded-full ${prod.inStock ? 'bg-[#4a7c59]' : 'bg-[#b83230]'}`} />
                        <span className="text-[10px] font-bold text-[#4a7c59] uppercase font-mono">
                          {prod.inStock ? `EN STOCK (${prod.stockUnits} u. disp.)` : 'SIN EXISTENCIAS'}
                        </span>
                      </div>
                      
                      {prod.stockUnits !== undefined && prod.stockUnits > 0 && prod.stockUnits <= 3 && (
                        <span className="inline-block self-start mt-1 bg-amber-100 text-amber-800 border border-amber-300 px-2 py-0.5 rounded text-[9.5px] font-bold uppercase tracking-wider animate-pulse">
                          ⚠️ Últimas unidades
                        </span>
                      )}
                    </div>

                    {/* Interactive add button with microstates */}
                    {prod.outOfStock ? (
                      <button
                        disabled
                        className="w-full bg-[#e4e0d8] text-[#4a4e4a]/60 py-2.5 rounded-lg font-bold text-xs flex items-center justify-center gap-2 cursor-not-allowed"
                      >
                        <span>Agotado</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => handleAddToCartWithFeedback(prod)}
                        className={`w-full py-2.5 rounded-lg font-bold text-xs flex items-center justify-center gap-1.5 transition-all active:scale-95 ${
                          isAdding 
                            ? 'bg-[#78a886] text-white' 
                            : 'bg-[#4a7c59] text-white hover:bg-[#3d6749]'
                        }`}
                      >
                        {isAdding ? (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            <span>¡Agregado!</span>
                          </>
                        ) : (
                          <>
                            <ShoppingCart className="w-3.5 h-3.5" />
                            <span>Añadir al carrito</span>
                          </>
                        )}
                      </button>
                    )}

                  </div>
                </div>

              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-16 text-[#4a4e4a] bg-[#f0ece4]/40 rounded-2xl border border-[#c4c8bc]/30">
          <p className="text-base font-bold">No se encontraron productos en esta categoría.</p>
          <p className="text-xs mt-1">Prueba refinando los criterios de búsqueda.</p>
        </div>
      )}

      {/* Floating Shopping Cart Button drawer button - real count shown in real time */}
      <button 
        onClick={() => setShowCartDrawer(true)}
        className="fixed bottom-6 right-6 w-16 h-16 bg-[#4a7c59] text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-105 transition-all z-[90] active:scale-95 group focus:outline-none"
      >
        <ShoppingCart className="w-6 h-6 group-hover:rotate-6 transition-transform" />
        {cartCount > 0 && (
          <span className="absolute top-2.5 right-2.5 bg-[#705c30] text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-extrabold shadow-sm animate-bounce">
            {cartCount}
          </span>
        )}
      </button>

      {/* CART DRAWER SLIDE PANEL OVERLAY */}
      {showCartDrawer && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[120] flex justify-end">
          <div className="bg-[#faf6f0] w-full max-w-md h-full shadow-2xl p-6 flex flex-col relative border-l border-[#c4c8bc]/30 animate-slide-in-right">
            
            <div className="flex justify-between items-center pb-4 border-b border-[#c4c8bc]/35">
              <h3 className="font-headline text-xl font-bold text-[#4a7c59] flex items-center gap-2">
                <ShoppingCart className="w-5 h-5" />
                Carrito de Compras
              </h3>
              <button 
                onClick={() => setShowCartDrawer(false)}
                className="p-1 hover:bg-[#e4e0d8] rounded-full transition-colors text-[#4a4e4a]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Cart Items list */}
            <div className="flex-1 overflow-y-auto py-4 space-y-4 pr-1">
              {cart.length > 0 ? (
                cart.map((item) => (
                  <div key={item.product.id} className="flex gap-4 p-3 bg-white rounded-lg border border-[#c4c8bc]/20 relative">
                    <img 
                      src={item.product.image} 
                      alt={item.product.name} 
                      className="w-16 h-16 rounded object-cover border border-[#c4c8bc]/10"
                      referrerPolicy="no-referrer"
                    />
                    <div className="flex-1">
                      <h4 className="font-bold text-sm text-[#2e3230] leading-snug line-clamp-1">{item.product.name}</h4>
                      <p className="text-xs text-[#4a7c59] font-bold mt-0.5">${item.product.price.toFixed(2)}</p>
                      
                      {/* Quantity switcher */}
                      <div className="flex items-center gap-2 mt-2">
                        <button 
                          onClick={() => onUpdateCartQty(item.product.id, -1)}
                          className="p-1 text-[#4a4e4a] hover:bg-[#e4e0d8] rounded"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="text-xs font-bold w-4 text-center">{item.quantity}</span>
                        <button 
                          onClick={() => onUpdateCartQty(item.product.id, 1)}
                          className="p-1 text-[#4a4e4a] hover:bg-[#e4e0d8] rounded"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <button 
                      onClick={() => onRemoveFromCart(item.product.id)}
                      className="text-red-500 hover:text-red-600 p-1.5 rounded absolute top-2 right-2 hover:bg-red-50 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))
              ) : (
                <div className="text-center py-16 space-y-2 text-[#4a4e4a]">
                  <PackageCheck className="w-12 h-12 text-[#ebd8b4] mx-auto" />
                  <p className="text-sm font-bold">Tu carrito está completamente vacío.</p>
                  <p className="text-xs">¡Agrega algunos alimentos saludables o juguetes divertidos!</p>
                </div>
              )}
            </div>

            {/* Bottom checkout totalizer */}
            {cart.length > 0 && (
              <div className="pt-4 border-t border-[#c4c8bc]/35 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-[#4a4e4a] font-semibold">Subtotal</span>
                  <span className="text-xl font-headline font-bold text-[#4a7c59]">${cartTotal.toFixed(2)}</span>
                </div>
                
                <div className="flex gap-2">
                  <button 
                    onClick={onClearCart}
                    className="flex-1 py-3 border border-red-200 text-red-600 hover:bg-red-50 font-bold rounded-lg text-xs"
                  >
                    Vaciar Carrito
                  </button>
                  <button 
                    onClick={handleCheckoutMock}
                    className="flex-[2] py-3 bg-[#4a7c59] text-white font-bold hover:bg-[#3d6749] rounded-lg text-xs shadow-md"
                  >
                    Reservar Compra
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      )}

      {/* PRODUCT DETAILS MODAL */}
      {selectedDetailProduct && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[130] flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#faf6f0] rounded-2xl w-full max-w-lg p-6 shadow-2xl relative border border-[#c4c8bc]/30 my-8">
            {/* Close button */}
            <button 
              onClick={() => setSelectedDetailProduct(null)}
              className="absolute top-4 right-4 p-2 hover:bg-[#e4e0d8] rounded-full transition-colors text-[#4a4e4a] cursor-pointer z-10"
              title="Cerrar"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Content Container */}
            <div className="space-y-6 text-left">
              
              {/* Product Image */}
              <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-[#faf6f0] border border-[#c4c8bc]/20">
                <img 
                  src={selectedDetailProduct.image} 
                  alt={selectedDetailProduct.name} 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                
                {selectedDetailProduct.recommended && (
                  <span className="absolute top-3 left-3 bg-[#705c30] text-white px-2.5 py-1 rounded text-[10px] font-bold shadow-md uppercase tracking-wider">
                    Recomendado
                  </span>
                )}

                {selectedDetailProduct.stockUnits !== undefined && selectedDetailProduct.stockUnits > 0 && selectedDetailProduct.stockUnits <= 3 && (
                  <span className="absolute top-3 right-3 bg-amber-500 text-white px-2.5 py-1 rounded text-[10px] font-extrabold shadow-md uppercase tracking-wider animate-pulse">
                    Últimas unidades
                  </span>
                )}
              </div>

              {/* Product Info */}
              <div className="space-y-3">
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <span className="text-[10px] bg-[#f0ece4] text-[#4a4e4a] px-2 py-0.5 rounded font-bold uppercase">
                      {selectedDetailProduct.category}
                    </span>
                    <h3 className="font-headline text-2xl font-bold text-[#2e3230] mt-1.5 leading-snug">
                      {selectedDetailProduct.name}
                    </h3>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-2xl font-headline font-bold text-[#4a7c59] block">${selectedDetailProduct.price.toFixed(2)}</span>
                    {selectedDetailProduct.originalPrice && (
                      <span className="text-xs text-[#a8aaa4] line-through">${selectedDetailProduct.originalPrice.toFixed(2)}</span>
                    )}
                  </div>
                </div>

                {/* Extensive Description */}
                <div className="bg-[#f0ece4]/40 border border-[#c4c8bc]/20 rounded-xl p-4 text-xs text-[#4a4e4a] leading-relaxed">
                  <p className="font-semibold text-[#2e3230] mb-1.5">Descripción del Artículo:</p>
                  <p className="text-sm font-medium leading-relaxed">{selectedDetailProduct.description}</p>
                  
                  <div className="mt-4 pt-3 border-t border-[#c4c8bc]/20 grid grid-cols-2 gap-4 text-[11px]">
                    <div>
                      <span className="font-bold text-[#2e3230]">Calidad Certificada:</span>
                      <p className="text-[#4a4e4a]/85 leading-normal">Fórmula veterinaria certificada clínicamente para mascotas en etapa de crecimiento y postoperatorio.</p>
                    </div>
                    <div>
                      <span className="font-bold text-[#2e3230]">Almacenamiento:</span>
                      <p className="text-[#4a4e4a]/85 leading-normal">Manténgase en un lugar seco y fresco, cerrado herméticamente para preservar frescura.</p>
                    </div>
                  </div>
                </div>

                {/* Stock status detail */}
                <div className="flex items-center justify-between border-t border-[#c4c8bc]/20 pt-4 mt-2">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-1.5">
                      <div className={`w-2.5 h-2.5 rounded-full ${selectedDetailProduct.inStock ? 'bg-[#4a7c59]' : 'bg-[#b83230]'}`} />
                      <span className="text-xs font-bold text-[#2e3230] uppercase">
                        {selectedDetailProduct.inStock ? 'En Stock' : 'Sin Existencias'}
                      </span>
                    </div>
                    {selectedDetailProduct.stockUnits !== undefined && (
                      <p className="text-[11px] text-[#4a4e4a] font-medium pl-4">
                        {selectedDetailProduct.stockUnits > 0 
                          ? `Contamos con ${selectedDetailProduct.stockUnits} unidades físicas listas para despacho inmediato.` 
                          : 'Temporalmente agotado en tienda SGC.'}
                      </p>
                    )}
                  </div>

                  {/* Add directly to cart */}
                  {!selectedDetailProduct.outOfStock && (
                    <button
                      onClick={() => {
                        handleAddToCartWithFeedback(selectedDetailProduct);
                      }}
                      className="px-5 py-2.5 bg-[#4a7c59] hover:bg-[#3d6749] text-white rounded-xl font-bold text-xs flex items-center gap-2 shadow-md transition-all active:scale-95 cursor-pointer"
                    >
                      <ShoppingCart className="w-4 h-4" />
                      <span>Añadir al carrito</span>
                    </button>
                  )}
                </div>

              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
}
