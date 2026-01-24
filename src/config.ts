// ============================================
// WEDDING CONFIGURATION
// Edit this file to customize your wedding website
// ============================================

export const config = {
  // ---- COUPLE DETAILS ----
  couple: {
    person1: {
      name: "John",
      fullName: "John Alexander Smith",
      parents: "Robert & Maria Smith",
    },
    person2: {
      name: "Jane",
      fullName: "Jane Elizabeth Doe",
      parents: "William & Sarah Doe",
    },
  },

  // ---- WEDDING DATE ----
  // Format: YYYY-MM-DDTHH:mm:ss
  weddingDate: "2026-11-14T13:00:00",

  // ---- EVENTS TIMELINE ----
  events: [
    {
      id: "ceremony",
      title: "Holy Matrimony",
      time: "10:00 AM",
      endTime: "11:30 AM",
      venue: "St. Mary's Cathedral",
      address: "123 Church Street, City",
      description: "Join us as we exchange our vows",
      icon: "church",
      mapsEmbed: "https://www.google.com/maps/embed?pb=!1m18!...", // Replace with actual embed URL
      mapsLink: "https://maps.google.com/?q=...", // Replace with actual link
    },
    {
      id: "lunch",
      title: "Wedding Lunch",
      time: "12:00 PM",
      endTime: "2:00 PM",
      venue: "Garden Pavilion",
      address: "456 Garden Road, City",
      description: "Light refreshments and celebration",
      icon: "utensils",
    },
    {
      id: "reception",
      title: "Reception & Dinner",
      time: "6:00 PM",
      endTime: "10:00 PM",
      venue: "Grand Ballroom Hotel",
      address: "789 Main Avenue, City",
      description: "Dinner, dancing, and celebration",
      icon: "party",
      mapsEmbed: "https://www.google.com/maps/embed?pb=!1m18!...", // Replace with actual embed URL
      mapsLink: "https://maps.google.com/?q=...", // Replace with actual link
      dressCode: "Formal Attire",
    },
  ],

  // ---- THEME COLORS ----
  // Choose a palette or customize your own
  // Preset options: "sage", "dustyRose", "slateGold", "navy", "custom"
  themePalette: "sage" as const,

  // Custom colors (only used if themePalette is "custom")
  customColors: {
    primary: "#87A878",
    secondary: "#F5F1EB",
    accent: "#C9A962",
    background: "#FDFCFA",
    text: "#2D3748",
    textLight: "#718096",
  },

  // ---- GALLERY ----
  // Add your prewedding photo URLs here
  gallery: [
    { src: "/images/gallery/photo1.jpg", alt: "Prewedding photo 1" },
    { src: "/images/gallery/photo2.jpg", alt: "Prewedding photo 2" },
    { src: "/images/gallery/photo3.jpg", alt: "Prewedding photo 3" },
    { src: "/images/gallery/photo4.jpg", alt: "Prewedding photo 4" },
    { src: "/images/gallery/photo5.jpg", alt: "Prewedding photo 5" },
    { src: "/images/gallery/photo6.jpg", alt: "Prewedding photo 6" },
  ],

  // ---- HERO IMAGES ----
  // Main hero section images (for slideshow)
  heroImages: [
    { src: "/images/hero/hero1.jpg", alt: "Hero image 1" },
    { src: "/images/hero/hero2.jpg", alt: "Hero image 2" },
    { src: "/images/hero/hero3.jpg", alt: "Hero image 3" },
  ],

  // ---- WEDDING REGISTRY ----
  registry: {
    enabled: true,
    message: "Your presence is the greatest gift. However, if you wish to honor us with a gift, we have registered at the following:",
    items: [
      {
        id: "1",
        name: "Honeymoon Fund",
        description: "Help us create memories on our honeymoon adventure",
        image: "/images/registry/honeymoon.jpg",
        link: "https://...",
        targetAmount: 5000,
      },
      {
        id: "2",
        name: "Kitchen Appliances",
        description: "Help us set up our new home",
        link: "https://amazon.com/registry/...",
        external: true,
      },
    ],
  },

  // ---- MESSAGE BOARD ----
  messageBoard: {
    enabled: true,
    title: "Wishes & Messages",
    subtitle: "Leave your heartfelt wishes for the couple",
  },

  // ---- RSVP SETTINGS ----
  // Note: Plus ones are set per-guest in the CSV import (max_plus_ones column)
  rsvp: {
    deadline: "2025-05-15",
    askDietaryRestrictions: true,
    askSongRequest: true,
  },

  // ---- SITE META ----
  site: {
    title: "John & Jane's Wedding",
    description: "Join us in celebrating our love",
    ogImage: "/images/og-image.jpg",
  },
};

// ============================================
// COLOR PALETTES (DO NOT EDIT)
// ============================================
export const colorPalettes = {
  sage: {
    primary: "#87A878",
    secondary: "#F5F1EB",
    accent: "#C9A962",
    background: "#FDFCFA",
    text: "#2D3748",
    textLight: "#718096",
  },
  dustyRose: {
    primary: "#D4A5A5",
    secondary: "#F9F5F3",
    accent: "#8B7355",
    background: "#FFFBF9",
    text: "#2D3748",
    textLight: "#718096",
  },
  slateGold: {
    primary: "#4A5568",
    secondary: "#F7FAFC",
    accent: "#D4AF37",
    background: "#FFFFFF",
    text: "#1A202C",
    textLight: "#718096",
  },
  navy: {
    primary: "#1E3A5F",
    secondary: "#F8F9FA",
    accent: "#B8860B",
    background: "#FFFFFF",
    text: "#1A202C",
    textLight: "#718096",
  },
  custom: {} as Record<string, string>,
};

// Helper to get current theme colors
export function getThemeColors() {
  if (config.themePalette === "custom") {
    return config.customColors;
  }
  return colorPalettes[config.themePalette];
}

export type ThemeColors = ReturnType<typeof getThemeColors>;
