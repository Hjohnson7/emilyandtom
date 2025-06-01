// src/hooks/useBreakpoint.js
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

const useBreakpoint = () => {
  const theme = useTheme();

  const breakpoints = {
    xs: useMediaQuery(theme.breakpoints.only('xs')),
    sm: useMediaQuery(theme.breakpoints.only('sm')),
    md: useMediaQuery(theme.breakpoints.only('md')),
    lg: useMediaQuery(theme.breakpoints.only('lg')),
    xl: useMediaQuery(theme.breakpoints.only('xl')),
  };

  return (
    (breakpoints.xs && 'xs') ||
    (breakpoints.sm && 'sm') ||
    (breakpoints.md && 'md') ||
    (breakpoints.lg && 'lg') ||
    (breakpoints.xl && 'xl') ||
    null
  );
};

export default useBreakpoint;
