import React, { useState, useEffect } from 'react';
import { 
  Heart, 
  Clock, 
  MapPin, 
  Phone, 
  Mail, 
  Sparkles, 
  ChevronRight, 
  Calendar, 
  ShoppingBag, 
  CheckCircle2, 
  Image as ImageIcon,
  Cake,
  Coffee,
  MessageCircle,
  Menu,
  X,
  Truck,
  Upload,
  AlertCircle,
  ShieldCheck,
  Send,
  Store,
  Compass,
  Lock
} from 'lucide-react';
import { 
  bakeryInfo, 
  categories, 
  products as defaultProducts, 
  roxasCityBarangays, 
  eventTypes 
} from './data/bakeryData';
import OwnerPortal from './components/OwnerPortal';

export default function App() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [bannerDismissed, setBannerDismissed] = useState(false);

  // View state: 'storefront' | 'portal'
  const [currentView, setCurrentView] = useState('storefront');

  // LocalStorage Persisted State: Products Catalog
  const [products, setProducts] = useState(() => {
    try {
      const saved = localStorage.getItem('jasnjoy_catalog_products');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error("Failed to load products from localStorage", e);
    }
    return defaultProducts;
  });

  // LocalStorage Persisted State: Announcement Banner
  const [announcement, setAnnouncement] = useState(() => {
    try {
      const saved = localStorage.getItem('jasnjoy_announcement');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error("Failed to load announcement from localStorage", e);
    }
    return bakeryInfo.announcement;
  });

  // LocalStorage Persisted State: Hero Signature Cake Showcase
  const [heroShowcase, setHeroShowcase] = useState(() => {
    try {
      const saved = localStorage.getItem('jasnjoy_hero_showcase');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error("Failed to load hero showcase from localStorage", e);
    }
    return bakeryInfo.heroShowcase;
  });

  // LocalStorage Persisted State: Custom Inquiries Log
  const [inquiries, setInquiries] = useState(() => {
    try {
      const saved = localStorage.getItem('jasnjoy_inquiries_log');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error("Failed to load inquiries from localStorage", e);
    }
    return [];
  });

  // Sync products to localStorage
  const handleUpdateProducts = (newProducts) => {
    setProducts(newProducts);
    try {
      localStorage.setItem('jasnjoy_catalog_products', JSON.stringify(newProducts));
    } catch (e) {
      console.error(e);
    }
  };

  const handleResetProducts = () => {
    if (window.confirm("Reset public catalog to the default bakeryData.js list?")) {
      setProducts(defaultProducts);
      try {
        localStorage.removeItem('jasnjoy_catalog_products');
      } catch (e) {
        console.error(e);
      }
    }
  };

  // Sync announcement banner to localStorage
  const handleUpdateAnnouncement = (newAnnouncement) => {
    setAnnouncement(newAnnouncement);
    try {
      localStorage.setItem('jasnjoy_announcement', JSON.stringify(newAnnouncement));
    } catch (e) {
      console.error(e);
    }
  };

  const handleResetAnnouncement = () => {
    setAnnouncement(bakeryInfo.announcement);
    try {
      localStorage.removeItem('jasnjoy_announcement');
    } catch (e) {
      console.error(e);
    }
  };

  // Sync Hero Showcase to localStorage
  const handleUpdateHeroShowcase = (newShowcase) => {
    setHeroShowcase(newShowcase);
    try {
      localStorage.setItem('jasnjoy_hero_showcase', JSON.stringify(newShowcase));
    } catch (e) {
      console.error(e);
    }
  };

  const handleResetHeroShowcase = () => {
    setHeroShowcase(bakeryInfo.heroShowcase);
    try {
      localStorage.removeItem('jasnjoy_hero_showcase');
    } catch (e) {
      console.error(e);
    }
  };

  // Delivery Zone Checker State
  const [selectedBarangay, setSelectedBarangay] = useState('Barangay Lawaan');

  // Custom Inquiry Form State
  const [formState, setFormState] = useState({
    customerName: '',
    contactNumber: '',
    eventType: 'Birthday Celebration',
    themeDescription: '',
    cakeSize: 'Single Tier (8-inch Celebration)',
    fulfillmentMethod: 'Free Local Delivery (Brgy. Lawaan / Dinginan)',
    preferredDate: '',
    notes: ''
  });
  const [previewImage, setPreviewImage] = useState(null);
  const [submittedSummary, setSubmittedSummary] = useState(null);
  const [isLogoZoomed, setIsLogoZoomed] = useState(false);

  // Filtered Products
  const filteredProducts = selectedCategory === 'all'
    ? products
    : products.filter(p => p.category === selectedCategory);

  const activeBarangayObj = roxasCityBarangays.find(b => b.name === selectedBarangay);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewImage(url);
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const newInquiry = {
      ...formState,
      hasUploadedImage: !!previewImage,
      previewUrl: previewImage,
      timestamp: new Date().toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric' 
      })
    };

    setSubmittedSummary(newInquiry);

    // Save to inquiries state and localStorage for owner portal review
    const updatedInquiries = [newInquiry, ...inquiries];
    setInquiries(updatedInquiries);
    try {
      localStorage.setItem('jasnjoy_inquiries_log', JSON.stringify(updatedInquiries));
    } catch (err) {
      console.error(err);
    }
  };

  // If in Owner Portal view, render the Owner Portal component
  if (currentView === 'portal') {
    return (
      <OwnerPortal
        onBackToStorefront={() => setCurrentView('storefront')}
        products={products}
        onUpdateProducts={handleUpdateProducts}
        onResetProducts={handleResetProducts}
        announcement={announcement}
        onUpdateAnnouncement={handleUpdateAnnouncement}
        onResetAnnouncement={handleResetAnnouncement}
        heroShowcase={heroShowcase}
        onUpdateHeroShowcase={handleUpdateHeroShowcase}
        onResetHeroShowcase={handleResetHeroShowcase}
        inquiries={inquiries}
      />
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#FFFDF9] text-[#2D241E] font-sans selection:bg-amber-200 selection:text-amber-900">
      
      {/* 1. Top Announcement Bar: Slot Availability Banner (Dismissible / Sticky) */}
      {!bannerDismissed && (
        <aside 
          aria-label="Slot Availability Announcement"
          className="sticky top-0 z-50 bg-[#F3DBBE] text-[#451A03] border-b border-[#E3C6A2] px-3 sm:px-4 py-2.5 text-xs sm:text-sm font-medium shadow-xs transition-all"
        >
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 sm:gap-3">
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#92400E] text-white text-[10px] sm:text-[11px] font-bold uppercase tracking-wider shrink-0 shadow-2xs">
                <Sparkles className="w-3 sm:w-3.5 h-3 sm:h-3.5 text-amber-200" />
                {announcement.badge || "Slot Notice"}
              </span>
              <p className="text-left leading-tight text-xs sm:text-sm font-semibold truncate sm:overflow-visible sm:whitespace-normal text-[#451A03]">
                {announcement.text}
              </p>
            </div>
            <button 
              onClick={() => setBannerDismissed(true)}
              className="text-[#78350F] hover:text-[#451A03] p-1 rounded-md hover:bg-[#E8CAAA]/70 transition-colors shrink-0"
              aria-label="Dismiss Announcement"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </aside>
      )}

      {/* Main Header / Navigation */}
      <header className="sticky top-0 z-40 bg-[#FFFDF9]/95 backdrop-blur-md border-b border-[#F5EBE1] shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          
          {/* Logo & Brand Identity (Clickable to Zoom) */}
          <div className="flex items-center gap-3.5">
            <button
              type="button"
              onClick={() => setIsLogoZoomed(true)}
              className="relative group focus:outline-none focus:ring-2 focus:ring-[#92400E] rounded-full cursor-zoom-in"
              title="Click to view Jas 'N Joy Logo"
              aria-label="Zoom Jas 'N Joy Logo"
            >
              <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-full overflow-hidden bg-white border border-[#E9D9C9] p-0.5 shadow-xs group-hover:scale-105 group-hover:border-[#92400E] transition-all">
                <img 
                  src={bakeryInfo.logoUrl} 
                  alt="Jas 'N Joy Cakes and Pastries Official Logo" 
                  className="w-full h-full object-cover rounded-full"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    e.currentTarget.nextElementSibling?.classList.remove('hidden');
                  }}
                />
                <div className="hidden w-full h-full flex items-center justify-center bg-[#FDF6ED] rounded-full">
                  <Cake className="w-6 h-6 text-[#92400E]" />
                </div>
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 bg-[#92400E] text-white p-1 rounded-full text-[9px] opacity-0 group-hover:opacity-100 transition-opacity shadow-xs">
                🔍
              </span>
            </button>
            <div>
              <a href="#" className="block font-serif text-xl sm:text-2xl font-bold tracking-tight text-[#451A03] hover:text-[#92400E] transition-colors leading-tight">
                {bakeryInfo.brandName}
              </a>
              <div className="flex items-center gap-1.5 text-[11px] font-semibold tracking-wider text-[#92400E] uppercase">
                <span>{bakeryInfo.tagline}</span>
                <span className="text-[#C28251]">•</span>
                <span className="font-bold text-[#78350F]">Est. 2019</span>
              </div>
            </div>
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-1.5 font-medium text-sm text-[#57483D]">
            <a 
              href="#about" 
              className="px-3.5 py-2 rounded-full text-center hover:text-[#92400E] hover:bg-amber-100/70 hover:shadow-xs active:scale-95 transition-all duration-200"
            >
              Our Story
            </a>
            <a 
              href="#menu" 
              className="px-3.5 py-2 rounded-full text-center hover:text-[#92400E] hover:bg-amber-100/70 hover:shadow-xs active:scale-95 transition-all duration-200"
            >
              Menu Catalog
            </a>
            <a 
              href="#delivery-checker" 
              className="px-3.5 py-2 rounded-full text-center hover:text-[#92400E] hover:bg-amber-100/70 hover:shadow-xs active:scale-95 transition-all duration-200"
            >
              Delivery Zones
            </a>
            <a 
              href="#inquiry-section" 
              className="px-3.5 py-2 rounded-full text-center hover:text-[#92400E] hover:bg-amber-100/70 hover:shadow-xs active:scale-95 transition-all duration-200"
            >
              Custom Cake Form
            </a>
            <a 
              href="#location" 
              className="px-3.5 py-2 rounded-full text-center hover:text-[#92400E] hover:bg-amber-100/70 hover:shadow-xs active:scale-95 transition-all duration-200"
            >
              Storefront Location
            </a>
          </nav>

          {/* CTA & Messenger Button */}
          <div className="hidden sm:flex items-center gap-3">
            <a 
              href={bakeryInfo.contact.facebookUrl}
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#92400E] hover:bg-[#78350F] text-[#FFFDF9] text-xs font-semibold shadow-xs hover:shadow transition-all"
            >
              <MessageCircle className="w-4 h-4 text-amber-300" />
              <span>Message on Facebook</span>
            </a>

            {/* Direct Owner Portal Login Button */}
            <button
              type="button"
              onClick={() => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
                setCurrentView('portal');
              }}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-[#FAF2E8] hover:bg-[#F5EBE1] border border-[#D9C4B2] text-[#451A03] text-xs font-bold transition-all shadow-2xs hover:border-[#92400E]"
              title="Baker / Owner Administration Login"
            >
              <Lock className="w-3.5 h-3.5 text-[#92400E]" />
              <span>Owner Login</span>
            </button>
          </div>

          {/* Mobile Menu Hamburger */}
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl text-[#57483D] hover:bg-[#F5EBE1]"
            aria-label="Toggle navigation menu"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Dropdown */}
        {isMobileMenuOpen && (
          <div className="lg:hidden bg-[#FFFDF9] border-b border-[#E9D9C9] px-6 py-5 space-y-4">
            <a 
              href="#about" 
              onClick={() => setIsMobileMenuOpen(false)}
              className="block px-3 py-2.5 rounded-xl font-medium text-sm text-[#451A03] hover:text-[#92400E] hover:bg-amber-100/70 transition-all"
            >
              Our Story
            </a>
            <a 
              href="#menu" 
              onClick={() => setIsMobileMenuOpen(false)}
              className="block px-3 py-2.5 rounded-xl font-medium text-sm text-[#451A03] hover:text-[#92400E] hover:bg-amber-100/70 transition-all"
            >
              Menu Catalog
            </a>
            <a 
              href="#delivery-checker" 
              onClick={() => setIsMobileMenuOpen(false)}
              className="block px-3 py-2.5 rounded-xl font-medium text-sm text-[#451A03] hover:text-[#92400E] hover:bg-amber-100/70 transition-all"
            >
              Roxas City Delivery Zones
            </a>
            <a 
              href="#inquiry-section" 
              onClick={() => setIsMobileMenuOpen(false)}
              className="block px-3 py-2.5 rounded-xl font-medium text-sm text-[#451A03] hover:text-[#92400E] hover:bg-amber-100/70 transition-all"
            >
              Custom Cake Inquiry Form
            </a>
            <a 
              href="#location" 
              onClick={() => setIsMobileMenuOpen(false)}
              className="block px-3 py-2.5 rounded-xl font-medium text-sm text-[#451A03] hover:text-[#92400E] hover:bg-amber-100/70 transition-all"
            >
              Storefront Location
            </a>
            <a 
              href={bakeryInfo.contact.facebookUrl}
              target="_blank" 
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 py-3 rounded-full bg-[#92400E] text-[#FFFDF9] text-xs font-semibold shadow-xs"
            >
              <MessageCircle className="w-4 h-4 text-amber-300" />
              <span>Message Us on Facebook</span>
            </a>

            <button
              type="button"
              onClick={() => {
                setIsMobileMenuOpen(false);
                window.scrollTo({ top: 0, behavior: 'smooth' });
                setCurrentView('portal');
              }}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-full bg-[#FAF2E8] border border-[#D9C4B2] text-[#451A03] text-xs font-bold"
            >
              <Lock className="w-4 h-4 text-[#92400E]" />
              <span>Owner Portal Login</span>
            </button>
          </div>
        )}
      </header>

      {/* 2. Hero Section (Brand Identity, Greeting, & Hero Placeholder) */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#F7ECD8] via-[#FFFDF8] via-70% to-[#1A1613]/[0.025] py-14 sm:py-20 border-b border-[#F5EBE1]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            {/* Left Copy */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Badges: Suki Greeting + Registration */}
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#FEE2E2] border border-[#FECACA] text-[#991B1B] text-xs font-bold uppercase tracking-wider">
                  <Heart className="w-3.5 h-3.5 fill-[#DC2626] text-[#DC2626]" />
                  {bakeryInfo.communityGreeting}
                </span>
                <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#FEF3C7] border border-[#FDE68A] text-[#92400E] text-xs font-bold tracking-wide">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#B45309]" />
                  {bakeryInfo.registration}
                </span>
              </div>

              {/* Headings */}
              <div className="space-y-3">
                <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold text-[#451A03] leading-[1.15]">
                  Warm, artisanal bakes for every joyful milestone.
                </h1>
                <p className="font-serif italic text-lg sm:text-xl text-[#92400E] font-medium">
                  "{bakeryInfo.tagline}"
                </p>
              </div>

              {/* Bio Summary */}
              <p className="text-[#57483D] text-sm sm:text-base leading-relaxed max-w-2xl">
                Established in 2019, Jas 'N Joy grew from an online home-based bakeshop in July 2020 into a beloved physical storefront at Pueblo de Panay. We take immense pride in handcrafting customized celebration centerpieces and daily fresh pastries for our community.
              </p>

              {/* Call to Actions */}
              <div className="pt-2 flex flex-wrap items-center gap-3.5">
                <a 
                  href="#inquiry-section"
                  className="px-6 py-3.5 rounded-full bg-[#92400E] hover:bg-[#78350F] text-[#FFFDF9] text-xs sm:text-sm font-semibold shadow-sm hover:shadow transition-all flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>Custom Cake Inquiry</span>
                </a>
                <a 
                  href="#delivery-checker"
                  className="px-6 py-3.5 rounded-full bg-[#F5EBE1] hover:bg-[#EBDCCE] border border-[#D9C4B2] text-[#451A03] text-xs sm:text-sm font-semibold transition-all flex items-center gap-2"
                >
                  <Truck className="w-4 h-4 text-[#92400E]" />
                  <span>Check Delivery Zones</span>
                </a>
              </div>

              {/* Micro Trust Indicators */}
              <div className="pt-6 grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-[#F5EBE1] text-xs text-[#57483D]">
                <div className="flex items-center gap-2">
                  <Store className="w-4 h-4 text-[#92400E] shrink-0" />
                  <span>Storefront at Pueblo de Panay</span>
                </div>
                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-[#92400E] shrink-0" />
                  <span>Free Delivery: Lawaan & Dinginan</span>
                </div>
                <div className="flex items-center gap-2">
                  <Heart className="w-4 h-4 text-[#92400E] shrink-0" />
                  <span>Crafted for Joyful Suki</span>
                </div>
              </div>
            </div>

            {/* Right Hero Image / Signature Cake Showcase Frame */}
            <div className="lg:col-span-5">
              <div className="relative rounded-3xl p-3 bg-gradient-to-br from-[#F5EBE1] via-[#FFFDF9] to-[#FAF2E8] border border-[#E9D9C9] shadow-lg">
                <div className="w-full aspect-[4/5] sm:aspect-square lg:aspect-[4/5] rounded-2xl bg-[#FFFDF9] border-2 border-dashed border-[#D9C4B2] flex flex-col items-center justify-center p-6 text-center group overflow-hidden">
                  {heroShowcase?.imageUrl ? (
                    <img 
                      src={heroShowcase.imageUrl} 
                      alt="Signature Cake Showcase" 
                      style={{ 
                        objectPosition: heroShowcase.imagePosition || 'center',
                        transform: heroShowcase.imageScale ? `translate(${heroShowcase.imageX || 0}%, ${heroShowcase.imageY || 0}%) scale(${heroShowcase.imageScale || 1})` : undefined,
                        transformOrigin: 'center center'
                      }}
                      className="w-full h-full object-cover rounded-xl transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <>
                      <div className="w-16 h-16 rounded-2xl bg-[#FDF6ED] border border-[#E9D9C9] flex items-center justify-center mb-4 text-[#92400E] shadow-2xs">
                        <ImageIcon className="w-8 h-8" />
                      </div>
                      <span className="font-mono text-xs text-[#78350F] bg-[#FEF3C7] px-3.5 py-1.5 rounded-lg border border-[#FDE68A] font-bold mb-2">
                        {heroShowcase?.placeholderText || "[Hero Photo Placeholder: Storefront or Signature Cake Showcase]"}
                      </span>
                      <p className="text-xs text-[#786C62] max-w-xs leading-relaxed">
                        {heroShowcase?.description || "Reserved for high-resolution photography of Jas 'N Joy's Pueblo de Panay bakeshop display or featured tiered centerpiece."}
                      </p>
                    </>
                  )}
                </div>

                {/* Floating Tag */}
                <div className="absolute -bottom-4 -left-3 bg-[#FFFDF9] border border-[#E9D9C9] px-4 py-2.5 rounded-2xl shadow-md flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#FEE2E2] flex items-center justify-center text-[#DC2626]">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="block text-xs font-bold text-[#451A03]">{heroShowcase?.badge || "Bespoke Theme Cakes"}</span>
                    <span className="block text-[11px] text-[#92400E]">{heroShowcase?.subBadge || "Fondant, Buttercream & Pull-outs"}</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. Brand Story & Founder Section */}
      <section id="about" className="py-16 sm:py-20 bg-gradient-to-b from-[#FFFDF8] via-[#FBF2E3] via-60% to-[#1A1613]/[0.035] border-b border-[#F5EBE1]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Story Content */}
            <div className="lg:col-span-7 space-y-6">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FEF3C7] border border-[#FDE68A] text-[#92400E] text-xs font-bold uppercase tracking-wider">
                <Store className="w-3.5 h-3.5 text-[#B45309]" />
                Our Story & Milestones
              </span>

              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#451A03] leading-snug">
                From home oven to Pueblo de Panay: Baking joy since 2019.
              </h2>

              <div className="space-y-4 text-sm sm:text-base text-[#57483D] leading-relaxed">
                <p>{bakeryInfo.story.origin}</p>
                <p>{bakeryInfo.story.fbMilestone}</p>
                <p>{bakeryInfo.story.storefrontMilestone}</p>
                <p className="font-medium text-[#78350F] italic">"{bakeryInfo.story.promise}"</p>
              </div>

              {/* Business Official Contact Card */}
              <div className="pt-2 p-5 rounded-2xl bg-[#FFFDF9] border border-[#E9D9C9] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <span className="text-[11px] uppercase tracking-wider text-[#786C62] font-semibold">Official Business Inquiries</span>
                  <p className="text-xs text-[#57483D] mt-0.5">{bakeryInfo.registration}</p>
                </div>
                <a 
                  href={`mailto:${bakeryInfo.ownerEmail}`}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#F5EBE1] hover:bg-[#EBDCCE] text-xs font-semibold text-[#451A03] border border-[#D9C4B2] transition-colors"
                >
                  <Mail className="w-3.5 h-3.5 text-[#92400E]" />
                  <span>{bakeryInfo.ownerEmail}</span>
                </a>
              </div>
            </div>

            {/* Storefront / Baker Photo Placeholder Frame */}
            <div className="lg:col-span-5">
              <div className="p-4 rounded-3xl bg-[#FAF2E8] border border-[#E9D9C9] shadow-sm">
                <div className="aspect-[4/5] sm:aspect-square lg:aspect-[4/5] w-full rounded-2xl bg-white border-2 border-dashed border-[#D9C4B2] flex flex-col items-center justify-center p-6 text-center">
                  <div className="w-14 h-14 rounded-2xl bg-[#FDF6ED] flex items-center justify-center text-[#92400E] mb-3">
                    <ImageIcon className="w-7 h-7" />
                  </div>
                  <span className="font-mono text-xs font-bold text-[#78350F] bg-[#FEF3C7] px-3 py-1 rounded-md border border-[#FDE68A] mb-2">
                    [Photo Placeholder: Storefront & Bakery Counter at Pueblo de Panay]
                  </span>
                  <p className="text-xs text-[#786C62] max-w-xs leading-relaxed">
                    Easy swap for a photograph of the physical shop at Roxas City Integrated Transport Terminal.
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 3. Product Catalog (Menu & Gallery Section) */}
      <section id="menu" className="py-16 sm:py-24 bg-gradient-to-b from-[#FFFDF8] via-[#FAF0DA] via-65% to-[#1C1814]/[0.035]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#FEF3C7] border border-[#FDE68A] text-[#92400E] text-xs font-bold uppercase tracking-wider">
              Bakeshop Catalog
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#451A03] mt-3 mb-4">
              Cakes, Pastries & Everyday Delights
            </h2>
            <p className="text-sm sm:text-base text-[#57483D]">
              Explore our ready-to-buy display treats, affordable snack tubs, and bespoke themed cakes. Managed live with instant updates.
            </p>
          </div>

          {/* Interactive Category Filter Tabs: Horizontal scroll on mobile, wrap on md+ */}
          <div className="flex overflow-x-auto flex-nowrap md:flex-wrap md:overflow-visible justify-start md:justify-center gap-2.5 mb-10 pb-2 md:pb-0 px-2 sm:px-0 -mx-4 sm:mx-0 px-4 sm:px-0 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 sm:px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all whitespace-nowrap shrink-0 ${
                  selectedCategory === cat.id
                    ? 'bg-[#92400E] text-white shadow-xs'
                    : 'bg-white text-[#57483D] hover:bg-[#FAF2E8] border border-[#E9D9C9]'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Product Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.map((product) => (
              <div 
                key={product.id}
                className={`group bg-white rounded-3xl border transition-all duration-300 ease-out overflow-hidden flex flex-col justify-between hover:scale-[1.03] hover:-translate-y-1 ${
                  product.isSoldOut ? 'border-stone-300 opacity-85' : 'border-[#E9D9C9] shadow-xs hover:shadow-xl hover:border-amber-300/80'
                }`}
              >
                {/* Product Photo Placeholder Frame or Live Image */}
                <div>
                  <div className="p-4 pb-0">
                    <div className="relative aspect-square sm:aspect-[4/5] w-full rounded-2xl bg-gradient-to-br from-[#FAF2E8] to-[#FFFDF9] border-2 border-dashed border-[#D9C4B2] flex flex-col items-center justify-center p-4 text-center overflow-hidden transition-all duration-300 group-hover:border-amber-400/80">
                      {product.imageUrl ? (
                        <img 
                          src={product.imageUrl} 
                          alt={product.name} 
                          style={{ 
                            objectPosition: product.imagePosition || 'center',
                            transform: product.imageScale ? `translate(${product.imageX || 0}%, ${product.imageY || 0}%) scale(${product.imageScale || 1})` : undefined,
                            transformOrigin: 'center center'
                          }}
                          className="w-full h-full object-cover rounded-xl transition-transform duration-500 ease-out group-hover:scale-105"
                        />
                      ) : (
                        <div className="transition-transform duration-300 group-hover:scale-105">
                          <ImageIcon className="w-8 h-8 text-[#B45309] mb-2 mx-auto" />
                          <span className="font-mono text-xs font-semibold text-[#78350F] bg-white/90 px-3 py-1 rounded-md border border-[#E9D9C9] shadow-2xs">
                            {product.photoPlaceholder}
                          </span>
                        </div>
                      )}

                      {/* Pill Badges */}
                      <div className="absolute top-3 right-3 flex flex-col gap-1 items-end z-10">
                        {product.isSoldOut ? (
                          <span className="text-[10px] font-bold uppercase px-3 py-1 rounded-full bg-stone-800 text-white shadow-2xs">
                            Sold Out Today
                          </span>
                        ) : (
                          <span className={`text-[11px] font-bold uppercase px-3 py-1 rounded-full border shadow-2xs transition-transform duration-300 group-hover:scale-105 ${product.accent || 'bg-amber-100 text-amber-900 border-amber-300'}`}>
                            {product.badge}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Details */}
                  <div className="p-6 pb-2 space-y-3">
                    <h3 className="font-serif text-lg sm:text-xl font-bold text-[#451A03] mb-1.5 transition-colors duration-200 group-hover:text-[#92400E]">
                      {product.name}
                    </h3>
                    <p className="text-xs sm:text-sm text-[#57483D] leading-relaxed mb-3">
                      {product.description}
                    </p>
                    <div className="flex items-center gap-1.5 text-[11px] font-semibold text-[#92400E]">
                      <Clock className="w-3.5 h-3.5 text-[#B45309]" />
                      <span>{product.availability}</span>
                    </div>
                  </div>
                </div>

                {/* Pricing Badge & Inquiry Trigger */}
                <div className="p-6 pt-4 border-t border-[#F5EBE1] flex items-center justify-between gap-2">
                  <div>
                    <span className="block text-[10px] uppercase tracking-wider text-[#786C62] font-bold">
                      Pricing / Status
                    </span>
                    <span className="font-mono text-xs font-bold text-[#78350F] bg-[#FEF3C7] px-2 py-0.5 rounded border border-[#FDE68A]">
                      {product.priceBadge}
                    </span>
                  </div>

                  <a 
                    href="#inquiry-section"
                    onClick={() => {
                      setFormState(prev => ({
                        ...prev,
                        themeDescription: `Inquiring for: ${product.name} (${product.priceBadge})`
                      }));
                    }}
                    className={`px-4 py-2 rounded-full text-xs font-semibold transition-all duration-200 flex items-center gap-1 shrink-0 ${
                      product.isSoldOut
                        ? 'bg-stone-100 text-stone-500 hover:bg-stone-200'
                        : 'bg-[#F5EBE1] hover:bg-[#92400E] hover:text-white text-[#451A03] shadow-2xs'
                    }`}
                  >
                    <span>{product.isSoldOut ? 'Inquire Next Batch' : 'Inquire'}</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 4. Interactive Features: Delivery Zone Checker & Custom Cake Inquiry Form */}
      <section id="delivery-checker" className="py-16 sm:py-20 bg-gradient-to-b from-[#FAF4EA] via-[#F4E6CD] via-60% to-[#181512]/[0.03] border-y border-[#F5EBE1]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#FEF3C7] border border-[#FDE68A] text-[#92400E] text-xs font-bold uppercase tracking-wider">
              <Truck className="w-3.5 h-3.5 text-[#B45309]" />
              Roxas City Delivery Checker
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#451A03] mt-2 mb-3">
              Instant Delivery Rate & Zone Verification
            </h2>
            <p className="text-sm text-[#57483D]">
              Check your Roxas City barangay to see if you qualify for Free Local Delivery or Maxim courier delivery.
            </p>
          </div>

          {/* Delivery Checker Tool Card */}
          <div className="max-w-2xl mx-auto bg-white rounded-3xl border border-[#E9D9C9] p-6 sm:p-8 shadow-xs">
            <label className="block text-xs font-bold uppercase tracking-wider text-[#57483D] mb-2">
              Select Your Roxas City Barangay:
            </label>
            <div className="relative mb-6">
              <select
                value={selectedBarangay}
                onChange={(e) => setSelectedBarangay(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl border border-[#D9C4B2] bg-[#FFFDF9] text-sm font-medium text-[#451A03] focus:outline-none focus:ring-2 focus:ring-[#92400E]/20 focus:border-[#92400E] appearance-none cursor-pointer"
              >
                {roxasCityBarangays.map((b) => (
                  <option key={b.name} value={b.name}>
                    {b.name} {b.isFree ? '⭐ (Free Delivery Zone)' : ''}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-[#786C62]">
                <ChevronRight className="w-4 h-4 rotate-90" />
              </div>
            </div>

            {/* Instant Delivery Result Box */}
            <div className={`p-5 rounded-2xl border transition-all ${
              activeBarangayObj?.isFree 
                ? 'bg-emerald-50 border-emerald-200 text-emerald-950'
                : 'bg-amber-50 border-amber-200 text-amber-950'
            }`}>
              <div className="flex items-start gap-3">
                {activeBarangayObj?.isFree ? (
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                    <Sparkles className="w-5 h-5" />
                  </div>
                ) : (
                  <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
                    <Truck className="w-5 h-5" />
                  </div>
                )}
                <div className="space-y-1">
                  <h4 className="font-serif text-lg font-bold">
                    {activeBarangayObj?.isFree ? (
                      "🎉 Free Local Delivery Available!"
                    ) : (
                      "🛵 Delivery via Maxim / Standard Service Charge Applies"
                    )}
                  </h4>
                  <p className="text-xs sm:text-sm leading-relaxed">
                    {activeBarangayObj?.isFree ? (
                      <>You are within our complimentary local delivery zone for <strong>{selectedBarangay}</strong> (Pueblo de Panay hub area).</>
                    ) : (
                      <>For deliveries to <strong>{selectedBarangay}</strong>, orders are safely dispatched via Maxim courier at standard rider rates, or you can opt for convenient <strong>In-Store Pickup</strong> at our terminal shop.</>
                    )}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-[#F5EBE1] flex flex-wrap items-center justify-between text-xs text-[#786C62]">
              <span>Pickup Hub: Roxas City Integrated Transport Terminal</span>
              <span className="font-medium text-[#92400E]">Daily 9:00 AM – 5:00 PM</span>
            </div>
          </div>

        </div>
      </section>

      {/* 4b. Custom Cake Inquiry Form (Interactive & Reactive) */}
      <section id="inquiry-section" className="py-16 sm:py-24 bg-gradient-to-b from-[#FFFDF8] via-[#FAF2E1] via-60% to-[#1C1814]/[0.035]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center mb-12">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#FEE2E2] border border-[#FECACA] text-[#991B1B] text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 fill-[#DC2626] text-[#DC2626]" />
              Joyful Suki Custom Cake Desk
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#451A03] mt-2 mb-3">
              Request a Custom Cake Quotation
            </h2>
            <p className="text-sm text-[#57483D] max-w-xl mx-auto">
              Share your celebration vision with our baking team. Upload your photo inspiration, choose fulfillment, and get a tailored quotation.
            </p>
          </div>

          <div className="bg-white rounded-3xl border border-[#E9D9C9] p-6 sm:p-10 shadow-xs">
            
            {submittedSummary ? (
              /* Interactive Order Summary Card */
              <div className="space-y-6 animate-in fade-in duration-300">
                <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-100 flex items-center justify-center shrink-0 text-emerald-700">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-serif text-xl font-bold text-emerald-950">
                      Inquiry Summary Generated!
                    </h3>
                    <p className="text-xs sm:text-sm text-emerald-800 mt-1">
                      Mabuhay, {submittedSummary.customerName}! We have saved your custom cake inquiry. You can review the details below or forward them directly to our Facebook messenger.
                    </p>
                  </div>
                </div>

                {/* Structured Summary Card */}
                <div className="border border-[#E9D9C9] rounded-2xl p-6 bg-[#FFFDF9] space-y-4">
                  <div className="flex justify-between items-center border-b border-[#F5EBE1] pb-3">
                    <span className="font-serif text-lg font-bold text-[#451A03]">Jas 'N Joy Cake Ticket</span>
                    <span className="font-mono text-xs text-[#786C62]">Logged: {submittedSummary.timestamp}</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm text-[#57483D]">
                    <div>
                      <span className="text-[#786C62] block text-[11px] uppercase font-bold">Client Name</span>
                      <strong className="text-[#451A03]">{submittedSummary.customerName}</strong>
                    </div>
                    <div>
                      <span className="text-[#786C62] block text-[11px] uppercase font-bold">Contact Number</span>
                      <strong className="text-[#451A03]">{submittedSummary.contactNumber}</strong>
                    </div>
                    <div>
                      <span className="text-[#786C62] block text-[11px] uppercase font-bold">Event Type</span>
                      <strong className="text-[#451A03]">{submittedSummary.eventType}</strong>
                    </div>
                    <div>
                      <span className="text-[#786C62] block text-[11px] uppercase font-bold">Preferred Event Date</span>
                      <strong className="text-[#451A03]">{submittedSummary.preferredDate || "To be finalized"}</strong>
                    </div>
                    <div>
                      <span className="text-[#786C62] block text-[11px] uppercase font-bold">Tier / Size</span>
                      <strong className="text-[#451A03]">{submittedSummary.cakeSize}</strong>
                    </div>
                    <div>
                      <span className="text-[#786C62] block text-[11px] uppercase font-bold">Fulfillment Method</span>
                      <strong className="text-[#451A03]">{submittedSummary.fulfillmentMethod}</strong>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-[#F5EBE1]">
                    <span className="text-[#786C62] block text-[11px] uppercase font-bold">Theme & Design Inspiration</span>
                    <p className="text-xs sm:text-sm text-[#451A03] mt-1 bg-white p-3 rounded-xl border border-[#E9D9C9]">
                      {submittedSummary.themeDescription || "No specific theme notes provided."}
                    </p>
                  </div>

                  {/* Uploaded Reference Preview */}
                  {submittedSummary.hasUploadedImage && (
                    <div className="pt-3 border-t border-[#F5EBE1]">
                      <span className="text-[#786C62] block text-[11px] uppercase font-bold mb-2">Attached Reference Photo</span>
                      <div className="w-32 h-32 rounded-xl overflow-hidden border border-[#D9C4B2] shadow-2xs">
                        <img 
                          src={submittedSummary.previewUrl} 
                          alt="Custom Cake Reference" 
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
                  <button
                    onClick={() => {
                      setSubmittedSummary(null);
                      setPreviewImage(null);
                    }}
                    className="px-5 py-2.5 rounded-full border border-[#D9C4B2] text-[#451A03] text-xs font-semibold hover:bg-[#FAF2E8] transition-colors"
                  >
                    Edit / Submit Another Inquiry
                  </button>
                  <a
                    href={bakeryInfo.contact.facebookUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-6 py-3 rounded-full bg-[#92400E] hover:bg-[#78350F] text-white text-xs font-bold shadow-xs flex items-center gap-2"
                  >
                    <MessageCircle className="w-4 h-4 text-amber-300" />
                    <span>Confirm With Jas 'N Joy on Facebook</span>
                  </a>
                </div>
              </div>
            ) : (
              /* Input Form */
              <form onSubmit={handleFormSubmit} className="space-y-6">
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#57483D] mb-1.5">
                      Your Full Name *
                    </label>
                    <input 
                      type="text" 
                      required
                      placeholder="e.g. Maria Joy Santos"
                      value={formState.customerName}
                      onChange={(e) => setFormState({...formState, customerName: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl border border-[#D9C4B2] bg-[#FFFDF9] text-sm text-[#451A03] focus:outline-none focus:ring-2 focus:ring-[#92400E]/20 focus:border-[#92400E]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#57483D] mb-1.5">
                      Contact Mobile Number *
                    </label>
                    <input 
                      type="tel" 
                      required
                      placeholder="+63 9XX XXX XXXX"
                      value={formState.contactNumber}
                      onChange={(e) => setFormState({...formState, contactNumber: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl border border-[#D9C4B2] bg-[#FFFDF9] text-sm text-[#451A03] focus:outline-none focus:ring-2 focus:ring-[#92400E]/20 focus:border-[#92400E]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#57483D] mb-1.5">
                      Event Type *
                    </label>
                    <select
                      value={formState.eventType}
                      onChange={(e) => setFormState({...formState, eventType: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl border border-[#D9C4B2] bg-[#FFFDF9] text-sm text-[#451A03] focus:outline-none focus:ring-2 focus:ring-[#92400E]/20 focus:border-[#92400E]"
                    >
                      {eventTypes.map((type) => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#57483D] mb-1.5">
                      Target Event Date *
                    </label>
                    <input 
                      type="date" 
                      required
                      value={formState.preferredDate}
                      onChange={(e) => setFormState({...formState, preferredDate: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl border border-[#D9C4B2] bg-[#FFFDF9] text-sm text-[#451A03] focus:outline-none focus:ring-2 focus:ring-[#92400E]/20 focus:border-[#92400E]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#57483D] mb-1.5">
                      Cake Size / Tier Setup
                    </label>
                    <select
                      value={formState.cakeSize}
                      onChange={(e) => setFormState({...formState, cakeSize: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl border border-[#D9C4B2] bg-[#FFFDF9] text-sm text-[#451A03] focus:outline-none focus:ring-2 focus:ring-[#92400E]/20 focus:border-[#92400E]"
                    >
                      <option value="Single Tier (8-inch Celebration)">Single Tier (8-inch Celebration)</option>
                      <option value="Two-Tier Celebration Cake">Two-Tier Celebration Cake</option>
                      <option value="Three-Tier Grand Milestone">Three-Tier Grand Milestone</option>
                      <option value="Pull-Out / Number Cupcake Set">Pull-Out / Number Cupcake Set</option>
                      <option value="Custom Sculpted / Themed Figurine Cake">Custom Sculpted / Themed Figurine Cake</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#57483D] mb-1.5">
                      Fulfillment Method
                    </label>
                    <select
                      value={formState.fulfillmentMethod}
                      onChange={(e) => setFormState({...formState, fulfillmentMethod: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl border border-[#D9C4B2] bg-[#FFFDF9] text-sm text-[#451A03] focus:outline-none focus:ring-2 focus:ring-[#92400E]/20 focus:border-[#92400E]"
                    >
                      <option value="In-Store Pickup (Pueblo de Panay Terminal)">In-Store Pickup (Pueblo de Panay Terminal)</option>
                      <option value="Free Local Delivery (Brgy. Lawaan / Dinginan)">Free Local Delivery (Brgy. Lawaan / Dinginan)</option>
                      <option value="Courier Delivery (Maxim / Roxas City standard service)">Courier Delivery (Maxim / Roxas City standard service)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#57483D] mb-1.5">
                    Theme Description & Cake Details *
                  </label>
                  <textarea 
                    rows="3"
                    required
                    placeholder="Tell us about the theme (e.g. Hello Kitty pastel candyland, gold accents, floral bouquet, luxury bag, favorite cartoon character, or custom piping)..."
                    value={formState.themeDescription}
                    onChange={(e) => setFormState({...formState, themeDescription: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-[#D9C4B2] bg-[#FFFDF9] text-sm text-[#451A03] focus:outline-none focus:ring-2 focus:ring-[#92400E]/20 focus:border-[#92400E]"
                  />
                </div>

                {/* Reference Photo Upload with Live Preview */}
                <div className="p-5 rounded-2xl bg-[#FAF2E8] border border-[#E9D9C9]">
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#451A03] mb-2">
                    Reference Photo Upload (Optional)
                  </label>
                  <div className="flex flex-col sm:flex-row items-center gap-4">
                    <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-[#D9C4B2] hover:bg-[#FDF6ED] text-xs font-semibold text-[#451A03] transition-colors shadow-2xs">
                      <Upload className="w-4 h-4 text-[#92400E]" />
                      <span>Choose Reference Image</span>
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </label>

                    {previewImage ? (
                      <div className="flex items-center gap-3">
                        <div className="w-14 h-14 rounded-xl overflow-hidden border border-[#D9C4B2] shadow-2xs">
                          <img src={previewImage} alt="Reference preview" className="w-full h-full object-cover" />
                        </div>
                        <div className="text-xs text-[#57483D]">
                          <span className="font-semibold text-emerald-800 block">✓ Image attached</span>
                          <button 
                            type="button" 
                            onClick={() => setPreviewImage(null)}
                            className="text-[#991B1B] hover:underline"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    ) : (
                      <span className="text-xs text-[#786C62]">
                        Attach photo inspiration (e.g., color palette, fondant topper, or cake layout).
                      </span>
                    )}
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-end">
                  <button
                    type="submit"
                    className="px-8 py-3.5 rounded-full bg-[#92400E] hover:bg-[#78350F] text-white text-xs sm:text-sm font-bold shadow-xs hover:shadow transition-all flex items-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    <span>Generate Inquiry Summary</span>
                  </button>
                </div>

              </form>
            )}

          </div>

        </div>
      </section>

      {/* 5. Storefront Location & Contact (Contact Section & Footer) */}
      <section id="location" className="py-16 sm:py-20 bg-gradient-to-b from-[#FAF4EA] via-[#F3E5CE] via-60% to-[#181512]/[0.03] border-t border-[#F5EBE1]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            
            {/* Contact Details Card */}
            <div className="lg:col-span-6 bg-white rounded-3xl border border-[#E9D9C9] p-8 shadow-xs space-y-6">
              <div>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FEF3C7] border border-[#FDE68A] text-[#92400E] text-xs font-bold uppercase tracking-wider">
                  <Store className="w-3.5 h-3.5 text-[#B45309]" />
                  Physical Storefront
                </span>
                <h3 className="font-serif text-2xl font-bold text-[#451A03] mt-2">
                  Visit Us at Pueblo de Panay
                </h3>
              </div>

              {/* Exact Location */}
              <div className="space-y-4 text-xs sm:text-sm text-[#57483D]">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-[#92400E] shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-[#451A03]">Storefront Address:</strong>
                    <span>{bakeryInfo.contact.address}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-[#92400E] shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-[#451A03]">Operating Hours:</strong>
                    <span>{bakeryInfo.contact.storeHours}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-[#92400E] shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-[#451A03]">Direct Phone Lines:</strong>
                    <span>Mobile: {bakeryInfo.contact.mobile}</span><br />
                    <span>Landline: {bakeryInfo.contact.landline}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-[#92400E] shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-[#451A03]">Email Inquiry:</strong>
                    <span>{bakeryInfo.contact.email}</span>
                  </div>
                </div>
              </div>

              {/* Facebook Button */}
              <div className="pt-2 border-t border-[#F5EBE1]">
                <a 
                  href={bakeryInfo.contact.facebookUrl}
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-[#92400E] hover:bg-[#78350F] text-white font-bold text-xs sm:text-sm shadow-xs transition-all"
                >
                  <MessageCircle className="w-4 h-4 text-amber-300" />
                  <span>Message Us on Facebook</span>
                </a>
              </div>
            </div>

            {/* Map & Storefront Photo Placeholder Frame */}
            <div className="lg:col-span-6 space-y-4">
              <div className="bg-white rounded-3xl border border-[#E9D9C9] p-4 shadow-xs">
                <div className="aspect-[4/3] w-full rounded-2xl bg-[#FFFDF9] border-2 border-dashed border-[#D9C4B2] flex flex-col items-center justify-center p-6 text-center">
                  <div className="w-14 h-14 rounded-2xl bg-[#FAF2E8] flex items-center justify-center text-[#92400E] mb-3">
                    <Compass className="w-7 h-7" />
                  </div>
                  <span className="font-mono text-xs font-bold text-[#78350F] bg-[#FEF3C7] px-3.5 py-1.5 rounded-md border border-[#FDE68A] mb-2">
                    [Photo / Map Placeholder: Terminal Storefront & Pueblo de Panay Map]
                  </span>
                  <p className="text-xs text-[#786C62] max-w-sm leading-relaxed">
                    Designed for embedding an interactive Google Map or a high-definition storefront facade photo at Roxas City Integrated Transport Terminal.
                  </p>
                </div>
              </div>

              {/* DTI & BIR Credential Notice */}
              <div className="p-4 rounded-2xl bg-[#FFFDF9] border border-[#E9D9C9] flex items-center justify-between text-xs text-[#57483D]">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-700" />
                  <span>{bakeryInfo.registration}</span>
                </div>
                <span className="font-semibold text-[#92400E]">Est. 2019</span>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-b from-[#451A03] via-[#3B1502] to-[#2B0E01] text-[#FAF2E8]/80 pt-12 pb-24 md:pb-12 text-xs border-t border-amber-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-8 border-b border-amber-900/60">
            <div>
              <div className="flex items-center gap-3">
                <button 
                  type="button" 
                  onClick={() => setIsLogoZoomed(true)} 
                  className="w-10 h-10 rounded-full overflow-hidden bg-white border border-amber-800 p-0.5 hover:scale-105 transition-transform cursor-zoom-in"
                  title="Click to zoom logo"
                >
                  <img 
                    src={bakeryInfo.logoUrl} 
                    alt="Jas 'N Joy Logo" 
                    className="w-full h-full object-cover rounded-full"
                  />
                </button>
                <span className="font-serif text-lg font-bold text-amber-100">
                  {bakeryInfo.brandName}
                </span>
              </div>
              <p className="text-amber-300/80 text-xs mt-1">
                "{bakeryInfo.tagline}" • <a href={`mailto:${bakeryInfo.ownerEmail}`} className="hover:text-amber-100 underline decoration-amber-500/50">{bakeryInfo.ownerEmail}</a>
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <a 
                href={bakeryInfo.contact.facebookUrl}
                target="_blank" 
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-full bg-amber-900/80 hover:bg-amber-800 text-amber-100 border border-amber-700/60 transition-colors flex items-center gap-1.5"
              >
                <MessageCircle className="w-3.5 h-3.5 text-amber-300" />
                <span>Facebook: {bakeryInfo.contact.facebookName}</span>
              </a>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-stone-400 text-[11px]">
            <div>
              © {new Date().getFullYear()} Jas 'N Joy Cakes and Pastries. All business facts sourced accurately.
            </div>

            {/* Owner Portal Access Button */}
            <div className="flex flex-wrap items-center gap-3">
              <span className="hidden sm:inline">Centralized: <code className="text-amber-300 font-mono">src/data/bakeryData.js</code></span>
              <span className="hidden sm:inline text-stone-600">•</span>
              <button
                type="button"
                onClick={() => {
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                  setCurrentView('portal');
                }}
                className="inline-flex items-center gap-2 text-amber-200 bg-amber-900/90 hover:bg-amber-800 transition-all px-3 py-1.5 rounded-full border border-amber-700/80 font-semibold text-xs shadow-xs"
                title="Baker / Owner Administration Login"
              >
                <Lock className="w-3.5 h-3.5 text-amber-300" />
                <span>Owner Portal Login</span>
              </button>
            </div>
          </div>

        </div>
      </footer>

      {/* Mobile-Only Sticky Bottom Action Bar (< 768px) */}
      <div className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-[#FFFDF9]/95 backdrop-blur-md border-t border-[#E9D9C9] px-4 py-2.5 shadow-lg flex items-center gap-2.5">
        <a
          href="tel:+639152830284"
          className="flex-1 min-h-[44px] inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-2xl bg-[#FAF2E8] border border-[#D9C4B2] text-[#451A03] text-xs font-bold hover:bg-[#F5EBE1] transition-colors"
        >
          <Phone className="w-4 h-4 text-[#92400E]" />
          <span>Call Shop</span>
        </a>

        <a
          href="#inquiry-section"
          className="flex-1 min-h-[44px] inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-2xl bg-[#92400E] hover:bg-[#78350F] text-white text-xs font-bold shadow-xs transition-colors"
        >
          <Sparkles className="w-4 h-4 text-amber-300" />
          <span>Custom Cake</span>
        </a>
      </div>

      {/* Lightbox / Zoom Modal for Jas N Joy Logo */}
      {isLogoZoomed && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setIsLogoZoomed(false)}
        >
          <div 
            className="relative bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-amber-200 text-center animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setIsLogoZoomed(false)}
              className="absolute top-4 right-4 p-2 rounded-full text-stone-500 hover:text-stone-900 hover:bg-stone-100 transition-colors"
              aria-label="Close zoomed logo"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Zoomed Image */}
            <div className="w-full aspect-square max-w-xs sm:max-w-sm mx-auto rounded-full overflow-hidden bg-white border-2 border-[#E9D9C9] p-1 shadow-inner">
              <img 
                src={bakeryInfo.logoUrl} 
                alt="Jas 'N Joy Cakes and Pastries Logo" 
                className="w-full h-full object-cover rounded-full"
              />
            </div>

            {/* Brand Title & Tagline in Modal */}
            <div className="mt-5 space-y-1">
              <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#451A03]">
                {bakeryInfo.brandName}
              </h3>
              <p className="text-xs sm:text-sm font-medium text-[#92400E] italic">
                "{bakeryInfo.tagline}"
              </p>
              <p className="text-[11px] text-[#786C62] pt-2">
                Click anywhere outside or press Close to dismiss
              </p>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
