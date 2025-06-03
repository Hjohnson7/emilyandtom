import React from "react";
import styled from "styled-components";
import { Typography } from "@mui/material";
import { motion } from "framer-motion";
import { MapPin, Train, Car, Plane, Bus } from "lucide-react";
import useInView from "../../hooks/inViewHook";

const Container = styled(motion.section)`
  background-color: ${({ theme }) => theme.colors.backgroundMain};
  color: ${({ theme }) => theme.colors.text};
  padding: ${({ theme }) => theme.spacing.xxl};
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Heading = styled(motion.h2)`
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: ${({ theme }) => theme.typography.fontSizes.xlarge};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  text-align: center;
`;

const Section = styled(motion.div)`
  background-color: ${({ theme }) => theme.colors.backgroundLighter};
  color: ${({ theme }) => theme.colors.backgroundDarker};
  border-radius: ${({ theme }) => theme.borders.radiuslg};
  box-shadow: ${({ theme }) => theme.shadows.medium};
  padding: ${({ theme }) => theme.spacing.lg};
  margin-bottom: ${({ theme }) => theme.spacing.xxl};
  width: 100%;
  max-width: 960px;
`;

const Subheading = styled.h3`
  display: flex;
  align-items: center;
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: ${({ theme }) => theme.typography.fontSizes.large};
  margin-bottom: ${({ theme }) => theme.spacing.md};
  svg {
    margin-right: ${({ theme }) => theme.spacing.sm};
  }
`;

const MapFrame = styled.iframe`
  width: 100%;
  height: 400px;
  border: 0;
  border-radius: ${({ theme }) => theme.borders.radius};
  margin-top: ${({ theme }) => theme.spacing.md};
`;

const List = styled.ul`
  margin: 0;
  padding-left: ${({ theme }) => theme.spacing.md};
  li {
    margin-bottom: ${({ theme }) => theme.spacing.sm};
    line-height: 1.5;
  }
`;

// Section Reveal Wrapper
const AnimatedSection = ({ children }) => {
  const [ref, isVisible] = useInView({ threshold: 0.2 });

  return (
    <Section
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isVisible ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8 }}
    >
      {children}
    </Section>
  );
};

const WeddingTravelInfo = () => {
  return (
    <Container
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1 }}
    >
      <Heading>Getting to the Wedding</Heading>

      <AnimatedSection>
        <Subheading><MapPin size={20} /> Venue Address</Subheading>
        <Typography>Wysis Way, Plump Hill, Mitcheldean GL17 0HA</Typography>
        <MapFrame
          title="Venue Location"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2465.7161154276296!2d-2.5002748842325896!3d51.862445879699265!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4871f5cf7e3c5017%3A0x6b0890ad8e5973b6!2sPlump%20Hill%2C%20Mitcheldean%20GL17%200HA%2C%20UK!5e0!3m2!1sen!2suk!4v1680272377394!5m2!1sen!2suk"
          allowFullScreen=""
          loading="lazy"
        />
      </AnimatedSection>

      <AnimatedSection>
        <Subheading><Train size={20} /> By Train</Subheading>
        <List>
          <li>Lydney Station – approx. 9.7 miles</li>
          <li>Gloucester Station – approx. 11 miles</li>
          <li>Cam & Dursley Station – approx. 12 miles</li>
          <li>Stonehouse Station – approx. 12 miles</li>
        </List>
        <Typography variant="body2">
          From London: Train to Gloucester → Stagecoach Bus 33 to Mitcheldean.
        </Typography>
      </AnimatedSection>

      <AnimatedSection>
        <Subheading><Car size={20} /> By Car</Subheading>
        <List>
          <li><strong>From London:</strong> ~2h 20m via M4, A419, A417, A4136</li>
          <li><strong>From Bristol:</strong> ~1h via M5 to Gloucester then A4136</li>
          <li><strong>From Birmingham:</strong> ~1h 30m via M5 to Gloucester then A4136</li>
        </List>
        <Typography variant="body2">Parking available on-site.</Typography>
      </AnimatedSection>

      <AnimatedSection>
        <Subheading><Bus size={20} /> By Bus</Subheading>
        <List>
          <li>Stagecoach 33 (Gloucester to Mitcheldean)</li>
          <li>Bus 72 (Chepstow → Lydney → Cinderford → Mitcheldean)</li>
          <li>Stops: Dunstone Place (2 min walk), Mill End School (8 min walk)</li>
        </List>
      </AnimatedSection>

      <AnimatedSection>
        <Subheading><Plane size={20} /> By Air</Subheading>
        <List>
          <li>Bristol Airport (BRS) – ~34.6 miles</li>
          <li>Gloucestershire Airport (GLO) – ~15 miles</li>
          <li>Birmingham Airport (BHX) – ~52 miles</li>
        </List>
        <Typography variant="body2">
          From airport: taxi or transfer to Gloucester, then bus or taxi to the venue.
        </Typography>
      </AnimatedSection>
    </Container>
  );
};

export default WeddingTravelInfo;
