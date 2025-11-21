// Translation system for SolarMatch
export type Language = "en" | "so";

export interface Translations {
  // Common
  common: {
    continue: string;
    back: string;
    skip: string;
    loading: string;
    error: string;
    close: string;
  };
  // Welcome
  welcome: {
    title: string;
    tagline: string;
    startButton: string;
    learnMoreButton: string;
    features: {
      visualSelection: {
        title: string;
        description: string;
      };
      instantRecommendations: {
        title: string;
        description: string;
      };
      retailerMatching: {
        title: string;
        description: string;
      };
    };
  };
  // Steps
  steps: {
    welcome: string;
    chooseSpace: string;
    selectAppliances: string;
    usageSchedule: string;
    billLocation: string;
    solarPlan: string;
  };
  // Space types
  spaceTypes: {
    home: string;
    largeHome: string;
    shop: string;
    clinic: string;
  };
  // Appliance categories
  categories: {
    lighting: string;
    cooling: string;
    refrigeration: string;
    electronics: string;
    medical: string;
    pumps: string;
    other: string;
  };
  // Usage presets
  usagePresets: {
    light: string;
    normal: string;
    heavy: string;
  };
  // Usage schedule
  usageSchedule: {
    morning: string;
    evening: string;
    allDay: string;
    sometimes: string;
  };
  // Bill entry
  billEntry: {
    title: string;
    subtitle: string;
    uploadBill: string;
    enterManually: string;
    billAmount: string;
    billKwh: string;
    location: string;
    locationPlaceholder: string;
  };
  // Results
  results: {
    title: string;
    subtitle: string;
    downloadPdf: string;
    seeRetailers: string;
    generatingPdf: string;
    panelSize: string;
    battery: string;
    monthlySavings: string;
    co2Avoided: string;
    payback: string;
    autonomyDays: string;
    monthlyProduction: string;
    refinementNotes: string;
  };
  // Retailers
  retailers: {
    title: string;
    subtitle: string;
    products: string;
    approximatePrices: string;
    call: string;
    whatsapp: string;
    distance: string;
    languages: string;
    loading: string;
  };
}

