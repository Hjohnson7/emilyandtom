// src/components/WeddingBanner.js
import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const BannerWrapper = styled.section`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  position: relative;
  marginBottom: ${({ theme }) => theme.spacing.xxxl};
`;

const StyledText = styled(motion.div)`
  font-family: ${({ theme }) => theme.typography.fontFamily}
  color: ${({ theme }) => theme.colors.text};
  text-align: center;
`;

const Initials = styled(StyledText)`
  font-size: ${({ theme }) => theme.spacing.lg};
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const Names = styled(StyledText)`
  font-size: ${({ theme }) => theme.spacing.xxxl};
  font-weight: bold;
  line-height: 1.1;
`;

const Subtext = styled(StyledText)`
  font-family: 'Dancing Script', cursive;
  font-size: ${({ theme }) => theme.spacing.lg};
  margin-top: ${({ theme }) => theme.spacing.lg};
`;

const Image = styled(motion.img)`
  position: absolute;
  width: 100px;
  height: auto;

  @media (max-width: 600px) {
    width: 70px;
  }
`;

// Animations
const imageVariants = (x = 0, y = 0) => ({
  hidden: { opacity: 0, x, y },
  visible: { opacity: 1, x: 0, y: 0, transition: { duration: 1.2 } }
});

const textVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 1.5 } }
};

const WeddingBanner = () => {
  return (
    <BannerWrapper>
      {/* Images flying in */}
      <Image src="/static/frontend/images/van.PNG" alt="van" style={{ top: '23%', left: '18%' }} variants={imageVariants(-200, -50)} initial="hidden" animate="visible" />
      <Image src="/static/frontend/images/champagne.PNG" alt="champagne" style={{ top: '0%', left: '23%' }} variants={imageVariants(200, -100)} initial="hidden" animate="visible" />
      <Image src="/static/frontend/images/cake.PNG" alt="cake" style={{ bottom: '10%', left: '13%' }} variants={imageVariants(-200, 100)} initial="hidden" animate="visible" />
      <Image src="/static/frontend/images/bird.PNG" alt="bird" style={{ top: '0%', right: '23%' }} variants={imageVariants(200, -50)} initial="hidden" animate="visible" />
      <Image src="/static/frontend/images/mountains.PNG" alt="mountains" style={{ top: '30%', right: '18%' }} variants={imageVariants(200, 100)} initial="hidden" animate="visible" />
      <Image src="/static/frontend/images/cocktail.PNG" alt="cocktail" style={{ bottom: '10%', right: '13%' }} variants={imageVariants(100, 100)} initial="hidden" animate="visible" />

      {/* Main text block */}
      <motion.div variants={textVariants} initial="hidden" animate="visible">
        <Initials>T & E</Initials>
        <Names>TOM<br />& EMILY</Names>
        <Subtext>cordially invite you to their wedding</Subtext>
      </motion.div>
    </BannerWrapper>
  );
};

export default WeddingBanner;
