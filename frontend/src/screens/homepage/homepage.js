// src/pages/HomePage.js
import React from 'react';
import styled, { ThemeProvider } from 'styled-components';
import { lightTheme } from '../../theme/theme'; // adjust the import path if needed
import WeddingBanner from '../../components/weddingBanner/weddingBanner';
import WeddingDetails from '../../components/weddingBanner/weddingDetails';
import ImageContainer from '../../components/home/imageContainer/imageContainer';
import WeddingOverview from '../../components/home/weddingOverview/weddingOverview';
import ScheduleOfEvents from '../../components/home/eventSchedule/eventSchedule';
import FaqSection from '../../components/home/faqs/faqs';

const Container = styled.div`
  max-width: 960px;
  margin: ${({ theme }) => theme.spacing.xxxl} auto;
  padding: 0 ${({ theme }) => theme.spacing.xxxl};
  @media (max-width: 900px) {
    padding: 0 ${({ theme }) => theme.spacing.sm};
  }

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
        <ScheduleOfEvents />
        <FaqSection />
    </ThemeProvider>
  );
};

export default HomePage;
