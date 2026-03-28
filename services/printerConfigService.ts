/**
 * 💾 SERVICIO DE CONFIGURACIÓN DE IMPRESORAS
 * Gestiona la persistencia de dirección MAC de impresoras en localStorage
 */

export interface PrinterConfiguration {
  caja: {
    macAddress?: string;
    deviceName?: string;
    lastUsedAt?: number;
  };
  cocina: {
    macAddress?: string;
    deviceName?: string;
    lastUsedAt?: number;
  };
  general: {
    autoDetect: boolean;  // Intentar autodetectar nuevas impresoras
    confirmBeforePrint: boolean; // Mostrar modal de confirmación
  };
}

const STORAGE_KEY = 'pos_printer_config';

const DEFAULT_CONFIG: PrinterConfiguration = {
  caja: {},
  cocina: {},
  general: {
    autoDetect: true,
    confirmBeforePrint: false,
  },
};

class PrinterConfigService {
  /**
   * Obtener configuración actual
   */
  static getConfig(): PrinterConfiguration {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) return DEFAULT_CONFIG;
      return JSON.parse(stored);
    } catch (error) {
      console.error('Error al leer configuración de impresoras:', error);
      return DEFAULT_CONFIG;
    }
  }

  /**
   * Guardar configuración completa
   */
  static saveConfig(config: PrinterConfiguration): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
      console.log('✅ Configuración de impresoras guardada');
    } catch (error) {
      console.error('Error al guardar configuración:', error);
    }
  }

  /**
   * Asignar impresora de CAJA
   */
  static setPrinterCaja(macAddress: string, deviceName: string): void {
    const config = this.getConfig();
    config.caja = {
      macAddress,
      deviceName,
      lastUsedAt: Date.now(),
    };
    this.saveConfig(config);
    console.log(`✅ Impresora de Caja asignada: ${deviceName} (${macAddress})`);
  }

  /**
   * Asignar impresora de COCINA
   */
  static setPrinterCocina(macAddress: string, deviceName: string): void {
    const config = this.getConfig();
    config.cocina = {
      macAddress,
      deviceName,
      lastUsedAt: Date.now(),
    };
    this.saveConfig(config);
    console.log(`✅ Impresora de Cocina asignada: ${deviceName} (${macAddress})`);
  }

  /**
   * Obtener MAC address de impresora de CAJA
   */
  static getCajaPrinterMac(): string | null {
    const config = this.getConfig();
    return config.caja.macAddress || null;
  }

  /**
   * Obtener MAC address de impresora de COCINA
   */
  static getCocinaPrinterMac(): string | null {
    const config = this.getConfig();
    return config.cocina.macAddress || null;
  }

  /**
   * Obtener nombre dispositivo de CAJA
   */
  static getCajaPrinterName(): string | null {
    const config = this.getConfig();
    return config.caja.deviceName || null;
  }

  /**
   * Obtener nombre dispositivo de COCINA
   */
  static getCocinaPrinterName(): string | null {
    const config = this.getConfig();
    return config.cocina.deviceName || null;
  }

  /**
   * ¿Está configurada la impresora de Caja?
   */
  static isCajaConfigured(): boolean {
    const config = this.getConfig();
    return !!config.caja.macAddress;
  }

  /**
   * ¿Está configurada la impresora de Cocina?
   */
  static isCocinaConfigured(): boolean {
    const config = this.getConfig();
    return !!config.cocina.macAddress;
  }

  /**
   * Limpiar configuración de una impresora
   */
  static clearPrinter(type: 'caja' | 'cocina'): void {
    const config = this.getConfig();
    config[type] = {};
    this.saveConfig(config);
    console.log(`✅ Configuración de impresora de ${type} limpiada`);
  }

  /**
   * Limpiar toda configuración
   */
  static clearAll(): void {
    localStorage.removeItem(STORAGE_KEY);
    console.log('✅ Todas las configuraciones de impresoras fueron limpiadas');
  }

  /**
   * Obtener estado general de configuración (para debugging)
   */
  static getStatus(): object {
    const config = this.getConfig();
    return {
      cajaConfigured: this.isCajaConfigured(),
      cajaName: config.caja.deviceName,
      cajaMac: config.caja.macAddress,
      cocinaConfigured: this.isCocinaConfigured(),
      cocinaName: config.cocina.deviceName,
      cocinaMac: config.cocina.macAddress,
      autoDetect: config.general.autoDetect,
      confirmBeforePrint: config.general.confirmBeforePrint,
    };
  }
}

export default PrinterConfigService;
