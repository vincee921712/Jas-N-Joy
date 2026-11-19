/**
 * Jas 'N Joy Cakes and Pastries - Centralized Business & Product Data Store
 * 
 * STRICT ANTI-HALLUCINATION & BUSINESS FACTS:
 * - Business: Jas 'N Joy Cakes and Pastries
 * - Owner & Founder: Razel C. Funa (razelcfuna@gmail.com)
 * - Established: 2019 (Online home-based baking on FB July 2020 -> physical storefront Pueblo de Panay 2021)
 * - Credentials: DTI- and BIR-registered local bakery
 * - Tagline: "Affordable yet swak sa panlasa"
 * - Community moniker: "Joyful Suki"
 * - Address: Roxas City Integrated Transport Terminal, Punta Dulog, Brgy. Lawaan, Pueblo de Panay, Roxas City, Capiz, 5800
 * - Hours: Monday to Sunday, 9:00 AM – 5:00 PM (subject to change)
 * - Mobile: +63 915 283 0284
 * - Landline: +63 36 647 3772
 * - Email: razelcfuna@gmail.com
 * - Facebook: Jas 'N Joy Cakes and Pastries
 * 
 * DELIVERY RULES:
 * - Free Local Delivery: Brgy. Lawaan, Brgy. Dinginan
 * - Maxim / Standard Service: Other Roxas City barangays
 */

export const bakeryInfo = {
  brandName: "Jas 'N Joy Cakes and Pastries",
  tagline: "Affordable yet swak sa panlasa",
  logoUrl: "/jas-n-joy-logo-circle.png",
  owner: "Razel C. Funa",
  ownerEmail: "razelcfuna@gmail.com",
  established: 2019,
  registration: "DTI- & BIR-Registered Local Bakery",
  communityGreeting: "Mabuhay, Joyful Suki!",
  
  story: {
    origin: "Jas 'N Joy Cakes and Pastries began in 2019 with a mother's passion for baking heartfelt, delicious treats for family celebrations.",
    fbMilestone: "In July 2020, during the height of the pandemic, we officially launched our home-based baking business on Facebook, serving custom cakes and comforting pastries to homes across Roxas City.",
    storefrontMilestone: "Thanks to our loyal Joyful Suki community, we proudly opened our brick-and-mortar storefront in 2021 at Pueblo de Panay, conveniently situated within the Roxas City Integrated Transport Terminal.",
    promise: "We stay true to our founding principle: crafting delightful, memorable celebration cakes and everyday treats that are truly affordable yet swak sa panlasa."
  },

  contact: {
    address: "Roxas City Integrated Transport Terminal, Punta Dulog, Brgy. Lawaan, Pueblo de Panay, Roxas City, Capiz, 5800",
    landmark: "Punta Dulog, Pueblo de Panay",
    storeHours: "Monday to Sunday, 9:00 AM – 5:00 PM (subject to change)",
    mobile: "+63 915 283 0284",
    landline: "+63 36 647 3772",
    email: "razelcfuna@gmail.com",
    facebookName: "Jas 'N Joy Cakes and Pastries (@jasnjoy.rxs)",
    facebookHandle: "@jasnjoy.rxs",
    facebookUrl: "https://www.facebook.com/jasnjoy.rxs/",
    googleMapsUrl: "https://www.google.com/maps/place/Jas+'N+Joy+Cakes+and+pastries+shop/@11.5597978,122.7504225,19z/data=!3m1!4b1!4m6!3m5!1s0x33a5f3e5e80d1d8f:0x93f9b8e54a1b246c!8m2!3d11.5597965!4d122.7510662!16s%2Fg%2F11rz4xnnb2"
  },

  announcement: {
    id: "announcement-2026",
    text: "Mabuhay, Joyful Suki! Daily custom cake slots are limited to ensure top handcrafted quality. Please reserve your celebration slots 3 to 5 days ahead!",
    badge: "Slot Availability Notice"
  },

  heroShowcase: {
    badge: "Bespoke Theme Cakes",
    subBadge: "Fondant, Buttercream & Pull-outs",
    placeholderText: "[Hero Photo Placeholder: Storefront or Signature Cake Showcase]",
    description: "Reserved for high-resolution photography of Jas 'N Joy's Pueblo de Panay bakeshop display or featured tiered centerpiece.",
    imageUrl: "",
    imagePosition: "center",
    imageScale: 1,
    imageX: 0,
    imageY: 0
  }
};

