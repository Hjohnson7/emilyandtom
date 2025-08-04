import styled, { useTheme } from 'styled-components';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from '@mui/material';

// Styled components using your custom theme
const ThemedDialog = styled(Dialog)`
  .MuiPaper-root {
    background-color: ${({ theme }) => theme.colors.backgroundMain};
    color: ${({ theme }) => theme.colors.textPrimary || '#fff'};
    border-radius: 16px;
  }
`;

const ThemedDialogTitle = styled(DialogTitle)`
  font-weight: bold;
  color: ${({ theme }) => theme.colors.textPrimary || '#fff'};
`;

const ThemedDialogContentText = styled(DialogContentText)`
  color: ${({ theme }) => theme.colors.textSecondary || '#ddd'};
  white-space: pre-line;
`;

const RSVPConfirmationDialog = ({
  open,
  onClose,
  onConfirm,
  content,
  canSubmit
}) => {
  const theme = useTheme();

  return (
    <ThemedDialog
      open={open}
      onClose={onClose}
      aria-labelledby="submit-warning-dialog"
    >
      <ThemedDialogTitle id="submit-warning-dialog">
        {canSubmit ? 'Confirm Submission' : 'Incomplete Submission'}
      </ThemedDialogTitle>
      <DialogContent>
        <ThemedDialogContentText>{content}</ThemedDialogContentText>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={onClose}
          sx={{ color: theme.colors.backgroundLighter }}
        >
          {canSubmit ? 'Cancel' : 'Back'}
        </Button>
        {canSubmit && (
            <Button
            onClick={onConfirm}
            autoFocus
            sx={{
              backgroundColor: theme.colors.primary,
              color: theme.colors.backgroundMain,
              '&:hover': {
                backgroundColor: theme.colors.primaryDark,
              },
            }}
          >
            Submit
          </Button>
        )}
      </DialogActions>
    </ThemedDialog>
  );
};

export default RSVPConfirmationDialog;