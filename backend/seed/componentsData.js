// Seed Data: 40+ PC Components with detailed specifications for Haniforge
// Real-world specs with AM4, AM5, LGA1700, DDR4, DDR5, varying TDP, GPU lengths, cooler heights, etc.

const componentsData = [
  // ==========================================
  // 1. PROCESSOR (CPU) - 6 Items
  // ==========================================
  {
    name: "AMD Ryzen 5 5600",
    brand: "AMD",
    category: "cpu",
    price: 1650000,
    image_url: "https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=500&auto=format&fit=crop&q=60",
    description: "Prosesor 6-core 12-thread populer dengan performa gaming solid pada platform AM4 yang sangat terjangkau.",
    specifications: {
      socket: "AM4",
      tdp: 65,
      cores: 6,
      threads: 12,
      base_clock_ghz: 3.5,
      boost_clock_ghz: 4.4,
      integrated_graphics: false
    }
  },
  {
    name: "AMD Ryzen 7 5700X",
    brand: "AMD",
    category: "cpu",
    price: 2450000,
    image_url: "https://images.unsplash.com/photo-1555617981-dac3880eac6e?w=500&auto=format&fit=crop&q=60",
    description: "Prosesor 8-core 16-thread hemat daya 65W untuk produktivitas multitasking dan gaming berat pada socket AM4.",
    specifications: {
      socket: "AM4",
      tdp: 65,
      cores: 8,
      threads: 16,
      base_clock_ghz: 3.4,
      boost_clock_ghz: 4.6,
      integrated_graphics: false
    }
  },
  {
    name: "AMD Ryzen 5 7600",
    brand: "AMD",
    category: "cpu",
    price: 3250000,
    image_url: "https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=500&auto=format&fit=crop&q=60",
    description: "Prosesor generasi Zen 4 berbasis arsitektur 5nm dengan socket AM5 dan dukungan memori DDR5 berkecepatan tinggi.",
    specifications: {
      socket: "AM5",
      tdp: 65,
      cores: 6,
      threads: 12,
      base_clock_ghz: 3.8,
      boost_clock_ghz: 5.1,
      integrated_graphics: true
    }
  },
  {
    name: "AMD Ryzen 7 7800X3D",
    brand: "AMD",
    category: "cpu",
    price: 6850000,
    image_url: "https://images.unsplash.com/photo-1555617981-dac3880eac6e?w=500&auto=format&fit=crop&q=60",
    description: "Prosesor gaming terbaik saat ini dengan teknologi 3D V-Cache masif 96MB untuk framerate tertinggi pada resolusi kompetitif.",
    specifications: {
      socket: "AM5",
      tdp: 120,
      cores: 8,
      threads: 16,
      base_clock_ghz: 4.2,
      boost_clock_ghz: 5.0,
      integrated_graphics: true
    }
  },
  {
    name: "Intel Core i5-12400F",
    brand: "Intel",
    category: "cpu",
    price: 1750000,
    image_url: "https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=500&auto=format&fit=crop&q=60",
    description: "Raja budget Intel LGA1700 dengan 6 Golden Cove performance cores, ideal untuk perakitan PC gaming hemat.",
    specifications: {
      socket: "LGA1700",
      tdp: 65,
      cores: 6,
      threads: 12,
      base_clock_ghz: 2.5,
      boost_clock_ghz: 4.4,
      integrated_graphics: false
    }
  },
  {
    name: "Intel Core i5-13600K",
    brand: "Intel",
    category: "cpu",
    price: 4700000,
    image_url: "https://images.unsplash.com/photo-1555617981-dac3880eac6e?w=500&auto=format&fit=crop&q=60",
    description: "Prosesor hybrid 14-core (6 P-core + 8 E-core) bertenaga tinggi untuk editing video dan gaming kelas atas.",
    specifications: {
      socket: "LGA1700",
      tdp: 125,
      cores: 14,
      threads: 20,
      base_clock_ghz: 3.5,
      boost_clock_ghz: 5.1,
      integrated_graphics: true
    }
  },
  {
    name: "Intel Core i7-14700K",
    brand: "Intel",
    category: "cpu",
    price: 6950000,
    image_url: "https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=500&auto=format&fit=crop&q=60",
    description: "Prosesor 20-core performa ekstrem untuk rendering 3D, simulasi AI, dan content creation tanpa kompromi.",
    specifications: {
      socket: "LGA1700",
      tdp: 253,
      cores: 20,
      threads: 28,
      base_clock_ghz: 3.4,
      boost_clock_ghz: 5.6,
      integrated_graphics: true
    }
  },

  // ==========================================
  // 2. MOTHERBOARD - 6 Items
  // ==========================================
  {
    name: "MSI B550M PRO-VDH WiFi",
    brand: "MSI",
    category: "motherboard",
    price: 1550000,
    image_url: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=500&auto=format&fit=crop&q=60",
    description: "Motherboard Micro-ATX socket AM4 dengan dukungan PCIe 4.0, dual M.2 slot, dan modul WiFi onboard.",
    specifications: {
      socket: "AM4",
      ram_type: "DDR4",
      max_ram_capacity: 128,
      form_factor: "Micro-ATX",
      chipset: "AMD B550",
      ram_slots: 4,
      supported_storage_interfaces: ["M.2 NVMe PCIe 4.0", "M.2 NVMe PCIe 3.0", "SATA III"]
    }
  },
  {
    name: "ASUS TUF Gaming B550-PLUS",
    brand: "ASUS",
    category: "motherboard",
    price: 2450000,
    image_url: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=500&auto=format&fit=crop&q=60",
    description: "Motherboard ATX tangguh dengan komponen military-grade TUF, VRM dingin, dan konektivitas lengkap.",
    specifications: {
      socket: "AM4",
      ram_type: "DDR4",
      max_ram_capacity: 128,
      form_factor: "ATX",
      chipset: "AMD B550",
      ram_slots: 4,
      supported_storage_interfaces: ["M.2 NVMe PCIe 4.0", "M.2 NVMe PCIe 3.0", "SATA III"]
    }
  },
  {
    name: "ASRock B650M-HDV/M.2",
    brand: "ASRock",
    category: "motherboard",
    price: 1950000,
    image_url: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=500&auto=format&fit=crop&q=60",
    description: "Motherboard AM5 DDR5 bernilai terbaik dengan VRM 8+2+1 phase yang mampu menyuplai CPU kelas atas.",
    specifications: {
      socket: "AM5",
      ram_type: "DDR5",
      max_ram_capacity: 96,
      form_factor: "Micro-ATX",
      chipset: "AMD B650",
      ram_slots: 2,
      supported_storage_interfaces: ["M.2 NVMe PCIe 5.0", "M.2 NVMe PCIe 4.0", "SATA III"]
    }
  },
  {
    name: "ASUS ROG STRIX B650-A GAMING WiFi",
    brand: "ASUS",
    category: "motherboard",
    price: 4350000,
    image_url: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=500&auto=format&fit=crop&q=60",
    description: "Motherboard premium ATX AM5 dengan desain tema putih perak, WiFi 6E, dan audio SupremeFX berkualitas tinggi.",
    specifications: {
      socket: "AM5",
      ram_type: "DDR5",
      max_ram_capacity: 192,
      form_factor: "ATX",
      chipset: "AMD B650",
      ram_slots: 4,
      supported_storage_interfaces: ["M.2 NVMe PCIe 5.0", "M.2 NVMe PCIe 4.0", "SATA III"]
    }
  },
  {
    name: "Gigabyte B660M DS3H DDR4",
    brand: "Gigabyte",
    category: "motherboard",
    price: 1650000,
    image_url: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=500&auto=format&fit=crop&q=60",
    description: "Pilihan ekonomis untuk Intel Core Gen 12/13/14 LGA1700 dengan memori DDR4 murah dan port lengkap.",
    specifications: {
      socket: "LGA1700",
      ram_type: "DDR4",
      max_ram_capacity: 128,
      form_factor: "Micro-ATX",
      chipset: "Intel B660",
      ram_slots: 4,
      supported_storage_interfaces: ["M.2 NVMe PCIe 4.0", "SATA III"]
    }
  },
  {
    name: "MSI MAG B760 TOMAHAWK WIFI DDR5",
    brand: "MSI",
    category: "motherboard",
    price: 3850000,
    image_url: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=500&auto=format&fit=crop&q=60",
    description: "Motherboard gaming ATX LGA1700 dengan power delivery 12+1+1 duet rail dan dukungan memori DDR5 hingga 7200+ MHz.",
    specifications: {
      socket: "LGA1700",
      ram_type: "DDR5",
      max_ram_capacity: 192,
      form_factor: "ATX",
      chipset: "Intel B760",
      ram_slots: 4,
      supported_storage_interfaces: ["M.2 NVMe PCIe 4.0", "SATA III"]
    }
  },

  // ==========================================
  // 3. RAM (MEMORY) - 6 Items
  // ==========================================
  {
    name: "Corsair Vengeance LPX 16GB (2x8GB) DDR4 3200MHz",
    brand: "Corsair",
    category: "ram",
    price: 650000,
    image_url: "https://images.unsplash.com/photo-1562976540-1502c2145186?w=500&auto=format&fit=crop&q=60",
    description: "Kit memori DDR4 dual channel low-profile berpendingin aluminium murni untuk kompatibilitas heatsink maksimal.",
    specifications: {
      ram_type: "DDR4",
      capacity: 16,
      speed: "3200MHz",
      modules: "2x8GB"
    }
  },
  {
    name: "Kingston FURY Beast 32GB (2x16GB) DDR4 3200MHz",
    brand: "Kingston",
    category: "ram",
    price: 1200000,
    image_url: "https://images.unsplash.com/photo-1562976540-1502c2145186?w=500&auto=format&fit=crop&q=60",
    description: "Kapasitas lapang 32GB DDR4 dengan profil Intel XMP dan AMD Ryzen Certified untuk kenyamanan multitasking.",
    specifications: {
      ram_type: "DDR4",
      capacity: 32,
      speed: "3200MHz",
      modules: "2x16GB"
    }
  },
  {
    name: "Team T-Force Delta RGB 16GB (2x8GB) DDR4 3600MHz",
    brand: "TeamGroup",
    category: "ram",
    price: 780000,
    image_url: "https://images.unsplash.com/photo-1562976540-1502c2145186?w=500&auto=format&fit=crop&q=60",
    description: "RAM DDR4 kencang dengan pencahayaan RGB 120 derajat ultra-lebar yang sinkron dengan software RGB motherboard.",
    specifications: {
      ram_type: "DDR4",
      capacity: 16,
      speed: "3600MHz",
      modules: "2x8GB"
    }
  },
  {
    name: "Kingston FURY Beast 32GB (2x16GB) DDR5 5600MHz",
    brand: "Kingston",
    category: "ram",
    price: 1850000,
    image_url: "https://images.unsplash.com/photo-1562976540-1502c2145186?w=500&auto=format&fit=crop&q=60",
    description: "Memori DDR5 generasi terbaru dengan on-die ECC dan on-board PMIC untuk stabilitas frekuensi tinggi.",
    specifications: {
      ram_type: "DDR5",
      capacity: 32,
      speed: "5600MHz",
      modules: "2x16GB"
    }
  },
  {
    name: "G.Skill Trident Z5 RGB 32GB (2x16GB) DDR5 6000MHz",
    brand: "G.Skill",
    category: "ram",
    price: 2450000,
    image_url: "https://images.unsplash.com/photo-1562976540-1502c2145186?w=500&auto=format&fit=crop&q=60",
    description: "Kecepatan optimal AMD EXPO 6000MHz CL30 yang direkomendasikan untuk platform Ryzen 7000.",
    specifications: {
      ram_type: "DDR5",
      capacity: 32,
      speed: "6000MHz",
      modules: "2x16GB"
    }
  },
  {
    name: "Corsair Vengeance 64GB (2x32GB) DDR5 5600MHz",
    brand: "Corsair",
    category: "ram",
    price: 3600000,
    image_url: "https://images.unsplash.com/photo-1562976540-1502c2145186?w=500&auto=format&fit=crop&q=60",
    description: "Kapasitas masif 64GB DDR5 untuk workstation, simulasi ilmiah, virtual machine, dan editing video 4K/8K.",
    specifications: {
      ram_type: "DDR5",
      capacity: 64,
      speed: "5600MHz",
      modules: "2x32GB"
    }
  },

  // ==========================================
  // 4. VGA / GRAPHICS CARD (GPU) - 6 Items
  // ==========================================
  {
    name: "Sapphire Pulse AMD Radeon RX 6600 8GB",
    brand: "Sapphire",
    category: "gpu",
    price: 3250000,
    image_url: "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=500&auto=format&fit=crop&q=60",
    description: "Kartu grafis 1080p gaming paling efisien dengan arsitektur RDNA 2 dan konsumsi daya hanya 132W.",
    specifications: {
      length_mm: 193,
      tdp: 132,
      vram: "8GB GDDR6",
      recommended_psu: 450
    }
  },
  {
    name: "ZOTAC GAMING GeForce RTX 3060 Twin Edge 12GB",
    brand: "ZOTAC",
    category: "gpu",
    price: 4350000,
    image_url: "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=500&auto=format&fit=crop&q=60",
    description: "VRAM 12GB besar untuk gaming ray tracing, render 3D Blender, dan machine learning lokal.",
    specifications: {
      length_mm: 224,
      tdp: 170,
      vram: "12GB GDDR6",
      recommended_psu: 550
    }
  },
  {
    name: "ASUS Dual GeForce RTX 4060 EVO OC 8GB",
    brand: "ASUS",
    category: "gpu",
    price: 4950000,
    image_url: "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=500&auto=format&fit=crop&q=60",
    description: "Didukung arsitektur Ada Lovelace dengan teknologi DLSS 3 Frame Generation dan konsumsi daya sangat irit 115W.",
    specifications: {
      length_mm: 227,
      tdp: 115,
      vram: "8GB GDDR6",
      recommended_psu: 500
    }
  },
  {
    name: "Gigabyte GeForce RTX 4070 SUPER WINDFORCE OC 12GB",
    brand: "Gigabyte",
    category: "gpu",
    price: 10450000,
    image_url: "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=500&auto=format&fit=crop&q=60",
    description: "Monster gaming 1440p resolusi tinggi dengan pendingin tiga kipas Windforce dan performa hampir setara RTX 4070 Ti.",
    specifications: {
      length_mm: 261,
      tdp: 220,
      vram: "12GB GDDR6X",
      recommended_psu: 650
    }
  },
  {
    name: "PowerColor Hellhound AMD Radeon RX 7800 XT 16GB",
    brand: "PowerColor",
    category: "gpu",
    price: 8900000,
    image_url: "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=500&auto=format&fit=crop&q=60",
    description: "GPU 1440p kencang dengan memori 16GB luas untuk game AAA terkini tanpa batasan tekstur grafis.",
    specifications: {
      length_mm: 322,
      tdp: 263,
      vram: "16GB GDDR6",
      recommended_psu: 750
    }
  },
  {
    name: "MSI GeForce RTX 4080 SUPER 16G GAMING X TRIO",
    brand: "MSI",
    category: "gpu",
    price: 18500000,
    image_url: "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=500&auto=format&fit=crop&q=60",
    description: "Kartu grafis flagship 4K ultra gaming dengan panjang 337mm dan arsitektur Ada Lovelace termutakhir.",
    specifications: {
      length_mm: 337,
      tdp: 320,
      vram: "16GB GDDR6X",
      recommended_psu: 850
    }
  },

  // ==========================================
  // 5. STORAGE (SSD / HDD) - 6 Items
  // ==========================================
  {
    name: "Kingston NV2 500GB M.2 NVMe PCIe 4.0",
    brand: "Kingston",
    category: "storage",
    price: 580000,
    image_url: "https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=500&auto=format&fit=crop&q=60",
    description: "SSD M.2 NVMe PCIe 4.0 berkecepatan baca hingga 3500MB/s untuk waktu boot kilat dan loading game responsif.",
    specifications: {
      storage_type: "SSD M.2 NVMe",
      capacity: "500GB",
      interface: "M.2 NVMe PCIe 4.0",
      read_speed_mbps: 3500,
      write_speed_mbps: 2100
    }
  },
  {
    name: "Kingston NV2 1TB M.2 NVMe PCIe 4.0",
    brand: "Kingston",
    category: "storage",
    price: 950000,
    image_url: "https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=500&auto=format&fit=crop&q=60",
    description: "SSD M.2 NVMe 1TB bernilai terbaik untuk kapasitas penyimpanan game modern.",
    specifications: {
      storage_type: "SSD M.2 NVMe",
      capacity: "1TB",
      interface: "M.2 NVMe PCIe 4.0",
      read_speed_mbps: 3500,
      write_speed_mbps: 2100
    }
  },
  {
    name: "Samsung 980 PRO 1TB M.2 NVMe PCIe 4.0 Heatsink",
    brand: "Samsung",
    category: "storage",
    price: 1850000,
    image_url: "https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=500&auto=format&fit=crop&q=60",
    description: "SSD NVMe kelas profesional dengan controller Elpis dan cache DRAM, kecepatan hingga 7000MB/s.",
    specifications: {
      storage_type: "SSD M.2 NVMe",
      capacity: "1TB",
      interface: "M.2 NVMe PCIe 4.0",
      read_speed_mbps: 7000,
      write_speed_mbps: 5000
    }
  },
  {
    name: "Crucial P3 Plus 2TB M.2 NVMe PCIe 4.0",
    brand: "Crucial",
    category: "storage",
    price: 2150000,
    image_url: "https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=500&auto=format&fit=crop&q=60",
    description: "Penyimpanan 2TB masif berkecepatan 5000MB/s untuk arsip video dan koleksi game puluhan judul.",
    specifications: {
      storage_type: "SSD M.2 NVMe",
      capacity: "2TB",
      interface: "M.2 NVMe PCIe 4.0",
      read_speed_mbps: 5000,
      write_speed_mbps: 4200
    }
  },
  {
    name: "Kingston A400 480GB SATA 2.5\" SSD",
    brand: "Kingston",
    category: "storage",
    price: 450000,
    image_url: "https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=500&auto=format&fit=crop&q=60",
    description: "SSD SATA 2.5 inci standar untuk secondary storage atau kompatibilitas motherboard lama.",
    specifications: {
      storage_type: "SSD SATA 2.5\"",
      capacity: "480GB",
      interface: "SATA III",
      read_speed_mbps: 500,
      write_speed_mbps: 450
    }
  },
  {
    name: "Seagate Barracuda 2TB HDD 3.5\" SATA",
    brand: "Seagate",
    category: "storage",
    price: 980000,
    image_url: "https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=500&auto=format&fit=crop&q=60",
    description: "Harddisk mekanik 7200 RPM untuk penyimpanan data cadangan, foto, dan dokumen berukuran besar.",
    specifications: {
      storage_type: "HDD 3.5\" SATA",
      capacity: "2TB",
      interface: "SATA III",
      read_speed_mbps: 190,
      write_speed_mbps: 185
    }
  },

  // ==========================================
  // 6. POWER SUPPLY (PSU) - 6 Items
  // ==========================================
  {
    name: "Deepcool PK550D 550W 80 Plus Bronze",
    brand: "Deepcool",
    category: "psu",
    price: 650000,
    image_url: "https://images.unsplash.com/photo-1587202372634-32705e3bf49c?w=500&auto=format&fit=crop&q=60",
    description: "Power supply 550W bersertifikasi 80 Plus Bronze dengan proteksi lengkap (OVP, OPP, SCP, OCP).",
    specifications: {
      wattage: 550,
      efficiency_rating: "80 Plus Bronze",
      modular: "Non-Modular"
    }
  },
  {
    name: "Corsair CV650 650W 80 Plus Bronze",
    brand: "Corsair",
    category: "psu",
    price: 880000,
    image_url: "https://images.unsplash.com/photo-1587202372634-32705e3bf49c?w=500&auto=format&fit=crop&q=60",
    description: "Catu daya 650 Watt andal dari Corsair dengan kipas 120mm silent thermal control.",
    specifications: {
      wattage: 650,
      efficiency_rating: "80 Plus Bronze",
      modular: "Non-Modular"
    }
  },
  {
    name: "MSI MAG A750GL PCIE5 750W 80 Plus Gold",
    brand: "MSI",
    category: "psu",
    price: 1550000,
    image_url: "https://images.unsplash.com/photo-1587202372634-32705e3bf49c?w=500&auto=format&fit=crop&q=60",
    description: "PSU Full Modular ATX 3.0 dengan kabel bawaan native 16-pin PCIe 5.0 (12VHPWR) untuk RTX 40-series.",
    specifications: {
      wattage: 750,
      efficiency_rating: "80 Plus Gold",
      modular: "Full Modular"
    }
  },
  {
    name: "Corsair RM850e 850W 80 Plus Gold ATX 3.0",
    brand: "Corsair",
    category: "psu",
    price: 1950000,
    image_url: "https://images.unsplash.com/photo-1587202372634-32705e3bf49c?w=500&auto=format&fit=crop&q=60",
    description: "PSU 850 Watt sertifikasi Gold dengan kapasitor kelas industri 105C dan mode zero-RPM silent fan.",
    specifications: {
      wattage: 850,
      efficiency_rating: "80 Plus Gold",
      modular: "Full Modular"
    }
  },
  {
    name: "be quiet! Pure Power 12 M 1000W 80 Plus Gold",
    brand: "be quiet!",
    category: "psu",
    price: 2750000,
    image_url: "https://images.unsplash.com/photo-1587202372634-32705e3bf49c?w=500&auto=format&fit=crop&q=60",
    description: "Tenaga 1000 Watt luar biasa hening untuk rakitan super multi-GPU atau CPU high-end yang dioverclock.",
    specifications: {
      wattage: 1000,
      efficiency_rating: "80 Plus Gold",
      modular: "Full Modular"
    }
  },

  // ==========================================
  // 7. CASING (PC CASE) - 6 Items
  // ==========================================
  {
    name: "Cube Gaming Byron Mini-Tower",
    brand: "Cube Gaming",
    category: "casing",
    price: 380000,
    image_url: "https://images.unsplash.com/photo-1587202372634-32705e3bf49c?w=500&auto=format&fit=crop&q=60",
    description: "Casing ringkas budget dengan panel kaca tempered dan dukungan motherboard Micro-ATX dan Mini-ITX.",
    specifications: {
      supported_motherboard_form_factors: ["Micro-ATX", "Mini-ITX"],
      max_gpu_length_mm: 300,
      max_cooler_height_mm: 155,
      form_factor: "Mini Tower"
    }
  },
  {
    name: "Montech Air 100 ARGB Black",
    brand: "Montech",
    category: "casing",
    price: 690000,
    image_url: "https://images.unsplash.com/photo-1587202372634-32705e3bf49c?w=500&auto=format&fit=crop&q=60",
    description: "Casing Micro-ATX airflow tinggi yang sudah dilengkapi 4 kipas ARGB bawaan dan magnetic front dust filter.",
    specifications: {
      supported_motherboard_form_factors: ["Micro-ATX", "Mini-ITX"],
      max_gpu_length_mm: 330,
      max_cooler_height_mm: 161,
      form_factor: "Mini Tower"
    }
  },
  {
    name: "Fractal Design Pop Air Black Solid",
    brand: "Fractal Design",
    category: "casing",
    price: 1250000,
    image_url: "https://images.unsplash.com/photo-1587202372634-32705e3bf49c?w=500&auto=format&fit=crop&q=60",
    description: "Casing Mid Tower bergaya Skandinavia minimalis, mendukung motherboard ATX, Micro-ATX, dan Mini-ITX.",
    specifications: {
      supported_motherboard_form_factors: ["ATX", "Micro-ATX", "Mini-ITX"],
      max_gpu_length_mm: 405,
      max_cooler_height_mm: 170,
      form_factor: "Mid Tower"
    }
  },
  {
    name: "NZXT H5 Flow Black",
    brand: "NZXT",
    category: "casing",
    price: 1450000,
    image_url: "https://images.unsplash.com/photo-1587202372634-32705e3bf49c?w=500&auto=format&fit=crop&q=60",
    description: "Casing ATX ikonik dengan intake kipas khusus dedicated GPU di bagian bawah untuk sirkulasi pendinginan prima.",
    specifications: {
      supported_motherboard_form_factors: ["ATX", "Micro-ATX", "Mini-ITX"],
      max_gpu_length_mm: 365,
      max_cooler_height_mm: 165,
      form_factor: "Mid Tower"
    }
  },
  {
    name: "Lian Li O11 Dynamic EVO Black",
    brand: "Lian Li",
    category: "casing",
    price: 2450000,
    image_url: "https://images.unsplash.com/photo-1587202372634-32705e3bf49c?w=500&auto=format&fit=crop&q=60",
    description: "Casing dual-chamber premium berdinding kaca panorama ganda untuk pamer komponen custom watercooling.",
    specifications: {
      supported_motherboard_form_factors: ["E-ATX", "ATX", "Micro-ATX", "Mini-ITX"],
      max_gpu_length_mm: 426,
      max_cooler_height_mm: 167,
      form_factor: "Mid Tower"
    }
  },
  {
    name: "Cooler Master NR200P SFF Mini-ITX",
    brand: "Cooler Master",
    category: "casing",
    price: 1100000,
    image_url: "https://images.unsplash.com/photo-1587202372634-32705e3bf49c?w=500&auto=format&fit=crop&q=60",
    description: "Casing compact SFF (Small Form Factor) 18 liter khusus motherboard Mini-ITX untuk rakitan PC portabel.",
    specifications: {
      supported_motherboard_form_factors: ["Mini-ITX"],
      max_gpu_length_mm: 330,
      max_cooler_height_mm: 155,
      form_factor: "Small Form Factor"
    }
  },

  // ==========================================
  // 8. CPU COOLER - 6 Items
  // ==========================================
  {
    name: "Thermalright Assassin X 120 Refined SE",
    brand: "Thermalright",
    category: "cooler",
    price: 240000,
    image_url: "https://images.unsplash.com/photo-1587202372634-32705e3bf49c?w=500&auto=format&fit=crop&q=60",
    description: "Pendingin udara single tower 4 heatpipe dengan performa harga terbaik di kelasnya.",
    specifications: {
      supported_sockets: ["AM4", "AM5", "LGA1700", "LGA1200"],
      height_mm: 148,
      cooler_type: "Air Cooler",
      max_tdp_cooling: 180
    }
  },
  {
    name: "Deepcool AK400 Zero Dark",
    brand: "Deepcool",
    category: "cooler",
    price: 390000,
    image_url: "https://images.unsplash.com/photo-1587202372634-32705e3bf49c?w=500&auto=format&fit=crop&q=60",
    description: "Air cooler serba hitam elegan dengan sirip matriks khas Deepcool dan kipas FDB hening.",
    specifications: {
      supported_sockets: ["AM4", "AM5", "LGA1700", "LGA1200"],
      height_mm: 155,
      cooler_type: "Air Cooler",
      max_tdp_cooling: 220
    }
  },
  {
    name: "Thermalright Peerless Assassin 120 SE",
    brand: "Thermalright",
    category: "cooler",
    price: 520000,
    image_url: "https://images.unsplash.com/photo-1587202372634-32705e3bf49c?w=500&auto=format&fit=crop&q=60",
    description: "Pendingin dual-tower 6 heatpipe legendaris dengan performa menandingi AIO liquid cooler 240mm.",
    specifications: {
      supported_sockets: ["AM4", "AM5", "LGA1700", "LGA1200"],
      height_mm: 155,
      cooler_type: "Air Cooler",
      max_tdp_cooling: 265
    }
  },
  {
    name: "Deepcool AG620 ARGB Dual Tower",
    brand: "Deepcool",
    category: "cooler",
    price: 680000,
    image_url: "https://images.unsplash.com/photo-1587202372634-32705e3bf49c?w=500&auto=format&fit=crop&q=60",
    description: "Pendingin dual tower 6 heatpipe dengan pencahayaan ARGB ganda dan daya disipasi panas hingga 260W TDP.",
    specifications: {
      supported_sockets: ["AM4", "AM5", "LGA1700", "LGA1200"],
      height_mm: 157,
      cooler_type: "Air Cooler",
      max_tdp_cooling: 260
    }
  },
  {
    name: "Arctic Liquid Freezer III 240 A-RGB",
    brand: "Arctic",
    category: "cooler",
    price: 1450000,
    image_url: "https://images.unsplash.com/photo-1587202372634-32705e3bf49c?w=500&auto=format&fit=crop&q=60",
    description: "Liquid cooler AIO 240mm dengan radiator tebal 38mm dan kipas VRM terintegrasi di waterblock.",
    specifications: {
      supported_sockets: ["AM4", "AM5", "LGA1700"],
      height_mm: 53, // Waterblock height
      cooler_type: "AIO Liquid Cooler 240mm",
      max_tdp_cooling: 300
    }
  },
  {
    name: "NZXT Kraken 240 RGB Black",
    brand: "NZXT",
    category: "cooler",
    price: 2350000,
    image_url: "https://images.unsplash.com/photo-1587202372634-32705e3bf49c?w=500&auto=format&fit=crop&q=60",
    description: "Water cooling AIO 240mm premium dengan layar LCD 1.54 inci untuk menampilkan suhu CPU atau gambar animasi kustom.",
    specifications: {
      supported_sockets: ["AM4", "AM5", "LGA1700", "LGA1200"],
      height_mm: 56, // Waterblock height
      cooler_type: "AIO Liquid Cooler 240mm",
      max_tdp_cooling: 280
    }
  }
];

module.exports = componentsData;
