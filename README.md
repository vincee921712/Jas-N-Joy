# Jas 'N Joy Cakes and Pastries - Webapp & Data Management Guide

## 1. Saved Skills
The entire **UI/UX Pro Max** skill suite from [ui-ux-pro-max-skill](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill) has been saved into `.agy/skills/`:
- `ui-ux-pro-max`: Design intelligence engine (192 color palettes, 74 font pairings, 130 UX guidelines).
- `design`: Comprehensive design systems and layout tokens.
- `design-system`: Master design tokens and typography pairings.
- `brand`: Brand identity, voice, tone, and positioning.
- `banner-design`: Promotional and celebration banner heuristics.
- `ui-styling`: CSS / Tailwind styling and micro-interactions.

---

## 2. Centralized Data Architecture (`src/data/bakeryData.js`)

In accordance with the **Strict Anti-Hallucination & Placeholder Rule**, all business info, product details, prices, contact records, and images are decoupled from the UI components.

To update prices, contact info, or add products, edit **`src/data/bakeryData.js`**:

```javascript
// Example: Updating a product
{
  id: "prod-custom-kitty",
  name: "Hello Kitty Candyland Cake",
  category: "custom-cakes",
  description: "Multi-tiered celebration centerpiece finished in pastel buttercream...",
  price: "$85.00", // Replace placeholder with real price
  leadTime: "3–5 days notice required",
  isCustom: true,
  photoPlaceholder: "/images/cakes/hello-kitty-candyland.jpg", // Replace with real image path
  badge: "Bespoke Order"
}
```

---

## 3. Tech Stack & Commands

- **React 19** + **Vite 8**
- **Tailwind CSS v4** (`@tailwindcss/vite`)
- **Lucide React** icons
- **Artisanal Typography**: Playfair Display (Serif Headings) + Plus Jakarta Sans (Clean Modern Body)

### Run Locally:
```bash
npm run dev
```

### Build for Production:
```bash
npm run build
```
