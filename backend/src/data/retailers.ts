import { Retailer } from "../types/solar";

export const RETAILERS: Retailer[] = [
  {
    id: "puntland_solar_house",
    name: "Puntland Solar House",
    contact: "info@puntlandsolarhouse.com",
    phone: "+252 90 123 4567",
    location: "Bosaso Downtown",
    distanceKm: 2.4,
    rating: 4.7,
    products: ["400W Poly Panels", "Lithium Batteries", "Hybrid Inverters"],
    productDetails: [
      {
        name: "400W Poly Panels",
        imageUrl: "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=400&h=300&fit=crop",
        description: "High-efficiency polycrystalline solar panels",
      },
      {
        name: "Lithium Batteries",
        imageUrl: "https://images.unsplash.com/photo-1609599006353-e629aaabfeae?w=400&h=300&fit=crop",
        description: "Long-lasting lithium-ion battery banks",
      },
      {
        name: "Hybrid Inverters",
        imageUrl: "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=400&h=300&fit=crop",
        description: "Smart hybrid inverters with grid-tie capability",
      },
    ],
    approximatePricesUsd: {
      panelWatt: 1.1,
      batteryAh: 1.3,
    },
    languages: ["Somali", "English"],
  },
  {
    id: "galkayo_green_energy",
    name: "Galkayo Green Energy",
    contact: "sales@gleanergy.so",
    phone: "+252 61 987 3322",
    location: "Galkayo South Market",
    distanceKm: 6.8,
    rating: 4.5,
    products: ["Panels", "Batteries", "Pump Kits"],
    productDetails: [
      {
        name: "Solar Panels",
        imageUrl: "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=400&h=300&fit=crop",
        description: "Reliable solar panels for home and business",
      },
      {
        name: "Batteries",
        imageUrl: "https://images.unsplash.com/photo-1609599006353-e629aaabfeae?w=400&h=300&fit=crop",
        description: "Deep cycle batteries for solar storage",
      },
      {
        name: "Pump Kits",
        imageUrl: "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=400&h=300&fit=crop",
        description: "Complete solar water pump systems",
      },
    ],
    approximatePricesUsd: {
      panelWatt: 0.95,
      batteryAh: 1.05,
      package: 1200,
    },
    languages: ["Somali", "Arabic"],
  },
  {
    id: "garowe_sunrise_energy",
    name: "Garowe Sunrise Energy",
    contact: "hello@sunriseenergy.africa",
    phone: "+252 91 556 7788",
    location: "Garowe Kilinka",
    distanceKm: 1.2,
    rating: 4.8,
    products: ["Premium Panels", "Lithium Banks", "Monitoring"],
    productDetails: [
      {
        name: "Premium Panels",
        imageUrl: "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=400&h=300&fit=crop",
        description: "Top-tier monocrystalline solar panels",
      },
      {
        name: "Lithium Banks",
        imageUrl: "https://images.unsplash.com/photo-1609599006353-e629aaabfeae?w=400&h=300&fit=crop",
        description: "Premium lithium battery systems",
      },
      {
        name: "Monitoring Systems",
        imageUrl: "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=400&h=300&fit=crop",
        description: "Smart monitoring and control systems",
      },
    ],
    approximatePricesUsd: {
      panelWatt: 1.25,
      batteryAh: 1.5,
      package: 1600,
    },
    languages: ["Somali", "English"],
  },
  {
    id: "som_power_traders",
    name: "Som Power Traders",
    contact: "support@sompowertraders.so",
    phone: "+252 63 221 0099",
    location: "Qardho Industrial Road",
    distanceKm: 12.5,
    rating: 4.2,
    products: ["Budget Panels", "Lead Acid Batteries"],
    productDetails: [
      {
        name: "Budget Panels",
        imageUrl: "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=400&h=300&fit=crop",
        description: "Affordable polycrystalline panels",
      },
      {
        name: "Lead Acid Batteries",
        imageUrl: "https://images.unsplash.com/photo-1609599006353-e629aaabfeae?w=400&h=300&fit=crop",
        description: "Cost-effective lead acid battery solutions",
      },
    ],
    approximatePricesUsd: {
      panelWatt: 0.82,
      batteryAh: 0.95,
    },
    languages: ["Somali"],
  },
];

