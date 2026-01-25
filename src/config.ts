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
      mapsEmbed: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3961.2988068457107!2d107.5925410750197!3d-6.854742793143652!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e68e6b7af9b3289%3A0x72b029ec1dd0124a!2sGrand%20Mercure%20Bandung%20Setiabudi!5e0!3m2!1sen!2sid!4v1769332704886!5m2!1sen!2sid", // Replace with actual embed URL
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
    { src: "https://media.cntraveler.com/photos/68ff82e7977accaf27ac5b35/16:9/w_2560%2Cc_limit/GettyImages-2078516558.jpg", alt: "Prewedding photo 1" },
    { src: "/images/gallery/photo2.jpg", alt: "Prewedding photo 2" },
    { src: "/images/gallery/photo3.jpg", alt: "Prewedding photo 3" },
    { src: "/images/gallery/photo4.jpg", alt: "Prewedding photo 4" },
    { src: "/images/gallery/photo5.jpg", alt: "Prewedding photo 5" },
    { src: "/images/gallery/photo6.jpg", alt: "Prewedding photo 6" },
  ],

  // ---- HERO IMAGES ----
  // Main hero section images (for slideshow)
  heroImages: [
    { src: "https://media.cntraveler.com/photos/68ff82e7977accaf27ac5b35/16:9/w_2560%2Cc_limit/GettyImages-2078516558.jpg", alt: "Hero image 1" },
    { src: "https://thumbs.dreamstime.com/b/autumn-leaves-wet-stone-pathway-park-beautiful-fall-season-weather-night-concept-melancholy-rain-scene-wallpaper-395389772.jpg", alt: "Hero image 2" },
    { src: "https://img.freepik.com/free-photo/fuji-mountain-with-milky-way-night_335224-104.jpg", alt: "Hero image 3" },
  ],

  // ---- HERO FONT SIZES ----
  // Customize the hero section font sizes (mobile / desktop)
  heroFontSizes: {
    tagline: { mobile: "0.875rem", desktop: "1.125rem" },      // "We're getting married"
    names: { mobile: "3.5rem", desktop: "5rem" },              // Couple names
    ampersand: { mobile: "1.75rem", desktop: "2.5rem" },       // "&" symbol
    date: { mobile: "1.25rem", desktop: "1.5rem" },            // Wedding date
  },

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

  // ---- ACCOMMODATIONS ----
  // Hotels near the venue for overseas guests
  accommodations: [
    {
      name: "Grand Mercure Setiabudi",
      address: "Jl. Dr. Setiabudi No.269 275, Isola, Kec. Sukasari, Kota Bandung, Jawa Barat 40154",
      distance: "2 km from venue",
      priceRange: "$$ - $$$",
      mapsLink: "https://maps.app.goo.gl/MDfHMshDJAeBHBwX6",
    },
    {
      name: "Best Western Setiabudi",
      address: "Jl. Dr. Setiabudi No.272, Ledeng, Kec. Cidadap, Kota Bandung, Jawa Barat 40143",
      distance: "3 km from venue",
      priceRange: "$$$",
      mapsLink: "https://maps.app.goo.gl/9gZKboFf6vjCeRGR6",
    },
    {
      name: "Hotel Name 3",
      address: "789 Inn Avenue, City",
      distance: "1.5 km from venue",
      priceRange: "$",
      mapsLink: "https://maps.google.com/?q=...",
    },
    {
      name: "Hotel Name 4",
      address: "321 Lodge Lane, City",
      distance: "4 km from venue",
      priceRange: "$$ - $$$",
      mapsLink: "https://maps.google.com/?q=...",
    },
  ],

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
