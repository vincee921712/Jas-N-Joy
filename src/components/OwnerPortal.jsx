import React, { useState } from 'react';
import { 
  Lock, 
  Store, 
  Plus, 
  Edit3, 
  Trash2, 
  RotateCcw, 
  CheckCircle, 
  AlertTriangle, 
  Calendar, 
  Image as ImageIcon, 
  Upload, 
  LogOut, 
  Bell, 
  Sparkles, 
  Inbox, 
  Tag, 
  Eye, 
  Layers, 
  Check, 
  X,
  Clock,
  MapPin,
  ChevronRight,
  ShieldCheck,
  ZoomIn,
  ZoomOut,
  Move,
  Crop
} from 'lucide-react';
import { bakeryInfo, categories } from '../data/bakeryData';
import GalleryPhotoCropper from './GalleryPhotoCropper';

export default function OwnerPortal({ 
  onBackToStorefront,
  products,
  onUpdateProducts,
  onResetProducts,
  announcement,
  onUpdateAnnouncement,
  onResetAnnouncement,
  heroShowcase,
  onUpdateHeroShowcase,
  onResetHeroShowcase,
  inquiries
}) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginForm, setLoginForm] = useState({ username: 'admin', password: 'admin' });
  const [loginError, setLoginError] = useState('');

  // Active Tab inside Portal
  const [activeTab, setActiveTab] = useState('catalog'); // 'catalog' | 'showcase' | 'slots' | 'inquiries'

  // Hero Showcase Form state
  const [showcaseForm, setShowcaseForm] = useState({
    badge: heroShowcase?.badge || "Bespoke Theme Cakes",
    subBadge: heroShowcase?.subBadge || "Fondant, Buttercream & Pull-outs",
    placeholderText: heroShowcase?.placeholderText || "[Hero Photo Placeholder: Storefront or Signature Cake Showcase]",
    description: heroShowcase?.description || "Reserved for high-resolution photography of Jas 'N Joy's Pueblo de Panay bakeshop display or featured tiered centerpiece.",
    imageUrl: heroShowcase?.imageUrl || "",
    imagePosition: heroShowcase?.imagePosition || "center",
    imageScale: heroShowcase?.imageScale || 1,
    imageX: heroShowcase?.imageX || 0,
    imageY: heroShowcase?.imageY || 0
  });
  const [showcaseSaveNotice, setShowcaseSaveNotice] = useState(false);
  const [showcaseSavedButtonState, setShowcaseSavedButtonState] = useState(false);

  // Global toast notification state
  const [toastMessage, setToastMessage] = useState(null);
  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Product Form Modal state (Create / Edit)
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productForm, setProductForm] = useState({
    name: '',
    category: 'display-cakes',
    description: '',
    priceBadge: '[In-Store Pricing / Inquire]',
    badge: 'Ready in Display',
    availability: 'Daily Walk-in / Ready-to-Go',
    photoPlaceholder: '',
    imageUrl: '',
    imagePosition: 'center',
    imageScale: 1,
    imageX: 0,
    imageY: 0,
    isSoldOut: false
  });

  // Slot Banner Form state
  const [slotText, setSlotText] = useState(announcement.text);
  const [slotStatus, setSlotStatus] = useState(announcement.status || 'open'); // 'open' | 'limited' | 'full'
  const [slotSaveNotice, setSlotSaveNotice] = useState(false);

  // Gallery Cropper Modal state
  const [cropperModal, setCropperModal] = useState({
    isOpen: false,
    imageUrl: '',
    target: '', // 'showcase' | 'product'
    title: ''
  });

  // Filter for Portal Catalog list
  const [portalCategoryFilter, setPortalCategoryFilter] = useState('all');

  const handleLogin = (e) => {
    e.preventDefault();
    if (loginForm.username.trim() === 'admin' && loginForm.password.trim() === 'admin') {
      setIsAuthenticated(true);
      setLoginError('');
    } else {
      setLoginError('Invalid credentials. Please use demo username: admin and password: admin');
    }
  };

  const openAddProductModal = () => {
    setEditingProduct(null);
    setProductForm({
      name: '',
      category: 'display-cakes',
      description: '',
      priceBadge: '[In-Store Pricing / Inquire]',
      badge: 'Ready in Display',
      availability: 'Daily Walk-in / Ready-to-Go',
      photoPlaceholder: '',
      imageUrl: '',
      imagePosition: 'center',
      imageScale: 1,
      imageX: 0,
      imageY: 0,
      isSoldOut: false
    });
    setIsProductModalOpen(true);
  };

  const openEditProductModal = (prod) => {
    setEditingProduct(prod);
    setProductForm({
      name: prod.name || '',
      category: prod.category || 'display-cakes',
      description: prod.description || '',
      priceBadge: prod.priceBadge || '',
      badge: prod.badge || '',
      availability: prod.availability || '',
      photoPlaceholder: prod.photoPlaceholder || '',
      imageUrl: prod.imageUrl || '',
      imagePosition: prod.imagePosition || 'center',
      imageScale: prod.imageScale || 1,
      imageX: prod.imageX || 0,
      imageY: prod.imageY || 0,
      isSoldOut: !!prod.isSoldOut
    });
    setIsProductModalOpen(true);
  };

  const handleSaveProduct = (e) => {
    e.preventDefault();
    if (editingProduct) {
      // Update
      const updated = products.map(p => {
        if (p.id === editingProduct.id) {
          return {
            ...p,
            ...productForm,
            photoPlaceholder: productForm.photoPlaceholder || `[Photo Placeholder: ${productForm.name}]`
          };
        }
        return p;
      });
      onUpdateProducts(updated);
      showToast(`Updated "${productForm.name}" successfully!`);
    } else {
      // Add
      const newProduct = {
        id: `prod-${Date.now()}`,
        ...productForm,
        photoPlaceholder: productForm.photoPlaceholder || `[Photo Placeholder: ${productForm.name}]`,
        accent: productForm.category === 'custom-fondant' 
          ? 'bg-pink-100 text-pink-900 border-pink-300' 
          : productForm.category === 'bite-sized'
          ? 'bg-stone-200 text-stone-900 border-stone-300'
          : 'bg-amber-100 text-amber-900 border-amber-300'
      };
      onUpdateProducts([newProduct, ...products]);
      showToast(`Added "${productForm.name}" to catalog!`);
    }
    setIsProductModalOpen(false);
  };

  const handleDeleteProduct = (id) => {
    if (window.confirm("Are you sure you want to remove this item from the catalog?")) {
      const remaining = products.filter(p => p.id !== id);
      onUpdateProducts(remaining);
    }
  };

  const handleToggleSoldOut = (id) => {
    const updated = products.map(p => {
      if (p.id === id) {
        return { ...p, isSoldOut: !p.isSoldOut };
      }
      return p;
    });
    onUpdateProducts(updated);
  };

  const handleImageFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        const rawUrl = uploadEvent.target.result;
        // Open Gallery Crop Tool directly so user crops their full picture like mobile gallery
        setCropperModal({
          isOpen: true,
          imageUrl: rawUrl,
          target: 'product',
          title: `Crop Photo: ${productForm.name || 'Catalog Product'}`
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveSlots = (e) => {
    e.preventDefault();
    let badge = "Slot Availability Notice";
    if (slotStatus === 'open') {
      badge = "Custom Cake Slots Open";
    } else if (slotStatus === 'limited') {
      badge = "Limited Daily Slots";
    } else if (slotStatus === 'full') {
      badge = "Fully Booked Today";
    }

    onUpdateAnnouncement({
      ...announcement,
      text: slotText,
      badge: badge,
      status: slotStatus
    });
    setSlotSaveNotice(true);
    showToast("Announcement banner published to storefront!");
    setTimeout(() => setSlotSaveNotice(false), 3000);
  };

  const filteredCatalog = portalCategoryFilter === 'all'
    ? products
    : products.filter(p => p.category === portalCategoryFilter);

  // If Not Authenticated, show Login Screen matching the clean guide sample card
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#F8F6F2] flex flex-col justify-center items-center px-4 py-12 selection:bg-amber-200 selection:text-amber-900">
        
        {/* Back Link */}
        <div className="w-full max-w-[430px] mb-5">
          <button
            onClick={onBackToStorefront}
            className="inline-flex items-center gap-2 text-xs font-semibold text-[#8C6D53] hover:text-[#451A03] transition-colors"
          >
            <Store className="w-4 h-4" />
            <span>← Return to Storefront</span>
          </button>
        </div>

        {/* Login Card (Styled after the exact guide sample) */}
        <div className="w-full max-w-[430px] bg-white rounded-[32px] p-8 sm:p-10 shadow-[0_10px_35px_-8px_rgba(0,0,0,0.07)] border border-stone-100/80 relative">
          
          {/* Centered Shield Badge */}
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 rounded-[22px] bg-[#FBF0E4] flex items-center justify-center text-[#C25E2E] shadow-xs">
              <ShieldCheck className="w-7 h-7 stroke-[2.2]" />
            </div>
          </div>

          {/* Heading and Description */}
          <div className="text-center mb-8 space-y-2">
            <h1 className="font-serif text-[26px] sm:text-[28px] font-bold text-[#143240] tracking-tight">
              Staff Portal Secure Login
            </h1>
            <p className="text-[13px] text-[#556973] leading-relaxed max-w-xs mx-auto">
              This terminal is reserved for Jas 'N Joy managers and kitchen staff. Please log in below.
            </p>
          </div>

          {loginError && (
            <div className="mb-5 p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2.5">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
              <span>{loginError}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-[13px] font-bold text-[#1F384C] mb-1.5">
                Username
              </label>
              <input 
                type="text"
                required
                value={loginForm.username}
                onChange={(e) => setLoginForm({ ...loginForm, username: e.target.value })}
                placeholder="admin"
                className="w-full px-4 py-3 rounded-2xl border border-[#DECDBB] bg-white text-sm text-[#1F384C] placeholder:text-[#A89D91] focus:outline-none focus:ring-2 focus:ring-[#C25E2E]/25 focus:border-[#C25E2E] transition-all"
              />
            </div>

            <div>
              <label className="block text-[13px] font-bold text-[#1F384C] mb-1.5">
                Password
              </label>
              <div className="relative">
                <input 
                  type="password"
                  required
                  value={loginForm.password}
                  onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 rounded-2xl border border-[#DECDBB] bg-white text-sm text-[#1F384C] placeholder:text-[#A89D91] focus:outline-none focus:ring-2 focus:ring-[#C25E2E]/25 focus:border-[#C25E2E] transition-all pr-11"
                />
                <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-[#5CB1C6]">
                  <Lock className="w-4 h-4 stroke-[2]" />
                </div>
              </div>
            </div>

            {/* Terracotta / Rust Button from the guide image */}
            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-3.5 rounded-2xl bg-[#C85D2A] hover:bg-[#B45122] active:scale-[0.99] text-white font-bold text-[15px] shadow-[0_4px_14px_rgba(200,93,42,0.35)] hover:shadow-md transition-all flex items-center justify-center cursor-pointer"
              >
                <span>Sign In to Dashboard</span>
              </button>
            </div>

            {/* Default credentials note matching image style */}
            <div className="text-center pt-3">
              <span className="text-[12px] text-[#2C8598] font-medium">
                Default credentials: <strong className="font-bold text-[#1F6E80]">admin</strong> / <strong className="font-bold text-[#1F6E80]">admin</strong>
              </span>
            </div>
          </form>

        </div>

      </div>
    );
  }

  // Authenticated Owner / Baker Dashboard
  return (
    <div className="min-h-screen bg-[#FFFDF9] text-[#2D241E] flex flex-col selection:bg-amber-200 selection:text-amber-900">
      
      {/* Top Portal Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#E9D9C9] shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full overflow-hidden bg-[#FAF2E8] border border-[#E9D9C9] p-0.5">
              <img 
                src={bakeryInfo.logoUrl} 
                alt="Jas N Joy Logo" 
                className="w-full h-full object-cover rounded-full"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-serif text-lg font-bold text-[#451A03]">
                  {bakeryInfo.brandName}
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-[#FEF3C7] text-[#92400E] px-2 py-0.5 rounded-full border border-[#FDE68A]">
                  Owner Portal
                </span>
              </div>
              <span className="text-xs text-[#786C62]">
                Logged in as <strong>{bakeryInfo.ownerEmail}</strong>
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onBackToStorefront}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#FAF2E8] hover:bg-[#F5EBE1] border border-[#D9C4B2] text-xs font-semibold text-[#451A03] transition-colors"
            >
              <Store className="w-4 h-4 text-[#92400E]" />
              <span className="hidden sm:inline">View Public Storefront</span>
            </button>
            <button
              onClick={() => setIsAuthenticated(false)}
              className="p-2 sm:px-3 sm:py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold transition-colors flex items-center gap-1.5"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>

        </div>

        {/* Portal Navigation Tabs */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-[#F5EBE1] flex items-center gap-2 overflow-x-auto py-2.5">
          <button
            onClick={() => setActiveTab('catalog')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
              activeTab === 'catalog'
                ? 'bg-[#92400E] text-white shadow-2xs'
                : 'text-[#57483D] hover:bg-[#FAF2E8]'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Bakeshop Catalog ({products.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('showcase')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
              activeTab === 'showcase'
                ? 'bg-[#92400E] text-white shadow-2xs'
                : 'text-[#57483D] hover:bg-[#FAF2E8]'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Hero Showcase Frame</span>
          </button>

          <button
            onClick={() => setActiveTab('slots')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
              activeTab === 'slots'
                ? 'bg-[#92400E] text-white shadow-2xs'
                : 'text-[#57483D] hover:bg-[#FAF2E8]'
            }`}
          >
            <Bell className="w-4 h-4" />
            <span>Slot Availability Banner</span>
          </button>

          <button
            onClick={() => setActiveTab('inquiries')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
              activeTab === 'inquiries'
                ? 'bg-[#92400E] text-white shadow-2xs'
                : 'text-[#57483D] hover:bg-[#FAF2E8]'
            }`}
          >
            <Inbox className="w-4 h-4" />
            <span>Custom Cake Inquiries ({inquiries?.length || 0})</span>
          </button>
        </div>
      </header>

      {/* Main Dashboard Workspace */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        
        {/* TAB 1: Bakeshop Catalog Manager */}
        {activeTab === 'catalog' && (
          <div className="space-y-6">
            
            {/* Action Bar */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-[#E9D9C9] shadow-2xs">
              <div>
                <h2 className="font-serif text-2xl font-bold text-[#451A03]">
                  Catalog & Menu Items
                </h2>
                <p className="text-xs text-[#786C62] mt-0.5">
                  Manage display cakes, bespoke fondant items, and bite-sized pastries shown on the public site.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2.5">
                <button
                  onClick={onResetProducts}
                  className="px-3.5 py-2.5 rounded-xl border border-stone-300 hover:bg-stone-50 text-xs font-semibold text-stone-700 transition-colors flex items-center gap-1.5"
                  title="Restore initial products from bakeryData.js"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset to Default Data</span>
                </button>
                <button
                  onClick={openAddProductModal}
                  className="px-5 py-2.5 rounded-xl bg-[#92400E] hover:bg-[#78350F] text-white text-xs font-bold shadow-xs transition-all flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add New Product</span>
                </button>
              </div>
            </div>

            {/* Category Filter Pills */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold text-[#786C62] mr-2">Filter View:</span>
              {categories.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setPortalCategoryFilter(c.id)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                    portalCategoryFilter === c.id
                      ? 'bg-[#451A03] text-white'
                      : 'bg-white text-[#57483D] border border-[#E9D9C9] hover:bg-[#FAF2E8]'
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>

            {/* Catalog Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCatalog.map((prod) => (
                <div 
                  key={prod.id} 
                  className={`bg-white rounded-3xl border transition-all overflow-hidden flex flex-col justify-between ${
                    prod.isSoldOut ? 'border-stone-300 opacity-80' : 'border-[#E9D9C9] shadow-2xs'
                  }`}
                >
                  <div>
                    {/* Image / Placeholder Area */}
                    <div className="relative aspect-[4/3] w-full bg-[#FAF2E8] border-b border-[#E9D9C9] overflow-hidden flex items-center justify-center p-3">
                      {prod.imageUrl ? (
                        <img 
                          src={prod.imageUrl} 
                          alt={prod.name} 
                          className="w-full h-full object-cover rounded-xl"
                        />
                      ) : (
                        <div className="text-center p-4">
                          <ImageIcon className="w-7 h-7 text-[#B45309] mx-auto mb-1.5" />
                          <span className="font-mono text-[11px] font-bold text-[#78350F] bg-white/90 px-2.5 py-1 rounded border border-[#E9D9C9]">
                            {prod.photoPlaceholder || `[Photo: ${prod.name}]`}
                          </span>
                        </div>
                      )}

                      {/* Status Badges */}
                      <div className="absolute top-3 right-3 flex flex-col gap-1 items-end">
                        {prod.isSoldOut ? (
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase bg-stone-800 text-white shadow-xs">
                            Sold Out Today
                          </span>
                        ) : (
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase bg-emerald-600 text-white shadow-xs">
                            Available in Store
                          </span>
                        )}
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${prod.accent || 'bg-amber-100 text-amber-900'}`}>
                          {prod.badge || 'Item'}
                        </span>
                      </div>
                    </div>

                    {/* Details */}
                    <div className="p-5 space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-serif text-lg font-bold text-[#451A03] leading-snug">
                          {prod.name}
                        </h3>
                      </div>
                      <p className="text-xs text-[#57483D] line-clamp-2 leading-relaxed">
                        {prod.description}
                      </p>
                      
                      <div className="pt-2 flex flex-wrap items-center gap-2 text-xs">
                        <span className="font-mono font-bold text-[#78350F] bg-[#FEF3C7] px-2 py-0.5 rounded border border-[#FDE68A]">
                          {prod.priceBadge}
                        </span>
                        <span className="text-[11px] text-[#786C62]">
                          • {prod.availability}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Baker Action Buttons */}
                  <div className="p-5 pt-0 border-t border-[#F5EBE1] mt-4">
                    {/* Desktop Layout (md: and up - exactly preserved) */}
                    <div className="hidden md:flex items-center justify-between gap-2">
                      <button
                        type="button"
                        onClick={() => handleToggleSoldOut(prod.id)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-colors ${
                          prod.isSoldOut
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
                            : 'bg-stone-100 text-stone-700 border-stone-200 hover:bg-stone-200'
                        }`}
                      >
                        {prod.isSoldOut ? 'Mark Available' : 'Mark Sold Out'}
                      </button>

                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => openEditProductModal(prod)}
                          className="p-2 rounded-xl text-[#92400E] hover:bg-[#FAF2E8] border border-[#E9D9C9] transition-colors"
                          title="Edit Item Details"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(prod.id)}
                          className="p-2 rounded-xl text-rose-700 hover:bg-rose-50 border border-rose-200 transition-colors"
                          title="Delete Item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Mobile-Only Touch-Friendly Layout (< 768px, min-h-[44px] buttons) */}
                    <div className="flex md:hidden flex-col gap-2">
                      <button
                        type="button"
                        onClick={() => handleToggleSoldOut(prod.id)}
                        className={`w-full min-h-[44px] px-3 py-2.5 rounded-xl text-xs font-bold border transition-colors flex items-center justify-center ${
                          prod.isSoldOut
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
                            : 'bg-stone-100 text-stone-700 border-stone-200 hover:bg-stone-200'
                        }`}
                      >
                        {prod.isSoldOut ? '✓ Mark Available' : '⚠ Mark Sold Out'}
                      </button>

                      <div className="grid grid-cols-2 gap-2">
                        <button
                          onClick={() => openEditProductModal(prod)}
                          className="w-full min-h-[44px] px-3 py-2 rounded-xl text-xs font-semibold text-[#92400E] bg-[#FAF2E8] border border-[#E9D9C9] flex items-center justify-center gap-1.5"
                        >
                          <Edit3 className="w-4 h-4" />
                          <span>Edit</span>
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(prod.id)}
                          className="w-full min-h-[44px] px-3 py-2 rounded-xl text-xs font-semibold text-rose-700 bg-rose-50 border border-rose-200 flex items-center justify-center gap-1.5"
                        >
                          <Trash2 className="w-4 h-4" />
                          <span>Delete</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

          </div>
        )}

        {/* TAB: Hero Signature Cake Showcase Editor */}
        {activeTab === 'showcase' && (
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="bg-white rounded-3xl border border-[#E9D9C9] p-6 sm:p-8 shadow-2xs space-y-6">
              
              <div className="flex items-center justify-between gap-4 border-b border-[#F5EBE1] pb-4">
                <div>
                  <h2 className="font-serif text-2xl font-bold text-[#451A03]">
                    Signature Cake Showcase & Hero Frame
                  </h2>
                  <p className="text-xs text-[#786C62] mt-0.5">
                    Customize the prominent centerpiece image, badge labels, and description on the main hero section.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    onResetHeroShowcase();
                    setShowcaseForm({
                      badge: bakeryInfo.heroShowcase.badge,
                      subBadge: bakeryInfo.heroShowcase.subBadge,
                      placeholderText: bakeryInfo.heroShowcase.placeholderText,
                      description: bakeryInfo.heroShowcase.description,
                      imageUrl: ""
                    });
                  }}
                  className="px-3 py-1.5 rounded-xl border border-stone-300 hover:bg-stone-50 text-xs font-semibold text-stone-700 transition-colors flex items-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset Default</span>
                </button>
              </div>

              {showcaseSaveNotice && (
                <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                  <span>Hero Signature Cake showcase updated successfully!</span>
                </div>
              )}

              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  onUpdateHeroShowcase(showcaseForm);
                  setShowcaseSaveNotice(true);
                  setShowcaseSavedButtonState(true);
                  showToast("Showcase changes saved successfully!");
                  setTimeout(() => setShowcaseSaveNotice(false), 3000);
                  setTimeout(() => setShowcaseSavedButtonState(false), 2500);
                }} 
                className="space-y-5"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#57483D] mb-1.5">
                      Showcase Badge Title *
                    </label>
                    <input
                      type="text"
                      required
                      value={showcaseForm.badge}
                      onChange={(e) => setShowcaseForm({ ...showcaseForm, badge: e.target.value })}
                      placeholder="Bespoke Theme Cakes"
                      className="w-full px-4 py-3 rounded-2xl border border-[#D9C4B2] bg-[#FFFDF9] text-sm text-[#451A03] focus:outline-none focus:ring-2 focus:ring-[#92400E]/20 focus:border-[#92400E]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#57483D] mb-1.5">
                      Showcase Sub-Badge / Note *
                    </label>
                    <input
                      type="text"
                      required
                      value={showcaseForm.subBadge}
                      onChange={(e) => setShowcaseForm({ ...showcaseForm, subBadge: e.target.value })}
                      placeholder="Fondant, Buttercream & Pull-outs"
                      className="w-full px-4 py-3 rounded-2xl border border-[#D9C4B2] bg-[#FFFDF9] text-sm text-[#451A03] focus:outline-none focus:ring-2 focus:ring-[#92400E]/20 focus:border-[#92400E]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#57483D] mb-1.5">
                    Placeholder Label (Shown if no photo is uploaded)
                  </label>
                  <input
                    type="text"
                    required
                    value={showcaseForm.placeholderText}
                    onChange={(e) => setShowcaseForm({ ...showcaseForm, placeholderText: e.target.value })}
                    placeholder="[Hero Photo Placeholder: Storefront or Signature Cake Showcase]"
                    className="w-full px-4 py-3 rounded-2xl border border-[#D9C4B2] bg-[#FFFDF9] text-sm text-[#451A03] focus:outline-none focus:ring-2 focus:ring-[#92400E]/20 focus:border-[#92400E]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#57483D] mb-1.5">
                    Description & Feature Note
                  </label>
                  <textarea
                    rows="2"
                    required
                    value={showcaseForm.description}
                    onChange={(e) => setShowcaseForm({ ...showcaseForm, description: e.target.value })}
                    className="w-full px-4 py-3 rounded-2xl border border-[#D9C4B2] bg-[#FFFDF9] text-sm text-[#451A03] focus:outline-none focus:ring-2 focus:ring-[#92400E]/20 focus:border-[#92400E]"
                  />
                </div>

                {/* Photo Upload & Preview */}
                <div className="p-5 rounded-2xl bg-[#FAF2E8] border border-[#E9D9C9] space-y-3">
                  <span className="block text-xs font-bold uppercase tracking-wider text-[#451A03]">
                    Showcase Photo Upload (Optional)
                  </span>

                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                    <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-[#D9C4B2] hover:bg-[#FDF6ED] text-xs font-semibold text-[#451A03] transition-colors shadow-2xs">
                      <Upload className="w-4 h-4 text-[#92400E]" />
                      <span>Upload Hero Cake Image</span>
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={(e) => {
                          const file = e.target.files[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onload = (uploadEvent) => {
                              setCropperModal({
                                isOpen: true,
                                imageUrl: uploadEvent.target.result,
                                rawOriginalUrl: uploadEvent.target.result,
                                target: 'showcase',
                                title: 'Crop Signature Cake Showcase Photo'
                              });
                            };
                            reader.readAsDataURL(file);
                          }
                        }} 
                        className="hidden" 
                      />
                    </label>

                    {showcaseForm.imageUrl ? (
                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full pt-1">
                        <div className="flex items-center gap-3">
                          <div className="w-16 h-16 rounded-xl overflow-hidden border border-[#D9C4B2] shadow-2xs relative bg-white">
                            <img 
                              src={showcaseForm.imageUrl} 
                              alt="Hero preview" 
                              className="w-full h-full object-cover" 
                            />
                          </div>
                          <div className="flex flex-col gap-1">
                            <button
                              type="button"
                              onClick={() => setCropperModal({
                                isOpen: true,
                                imageUrl: showcaseForm.rawOriginalUrl || showcaseForm.imageUrl,
                                rawOriginalUrl: showcaseForm.rawOriginalUrl || showcaseForm.imageUrl,
                                target: 'showcase',
                                title: 'Re-crop Showcase Photo'
                              })}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#FAF2E8] hover:bg-[#F3E5D4] border border-[#D9C4B2] text-xs text-[#92400E] font-bold transition-colors"
                            >
                              <Crop className="w-3.5 h-3.5" />
                              <span>Crop & Adjust Frame</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => setShowcaseForm({ ...showcaseForm, imageUrl: "", rawOriginalUrl: "" })}
                              className="text-[11px] text-rose-700 hover:underline font-semibold text-left"
                            >
                              Remove Photo
                            </button>
                          </div>
                        </div>

                        <div className="flex-1 bg-white p-3 rounded-xl border border-[#D9C4B2] w-full text-xs text-[#57483D]">
                          <span className="font-bold text-[#451A03] block mb-1">Gallery Photo Crop Applied</span>
                          <p className="text-[11px] text-[#786C62]">
                            Your photo was framed with the interactive crop tool and will display cleanly across the storefront. Click <strong>"Crop & Adjust Frame"</strong> anytime to reposition or re-zoom the full original image.
                          </p>
                        </div>
                      </div>
                    ) : (
                      <span className="text-xs text-[#786C62]">
                        No image uploaded yet. The clean styled placeholder will display.
                      </span>
                    )}
                  </div>
                </div>

                {/* Live Preview Box */}
                <div>
                  <span className="block text-[11px] uppercase font-bold tracking-wider text-[#786C62] mb-2">
                    Hero Showcase Preview:
                  </span>
                  <div className="max-w-sm mx-auto rounded-3xl p-3 bg-gradient-to-br from-[#F5EBE1] via-[#FFFDF9] to-[#FAF2E8] border border-[#E9D9C9] shadow-sm relative">
                    <div className="w-full aspect-[4/5] sm:aspect-square rounded-2xl bg-[#FFFDF9] border-2 border-dashed border-[#D9C4B2] flex flex-col items-center justify-center p-4 text-center overflow-hidden">
                      {showcaseForm.imageUrl ? (
                        <img 
                          src={showcaseForm.imageUrl} 
                          alt="preview" 
                          className="w-full h-full object-cover rounded-xl transition-all" 
                        />
                      ) : (
                        <>
                          <ImageIcon className="w-7 h-7 text-[#92400E] mb-2" />
                          <span className="font-mono text-[10px] text-[#78350F] bg-[#FEF3C7] px-2.5 py-1 rounded-lg border border-[#FDE68A] font-bold mb-1">
                            {showcaseForm.placeholderText}
                          </span>
                          <p className="text-[10px] text-[#786C62] line-clamp-2">
                            {showcaseForm.description}
                          </p>
                        </>
                      )}
                    </div>
                    <div className="mt-2 text-center">
                      <span className="inline-block text-[11px] font-bold text-[#451A03]">{showcaseForm.badge}</span>
                      <span className="block text-[10px] text-[#92400E]">{showcaseForm.subBadge}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-[#F5EBE1] flex items-center justify-end">
                  <button
                    type="submit"
                    className={`px-6 py-3 rounded-full text-white text-xs font-bold shadow-xs hover:shadow transition-all flex items-center gap-2 ${
                      showcaseSavedButtonState 
                        ? 'bg-emerald-600 hover:bg-emerald-700 scale-102 ring-2 ring-emerald-400/50' 
                        : 'bg-[#92400E] hover:bg-[#78350F]'
                    }`}
                  >
                    <Check className={`w-4 h-4 ${showcaseSavedButtonState ? 'text-white' : 'text-amber-200'}`} />
                    <span>{showcaseSavedButtonState ? 'Saved Successfully!' : 'Save Showcase Changes'}</span>
                  </button>
                </div>
              </form>

            </div>
          </div>
        )}

        {/* TAB 2: Slot Availability Banner Editor */}
        {activeTab === 'slots' && (
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="bg-white rounded-3xl border border-[#E9D9C9] p-6 sm:p-8 shadow-2xs space-y-6">
              
              <div className="flex items-center justify-between gap-4 border-b border-[#F5EBE1] pb-4">
                <div>
                  <h2 className="font-serif text-2xl font-bold text-[#451A03]">
                    Daily Custom Slot Availability
                  </h2>
                  <p className="text-xs text-[#786C62] mt-0.5">
                    Controls the sticky top notice banner shown across the public storefront.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={onResetAnnouncement}
                  className="px-3 py-1.5 rounded-xl border border-stone-300 hover:bg-stone-50 text-xs font-semibold text-stone-700 transition-colors flex items-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset Default</span>
                </button>
              </div>

              {slotSaveNotice && (
                <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                  <span>Public announcement banner updated successfully!</span>
                </div>
              )}

              <form onSubmit={handleSaveSlots} className="space-y-6">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#57483D] mb-2">
                    Current Slot Status:
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        setSlotStatus('open');
                        setSlotText("Mabuhay, Joyful Suki! Custom celebration cake slots for this week are OPEN. Reserve 3 to 5 days ahead!");
                      }}
                      className={`p-4 rounded-2xl border text-left transition-all ${
                        slotStatus === 'open' 
                          ? 'bg-emerald-50 border-emerald-300 text-emerald-950 ring-2 ring-emerald-500/20' 
                          : 'bg-[#FFFDF9] border-[#D9C4B2] text-[#57483D] hover:bg-[#FAF2E8]'
                      }`}
                    >
                      <span className="block font-serif text-sm font-bold text-emerald-900">🟢 Slots Open</span>
                      <span className="text-[11px] text-stone-600 mt-1 block">Accepting daily orders</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setSlotStatus('limited');
                        setSlotText("Mabuhay, Joyful Suki! Daily custom cake slots are limited to ensure top handcrafted quality. Please reserve your celebration slots 3 to 5 days ahead!");
                      }}
                      className={`p-4 rounded-2xl border text-left transition-all ${
                        slotStatus === 'limited' 
                          ? 'bg-amber-50 border-amber-300 text-amber-950 ring-2 ring-amber-500/20' 
                          : 'bg-[#FFFDF9] border-[#D9C4B2] text-[#57483D] hover:bg-[#FAF2E8]'
                      }`}
                    >
                      <span className="block font-serif text-sm font-bold text-amber-900">🟡 Limited Slots</span>
                      <span className="text-[11px] text-stone-600 mt-1 block">Few reservation spaces left</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setSlotStatus('full');
                        setSlotText("Notice: Custom cake slots for today are FULLY BOOKED! Walk-in display cakes & pastries remain available at our terminal shop.");
                      }}
                      className={`p-4 rounded-2xl border text-left transition-all ${
                        slotStatus === 'full' 
                          ? 'bg-rose-50 border-rose-300 text-rose-950 ring-2 ring-rose-500/20' 
                          : 'bg-[#FFFDF9] border-[#D9C4B2] text-[#57483D] hover:bg-[#FAF2E8]'
                      }`}
                    >
                      <span className="block font-serif text-sm font-bold text-rose-900">🔴 Fully Booked</span>
                      <span className="text-[11px] text-stone-600 mt-1 block">Display walk-in only</span>
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#57483D] mb-1.5">
                    Banner Announcement Text
                  </label>
                  <textarea
                    rows="3"
                    required
                    value={slotText}
                    onChange={(e) => setSlotText(e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl border border-[#D9C4B2] bg-[#FFFDF9] text-sm text-[#451A03] focus:outline-none focus:ring-2 focus:ring-[#92400E]/20 focus:border-[#92400E]"
                  />
                  <p className="text-[11px] text-[#786C62] mt-1">
                    Keep messages concise so Joyful Suki customers can easily read it on mobile devices.
                  </p>
                </div>

                {/* Live Banner Preview Box */}
                <div>
                  <span className="block text-[11px] uppercase font-bold tracking-wider text-[#786C62] mb-1.5">
                    Storefront Live Preview:
                  </span>
                  <div className="bg-[#F3DBBE] text-[#451A03] border border-[#E3C6A2] rounded-2xl p-4 text-xs font-medium flex items-center justify-between gap-3 shadow-xs">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full bg-[#92400E] text-white text-[10px] font-bold uppercase tracking-wider shadow-2xs">
                        {slotStatus === 'open' ? 'Custom Cake Slots Open' : slotStatus === 'full' ? 'Fully Booked Today' : 'Slot Availability Notice'}
                      </span>
                      <span className="font-semibold text-[#451A03]">{slotText}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    type="submit"
                    className="px-6 py-3 rounded-full bg-[#92400E] hover:bg-[#78350F] text-white text-xs font-bold shadow-xs hover:shadow transition-all flex items-center gap-2"
                  >
                    <Check className="w-4 h-4 text-amber-200" />
                    <span>Publish Banner to Storefront</span>
                  </button>
                </div>
              </form>

            </div>
          </div>
        )}

        {/* TAB 3: Custom Cake Inquiries Log */}
        {activeTab === 'inquiries' && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-3xl border border-[#E9D9C9] shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className="font-serif text-2xl font-bold text-[#451A03]">
                  Custom Cake Inquiry Log
                </h2>
                <p className="text-xs text-[#786C62] mt-0.5">
                  Submissions received from the public Custom Cake Request form.
                </p>
              </div>
              <span className="px-3.5 py-1.5 rounded-full bg-[#FAF2E8] border border-[#E9D9C9] text-xs font-bold text-[#78350F]">
                Total Received: {inquiries?.length || 0}
              </span>
            </div>

            {(!inquiries || inquiries.length === 0) ? (
              <div className="bg-white rounded-3xl border border-dashed border-[#D9C4B2] p-12 text-center max-w-lg mx-auto">
                <div className="w-16 h-16 rounded-2xl bg-[#FAF2E8] flex items-center justify-center text-[#92400E] mx-auto mb-3">
                  <Inbox className="w-8 h-8" />
                </div>
                <h3 className="font-serif text-xl font-bold text-[#451A03]">No Inquiries Logged Yet</h3>
                <p className="text-xs text-[#786C62] mt-1 max-w-xs mx-auto">
                  When customers submit the Custom Cake Inquiry Form on the storefront, their details will appear here immediately.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {inquiries.map((inq, idx) => (
                  <div key={idx} className="bg-white rounded-3xl border border-[#E9D9C9] p-6 shadow-2xs space-y-4">
                    <div className="flex justify-between items-start border-b border-[#F5EBE1] pb-3">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#92400E] bg-[#FEF3C7] px-2.5 py-0.5 rounded-full border border-[#FDE68A]">
                          {inq.eventType}
                        </span>
                        <h4 className="font-serif text-lg font-bold text-[#451A03] mt-1.5">
                          {inq.customerName}
                        </h4>
                      </div>
                      <span className="font-mono text-[11px] text-[#786C62]">
                        {inq.timestamp}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-xs text-[#57483D]">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-[#786C62] block">Contact Number</span>
                        <strong className="text-[#451A03]">{inq.contactNumber}</strong>
                      </div>
                      <div>
                        <span className="text-[10px] uppercase font-bold text-[#786C62] block">Event Date</span>
                        <strong className="text-[#451A03]">{inq.preferredDate || 'TBD'}</strong>
                      </div>
                      <div>
                        <span className="text-[10px] uppercase font-bold text-[#786C62] block">Size / Tiers</span>
                        <strong className="text-[#451A03]">{inq.cakeSize}</strong>
                      </div>
                      <div>
                        <span className="text-[10px] uppercase font-bold text-[#786C62] block">Fulfillment</span>
                        <strong className="text-[#451A03]">{inq.fulfillmentMethod}</strong>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-[#F5EBE1]">
                      <span className="text-[10px] uppercase font-bold text-[#786C62] block mb-1">Theme & Notes</span>
                      <p className="text-xs text-[#451A03] bg-[#FFFDF9] p-3 rounded-xl border border-[#E9D9C9]">
                        {inq.themeDescription}
                      </p>
                    </div>

                    {inq.hasUploadedImage && inq.previewUrl && (
                      <div className="pt-2 border-t border-[#F5EBE1]">
                        <span className="text-[10px] uppercase font-bold text-[#786C62] block mb-2">Uploaded Reference</span>
                        <div className="w-24 h-24 rounded-xl overflow-hidden border border-[#D9C4B2] shadow-2xs">
                          <img src={inq.previewUrl} alt="Cake reference" className="w-full h-full object-cover" />
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </main>

      {/* Modal: Add / Edit Product */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-[#E9D9C9] max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between border-b border-[#F5EBE1] pb-4 mb-5">
              <div>
                <h3 className="font-serif text-xl font-bold text-[#451A03]">
                  {editingProduct ? 'Edit Catalog Item' : 'Add New Item to Catalog'}
                </h3>
                <p className="text-xs text-[#786C62]">
                  Changes are saved to local state and reflected immediately.
                </p>
              </div>
              <button 
                onClick={() => setIsProductModalOpen(false)}
                className="p-1.5 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#57483D] mb-1">
                  Product Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Strawberry Shortcake Chiffon"
                  value={productForm.name}
                  onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#D9C4B2] bg-[#FFFDF9] text-sm text-[#451A03] focus:outline-none focus:ring-2 focus:ring-[#92400E]/20 focus:border-[#92400E]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#57483D] mb-1">
                    Category *
                  </label>
                  <select
                    value={productForm.category}
                    onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#D9C4B2] bg-[#FFFDF9] text-sm text-[#451A03] focus:outline-none focus:ring-2 focus:ring-[#92400E]/20 focus:border-[#92400E]"
                  >
                    <option value="display-cakes">Ready-to-Buy Display Cakes</option>
                    <option value="custom-fondant">Customized & Fondant Cakes</option>
                    <option value="bite-sized">Bite-Sized Pastries & Tubs</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#57483D] mb-1">
                    Pricing Display *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. ₱450.00 or [Custom Quote]"
                    value={productForm.priceBadge}
                    onChange={(e) => setProductForm({ ...productForm, priceBadge: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#D9C4B2] bg-[#FFFDF9] text-sm text-[#451A03] focus:outline-none focus:ring-2 focus:ring-[#92400E]/20 focus:border-[#92400E]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#57483D] mb-1">
                  Description *
                </label>
                <textarea
                  rows="2"
                  required
                  placeholder="Describe sponge, frosting, flavors, or packaging..."
                  value={productForm.description}
                  onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#D9C4B2] bg-[#FFFDF9] text-sm text-[#451A03] focus:outline-none focus:ring-2 focus:ring-[#92400E]/20 focus:border-[#92400E]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#57483D] mb-1">
                    Badge Label
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Bestseller, Ready in Display"
                    value={productForm.badge}
                    onChange={(e) => setProductForm({ ...productForm, badge: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#D9C4B2] bg-[#FFFDF9] text-sm text-[#451A03] focus:outline-none focus:ring-2 focus:ring-[#92400E]/20 focus:border-[#92400E]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#57483D] mb-1">
                    Availability / Lead Time
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Daily Walk-in, 3-5 Days Notice"
                    value={productForm.availability}
                    onChange={(e) => setProductForm({ ...productForm, availability: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#D9C4B2] bg-[#FFFDF9] text-sm text-[#451A03] focus:outline-none focus:ring-2 focus:ring-[#92400E]/20 focus:border-[#92400E]"
                  />
                </div>
              </div>

              {/* Image Upload or Placeholder */}
              <div className="p-4 rounded-2xl bg-[#FAF2E8] border border-[#E9D9C9] space-y-3">
                <label className="block text-xs font-bold uppercase tracking-wider text-[#451A03]">
                  Product Photo (Local Upload or Placeholder)
                </label>
                
                <div className="flex items-center gap-3">
                  <label className="cursor-pointer inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-white border border-[#D9C4B2] text-xs font-semibold text-[#451A03] hover:bg-[#FDF6ED] transition-colors">
                    <Upload className="w-3.5 h-3.5 text-[#92400E]" />
                    <span>Upload Local Photo</span>
                    <input type="file" accept="image/*" onChange={handleImageFileChange} className="hidden" />
                  </label>

                  {productForm.imageUrl && (
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full pt-1">
                      <div className="flex items-center gap-2">
                        <div className="w-14 h-14 rounded-xl overflow-hidden border border-[#D9C4B2] shrink-0 relative bg-white shadow-2xs">
                          <img 
                            src={productForm.imageUrl} 
                            alt="preview" 
                            className="w-full h-full object-cover" 
                          />
                        </div>
                        <div className="flex flex-col gap-1">
                          <button
                            type="button"
                            onClick={() => setCropperModal({
                              isOpen: true,
                              imageUrl: productForm.rawOriginalUrl || productForm.imageUrl,
                              rawOriginalUrl: productForm.rawOriginalUrl || productForm.imageUrl,
                              target: 'product',
                              title: `Crop Photo: ${productForm.name || 'Catalog Product'}`
                            })}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white hover:bg-[#F3E5D4] border border-[#D9C4B2] text-xs text-[#92400E] font-bold transition-colors shadow-2xs"
                          >
                            <Crop className="w-3.5 h-3.5" />
                            <span>Crop Photo</span>
                          </button>
                          <button 
                            type="button" 
                            onClick={() => setProductForm({ ...productForm, imageUrl: '', rawOriginalUrl: '' })}
                            className="text-[11px] text-rose-700 hover:underline font-semibold text-left"
                          >
                            Remove Photo
                          </button>
                        </div>
                      </div>

                      <div className="flex-1 bg-white p-2.5 rounded-xl border border-[#D9C4B2] text-xs text-[#57483D]">
                        <span className="font-bold text-[#451A03] block text-[11px]">Photo Cropped for Storefront</span>
                        <p className="text-[10px] text-[#786C62]">
                          Uses gallery-style crop box matching the catalog card aspect ratio. Click <strong>"Crop Photo"</strong> to re-adjust framing anytime.
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  <input
                    type="text"
                    placeholder="Or custom placeholder text: [Photo Placeholder: My Cake]"
                    value={productForm.photoPlaceholder}
                    onChange={(e) => setProductForm({ ...productForm, photoPlaceholder: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-[#D9C4B2] bg-white text-xs text-[#451A03]"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="soldOutCheck"
                  checked={productForm.isSoldOut}
                  onChange={(e) => setProductForm({ ...productForm, isSoldOut: e.target.checked })}
                  className="rounded text-[#92400E] focus:ring-[#92400E]"
                />
                <label htmlFor="soldOutCheck" className="text-xs font-semibold text-[#57483D] cursor-pointer">
                  Mark as "Sold Out Today" in Public Catalog
                </label>
              </div>

              <div className="pt-3 border-t border-[#F5EBE1] flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  className="px-4 py-2 rounded-full text-stone-600 text-xs font-semibold hover:bg-stone-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-full bg-[#92400E] hover:bg-[#78350F] text-white text-xs font-bold shadow-xs"
                >
                  {editingProduct ? 'Save Changes' : 'Add Item'}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

      {/* Gallery Photo Cropper Modal */}
      {cropperModal.isOpen && (
        <GalleryPhotoCropper 
          imageUrl={cropperModal.imageUrl}
          title={cropperModal.title || "Crop & Frame Photo"}
          aspectRatio={cropperModal.target === 'showcase' ? 4 / 5 : 4 / 5}
          onSaveCroppedImage={(croppedDataUrl) => {
            if (cropperModal.target === 'showcase') {
              setShowcaseForm(prev => ({ 
                ...prev, 
                imageUrl: croppedDataUrl,
                rawOriginalUrl: cropperModal.rawOriginalUrl || prev.rawOriginalUrl || cropperModal.imageUrl
              }));
              showToast("Photo cropped & framed! Click 'Save Showcase Changes' to publish.");
            } else if (cropperModal.target === 'product') {
              setProductForm(prev => ({ 
                ...prev, 
                imageUrl: croppedDataUrl,
                rawOriginalUrl: cropperModal.rawOriginalUrl || prev.rawOriginalUrl || cropperModal.imageUrl
              }));
              showToast("Photo cropped & framed for product!");
            }
            setCropperModal({ isOpen: false, imageUrl: '', rawOriginalUrl: '', target: '', title: '' });
          }}
          onClose={() => setCropperModal({ isOpen: false, imageUrl: '', rawOriginalUrl: '', target: '', title: '' })}
        />
      )}

      {/* Floating Toast Notification Banner */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 animate-bounce-in flex items-center gap-3 px-5 py-3.5 rounded-2xl bg-[#1C1917] text-white shadow-2xl border border-stone-700/80">
          <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
            <Check className="w-4 h-4" />
          </div>
          <span className="text-xs font-semibold text-stone-100">{toastMessage}</span>
          <button
            type="button"
            onClick={() => setToastMessage(null)}
            className="text-stone-400 hover:text-white ml-1"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

    </div>
  );
}
