import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.turestaurante.admin',
  appName: 'Administrador',
  webDir: 'dist',
  server: {
    allowNavigation: [
      'restaurante-backend-ys2q.onrender.com',
      'localhost',
      '127.0.0.1'
    ]
  },
  android: {
    allowMixedContent: true
  }
};

export default config;
