/**
 * 🔥 SERVICIO DE GESTIÓN DE IMPRESORAS BLUETOOTH
 * 
 * Este servicio maneja:
 * - Descubrimiento de dispositivos Bluetooth emparejados
 * - Identificación única por MAC address
 * - Conexión/desconexión selective
 * - Envío de comandos ESC/POS
 * - Gestión de errores robusto
 */

declare const window: any;

export interface BluetoothPrinter {
  id: string;           // MAC address única
  name: string;         // Nombre del dispositivo
  address: string;      // Dirección MAC (mismo que id)
  class: number;        // Clase de dispositivo (1664 = impresora térmica)
  isPaired: boolean;    // Está emparejada
  signalStrength?: number;
}

export interface PrinterConfig {
  cajaId?: string;      // MAC de impresora de caja
  cajaName?: string;
  cocinaId?: string;    // MAC de impresora de cocina
  cocinaName?: string;
  lastUsed?: string;    // Última usada
}

class BluetoothPrinterService {
  private static isInitialized = false;
  private static cachedPrinters: BluetoothPrinter[] = [];

  /**
   * Verificar si Bluetooth está disponible y habilitado
   */
  static async isBluetoothAvailable(): Promise<boolean> {
    if (!window.bluetoothSerial) {
      console.warn('⚠️ Bluetooth Serial no disponible');
      return false;
    }
    
    return new Promise((resolve) => {
      window.bluetoothSerial.isEnabled(
        () => resolve(true),
        () => resolve(false)
      );
    });
  }

  /**
   * Habilitar Bluetooth (abre UI nativa del sistema)
   */
  static async enableBluetooth(): Promise<boolean> {
    return new Promise((resolve) => {
      if (!window.bluetoothSerial) {
        resolve(false);
        return;
      }
      
      window.bluetoothSerial.enable(
        () => {
          console.log('✅ Bluetooth habilitado');
          resolve(true);
        },
        () => {
          console.warn('⚠️ Usuario rechazó habilitar Bluetooth');
          resolve(false);
        }
      );
    });
  }

  /**
   * Escanear y obtener lista de dispositivos Bluetooth EMPAREJADOS
   * (No hace descubrimiento activo, solo lista los que ya están paired)
   */
  static async scanPairedPrinters(): Promise<BluetoothPrinter[]> {
    return new Promise((resolve) => {
      if (!window.bluetoothSerial) {
        console.error('❌ Bluetooth Serial no disponible');
        resolve([]);
        return;
      }

      window.bluetoothSerial.list(
        (devices: any[]) => {
          console.log(`[BT] Dispositivos encontrados: ${devices.length}`);
          
          // Filtrar solo dispositivos que parecen impresoras
          const printers: BluetoothPrinter[] = devices
            .filter((device: any) => {
              const isPrinter = 
                device.name?.toLowerCase().includes('printer') ||
                device.name?.toLowerCase().includes('pos') ||
                device.name?.toLowerCase().includes('nextep') ||  // Tu marca específica
                device.name?.toLowerCase().includes('mpt') ||
                device.name?.toLowerCase().includes('mp235') ||
                device.class === 1664; // Clase de impresora térmica
              
              return isPrinter;
            })
            .map((device: any) => ({
              id: device.address,           // MAC address es el ID único
              name: device.name || 'Desconocida',
              address: device.address,
              class: device.class || 0,
              isPaired: true,
              signalStrength: device.rssi,
            }));

          this.cachedPrinters = printers;
          console.log(`[BT] Impresoras detectadas: ${printers.length}`);
          printers.forEach((p, i) => {
            console.log(`  ${i + 1}. ${p.name} (${p.address})`);
          });

          resolve(printers);
        },
        (err: any) => {
          console.error('❌ Error al escanear impresoras:', err);
          resolve([]);
        }
      );
    });
  }

  /**
   * Obtener dispositivos cacheados (últimos escaneo)
   */
  static getCachedPrinters(): BluetoothPrinter[] {
    return this.cachedPrinters;
  }

  /**
   * Conectar a una impresora específica por MAC address
   */
  static async connectToPrinter(macAddress: string): Promise<boolean> {
    return new Promise((resolve) => {
      if (!window.bluetoothSerial) {
        console.error('❌ Bluetooth Serial no disponible');
        resolve(false);
        return;
      }

      console.log(`[BT] Intentando conectar a ${macAddress}...`);

      window.bluetoothSerial.connect(
        macAddress,
        () => {
          console.log(`✅ Conectado a ${macAddress}`);
          resolve(true);
        },
        (err: any) => {
          console.error(`❌ Error conectando a ${macAddress}:`, err);
          resolve(false);
        }
      );
    });
  }

  /**
   * Desconectar de la impresora actual
   */
  static async disconnectPrinter(): Promise<boolean> {
    return new Promise((resolve) => {
      if (!window.bluetoothSerial) {
        resolve(false);
        return;
      }

      window.bluetoothSerial.disconnect(
        () => {
          console.log('📴 Desconectado de impresora');
          resolve(true);
        },
        (err: any) => {
          console.error('⚠️ Error desconectando:', err);
          resolve(true); // Ignorar errores de desconexión
        }
      );
    });
  }

  /**
   * Enviar texto (comandos ESC/POS) a impresora
   * Asume conexión ya establecida
   */
  private static async sendRawData(data: string): Promise<boolean> {
    return new Promise((resolve) => {
      if (!window.bluetoothSerial) {
        console.error('❌ Bluetooth Serial no disponible');
        resolve(false);
        return;
      }

      window.bluetoothSerial.write(
        data,
        () => {
          console.log('✅ Datos enviados exitosamente');
          resolve(true);
        },
        (err: any) => {
          console.error('❌ Error al enviar datos:', err);
          resolve(false);
        }
      );
    });
  }

  /**
   * Flujo completo: Conectar → Enviar → Desconectar
   */
  static async sendToPrinter(macAddress: string, ticketData: string): Promise<boolean> {
    try {
      // 1. Verificar Bluetooth
      const btAvailable = await this.isBluetoothAvailable();
      if (!btAvailable) {
        console.warn('⚠️ Bluetooth no disponible, intentando habilitar...');
        const enabled = await this.enableBluetooth();
        if (!enabled) {
          alert('❌ Bluetooth no disponible');
          return false;
        }
      }

      // 2. Conectar
      const connected = await this.connectToPrinter(macAddress);
      if (!connected) {
        alert(`❌ No se pudo conectar a la impresora (${macAddress})`);
        return false;
      }

      // 3. Pequeño delay para asegurar estabilidad de conexión
      await new Promise(resolve => setTimeout(resolve, 500));

      // 4. Enviar datos
      const sent = await this.sendRawData(ticketData);

      // 5. Pequeño delay antes de desconectar
      await new Promise(resolve => setTimeout(resolve, 500));

      // 6. Desconectar
      await this.disconnectPrinter();

      return sent;
    } catch (error) {
      console.error('❌ Error en flujo de impresión:', error);
      await this.disconnectPrinter();
      return false;
    }
  }

  /**
   * Buscar impresora por nombre parcial
   */
  static findPrinterByName(searchTerm: string): BluetoothPrinter | null {
    return this.cachedPrinters.find(p =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase())
    ) || null;
  }

  /**
   * Buscar impresora por MAC address
   */
  static findPrinterById(macAddress: string): BluetoothPrinter | null {
    return this.cachedPrinters.find(p => p.address === macAddress) || null;
  }
}

export default BluetoothPrinterService;