const translations: Record<Language, Translations> = {
  en: {
    common: {
      continue: "Continue",
      back: "Back",
      skip: "Skip",
      loading: "Loading...",
      error: "Error",
      close: "Close",
    },
    welcome: {
      title: "Find the right solar system instantly",
      tagline: "Find the right solar system instantly",
      startButton: "Start",
      learnMoreButton: "Learn More",
      features: {
        visualSelection: {
          title: "Simple visual selection",
          description: "Choose appliances with pictures, no complex forms",
        },
        instantRecommendations: {
          title: "Instant recommendations",
          description: "Get your solar plan in seconds, not hours",
        },
        retailerMatching: {
          title: "Local retailer matching",
          description: "Connect with nearby installers instantly",
        },
      },
    },
    steps: {
      welcome: "Welcome",
      chooseSpace: "Choose Space Type",
      selectAppliances: "Select Appliances",
      usageSchedule: "When do you use",
      billLocation: "Bill & Location",
      solarPlan: "Your Solar Plan",
    },
    spaceTypes: {
      home: "Small Home",
      largeHome: "Large Home",
      shop: "Retail Shop",
      clinic: "Clinic / Pharmacy",
    },
    categories: {
      lighting: "Lighting",
      cooling: "Cooling",
      refrigeration: "Refrigeration",
      electronics: "Electronics",
      medical: "Medical",
      pumps: "Pumps",
      other: "Other",
    },
    usagePresets: {
      light: "Light",
      normal: "Normal",
      heavy: "Heavy",
    },
    usageSchedule: {
      morning: "Morning",
      evening: "Evening",
      allDay: "All Day",
      sometimes: "Sometimes",
    },
    billEntry: {
      title: "Enter Your Electricity Bill",
      subtitle: "This helps calculate your exact savings (Optional)",
      uploadBill: "Upload Bill",
      enterManually: "Enter Manually",
      billAmount: "Monthly Bill Amount (USD)",
      billKwh: "Monthly Usage (kWh)",
      location: "Location",
      locationPlaceholder: "City or area",
    },
    results: {
      title: "Your SolarMatch Plan",
      subtitle: "Review your solar sizing report",
      downloadPdf: "Download PDF",
      seeRetailers: "See Retailers",
      generatingPdf: "Generating PDF...",
      panelSize: "Panel size",
      battery: "Battery",
      monthlySavings: "Monthly savings",
      co2Avoided: "CO₂ avoided",
      payback: "Payback",
      autonomyDays: "autonomy days",
      monthlyProduction: "kWh/month",
      refinementNotes: "Smart refinement notes",
    },
    retailers: {
      title: "Solar Retailers Near You",
      subtitle: "Contact local installers for quotes and installation",
      products: "Products",
      approximatePrices: "Approximate Prices",
      call: "Call",
      whatsapp: "WhatsApp",
      distance: "km",
      languages: "Languages",
      loading: "Loading retailers...",
    },
  },
  so: {
    common: {
      continue: "Sii wad",
      back: "Dib u noqo",
      skip: "Ka bood",
      loading: "Waa la soo gelinayaa...",
      error: "Qalad",
      close: "Xidh",
    },
    welcome: {
      title: "Hel Solar ka saxda ah ee ku haboon gurigaaga ama goobtaada ganacsiga si dhaqsaha ah",
      tagline: "Hel Solar ka saxda ah ee ku haboon gurigaaga ama goobtaada ganacsiga si dhaqsaha ah",
      startButton: "Bilow",
      learnMoreButton: "Wax badan oo baro",
      features: {
        visualSelection: {
          title: "Doorasho fudud oo muuqaal ah",
          description: "Dooro qalabyada sawirada, maaha foomo adag",
        },
        instantRecommendations: {
          title: "Talooyin degdeg ah",
          description: "Hel qorshahaaga qorraxda ilbiriqsi gudahood, maaha saacado",
        },
        retailerMatching: {
          title: "Isku xidhka ganacsatada maxalliga ah",
          description: "Xidhiidh guryaha rakibidda ee dhow si degdeg ah",
        },
      },
    },
    steps: {
      welcome: "Salaan",
      chooseSpace: "Dooro Nooca Goobta",
      selectAppliances: "Dooro Qalabyada",
      usageSchedule: "Goormaad isticmaashaa",
      billLocation: "Bil & Goobta",
      solarPlan: "Qorshahaaga Qorraxda",
    },
    spaceTypes: {
      home: "Guri Yar",
      largeHome: "Guri Weyn",
      shop: "Dukaan",
      clinic: "Isbitaal / Farmashi",
    },
    categories: {
      lighting: "Iftiinka",
      cooling: "Qaboojinta",
      refrigeration: "Qaboojinta",
      electronics: "Elektroonigga",
      medical: "Caafimaad",
      pumps: "Bombaabka",
      other: "Kale",
    },
    usagePresets: {
      light: "Yar",
      normal: "Caadi",
      heavy: "Badan",
    },
    usageSchedule: {
      morning: "Subax",
      evening: "Fiid",
      allDay: "Maalinta Oo Dhan",
      sometimes: "Marmar",
    },
    billEntry: {
      title: "Geli Bilaashkaaga Korontada",
      subtitle: "Tani waxay ka caawisaa xisaabinta badbaadintaada (Ikhtiyaari)",
      uploadBill: "Soo geli Bil",
      enterManually: "Geli Si Gacanta",
      billAmount: "Qadarka Bilka Bishii (USD)",
      billKwh: "Isticmaalka Bishii (kWh)",
      location: "Goobta",
      locationPlaceholder: "Magaalo ama aag",
    },
    results: {
      title: "Qorshahaaga SolarMatch",
      subtitle: "Dib u eeg warbixintaada cabirka qorraxda",
      downloadPdf: "Soo deji PDF",
      seeRetailers: "Eeg Ganacsatada",
      generatingPdf: "Waa la sameeyayaa PDF...",
      panelSize: "Cabbirka Panelka",
      battery: "Batari",
      monthlySavings: "Badbaadinta bishii",
      co2Avoided: "CO₂ la iska dhaafay",
      payback: "Celinta lacagta",
      autonomyDays: "maalmaha madax bannaanida",
      monthlyProduction: "kWh/bil",
      refinementNotes: "Xusuusyada hagaajinta",
    },
    retailers: {
      title: "Ganacsatada Qorraxda Ee Agagaarkaaga",
      subtitle: "La xidhiidh guryaha rakibidda ee maxalliga ah si aad u hesho qiimaha iyo rakibidda",
      products: "Alaabta",
      approximatePrices: "Qiimaha U Dhigma",
      call: "Wac",
      whatsapp: "WhatsApp",
      distance: "km",
      languages: "Luqadaha",
      loading: "Waa la soo gelinayaa ganacsatada...",
    },
  },
};

// Language context
let currentLanguage: Language = "en";

export const setLanguage = (lang: Language) => {
  currentLanguage = lang;
  if (typeof window !== "undefined") {
    localStorage.setItem("solarmatch_language", lang);
  }
};

export const getLanguage = (): Language => {
  if (typeof window !== "undefined") {
    const stored = localStorage.getItem("solarmatch_language") as Language;
    if (stored && (stored === "en" || stored === "so")) {
      return stored;
    }
  }
  return currentLanguage;
};

export const t = (): Translations => {
  return translations[getLanguage()];
};

// Initialize language from localStorage
if (typeof window !== "undefined") {
  const stored = localStorage.getItem("solarmatch_language") as Language;
  if (stored && (stored === "en" || stored === "so")) {
    currentLanguage = stored;
  }
}

