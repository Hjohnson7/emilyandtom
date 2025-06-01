import { Box } from "@mui/material";
import styled, {css, keyframes} from "styled-components";

export const AnimatedBox = styled(Box)`
  opacity: 0;
  transition: opacity 0.3s ease-out;

  &.visible {
    opacity: 1;
    ${({ animation }) => css`
      animation: ${animation} 1s ease-out forwards;
    `}
  }
`;


export const fadeInUp = keyframes`
  0% { opacity: 0; transform: translateY(40px); }
  100% { opacity: 1; transform: translateY(0); }
`;
