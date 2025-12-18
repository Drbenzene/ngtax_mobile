import * as Font from 'expo-font';
import { useEffect, useState } from 'react';

export const useFonts = () => {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    async function loadFonts() {
      try {
        await Font.loadAsync({
          'Inter-Regular': require('../../assets/fonts/Inter-Regular.otf'),
          'Inter-Medium': require('../../assets/fonts/Inter-Medium.otf'),
          'Inter-SemiBold': require('../../assets/fonts/Inter-SemiBold.otf'),
          'Inter-Bold': require('../../assets/fonts/Inter-Bold.otf'),
        });
        setFontsLoaded(true);
      } catch (error) {
        console.error('Error loading fonts:', error);
        setFontsLoaded(true); // Proceed anyway
      }
    }

    loadFonts();
  }, []);

  return fontsLoaded;
};
