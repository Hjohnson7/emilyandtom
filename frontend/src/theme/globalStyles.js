import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  *, *::before, *::after {
    box-sizing: border-box;
  }

  html, body {
    height: 100%;
    scroll-behavior: smooth;
  }

  #main {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
  }

  body {
    margin: 0;
    padding: 0;
    font-family: ${({ theme }) => theme.typography.bodyFont};
    background-color: ${({ theme }) => theme.colors.backgroundMain};
    color: ${({ theme }) => theme.colors.text};
    transition: ${({ theme }) => theme.transitions.default};
    line-height: 1.6;
    font-size: 16px;

    @media (max-width: 768px) {
      font-size: 15px;
      padding-bottom: 60px;
    }

    @media (max-width: 480px) {
      font-size: 14px;
    }
  }

  .inner {
    background: ${({ theme }) => theme.colors.background};
    color: ${({ theme }) => theme.colors.text};
    
  }

  h1, h2, h3, h4, h5, h6 {
    font-family: ${({ theme }) => theme.typography.fontFamily};
    margin: 0 0 0.5em;
    line-height: 1.2;
  }

  h1 {
    font-size: clamp(2rem, 5vw, 3rem);
  }

  h2 {
    font-size: clamp(1.75rem, 4.5vw, 2.5rem);
  }

  h3 {
    font-size: clamp(1.5rem, 4vw, 2rem);
  }

  a {
    color: ${({ theme }) => theme.colors.text};
    text-decoration: none;
    transition: ${({ theme }) => theme.transitions.default};

    &:hover {
      color: ${({ theme }) => theme.colors.text};
    }
  }

  button {
    font-family: ${({ theme }) => theme.typography.bodyFont};
    font-size: 1rem;
    padding: 0.5rem 1rem;
    cursor: pointer;

    @media (max-width: 480px) {
      font-size: 0.95rem;
      padding: 0.4rem 0.8rem;
    }
  }

  // MUI input and select styling
  .MuiOutlinedInput-notchedOutline {
    border-color: ${({ theme }) => theme.colors.text};
  }

  .Mui-focused .MuiOutlinedInput-notchedOutline {
    border-color: ${({ theme }) => theme.colors.text};
  }

  .MuiPaper-root, 
  .MuiPickersDay-root {
    background-color: #fff;
  }

  .MuiMenu-paper {
    max-height: 240px;
    overflow-y: auto;
    background-color: ${({ theme }) => theme.colors.secondary};
    color: ${({ theme }) => theme.colors.text};
    border-radius: ${({ theme }) => theme.borders.radius};
    box-shadow: ${({ theme }) => theme.shadows.medium};
  }

  .MuiListSubheader-root {
    background-color: ${({ theme }) => theme.colors.secondary} !important;
    color: ${({ theme }) => theme.colors.text} !important;
    font-weight: bold;
    font-size: ${({ theme }) => theme.typography.fontSizes.medium};
  }

  .MuiMenuItem-root {
    font-family: ${({ theme }) => theme.typography.bodyFont};
    font-size: ${({ theme }) => theme.typography.fontSizes.medium};
    padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  }

  .MuiSelect-icon {
    color: ${({ theme }) => theme.colors.text};
  }

`;

export default GlobalStyle;