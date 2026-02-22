import { DefaultTheme } from 'react-native-paper'
const customFonts = {
  'open-sans-light': require('../assets/fonts/OpenSans-Light.ttf'),
};

export const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    text: '#000000',
    primary: '#cf694b',
    secondary: '#9aaab7',
    ter : '#cf694b',
    cuarto : '#376573',
    white : '#fff',
    error: '#f13a59',
    header:'#376573',
  },
  fonts: {
    ...DefaultTheme.fonts,
    light: 'open-sans-light', // Usa el nombre definido en customFonts
  },
}
