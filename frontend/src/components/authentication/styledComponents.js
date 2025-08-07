// src/components/Auth/styles.js
import styled from 'styled-components';
import { Box, Button, Paper, TextField, Typography } from '@mui/material';

export const AuthWrapper = styled(Box)`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: ${({ theme }) => theme.spacing.md};
  background-color: ${({ theme }) => theme.colors.backgroundDarker};
`;

export const FormContainer = styled(Paper)`
  padding: ${({ theme }) => theme.spacing.xxxl};
  margin-top: ${({ theme }) => theme.spacing.xxxl};
  background-color: ${({ theme }) => theme.colors.backgroundDarker};
  border-radius: ${({ theme }) => theme.borderRadius};
  max-width: 500px;
  margin: auto;
`;

export const StyledTextField = styled(TextField)`
  margin-bottom: ${({ theme }) => theme.spacing.md} !important;
`;

export const StyledButton = styled(Button)`
  margin-top: ${({ theme }) => theme.spacing.md};
  font-weight: bold;
  text-transform: none;
`;

export const StyledSignUpText = styled(Typography)`
  margin-top: ${({ theme }) => theme.spacing.lg};
  padding-top: ${({ theme }) => theme.spacing.sm};
  margin-right: auto;
  justify-content: right;
  display: flex;
  &:hover {
    color: ${({ theme }) => theme.colors.accent};
    cursor: pointer;
  }
`