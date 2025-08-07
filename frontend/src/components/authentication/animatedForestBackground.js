// src/components/AnimatedForestBackground.js
import React from 'react';
import { motion } from 'framer-motion';
import styled from 'styled-components';

const Background = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(to top, #2f4f4f, #556b2f);
  overflow: hidden;
  z-index: -1;
`;

const Tree = styled(motion.img)`
  position: absolute;

  bottom: 0;
  opacity: 0.8;

  @media (max-width: 600px) {
    width: 50px;
  }
`;

const AnimatedForestBackground = () => {
  const trees = [
    { src: '/static/frontend/images/tree.png', left: '10%' },
    { src: '/static/frontend/images/tree.png', left: '30%' },
    { src: '/static/frontend/images/tree.png', left: '60%' },
    { src: '/static/frontend/images/tree.png', left: '80%' },
  ];

  return (
    <Background>
      {trees.map((tree, i) => (
        <Tree
          key={i}
          src={tree.src}
          style={{ left: tree.left }}
          animate={{ rotate: [0, -2, 2, -1, 0] }}
          transition={{ repeat: Infinity, duration: 6 + i, ease: "easeInOut" }}
        />
      ))}
    </Background>
  );
};

export default AnimatedForestBackground;
