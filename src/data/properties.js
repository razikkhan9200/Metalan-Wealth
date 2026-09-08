/* data/properties.js: application source file. */
// Lucide-react icons
import {
  Landmark,
  Maximize2,
  CheckCircle2,
  Lock,
  Home,
  Waves,
  ShieldCheck,
} from "lucide-react";

// Images
// import canalSideHero from "../../public/images/canal-side-heritage-hero.png";
// import centralParkHero from "../../public/images/central-park-tower-suite-hero.png";
// import malibuHero from "../../public/images/malibu-coastal-sanctuary-hero.png";
// import marinaBayHero from "../../public/images/marina-bay-residences-hero.png";

// Images
import canalSideHero from "../../public/images/Dashboard-Property-images/canal-side-heritage-hero.png";
import centralParkHero from "../../public/images/Dashboard-Property-images/central-park-tower-suite-hero.png";
import malibuHero from "../../public/images/Dashboard-Property-images/malibu-coastal-sanctuary-hero.png";
import marinaBayHero from "../../public/images/Dashboard-Property-Images/marina-bay-residences-hero.png";

// isometric-visual
export const PROPERTIES = [
  {
    slug: "canal-side-heritage",
    city: "Amsterdam",
    type: "Historic Townhouse",
    name: "Canal Side Heritage",
    address: "Prinsengracht 442, Heritage District, Amsterdam",
    heroImage: canalSideHero,
    mapAccent: "#4f7cff",
    description:
      "A majestic masterpiece from Amsterdam's Golden Age, Canal Side Heritage blends timeless architectural history with high-performance modern preservation. This canal-front physical landmark is fully restored to pristine standards, offering highly stable capital yield and exceptionally low volatility. Tokenized fractional pools are fully audited and backed by sovereign deed registries.",
    features: [
      { icon: Landmark, label: "Heritage Listed" },
      { icon: Maximize2, label: "3,200 Sq Ft" },
      { icon: CheckCircle2, label: "Fully Restored" },
      { icon: Lock, label: "3-Year Lock-in" },
    ],
    metrics: {
      minInvestment: "F 300.00",
      assetValuation: "$8,400,000",
      totalTokenSupply: "18,000 FAIX",
      projectedRoi: "11.2% Expected",
    },
    investment: {
      tokenPrice: 300,
      estimatedYield: 7.8,
      faixSold: 1200,
      faixTotal: 6000,
    },
    syndicate: {
      custodian: "Metalan Trust Ltd.",
      registryId: "NL-RWA-01048",
      settlement: "Immediate T+0",
    },
  },
  {
    slug: "central-park-tower-suite",
    city: "New York",
    type: "Penthouse",
    name: "Central Park Tower Suite",
    address: "225 West 57th Street, Manhattan, New York, NY 10019",
    heroImage: centralParkHero,
    mapAccent: "#a78bfa",
    description:
      "Occupying an elite high-altitude plateau, the Central Park Tower Suite represents the zenith of Manhattan residential luxury. This trophy physical asset provides floor-to-ceiling panoramic vistas of the entire park, framed in exceptional museum-grade glass and structured concrete. The fractional pool guarantees institutional protection under Metalan Trust custody with immediate on-chain settlement.",
    features: [
      { icon: Home, label: "Ultra Luxury" },
      { icon: Maximize2, label: "5,800 Sq Ft" },
      { icon: ShieldCheck, label: "Concierge Service" },
      { icon: Lock, label: "5-Year Lock-in" },
    ],
    metrics: {
      minInvestment: "F 1,000.00",
      assetValuation: "$22,500,000",
      totalTokenSupply: "45,000 FAIX",
      projectedRoi: "12.8% Expected",
    },
    investment: {
      tokenPrice: 1000,
      estimatedYield: 9.1,
      faixSold: 3800,
      faixTotal: 4800,
    },
    syndicate: {
      custodian: "Metalan Trust Ltd.",
      registryId: "US-RWA-10019",
      settlement: "Immediate T+0",
    },
  },
  {
    slug: "malibu-coastal-sanctuary",
    city: "California",
    type: "Villa",
    name: "Malibu Coastal Sanctuary",
    address: "27318 Pacific Coast Highway, Malibu, CA 90265",
    heroImage: malibuHero,
    mapAccent: "#2dd4bf",
    description:
      "Tucked away on Malibu's most coveted private shoreline, the Coastal Sanctuary is a rare modern compound of organic concrete, glass, and teak. Enjoy direct personal sand access, world-class sustainability tech, and state-of-the-art automated home management. Perfect sovereign asset protection combined with exceptional holiday rental yield indexation.",
    features: [
      { icon: Waves, label: "Beachfront Estate" },
      { icon: Maximize2, label: "6,500 Sq Ft" },
      { icon: ShieldCheck, label: "Fully Managed" },
      { icon: Lock, label: "4-Year Lock-in" },
    ],
    metrics: {
      minInvestment: "F 1,200.00",
      assetValuation: "$18,750,000",
      totalTokenSupply: "32,000 FAIX",
      projectedRoi: "13.4% Expected",
    },
    investment: {
      tokenPrice: 1200,
      estimatedYield: 8.7,
      faixSold: 3600,
      faixTotal: 4000,
    },
    syndicate: {
      custodian: "Metalan Trust Ltd.",
      registryId: "US-RWA-90265",
      settlement: "Immediate T+0",
    },
  },
  {
    slug: "marina-bay-residences",
    city: "Singapore",
    type: "Residential Tower",
    name: "Marina Bay Residences",
    address: "18 Marina Boulevard, District 01, Singapore",
    heroImage: marinaBayHero,
    mapAccent: "#e8b46a",
    description:
      "Marina Bay Residences stands as a crown jewel in Singapore's most celebrated waterfront district. Offering peerless panoramic vistas of the marina skyline, this institutional-grade residential skyscraper represents the peak of sovereign physical assets. This offering represents fractioned ownership of a high-yield residential penthouse with historically resilient capital preservation and exceptional rental yield indexation.",
    features: [
      { icon: Home, label: "Luxury Penthouse" },
      { icon: Maximize2, label: "4,200 Sq Ft" },
      { icon: ShieldCheck, label: "Fully Managed" },
      { icon: Lock, label: "3-Year Lock-in" },
    ],
    metrics: {
      minInvestment: "F 500.00",
      assetValuation: "$14,250,000",
      totalTokenSupply: "28,500 FAIX",
      projectedRoi: "14.6% Expected",
    },
    investment: {
      tokenPrice: 500,
      estimatedYield: 8.2,
      faixSold: 2400,
      faixTotal: 4800,
    },
    syndicate: {
      custodian: "Metalan Trust Ltd.",
      registryId: "SG-RWA-04982",
      settlement: "Immediate T+0",
    },
  },
];

export const getPropertyBySlug = (slug) =>
  PROPERTIES.find((property) => property.slug === slug);