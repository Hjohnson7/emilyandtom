// components/AnimatedImage.js
import React from 'react';
import styled, { keyframes, css } from 'styled-components';
import PropTypes from 'prop-types';

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const ImageWrapper = styled.div`
  width: ${({ width }) => width || '420px'};
  height: ${({ height }) => height || '380px'};
  border-radius: 20% / 15%;
  background-color: ${({ theme }) => theme.colors.secondary || '#f0f0da'};
  overflow: hidden;
  display: inline-block;
  margin: 0;
`;

const StyledImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0;

  ${({ visible, delay }) =>
    visible &&
    css`
      animation: ${fadeIn} 1.5s ease-out ${delay}s forwards;
    `}
`;

const AnimatedImage = ({ src, alt, delay = 0, width, height, visible }) => (
  <ImageWrapper width={width} height={height}>
    <StyledImage src={src} alt={alt} delay={delay} visible={visible} />
  </ImageWrapper>
);

AnimatedImage.propTypes = {
  src: PropTypes.string.isRequired,
  alt: PropTypes.string.isRequired,
  delay: PropTypes.number,
  width: PropTypes.string,
  height: PropTypes.string,
  visible: PropTypes.bool,
};

export default AnimatedImage;
