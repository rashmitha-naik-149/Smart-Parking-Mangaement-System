// 55+ Realistic Smart Parking Facilities with distinct coordinates, spot types, and real photos

const carImages = [
  "https://images.unsplash.com/photo-1506521781263-d8422e82f27a?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1590674899484-d5640e854abe?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1573348722427-f1d6819fdf98?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1545179605-1296651e4d43?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1508974239320-0a029497e820?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1526628953301-3e589a6a8b74?auto=format&fit=crop&w=800&q=80"
];

const bikeImages = [
  "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=800&q=80", // Sporty motorcycle
  "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=800&q=80", // Modern bike deck
  "https://images.unsplash.com/photo-1558981285-6f0c94958bb6?auto=format&fit=crop&w=800&q=80", // Sportbike bay
  "https://images.unsplash.com/photo-1558981359-219d6364c9c8?auto=format&fit=crop&w=800&q=80", // Motorbike row
  "https://images.unsplash.com/photo-1558980664-3a031cf67ea8?auto=format&fit=crop&w=800&q=80"  // Rider depot
];

const evImages = [
  "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=800&q=80", // EV charging station
  "https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=800&q=80", // EV charger plugged
  "https://images.unsplash.com/photo-1593941707882-a5bba14938c7?auto=format&fit=crop&w=800&q=80"  // Supercharger bay
];

// Helper to generate realistic slot layout
const generateSlots = (count, hasBikes = true, hasEv = true) => {
  return Array.from({ length: count }, (_, i) => {
    const row = i < 15 ? 'A' : i < 30 ? 'B' : i < 45 ? 'C' : 'D';
    const num = (i % 15) + 1;
    const id = `${row}${num}`;
    let status = 'available';
    if ([2, 5, 9, 14, 18, 24, 29, 35].includes(i)) status = 'occupied';
    else if ([3, 11, 21, 31].includes(i)) status = 'reserved';
    else if (i === 12) status = 'maintenance';

    const isBikeSlot = hasBikes && (i % 3 === 0);
    const hasEVBay = hasEv && (i % 5 === 0);

    return {
      id,
      name: `Slot ${id}`,
      level: row === 'A' ? 'Level 1' : row === 'B' ? 'Level 2' : 'Basement',
      status,
      type: isBikeSlot ? 'Bike' : 'Car',
      hasEV: hasEVBay
    };
  });
};