// Roxas City Barangays for the Interactive Delivery Zone Checker
export const roxasCityBarangays = [
  { name: "Barangay Lawaan", isFree: true, note: "Pueblo de Panay Hub Zone" },
  { name: "Barangay Dinginan", isFree: true, note: "Neighboring Zone" },
  { name: "Barangay I (Poblacion)", isFree: false },
  { name: "Barangay II (Poblacion)", isFree: false },
  { name: "Barangay III (Poblacion)", isFree: false },
  { name: "Barangay IV (Poblacion)", isFree: false },
  { name: "Barangay V (Poblacion)", isFree: false },
  { name: "Barangay VI (Poblacion)", isFree: false },
  { name: "Barangay VII (Poblacion)", isFree: false },
  { name: "Barangay VIII (Poblacion)", isFree: false },
  { name: "Barangay IX (Poblacion)", isFree: false },
  { name: "Barangay X (Poblacion)", isFree: false },
  { name: "Barangay XI (Poblacion)", isFree: false },
  { name: "Adlawan", isFree: false },
  { name: "Bago", isFree: false },
  { name: "Balaju-an", isFree: false },
  { name: "Balanacan", isFree: false },
  { name: "Banuya", isFree: false },
  { name: "Baybay", isFree: false },
  { name: "Bolo", isFree: false },
  { name: "Cabugao", isFree: false },
  { name: "Cagay", isFree: false },
  { name: "Cogon", isFree: false },
  { name: "Culajao", isFree: false },
  { name: "Culasi", isFree: false },
  { name: "Dumolog", isFree: false },
  { name: "Dayao", isFree: false },
  { name: "Inzo Arnaldo Village", isFree: false },
  { name: "Jumbo", isFree: false },
  { name: "Lanot", isFree: false },
  { name: "Libas", isFree: false },
  { name: "Liong", isFree: false },
  { name: "Loctugan", isFree: false },
  { name: "Malipayon", isFree: false },
  { name: "Milibili", isFree: false },
  { name: "Mongpong", isFree: false },
  { name: "Olango", isFree: false },
  { name: "Punta Cogon", isFree: false },
  { name: "Punta Tabuc", isFree: false },
  { name: "San Jose", isFree: false },
  { name: "Sibaguan", isFree: false },
  { name: "Talon", isFree: false },
  { name: "Tanque", isFree: false },
  { name: "Tiza", isFree: false }
];

export const categories = [
  { id: "all", label: "All Items" },
  { id: "display-cakes", label: "Ready-to-Buy Display Cakes" },
  { id: "custom-fondant", label: "Customized & Fondant Cakes" },
  { id: "bite-sized", label: "Bite-Sized Pastries & Tubs" }
];

