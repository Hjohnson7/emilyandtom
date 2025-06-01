// src/pages/HomePage.js
import React from 'react';
import styled, { ThemeProvider } from 'styled-components';
import { lightTheme } from '../../theme/theme'; // adjust the import path if needed
import WeddingBanner from '../../components/weddingBanner/weddingBanner';
import WeddingDetails from '../../components/weddingBanner/weddingDetails';
import ImageContainer from '../../components/home/imageContainer/imageContainer';
import WeddingOverview from '../../components/home/weddingOverview/weddingOverview';

const Container = styled.div`
  max-width: 960px;
  margin: ${({ theme }) => theme.spacing.xxxl} auto;
  padding: 0 ${({ theme }) => theme.spacing.xxxl};
`;


const HomePage = () => {
  return (
    <ThemeProvider theme={lightTheme}>
        <Container>
        <WeddingBanner />
        <WeddingDetails />
        </Container>
        <ImageContainer />
        <WeddingOverview />
    </ThemeProvider>
  );
};

export default HomePage;