const rawLocations = [
  // --- BENGALURU LOCATIONS (1 - 25) ---
  {
    name: "MG One Plaza Smart Parking",
    area: "MG Road",
    address: "88 Mahatma Gandhi Road, Near Metro Station, Central Bengaluru",
    city: "Bengaluru",
    lat: 12.9756,
    lng: 77.6066,
    price: 30,
    total: 50,
    rating: 4.8,
    reviews: 142,
    type: "Both",
    amenities: ["CCTV", "Security", "Covered Parking", "EV Charging", "Accessible Parking", "24/7"],
    imageType: "car"
  },
  {
    name: "100ft Metro Hub Multi-Level Parking",
    area: "Indiranagar",
    address: "124 100 Feet Road, HAL 2nd Stage, Indiranagar",
    city: "Bengaluru",
    lat: 12.9784,
    lng: 77.6408,
    price: 40,
    total: 80,
    rating: 4.6,
    reviews: 98,
    type: "Both",
    amenities: ["CCTV", "Security", "Covered Parking", "Accessible Parking", "24/7"],
    imageType: "car"
  },
  {
    name: "Nexus Koramangala Eco Parking",
    area: "Koramangala",
    address: "Hosur Main Road, 7th Block, Koramangala",
    city: "Bengaluru",
    lat: 12.9352,
    lng: 77.6245,
    price: 35,
    total: 120,
    rating: 4.7,
    reviews: 215,
    type: "Both",
    amenities: ["CCTV", "Security", "Covered Parking", "EV Charging", "Accessible Parking", "24/7"],
    imageType: "car"
  },
  {
    name: "Two-Wheeler Riders Depot",
    area: "Indiranagar",
    address: "12th Main Road, HAL 2nd Stage, Indiranagar",
    city: "Bengaluru",
    lat: 12.9712,
    lng: 77.6415,
    price: 15,
    total: 65,
    rating: 4.9,
    reviews: 180,
    type: "Bike",
    amenities: ["CCTV", "Security", "Covered Parking", "24/7"],
    imageType: "bike"
  },
  {
    name: "Brigade Central Automated Smart Bays",
    area: "Brigade Road",
    address: "Brigade Road junction, Shanthala Nagar, Ashok Nagar",
    city: "Bengaluru",
    lat: 12.9719,
    lng: 77.6070,
    price: 50,
    total: 45,
    rating: 4.9,
    reviews: 180,
    type: "Car",
    amenities: ["CCTV", "Security", "Covered Parking", "Accessible Parking", "24/7"],
    imageType: "car"
  },
  {
    name: "ITPL Cyber Park Deck",
    area: "Whitefield",
    address: "International Tech Park, Pattandur Agrahara, Whitefield",
    city: "Bengaluru",
    lat: 12.9856,
    lng: 77.7289,
    price: 20,
    total: 150,
    rating: 4.5,
    reviews: 89,
    type: "Both",
    amenities: ["CCTV", "Security", "Covered Parking", "EV Charging", "24/7"],
    imageType: "ev"
  },
  {
    name: "Sportbike & Scooter SafeBay",
    area: "Koramangala",
    address: "5th Block, Jyoti Nivas College Road, Koramangala",
    city: "Bengaluru",
    lat: 12.9340,
    lng: 77.6190,
    price: 15,
    total: 80,
    rating: 4.8,
    reviews: 110,
    type: "Bike",
    amenities: ["CCTV", "Security", "Covered Parking"],
    imageType: "bike"
  },
  {
    name: "InfoCity Smart Garage",
    area: "Electronic City",
    address: "Phase 1, Hosur Road, Near Wipro Gate 5, Electronic City",
    city: "Bengaluru",
    lat: 12.8399,
    lng: 77.6770,
    price: 20,
    total: 90,
    rating: 4.4,
    reviews: 64,
    type: "Both",
    amenities: ["CCTV", "Security", "Covered Parking", "EV Charging", "Accessible Parking"],
    imageType: "car"
  },
  {
    name: "4th Block Civic Smart Parking",
    area: "Jayanagar",
    address: "11th Main Road, Near Jayanagar Shopping Complex, 4th Block",
    city: "Bengaluru",
    lat: 12.9298,
    lng: 77.5833,
    price: 25,
    total: 60,
    rating: 4.6,
    reviews: 112,
    type: "Both",
    amenities: ["CCTV", "Security", "Accessible Parking", "Covered Parking"],
    imageType: "car"
  },
  {
    name: "Yeshwanthpur Metro Multilevel Parking",
    area: "Yeshwanthpur",
    address: "Tumkur Road, Opp. Yeshwanthpur Railway Station, Subedarpalya",
    city: "Bengaluru",
    lat: 13.0238,
    lng: 77.5503,
    price: 25,
    total: 110,
    rating: 4.5,
    reviews: 76,
    type: "Both",
    amenities: ["CCTV", "Security", "Covered Parking", "24/7", "Accessible Parking"],
    imageType: "car"
  },
  {
    name: "Sector 1 Park & Fly Hub",
    area: "HSR Layout",
    address: "14th Main Road, Sector 1, Near Agara Lake, HSR Layout",
    city: "Bengaluru",
    lat: 12.9121,
    lng: 77.6446,
    price: 30,
    total: 70,
    rating: 4.7,
    reviews: 133,
    type: "Both",
    amenities: ["CCTV", "Security", "Covered Parking", "EV Charging", "24/7"],
    imageType: "ev"
  },
  {
    name: "Church Street Automated Garage",
    area: "Church Street",
    address: "Church Street, Off MG Road, Shantala Nagar",
    city: "Bengaluru",
    lat: 12.9748,
    lng: 77.6015,
    price: 60,
    total: 40,
    rating: 4.9,
    reviews: 167,
    type: "Car",
    amenities: ["CCTV", "Security", "Covered Parking", "Accessible Parking", "24/7"],
    imageType: "car"
  },
  {
    name: "Malleshwaram 8th Cross Civic Bay",
    area: "Malleshwaram",
    address: "8th Cross Road, Near Margosa Road, Malleshwaram",
    city: "Bengaluru",
    lat: 13.0035,
    lng: 77.5710,
    price: 25,
    total: 55,
    rating: 4.6,
    reviews: 82,
    type: "Both",
    amenities: ["CCTV", "Security", "Accessible Parking"],
    imageType: "car"
  },
  {
    name: "Superbike SafeHub MG Road",
    area: "MG Road",
    address: "Rest House Road, Off Brigade Road, Central Bengaluru",
    city: "Bengaluru",
    lat: 12.9735,
    lng: 77.6080,
    price: 20,
    total: 75,
    rating: 4.9,
    reviews: 145,
    type: "Bike",
    amenities: ["CCTV", "Security", "Covered Parking", "24/7"],
    imageType: "bike"
  },
  {
    name: "Frazer Town Coles Park Deck",
    area: "Frazer Town",
    address: "Promenade Road, Near Coles Park, Pulikeshi Nagar",
    city: "Bengaluru",
    lat: 12.9982,
    lng: 77.6124,
    price: 25,
    total: 48,
    rating: 4.5,
    reviews: 63,
    type: "Both",
    amenities: ["CCTV", "Security", "Covered Parking"],
    imageType: "car"
  },
  {
    name: "Bellandur Ecospace EV HyperPark",
    area: "Bellandur",
    address: "Outer Ring Road, Adarsh Palm Retreat, Bellandur",
    city: "Bengaluru",
    lat: 12.9260,
    lng: 77.6830,
    price: 35,
    total: 130,
    rating: 4.7,
    reviews: 194,
    type: "Both",
    amenities: ["CCTV", "Security", "EV Charging", "Covered Parking", "24/7"],
    imageType: "ev"
  },
  {
    name: "Marathahalli Bridge Multilevel",
    area: "Marathahalli",
    address: "Varthur Main Road, Opp KLM Mall, Marathahalli",
    city: "Bengaluru",
    lat: 12.9562,
    lng: 77.7011,
    price: 20,
    total: 85,
    rating: 4.3,
    reviews: 91,
    type: "Both",
    amenities: ["CCTV", "Security", "Covered Parking"],
    imageType: "car"
  },
  {
    name: "Sarjapur Wipro Gate Deck",
    area: "Sarjapur Road",
    address: "Doddakannelli, Sarjapur Main Road, Bengaluru",
    city: "Bengaluru",
    lat: 12.9090,
    lng: 77.6850,
    price: 25,
    total: 90,
    rating: 4.6,
    reviews: 104,
    type: "Both",
    amenities: ["CCTV", "Security", "Covered Parking", "EV Charging"],
    imageType: "car"
  },
  {
    name: "Hebbal Flyover Transit Bay",
    area: "Hebbal",
    address: "Bellary Road, Near Esteem Mall, Hebbal",
    city: "Bengaluru",
    lat: 13.0358,
    lng: 77.5970,
    price: 30,
    total: 100,
    rating: 4.5,
    reviews: 88,
    type: "Both",
    amenities: ["CCTV", "Security", "24/7", "Covered Parking"],
    imageType: "car"
  },
  {
    name: "Rajajinagar Orion SkyPark",
    area: "Rajajinagar",
    address: "Dr Rajkumar Road, Rajajinagar Industrial Area",
    city: "Bengaluru",
    lat: 13.0110,
    lng: 77.5550,
    price: 40,
    total: 160,
    rating: 4.8,
    reviews: 230,
    type: "Both",
    amenities: ["CCTV", "Security", "Covered Parking", "EV Charging", "Accessible Parking", "24/7"],
    imageType: "car"
  },
  {
    name: "Banashankari BDA Complex Lot",
    area: "Banashankari",
    address: "24th Cross Road, 2nd Stage, Banashankari",
    city: "Bengaluru",
    lat: 12.9255,
    lng: 77.5660,
    price: 20,
    total: 70,
    rating: 4.4,
    reviews: 67,
    type: "Both",
    amenities: ["CCTV", "Security"],
    imageType: "car"
  },
  {
    name: "BTM 2nd Stage Lakeview Park",
    area: "BTM Layout",
    address: "7th Main Road, Near Madiwala Lake, BTM 2nd Stage",
    city: "Bengaluru",
    lat: 12.9150,
    lng: 77.6101,
    price: 20,
    total: 60,
    rating: 4.5,
    reviews: 83,
    type: "Both",
    amenities: ["CCTV", "Security", "Covered Parking"],
    imageType: "car"
  },
  {
    name: "Majestic City Railway Transit Deck",
    area: "Majestic",
    address: "Gubbi Thotadappa Road, Near KSR Railway Station",
    city: "Bengaluru",
    lat: 12.9780,
    lng: 77.5700,
    price: 30,
    total: 200,
    rating: 4.5,
    reviews: 310,
    type: "Both",
    amenities: ["CCTV", "Security", "24/7", "Accessible Parking"],
    imageType: "car"
  },
  {
    name: "JP Nagar 6th Phase Metro Bays",
    area: "JP Nagar",
    address: "Kanaka Nagar, 6th Phase, JP Nagar",
    city: "Bengaluru",
    lat: 12.9063,
    lng: 77.5855,
    price: 25,
    total: 75,
    rating: 4.6,
    reviews: 95,
    type: "Both",
    amenities: ["CCTV", "Security", "Covered Parking", "EV Charging"],
    imageType: "car"
  },
  {
    name: "Lavelle Road Executive Stacking",
    area: "Lavelle Road",
    address: "Lavelle Road, Near UB City, Ashok Nagar",
    city: "Bengaluru",
    lat: 12.9710,
    lng: 77.5960,
    price: 70,
    total: 45,
    rating: 4.9,
    reviews: 140,
    type: "Car",
    amenities: ["CCTV", "Security", "Covered Parking", "Accessible Parking", "24/7"],
    imageType: "car"
  },

  // --- MUMBAI LOCATIONS (26 - 36) ---
  {
    name: "BKC One Financial Tower Parking",
    area: "Bandra-Kurla Complex",
    address: "G Block, BKC, Bandra East, Mumbai",
    city: "Mumbai",
    lat: 19.0657,
    lng: 72.8687,
    price: 60,
    total: 180,
    rating: 4.8,
    reviews: 245,
    type: "Both",
    amenities: ["CCTV", "Security", "Covered Parking", "EV Charging", "24/7"],
    imageType: "car"
  },
  {
    name: "BKC Motorbike Express Bay",
    area: "Bandra-Kurla Complex",
    address: "Near Trade Centre, BKC, Mumbai",
    city: "Mumbai",
    lat: 19.0640,
    lng: 72.8650,
    price: 20,
    total: 90,
    rating: 4.7,
    reviews: 130,
    type: "Bike",
    amenities: ["CCTV", "Security", "Covered Parking"],
    imageType: "bike"
  },
  {
    name: "Nariman Point Seaside Garage",
    area: "Nariman Point",
    address: "Marine Drive Promenade, Nariman Point, South Mumbai",
    city: "Mumbai",
    lat: 18.9256,
    lng: 72.8242,
    price: 80,
    total: 90,
    rating: 4.9,
    reviews: 289,
    type: "Car",
    amenities: ["CCTV", "Security", "Covered Parking", "Accessible Parking", "24/7"],
    imageType: "car"
  },
  {
    name: "Lower Parel Palladium Deck",
    area: "Lower Parel",
    address: "High Street Phoenix, Senapati Bapat Marg, Lower Parel",
    city: "Mumbai",
    lat: 18.9950,
    lng: 72.8270,
    price: 50,
    total: 210,
    rating: 4.7,
    reviews: 320,
    type: "Both",
    amenities: ["CCTV", "Security", "Covered Parking", "EV Charging", "24/7"],
    imageType: "ev"
  },
  {
    name: "Andheri East Metro Line 1 Lot",
    area: "Andheri East",
    address: "Western Express Highway, Andheri East, Mumbai",
    city: "Mumbai",
    lat: 19.1197,
    lng: 72.8464,
    price: 35,
    total: 110,
    rating: 4.4,
    reviews: 115,
    type: "Both",
    amenities: ["CCTV", "Security", "Covered Parking"],
    imageType: "car"
  },
  {
    name: "Powai Hiranandani Tech Bay",
    area: "Powai",
    address: "Central Avenue, Hiranandani Gardens, Powai",
    city: "Mumbai",
    lat: 19.1170,
    lng: 72.9060,
    price: 40,
    total: 95,
    rating: 4.8,
    reviews: 160,
    type: "Both",
    amenities: ["CCTV", "Security", "Covered Parking", "EV Charging", "24/7"],
    imageType: "car"
  },
  {
    name: "Colaba Causeway Heritage Bays",
    area: "Colaba",
    address: "Shahid Bhagat Singh Road, Colaba, Mumbai",
    city: "Mumbai",
    lat: 18.9150,
    lng: 72.8290,
    price: 60,
    total: 50,
    rating: 4.6,
    reviews: 140,
    type: "Car",
    amenities: ["CCTV", "Security", "Accessible Parking"],
    imageType: "car"
  },
  {
    name: "Dadar TT Circle Multilevel",
    area: "Dadar",
    address: "Dr Babasaheb Ambedkar Road, Dadar East",
    city: "Mumbai",
    lat: 19.0190,
    lng: 72.8430,
    price: 40,
    total: 80,
    rating: 4.3,
    reviews: 88,
    type: "Both",
    amenities: ["CCTV", "Security", "Covered Parking"],
    imageType: "car"
  },
  {
    name: "Thane Viviana SuperDeck",
    area: "Thane",
    address: "Eastern Express Highway, Near Jupiter Hospital, Thane West",
    city: "Mumbai",
    lat: 19.2080,
    lng: 72.9720,
    price: 30,
    total: 150,
    rating: 4.7,
    reviews: 195,
    type: "Both",
    amenities: ["CCTV", "Security", "Covered Parking", "EV Charging"],
    imageType: "car"
  },
  {
    name: "Bandra Carter Road Promenade Park",
    area: "Bandra West",
    address: "Carter Road, Bandra West, Mumbai",
    city: "Mumbai",
    lat: 19.0645,
    lng: 72.8250,
    price: 50,
    total: 60,
    rating: 4.8,
    reviews: 175,
    type: "Both",
    amenities: ["CCTV", "Security", "24/7"],
    imageType: "car"
  },
  {
    name: "Borivali Link Road Express Bay",
    area: "Borivali West",
    address: "New Link Road, Eksar, Borivali West",
    city: "Mumbai",
    lat: 19.2300,
    lng: 72.8450,
    price: 30,
    total: 85,
    rating: 4.5,
    reviews: 92,
    type: "Both",
    amenities: ["CCTV", "Security", "Covered Parking"],
    imageType: "car"
  },

  // --- DELHI NCR LOCATIONS (37 - 45) ---
  {
    name: "Connaught Place Inner Circle Garage",
    area: "Connaught Place",
    address: "Block A, Radial Road 1, CP, New Delhi",
    city: "Delhi",
    lat: 28.6315,
    lng: 77.2167,
    price: 50,
    total: 140,
    rating: 4.8,
    reviews: 310,
    type: "Both",
    amenities: ["CCTV", "Security", "Covered Parking", "EV Charging", "Accessible Parking", "24/7"],
    imageType: "car"
  },
  {
    name: "CP Two-Wheeler Underground Stash",
    area: "Connaught Place",
    address: "Palika Bazaar Gate 4, Connaught Place, New Delhi",
    city: "Delhi",
    lat: 28.6300,
    lng: 77.2180,
    price: 20,
    total: 100,
    rating: 4.7,
    reviews: 190,
    type: "Bike",
    amenities: ["CCTV", "Security", "Covered Parking"],
    imageType: "bike"
  },
  {
    name: "Cyber City Gurugram Rapid Park",
    area: "Cyber City",
    address: "DLF Cyber City, Sector 24, Gurugram, NCR",
    city: "Delhi",
    lat: 28.4950,
    lng: 77.0890,
    price: 40,
    total: 180,
    rating: 4.9,
    reviews: 260,
    type: "Both",
    amenities: ["CCTV", "Security", "Covered Parking", "EV Charging", "24/7"],
    imageType: "ev"
  },
  {
    name: "Sector 18 Noida Mall Deck",
    area: "Sector 18",
    address: "Atta Market, Sector 18, Noida, Uttar Pradesh",
    city: "Delhi",
    lat: 28.5700,
    lng: 77.3200,
    price: 30,
    total: 130,
    rating: 4.6,
    reviews: 175,
    type: "Both",
    amenities: ["CCTV", "Security", "Covered Parking"],
    imageType: "car"
  },
  {
    name: "Aerocity Smart Transit Terminal",
    area: "Aerocity",
    address: "Hospitality District, IGI Airport, New Delhi",
    city: "Delhi",
    lat: 28.5520,
    lng: 77.1210,
    price: 70,
    total: 160,
    rating: 4.9,
    reviews: 280,
    type: "Car",
    amenities: ["CCTV", "Security", "Covered Parking", "EV Charging", "24/7", "Accessible Parking"],
    imageType: "car"
  },
  {
    name: "Nehru Place IT Hub Parking",
    area: "Nehru Place",
    address: "Eros Corporate Tower, Nehru Place, New Delhi",
    city: "Delhi",
    lat: 28.5490,
    lng: 77.2510,
    price: 35,
    total: 90,
    rating: 4.4,
    reviews: 135,
    type: "Both",
    amenities: ["CCTV", "Security", "Covered Parking"],
    imageType: "car"
  },
  {
    name: "Hauz Khas Village Shaded Deck",
    area: "Hauz Khas",
    address: "Deer Park Entry, Hauz Khas Village, New Delhi",
    city: "Delhi",
    lat: 28.5540,
    lng: 77.1940,
    price: 45,
    total: 60,
    rating: 4.7,
    reviews: 152,
    type: "Both",
    amenities: ["CCTV", "Security"],
    imageType: "car"
  },
  {
    name: "Saket Select Citywalk Stacking",
    area: "Saket",
    address: "Press Enclave Marg, Saket District Centre, New Delhi",
    city: "Delhi",
    lat: 28.5280,
    lng: 77.2190,
    price: 50,
    total: 220,
    rating: 4.8,
    reviews: 340,
    type: "Both",
    amenities: ["CCTV", "Security", "Covered Parking", "EV Charging", "24/7"],
    imageType: "car"
  },
  {
    name: "Karol Bagh Market Multilevel",
    area: "Karol Bagh",
    address: "Ajmal Khan Road, Karol Bagh, New Delhi",
    city: "Delhi",
    lat: 28.6510,
    lng: 77.1900,
    price: 30,
    total: 80,
    rating: 4.3,
    reviews: 98,
    type: "Both",
    amenities: ["CCTV", "Security", "Covered Parking"],
    imageType: "car"
  },

  // --- HYDERABAD LOCATIONS (46 - 51) ---
  {
    name: "HITEC City Cyber Towers Stacking",
    area: "HITEC City",
    address: "Cyber Towers Junction, Madhapur, Hyderabad",
    city: "Hyderabad",
    lat: 17.4504,
    lng: 78.3808,
    price: 35,
    total: 150,
    rating: 4.8,
    reviews: 210,
    type: "Both",
    amenities: ["CCTV", "Security", "Covered Parking", "EV Charging", "24/7"],
    imageType: "car"
  },
  {
    name: "Cyber Pearl Biker Haven",
    area: "HITEC City",
    address: "Hitec City Main Road, Hyderabad",
    city: "Hyderabad",
    lat: 17.4480,
    lng: 78.3790,
    price: 15,
    total: 70,
    rating: 4.9,
    reviews: 140,
    type: "Bike",
    amenities: ["CCTV", "Security", "Covered Parking"],
    imageType: "bike"
  },
  {
    name: "Gachibowli Financial Hub Garage",
    area: "Gachibowli",
    address: "ISB Road, Nanakramguda, Financial District, Hyderabad",
    city: "Hyderabad",
    lat: 17.4400,
    lng: 78.3489,
    price: 30,
    total: 120,
    rating: 4.7,
    reviews: 185,
    type: "Both",
    amenities: ["CCTV", "Security", "Covered Parking", "EV Charging", "24/7"],
    imageType: "ev"
  },
  {
    name: "Jubilee Hills Checkpost Deck",
    area: "Jubilee Hills",
    address: "Road No 36, Jubilee Hills Checkpost, Hyderabad",
    city: "Hyderabad",
    lat: 17.4310,
    lng: 78.4070,
    price: 45,
    total: 75,
    rating: 4.8,
    reviews: 165,
    type: "Car",
    amenities: ["CCTV", "Security", "Covered Parking", "Accessible Parking"],
    imageType: "car"
  },
  {
    name: "Banjara Hills Road No 12 Smart Bay",
    area: "Banjara Hills",
    address: "Road No 12, Near MLA Colony, Banjara Hills",
    city: "Hyderabad",
    lat: 17.4150,
    lng: 78.4350,
    price: 40,
    total: 80,
    rating: 4.7,
    reviews: 142,
    type: "Both",
    amenities: ["CCTV", "Security", "Covered Parking", "24/7"],
    imageType: "car"
  },
  {
    name: "Begumpet Airport Road Deck",
    area: "Begumpet",
    address: "Sardar Patel Road, Opp Shoppers Stop, Begumpet",
    city: "Hyderabad",
    lat: 17.4440,
    lng: 78.4680,
    price: 30,
    total: 65,
    rating: 4.5,
    reviews: 79,
    type: "Both",
    amenities: ["CCTV", "Security", "Covered Parking"],
    imageType: "car"
  },

  // --- CHENNAI LOCATIONS (52 - 57) ---
  {
    name: "T Nagar Pondy Bazaar Automated Bay",
    area: "T Nagar",
    address: "Pondy Bazaar Pedestrian Plaza, T Nagar, Chennai",
    city: "Chennai",
    lat: 13.0418,
    lng: 80.2341,
    price: 35,
    total: 100,
    rating: 4.7,
    reviews: 198,
    type: "Both",
    amenities: ["CCTV", "Security", "Covered Parking", "24/7", "Accessible Parking"],
    imageType: "car"
  },
  {
    name: "T Nagar Motorbike Express Hub",
    area: "T Nagar",
    address: "Usman Road, Near Panagal Park, T Nagar, Chennai",
    city: "Chennai",
    lat: 13.0400,
    lng: 78.2320,
    price: 15,
    total: 85,
    rating: 4.8,
    reviews: 160,
    type: "Bike",
    amenities: ["CCTV", "Security", "Covered Parking"],
    imageType: "bike"
  },
  {
    name: "OMR IT Expressway Cyber Park",
    area: "OMR IT Corridor",
    address: "Rajiv Gandhi Salai, Sholinganallur, Chennai",
    city: "Chennai",
    lat: 12.9010,
    lng: 80.2279,
    price: 25,
    total: 140,
    rating: 4.6,
    reviews: 170,
    type: "Both",
    amenities: ["CCTV", "Security", "Covered Parking", "EV Charging", "24/7"],
    imageType: "ev"
  },
  {
    name: "Anna Nagar Roundtana Multilevel",
    area: "Anna Nagar",
    address: "2nd Avenue, Near Roundtana, Anna Nagar East",
    city: "Chennai",
    lat: 13.0850,
    lng: 80.2100,
    price: 30,
    total: 90,
    rating: 4.6,
    reviews: 125,
    type: "Both",
    amenities: ["CCTV", "Security", "Covered Parking"],
    imageType: "car"
  },
  {
    name: "Nungambakkam High Road Garage",
    area: "Nungambakkam",
    address: "Uthamar Gandhi Salai, Nungambakkam, Chennai",
    city: "Chennai",
    lat: 13.0600,
    lng: 80.2400,
    price: 40,
    total: 70,
    rating: 4.7,
    reviews: 110,
    type: "Both",
    amenities: ["CCTV", "Security", "Covered Parking", "24/7"],
    imageType: "car"
  },
  {
    name: "Guindy Kathipara Junction Bay",
    area: "Guindy",
    address: "GST Road, Near Kathipara Grade Separator, Guindy",
    city: "Chennai",
    lat: 13.0067,
    lng: 80.2025,
    price: 30,
    total: 110,
    rating: 4.5,
    reviews: 95,
    type: "Both",
    amenities: ["CCTV", "Security", "24/7", "Accessible Parking"],
    imageType: "car"
  }
];