export const products = [
  // Ready-to-Buy Display Cakes
  {
    id: "disp-choc-fudge",
    name: "Classic Chocolate Fudge Cake",
    category: "display-cakes",
    description: "Moist, rich chocolate sponge covered in silky chocolate fudge icing. Kept freshly frosted and ready for walk-in pickup.",
    priceBadge: "[In-Store Pricing / Inquire]",
    badge: "Ready in Display",
    availability: "Daily Walk-in / Ready-to-Go",
    photoPlaceholder: "[Photo Placeholder: Classic Chocolate Fudge Display Cake]",
    accent: "bg-amber-100 text-amber-900 border-amber-300"
  },
  {
    id: "disp-caramel-delight",
    name: "Golden Caramel Chiffon Cake",
    category: "display-cakes",
    description: "Light and airy chiffon sponge enveloped in creamy golden caramel glaze. Perfect for impromptu family get-togethers.",
    priceBadge: "[In-Store Pricing / Inquire]",
    badge: "Ready in Display",
    availability: "Daily Walk-in / Ready-to-Go",
    photoPlaceholder: "[Photo Placeholder: Golden Caramel Chiffon Display Cake]",
    accent: "bg-orange-100 text-orange-900 border-orange-300"
  },
  {
    id: "disp-ube-sponge",
    name: "Ube Pastry Display Cake",
    category: "display-cakes",
    description: "Authentic Filipino ube halaya sponge layered with smooth whipped frosting. A true Joyful Suki favorite.",
    priceBadge: "[In-Store Pricing / Inquire]",
    badge: "Ready in Display",
    availability: "Daily Walk-in / Ready-to-Go",
    photoPlaceholder: "[Photo Placeholder: Ube Pastry Display Cake]",
    accent: "bg-purple-100 text-purple-900 border-purple-300"
  },

  // Customized & Fondant Cakes
  {
    id: "cust-hello-kitty",
    name: "Hello Kitty Candyland Fondant Cake",
    category: "custom-fondant",
    description: "Bespoke celebration showstopper featuring handcrafted fondant figurines, pastel rainbow accents, and piped candyland detailing.",
    priceBadge: "[Custom Quote]",
    badge: "Past Featured Theme",
    availability: "3–5 Days Advance Order",
    photoPlaceholder: "[Photo Placeholder: Hello Kitty Candyland Cake]",
    accent: "bg-pink-100 text-pink-900 border-pink-300"
  },
  {
    id: "cust-luxury-bag",
    name: "Luxury Designer Bag Themed Cake",
    category: "custom-fondant",
    description: "Meticulously hand-sculpted designer purse cake with realistic quilted texture, edible metallic buckles, and elegant monogram finishes.",
    priceBadge: "[Custom Quote]",
    badge: "Past Featured Theme",
    availability: "3–5 Days Advance Order",
    photoPlaceholder: "[Photo Placeholder: Luxury Designer Bag Cake]",
    accent: "bg-rose-100 text-rose-900 border-rose-300"
  },
  {
    id: "cust-doll-cake",
    name: "Enchanted Princess Doll Cake",
    category: "custom-fondant",
    description: "Classic doll cake draped in flowing ruffled buttercream or rolled fondant gowns for fairy-tale birthday celebrations.",
    priceBadge: "[Custom Quote]",
    badge: "Past Featured Theme",
    availability: "3–5 Days Advance Order",
    photoPlaceholder: "[Photo Placeholder: Princess Doll Cake]",
    accent: "bg-indigo-100 text-indigo-900 border-indigo-300"
  },
  {
    id: "cust-fresh-fruits",
    name: "Lush Fruit Medley Tiered Cake",
    category: "custom-fondant",
    description: "Elegant celebration cake adorned with vibrant fruit garnishes, delicate drip glaze, and custom chocolate lettering.",
    priceBadge: "[Custom Quote]",
    badge: "Past Featured Theme",
    availability: "3–5 Days Advance Order",
    photoPlaceholder: "[Photo Placeholder: Fresh Fruit Medley Cake]",
    accent: "bg-emerald-100 text-emerald-900 border-emerald-300"
  },
  {
    id: "cust-pullout-cupcakes",
    name: "Themed Pull-Out & Number Cupcake Platter",
    category: "custom-fondant",
    description: "Custom arranged number or shaped cupcake sets with coordinating toppers for easy sharing and celebrations without slicing.",
    priceBadge: "[Custom Quote]",
    badge: "Custom Arrangements",
    availability: "2–3 Days Advance Order",
    photoPlaceholder: "[Photo Placeholder: Number & Pull-Out Cupcake Set]",
    accent: "bg-amber-100 text-amber-900 border-amber-300"
  },

  // Bite-Sized Pastries & Tubs
  {
    id: "bite-mini-crinkles",
    name: "Fudgy Mini Crinkles in a Tub",
    category: "bite-sized",
    description: "Soft, rich, and heavily dusted with confectioner's powdered sugar. Packed generously in handy reusable tubs.",
    priceBadge: "Affordable Snack Tub [Inquire / Regular Promo]",
    badge: "Community Favorite",
    availability: "Available Daily at Pueblo de Panay",
    photoPlaceholder: "[Photo Placeholder: Mini Crinkles in a Tub]",
    accent: "bg-stone-200 text-stone-900 border-stone-300"
  },
  {
    id: "bite-donuts-box",
    name: "Box of Bite-Sized Donuts",
    category: "bite-sized",
    description: "Pillowy, assorted mini donuts dusted with sweet glazes and sprinkles. (Previously featured at ₱59/box special promo).",
    priceBadge: "₱59 Special Promo / Box [Check In-Store Batch]",
    badge: "₱59 Snack Promo",
    availability: "Fresh Daily Batches",
    photoPlaceholder: "[Photo Placeholder: Box of Bite-Sized Donuts (₱59 Promo)]",
    accent: "bg-orange-100 text-orange-950 border-orange-300"
  }
];

export const eventTypes = [
  "Birthday Celebration",
  "Wedding Reception",
  "Baptism / Christening",
  "Gender Reveal",
  "Graduation Milestone",
  "Holiday / Christmas Gathering",
  "Anniversary",
  "Corporate / Other Event"
];
