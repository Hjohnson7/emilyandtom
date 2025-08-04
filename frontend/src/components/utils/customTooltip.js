import React, { useState, useRef } from 'react';
import { ClickAwayListener, IconButton, Popper, Paper, useMediaQuery } from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { styled, useTheme } from 'styled-components';

const StyledTooltipContent = styled(Paper)`
  padding: ${({ theme }) => theme.spacing.sm};
  background-color: ${({ theme }) => theme.colors.backgroundDarker};
  color: ${({ theme }) => theme.colors.white};
  font-size: 0.875rem;
  max-width: 250px;
  a {
    color: ${({ theme }) => theme.colors.white};
    text-decoration: underline;
  }
`;

const TooltipInfo = ({ message, linkText, linkUrl }) => {
  const theme = useTheme();
  const isTouch = useMediaQuery('(hover: none)');
  const [open, setOpen] = useState(false);
  const anchorRef = useRef(null);

  const handleToggle = () => {
    setOpen((prev) => !prev);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <ClickAwayListener onClickAway={handleClose}>
      <span>
        <IconButton
          ref={anchorRef}
          size="small"
          onClick={handleToggle}
          onMouseEnter={!isTouch ? () => setOpen(true) : undefined}
        //   onMouseLeave={!isTouch ? () => setOpen(false) : undefined}
          sx={{
            padding: 0.5,
            color: theme.colors.white,
            backgroundColor: theme.colors.white
          }}
        >
          <InfoOutlinedIcon fontSize="small" />
        </IconButton>

        <Popper
          open={open}
          anchorEl={anchorRef.current}
          placement="top"
          disablePortal
          modifiers={[{ name: 'offset', options: { offset: [0, 8] } }]}
        >
          <StyledTooltipContent elevation={3}>
            {message}
            <br />
            <a href={linkUrl} target="_blank" rel="noopener noreferrer">{linkText}</a>
          </StyledTooltipContent>
        </Popper>
      </span>
    </ClickAwayListener>
  );
};

export default TooltipInfo;
