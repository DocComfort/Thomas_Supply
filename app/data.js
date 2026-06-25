// ── Edit your business info here. Everything on the site reads from this file. ──

export const company = {
  name: "Thomas Supply Inc.",
  tagline: "Your local source for HVAC parts and equipment",
  // TODO: replace with your real branch hours
  hours: "Mon–Fri 7:00 AM – 5:00 PM  •  Sat by branch",
  facebook:
    "https://www.facebook.com/Thomas-Supply-of-Lake-Charles-1654488201543707/",
  award: "2023 ICP Multi-Branch KeepRite Distributor of the Year",
};

export const locations = [
  {
    name: "Thomas Supply of Lake Charles",
    phone: "337-433-4086",
    street: "625 15th Street",
    city: "Lake Charles, LA 70601",
  },
  {
    name: "Thomas Supply of Alexandria",
    phone: "318-487-9781",
    street: "3224 Industrial Street",
    city: "Alexandria, LA 71301",
  },
  {
    name: "Thomas Supply of Lafayette",
    phone: "337-235-4885",
    street: "210 North Luke Street",
    city: "Lafayette, LA 70506",
  },
  {
    name: "Thomas A/C Supply",
    phone: "409-835-4086",
    street: "350 North MLK Drive",
    city: "Beaumont, TX 77701",
  },
  {
    name: "Thomas Supply of Baton Rouge – Industriplex",
    phone: "225-444-5328",
    street: "11811 Dunlay Ave",
    city: "Baton Rouge, LA 70809",
  },
  {
    name: "Thomas Supply of Baton Rouge – Choctaw",
    phone: null,
    street: "9170 S. Choctaw",
    city: "Baton Rouge, LA 70815",
    comingSoon: true,
  },
];

// Featured brands shown on the home page
export const featuredBrands = [
  "Keeprite",
  "LG",
  "Russell",
  "Manitowoc",
  "Glasfloss",
  "Diversitech",
  "FAST Parts",
];

// OEM Fast Parts lines
export const fastPartsBrands = [
  "Arcoaire",
  "Comfortmaker",
  "Grand Air",
  "Heil",
  "Keeprite",
  "Maratherm",
  "Tempstar",
];

// Full A–Z brand directory
export const brandDirectory = {
  A: ["Ace", "Airmate", "Amerikooler", "Arkema", "Armacell", "Atco"],
  B: ["Big Blue", "Boss Products"],
  C: [
    "Cambridge Lee",
    "Century Motors",
    "Certainteed",
    "Chemical Acme",
    "Comfort-Aire",
    "Copeland",
    "CPS",
    "Cuno",
  ],
  D: ["Danfoss", "Devco", "Diversitech", "Duro Dyne"],
  E: ["Embraco", "Emerson White Rodgers", "ESP Products", "EWC Controls"],
  F: ["Fantech", "Fasco", "Fieldpiece"],
  G: ["Glasfloss", "Grasslin", "Gray Metal South"],
  H: ["Hardcast", "Harris", "Hart & Cooley", "Hilmor", "Hoshizaki"],
  I: ["Inficon"],
  K: ["Keeprite", "K-Flex", "Klein"],
  L: ["Lenox", "LG", "Little Giant", "Lomanco"],
  M: [
    "M&M",
    "Mainstream",
    "Malco",
    "Manitowoc",
    "Mars",
    "McDaniel Metal",
    "Miami Air Products",
    "Mitchell Metal",
    "Mueller",
  ],
  P: ["Packard", "Paragon", "Parker", "Penn Controls", "Pro 1"],
  R: ["Ranco", "Rectorseal", "Ritchie Yellow Jacket", "Robertshaw", "Russell"],
  S: ["Solar & Palau", "Spectroline", "Sterling Heaters", "Supco"],
  T: ["Turbo Air", "Turbo Torch"],
  U: ["UEI", "United Salt"],
  V: ["Vulkem"],
  W: ["Watt"],
};

// ── Brand & partner logos ──
// Filenames live in /public/photos. Run scripts/download-logos.ps1 (Windows)
// or scripts/download-logos.sh to populate them. Until then, names show as text.
export const brandLogos = [
  { name: "Keeprite", file: "keeprite.png" },
  { name: "LG", file: "lg.png" },
  { name: "Russell", file: "russell.png" },
  { name: "Manitowoc", file: "manitowoc.png" },
  { name: "Glasfloss", file: "glasfloss.jpg" },
  { name: "Diversitech", file: "diversitech.png" },
  { name: "FAST Parts", file: "fast.jpg" },
];

export const partnerLogos = [
  { name: "ICP", file: "icp.png" },
  { name: "KeepRite", file: "keeprite-equipment.jpg" },
  { name: "Proud member of Blue Hawk", file: "bluehawk.png" },
];
