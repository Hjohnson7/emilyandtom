export const lightTheme = {
    zIndex: {
      modal: 1300,
      drawer: 1200,
      appBar: 1100,
      snackbar: 1400,
      tooltip: 1500,
    },
    colors: {
      primary: '#FADADD',        // Soft pink
      secondary: '#FFF5F5',      // Blush white
      accent: '#FFD1DC',         // Light rose
      gold: '#D4AF37',           // Subtle gold
      backgroundMain: '#698A65',     // Green
      backgroundLighter: '#EAE4CC',     // Yellowy
      backgroundDarker: '#3E513C',  // Dark Green
      text: '#FFFFFF',           // white
      muted: '#AAAAAA',          // Light gray
      black: 'black',
      faqs: '#F3DBB9',
    },
    typography: {
      fontFamily: "'Playfair Display', serif",
      bodyFont: "'Open Sans', sans-serif",
      serif: "'Playfair Display', serif",
      script: "'Great Vibes', cursive", // Or any other elegant script you prefer
      fontSizes: {
        small: 'clamp(0.85rem, 1vw, 0.95rem)',
        medium: 'clamp(1rem, 1.2vw, 1.1rem)',
        large: 'clamp(1.25rem, 2vw, 1.5rem)',
        xlarge: 'clamp(1.75rem, 3vw, 2.25rem)',
      },
    },
    spacing: {
      xs: '0.25rem',   // 4px
      sm: '0.5rem',    // 8px
      md: '1rem',      // 16px
      lg: '1.5rem',    // 24px
      xl: '2rem',      // 32px
      xxl: '3rem',     // 48px (for mobile section padding/margin)
      xxxl: '5rem'
    },
    borders: {
      radius: '8px',
      radiuslg: '16px'
    },
    radius: {
      md: '4px'
    },
    shadows: {
      subtle: '0 2px 4px rgba(0, 0, 0, 0.05)',
      medium: '0 4px 8px rgba(0, 0, 0, 0.1)',
    },
    transitions: {
      default: 'all 0.3s ease-in-out',
    },
  };
  
  export const darkTheme = {
    ...lightTheme,
    colors: {
      primary: '#FFB6C1',
      secondary: '#2C2C2C',
      accent: '#FFC0CB',
      gold: '#FFD700',
      background: '#1E1E1E',
      text: '#FAFAFA',
      muted: '#BBBBBB',
    },
    shadows: {
      subtle: '0 1px 4px rgba(255, 255, 255, 0.05)',
      medium: '0 3px 10px rgba(255, 255, 255, 0.1)',
    },
  };



  // #698A65  - Green
// #EAE4CC - yellowy white
// #3E513C - Dark Green
// #F3DBB9 - text color