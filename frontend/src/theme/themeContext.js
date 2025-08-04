import React, { createContext, useContext, useState } from 'react';
import { ThemeProvider as StyledProvider } from 'styled-components';
import { ThemeProvider as MuiProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { lightTheme, darkTheme } from './theme';

const ThemeToggleContext = createContext();

export const useThemeToggle = () => useContext(ThemeToggleContext);

export const ThemeProvider = ({ children }) => {
  const [mode, setMode] = useState('light');

  const isDark = mode === 'dark';
  const styledTheme = isDark ? darkTheme : lightTheme;

  const muiTheme = createTheme({
    palette: {
      mode,
      primary: {
        main: styledTheme.colors.primary,
      },
      secondary: {
        main: styledTheme.colors.secondary,
      },
      background: {
        default: styledTheme.colors.background,
        paper: styledTheme.colors.card,
      },
      text: {
        primary: styledTheme.colors.text,
      },
    },
    typography: {
      fontFamily: styledTheme.typography.fontFamily,
    },
    components: {
      MuiSnackbarContent: {
        styleOverrides: {
          root: {
            '&.notistack-SnackbarContent': {
              // optional global override
            },
            '&.SnackbarItem-variantInfo': {
              backgroundColor: styledTheme.colors.backgroundMain,
              color: styledTheme.colors.text,
            },
            '&.SnackbarItem-variantSuccess': {
              backgroundColor: styledTheme.colors.backgroundMain || '#4caf50',
            },
            '&.SnackbarItem-variantError': {
              backgroundColor: styledTheme.colors.error || '#f44336',
            },
            '&.SnackbarItem-variantWarning': {
              backgroundColor: styledTheme.colors.warning || '#ff9800',
            },
          },
        },
      },
    },
  });

  const toggleTheme = () => setMode(isDark ? 'light' : 'dark');

  return (
    <ThemeToggleContext.Provider value={{ mode, toggleTheme }}>
      <MuiProvider theme={muiTheme}>
        <StyledProvider theme={styledTheme}>
          <CssBaseline />
          {children}
        </StyledProvider>
      </MuiProvider>
    </ThemeToggleContext.Provider>
  );
};