// Transform raw locations into full SmartPark facility schema
export const parkingLocations = rawLocations.map((item, idx) => {
  const id = `park-${String(idx + 1).padStart(2, '0')}`;
  const isBike = item.type === "Bike";
  const isCarOnly = item.type === "Car";
  const vehicleTypes = isBike ? ["Bike"] : isCarOnly ? ["Car"] : ["Car", "Bike"];

  // Pick realistic image matching spot type
  let image = carImages[idx % carImages.length];
  if (item.imageType === "bike") {
    image = bikeImages[idx % bikeImages.length];
  } else if (item.imageType === "ev") {
    image = evImages[idx % evImages.length];
  }

  const occupied = Math.round(item.total * (0.35 + (idx % 5) * 0.1));
  const reserved = Math.round(item.total * 0.08);
  const available = Math.max(2, item.total - occupied - reserved);

  return {
    id,
    name: item.name,
    area: item.area,
    address: item.address,
    city: item.city,
    coordinates: { lat: item.lat, lng: item.lng },
    totalSlots: item.total,
    availableSlots: available,
    occupiedSlots: occupied,
    reservedSlots: reserved,
    pricePerHour: item.price,
    distance: `${(0.3 + (idx % 12) * 0.4).toFixed(1)} km away`,
    distanceKm: parseFloat((0.3 + (idx % 12) * 0.4).toFixed(1)),
    rating: item.rating,
    reviewCount: item.reviews,
    image,
    amenities: item.amenities,
    vehicleTypes,
    openingHours: [
      { day: "Monday - Friday", hours: "6:00 AM - 11:30 PM" },
      { day: "Saturday - Sunday", hours: "24 Hours Open" }
    ],
    rules: [
      "Maximum parking duration: 18 hours per single booking",
      "Entry allowed up to 30 mins before reservation start",
      "Keep digital QR pass accessible upon gate entry",
      isBike ? "Designated helmet locker bay on Level 1" : "Follow directional floor arrows"
    ],
    description: `Modern smart parking facility situated in ${item.area}, ${item.city}. Features 24/7 CCTV surveillance, rapid automated boom barriers, and ultrasonic live bay occupancy indicators.`,
    slots: generateSlots(Math.min(30, item.total), !isCarOnly, item.amenities.includes("EV Charging"))
  };
});
