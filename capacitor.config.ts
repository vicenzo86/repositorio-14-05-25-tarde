
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.737dbe0c822146dd95750a8ac92d566f',
  appName: 'Constru-Leads',
  webDir: 'dist',
  server: {
    url: 'https://737dbe0c-8221-46dd-9575-0a8ac92d566f.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: "#FFFFFF",
      androidScaleType: "CENTER_CROP",
      showSpinner: true,
      spinnerColor: "#3B82F6"
    }
  }
};

export default config;
