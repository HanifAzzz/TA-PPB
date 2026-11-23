/**
 * Service Analisis Kompatibilitas Komponen PC Haniforge
 * Melakukan pengecekan menyeluruh berdasarkan data spesifikasi riil di database.
 */

function checkCompatibility(componentsMap) {
  // componentsMap: { cpu, motherboard, ram, gpu, storage, psu, casing, cooler }
  const checks = [];
  let hasIncompatible = false;
  let hasWarning = false;

  const { cpu, motherboard, ram, gpu, storage, psu, casing, cooler } = componentsMap;

  // -------------------------------------------------------------
  // 1. CPU vs Motherboard (Socket)
  // -------------------------------------------------------------
  if (cpu && motherboard) {
    const cpuSocket = cpu.specifications?.socket;
    const moboSocket = motherboard.specifications?.socket;

    if (!cpuSocket || !moboSocket) {
      checks.push({
        rule: 'cpu_motherboard_socket',
        title: 'Socket CPU & Motherboard',
        status: 'warning',
        message: 'Data spesifikasi socket CPU atau Motherboard belum lengkap untuk validasi otomatis.',
      });
      hasWarning = true;
    } else if (cpuSocket.toUpperCase() === moboSocket.toUpperCase()) {
      checks.push({
        rule: 'cpu_motherboard_socket',
        title: 'Socket CPU & Motherboard',
        status: 'compatible',
        message: `Kompatibel: CPU (${cpu.name}) dan Motherboard (${motherboard.name}) sama-sama menggunakan socket ${cpuSocket}.`,
      });
    } else {
      checks.push({
        rule: 'cpu_motherboard_socket',
        title: 'Socket CPU & Motherboard',
        status: 'incompatible',
        message: `Tidak Kompatibel: CPU menggunakan socket ${cpuSocket}, sedangkan Motherboard menggunakan socket ${moboSocket}. Komponen tidak dapat dipasang fisik.`,
      });
      hasIncompatible = true;
    }
  } else {
    checks.push({
      rule: 'cpu_motherboard_socket',
      title: 'Socket CPU & Motherboard',
      status: 'warning',
      message: 'Pilih CPU dan Motherboard untuk memeriksa kecocokan socket.',
    });
    hasWarning = true;
  }

  // -------------------------------------------------------------
  // 2. RAM vs Motherboard (Tipe & Kapasitas)
  // -------------------------------------------------------------
  if (ram && motherboard) {
    const ramType = ram.specifications?.ram_type;
    const moboRamType = motherboard.specifications?.ram_type;
    const ramCapacity = Number(ram.specifications?.capacity || 0);
    const moboMaxRam = Number(motherboard.specifications?.max_ram_capacity || 0);

    if (!ramType || !moboRamType) {
      checks.push({
        rule: 'ram_motherboard_type',
        title: 'Tipe Generasi RAM & Motherboard',
        status: 'warning',
        message: 'Data tipe RAM atau Motherboard belum tersedia.',
      });
      hasWarning = true;
    } else if (ramType.toUpperCase() === moboRamType.toUpperCase()) {
      checks.push({
        rule: 'ram_motherboard_type',
        title: 'Tipe Generasi RAM & Motherboard',
        status: 'compatible',
        message: `Kompatibel: RAM (${ram.name}) dan Motherboard mendukung tipe memori generasi ${ramType}.`,
      });
    } else {
      checks.push({
        rule: 'ram_motherboard_type',
        title: 'Tipe Generasi RAM & Motherboard',
        status: 'incompatible',
        message: `Tidak Kompatibel: RAM bertipe ${ramType}, sedangkan Motherboard hanya mendukung memori ${moboRamType}. Slot memori DDR berbeda secara fisik dan kelistrikan.`,
      });
      hasIncompatible = true;
    }

    // Pengecekan kapasitas RAM
    if (ramCapacity > 0 && moboMaxRam > 0) {
      if (ramCapacity <= moboMaxRam) {
        checks.push({
          rule: 'ram_capacity_limit',
          title: 'Kapasitas RAM',
          status: 'compatible',
          message: `Kapasitas RAM (${ramCapacity} GB) berada di dalam batas dukungan maksimum Motherboard (${moboMaxRam} GB).`,
        });
      } else {
        checks.push({
          rule: 'ram_capacity_limit',
          title: 'Kapasitas RAM',
          status: 'incompatible',
          message: `Tidak Kompatibel: Kapasitas RAM (${ramCapacity} GB) melebihi batas maksimum Motherboard (${moboMaxRam} GB).`,
        });
        hasIncompatible = true;
      }
    }
  } else {
    checks.push({
      rule: 'ram_motherboard_type',
      title: 'Tipe Generasi RAM & Motherboard',
      status: 'warning',
      message: 'Pilih RAM dan Motherboard untuk memeriksa kecocokan tipe memori.',
    });
    hasWarning = true;
  }

  // -------------------------------------------------------------
  // 3. Motherboard vs Casing (Form Factor)
  // -------------------------------------------------------------
  if (motherboard && casing) {
    const moboForm = motherboard.specifications?.form_factor;
    const casingForms = casing.specifications?.supported_motherboard_form_factors;

    if (!moboForm || !Array.isArray(casingForms)) {
      checks.push({
        rule: 'mobo_casing_form_factor',
        title: 'Form Factor Motherboard & Casing',
        status: 'warning',
        message: 'Data spesifikasi form factor Motherboard atau Casing belum lengkap.',
      });
      hasWarning = true;
    } else {
      const isSupported = casingForms.some(f => f.toLowerCase() === moboForm.toLowerCase());
      if (isSupported) {
        checks.push({
          rule: 'mobo_casing_form_factor',
          title: 'Form Factor Motherboard & Casing',
          status: 'compatible',
          message: `Kompatibel: Casing (${casing.name}) mendukung motherboard form factor ${moboForm} (didukung: ${casingForms.join(', ')}).`,
        });
      } else {
        checks.push({
          rule: 'mobo_casing_form_factor',
          title: 'Form Factor Motherboard & Casing',
          status: 'incompatible',
          message: `Tidak Kompatibel: Motherboard berukuran ${moboForm}, namun Casing hanya mendukung form factor: ${casingForms.join(', ')}. Motherboard tidak akan muat di dalam casing.`,
        });
        hasIncompatible = true;
      }
    }
  } else {
    checks.push({
      rule: 'mobo_casing_form_factor',
      title: 'Form Factor Motherboard & Casing',
      status: 'warning',
      message: 'Pilih Motherboard dan Casing untuk memastikan form factor didukung.',
    });
    hasWarning = true;
  }

  // -------------------------------------------------------------
  // 4. GPU vs Casing (Panjang Kartu Grafis / Clearance)
  // -------------------------------------------------------------
  if (gpu && casing) {
    const gpuLength = Number(gpu.specifications?.length_mm);
    const maxGpuLength = Number(casing.specifications?.max_gpu_length_mm);

    if (!gpuLength || !maxGpuLength) {
      checks.push({
        rule: 'gpu_casing_length',
        title: 'Ruang Panjang GPU di Casing',
        status: 'warning',
        message: 'Data dimensi panjang GPU atau ruang maksimum Casing belum tersedia.',
      });
      hasWarning = true;
    } else if (gpuLength > maxGpuLength) {
      checks.push({
        rule: 'gpu_casing_length',
        title: 'Ruang Panjang GPU di Casing',
        status: 'incompatible',
        message: `Tidak Kompatibel: Panjang GPU (${gpuLength} mm) melebihi batas ruang GPU pada Casing (${maxGpuLength} mm). GPU akan terbentur panel depan atau radiator.`,
      });
      hasIncompatible = true;
    } else if (gpuLength > maxGpuLength - 15) {
      checks.push({
        rule: 'gpu_casing_length',
        title: 'Ruang Panjang GPU di Casing',
        status: 'warning',
        message: `Perlu Diperiksa: Panjang GPU (${gpuLength} mm) sangat mepet dengan batas Casing (${maxGpuLength} mm). Sisa ruang hanya ${maxGpuLength - gpuLength} mm, perhatikan manajemen kabel.`,
      });
      hasWarning = true;
    } else {
      checks.push({
        rule: 'gpu_casing_length',
        title: 'Ruang Panjang GPU di Casing',
        status: 'compatible',
        message: `Kompatibel: Panjang GPU (${gpuLength} mm) pas di dalam Casing dengan ruang sisa ${maxGpuLength - gpuLength} mm (maks ${maxGpuLength} mm).`,
      });
    }
  } else if (gpu && !casing) {
    checks.push({
      rule: 'gpu_casing_length',
      title: 'Ruang Panjang GPU di Casing',
      status: 'warning',
      message: 'Pilih Casing untuk memverifikasi apakah GPU muat.',
    });
    hasWarning = true;
  }

  // -------------------------------------------------------------
  // 5. Kebutuhan Daya (TDP & Kapasitas PSU)
  // -------------------------------------------------------------
  if (psu) {
    const psuWattage = Number(psu.specifications?.wattage);
    const cpuTdp = cpu ? Number(cpu.specifications?.tdp) : null;
    const gpuTdp = gpu ? Number(gpu.specifications?.tdp) : 0; // GPU opsional jika CPU ada iGPU

    if (!psuWattage) {
      checks.push({
        rule: 'psu_power_capacity',
        title: 'Kebutuhan Daya & Kapasitas PSU',
        status: 'warning',
        message: 'Data spesifikasi kapasitas daya PSU belum tersedia.',
      });
      hasWarning = true;
    } else if (cpu && cpuTdp === null) {
      // Prompt explicitly says: "Jangan menyatakan PSU pasti aman jika data konsumsi daya belum lengkap."
      checks.push({
        rule: 'psu_power_capacity',
        title: 'Kebutuhan Daya & Kapasitas PSU',
        status: 'warning',
        message: 'Data konsumsi daya (TDP) CPU belum lengkap, kapasitas PSU tidak dapat dipastikan aman.',
      });
      hasWarning = true;
    } else {
      // Estimasi konsumsi daya total:
      // CPU TDP + GPU TDP + Base system overhead (Motherboard, RAM, SSD, Fans ~ 75W)
      const baseOverhead = 75;
      const actualCpuTdp = cpuTdp || 65;
      const actualGpuTdp = gpu ? gpuTdp : 0;
      const estimatedTotalTdp = actualCpuTdp + actualGpuTdp + baseOverhead;
      const recommendedWattage = Math.ceil((estimatedTotalTdp * 1.3) / 50) * 50; // Headroom 30%, dibulatkan ke kelipatan 50W

      if (psuWattage < estimatedTotalTdp) {
        checks.push({
          rule: 'psu_power_capacity',
          title: 'Kebutuhan Daya & Kapasitas PSU',
          status: 'incompatible',
          message: `Tidak Kompatibel: Kapasitas PSU (${psuWattage}W) lebih kecil dari estimasi konsumsi daya beban penuh sistem (${estimatedTotalTdp}W = CPU ${actualCpuTdp}W + GPU ${actualGpuTdp}W + Komponen Lain ${baseOverhead}W). Berisiko shut-down mendadak saat full load.`,
        });
        hasIncompatible = true;
      } else if (psuWattage < recommendedWattage) {
        checks.push({
          rule: 'psu_power_capacity',
          title: 'Kebutuhan Daya & Kapasitas PSU',
          status: 'warning',
          message: `Perlu Diperiksa: Kapasitas PSU (${psuWattage}W) mencukupi kebutuhan dasar (${estimatedTotalTdp}W), tetapi di bawah rekomendasi aman dengan headroom 30% (${recommendedWattage}W) untuk menangani lonjakan daya (transient power spikes).`,
        });
        hasWarning = true;
      } else {
        checks.push({
          rule: 'psu_power_capacity',
          title: 'Kebutuhan Daya & Kapasitas PSU',
          status: 'compatible',
          message: `Kompatibel: Kapasitas PSU (${psuWattage}W) sangat memadai untuk estimasi kebutuhan daya sistem (${estimatedTotalTdp}W). Rekomendasi aman: minimal ${recommendedWattage}W.`,
        });
      }
    }
  } else {
    checks.push({
      rule: 'psu_power_capacity',
      title: 'Kebutuhan Daya & Kapasitas PSU',
      status: 'warning',
      message: 'Pilih Power Supply (PSU) untuk menganalisis kecukupan daya rakitan.',
    });
    hasWarning = true;
  }

  // -------------------------------------------------------------
  // 6. CPU Cooler vs CPU & Casing
  // -------------------------------------------------------------
  if (cooler) {
    // 6a. Cooler vs CPU Socket
    if (cpu) {
      const cpuSocket = cpu.specifications?.socket;
      const coolerSockets = cooler.specifications?.supported_sockets;

      if (!cpuSocket || !Array.isArray(coolerSockets)) {
        checks.push({
          rule: 'cooler_cpu_socket',
          title: 'Bracket CPU Cooler & Socket CPU',
          status: 'warning',
          message: 'Data spesifikasi bracket CPU Cooler atau socket CPU belum lengkap.',
        });
        hasWarning = true;
      } else {
        const socketMatches = coolerSockets.some(s => s.toUpperCase() === cpuSocket.toUpperCase());
        if (socketMatches) {
          checks.push({
            rule: 'cooler_cpu_socket',
            title: 'Bracket CPU Cooler & Socket CPU',
            status: 'compatible',
            message: `Kompatibel: Bracket CPU Cooler (${cooler.name}) mendukung socket CPU ${cpuSocket}.`,
          });
        } else {
          checks.push({
            rule: 'cooler_cpu_socket',
            title: 'Bracket CPU Cooler & Socket CPU',
            status: 'incompatible',
            message: `Tidak Kompatibel: Cooler tidak mendukung socket ${cpuSocket} (hanya mendukung: ${coolerSockets.join(', ')}). Bracket pendingin tidak dapat dipasang.`,
          });
          hasIncompatible = true;
        }
      }
    }

    // 6b. Cooler Height vs Casing Max Cooler Height
    if (casing) {
      const coolerHeight = Number(cooler.specifications?.height_mm);
      const maxCoolerHeight = Number(casing.specifications?.max_cooler_height_mm);

      // Cek apakah cooler adalah AIO liquid cooler (waterblock biasanya rendah, < 70mm)
      const isAIO = cooler.specifications?.cooler_type?.toLowerCase().includes('aio');

      if (!isAIO && coolerHeight && maxCoolerHeight) {
        if (coolerHeight > maxCoolerHeight) {
          checks.push({
            rule: 'cooler_casing_height',
            title: 'Tinggi CPU Cooler & Casing',
            status: 'incompatible',
            message: `Tidak Kompatibel: Tinggi CPU Cooler (${coolerHeight} mm) melebihi batas tinggi cooler Casing (${maxCoolerHeight} mm). Panel samping kaca casing tidak dapat ditutup.`,
          });
          hasIncompatible = true;
        } else if (coolerHeight > maxCoolerHeight - 5) {
          checks.push({
            rule: 'cooler_casing_height',
            title: 'Tinggi CPU Cooler & Casing',
            status: 'warning',
            message: `Perlu Diperiksa: Tinggi CPU Cooler (${coolerHeight} mm) sangat mepet dengan batas toleransi Casing (${maxCoolerHeight} mm). Pastikan tidak ada benturan dengan heatpipe.`,
          });
          hasWarning = true;
        } else {
          checks.push({
            rule: 'cooler_casing_height',
            title: 'Tinggi CPU Cooler & Casing',
            status: 'compatible',
            message: `Kompatibel: Tinggi CPU Cooler (${coolerHeight} mm) berada di bawah batas maksimum Casing (${maxCoolerHeight} mm).`,
          });
        }
      } else if (isAIO) {
        checks.push({
          rule: 'cooler_casing_height',
          title: 'Tinggi CPU Cooler & Casing',
          status: 'compatible',
          message: `Kompatibel: Liquid Cooler AIO menggunakan waterblock kompak (${coolerHeight} mm) yang muat di semua casing standar.`,
        });
      }
    }
  }

  // -------------------------------------------------------------
  // 7. Storage vs Motherboard (Interface)
  // -------------------------------------------------------------
  if (storage && motherboard) {
    const storageInterface = storage.specifications?.interface;
    const supportedInterfaces = motherboard.specifications?.supported_storage_interfaces;

    if (!storageInterface || !Array.isArray(supportedInterfaces)) {
      checks.push({
        rule: 'storage_mobo_interface',
        title: 'Interface Storage & Motherboard',
        status: 'warning',
        message: 'Data interface media penyimpanan atau slot motherboard belum tersedia lengkap.',
      });
      hasWarning = true;
    } else {
      // Check interface match
      const isInterfaceSupported = supportedInterfaces.some(sup => {
        if (storageInterface.includes('NVMe') && sup.includes('NVMe')) return true;
        if (storageInterface.includes('SATA') && sup.includes('SATA')) return true;
        return false;
      });

      if (isInterfaceSupported) {
        checks.push({
          rule: 'storage_mobo_interface',
          title: 'Interface Storage & Motherboard',
          status: 'compatible',
          message: `Kompatibel: Motherboard memiliki slot pendukung interface ${storageInterface} (${storage.name}).`,
        });
      } else {
        checks.push({
          rule: 'storage_mobo_interface',
          title: 'Interface Storage & Motherboard',
          status: 'incompatible',
          message: `Tidak Kompatibel: Media penyimpanan menggunakan interface ${storageInterface}, namun motherboard hanya mendukung: ${supportedInterfaces.join(', ')}.`,
        });
        hasIncompatible = true;
      }
    }
  }

  // Overall Status
  let overallStatus = 'compatible';
  if (hasIncompatible) {
    overallStatus = 'incompatible';
  } else if (hasWarning) {
    overallStatus = 'warning';
  }

  return {
    status: overallStatus,
    checks,
  };
}

module.exports = {
  checkCompatibility,
};
