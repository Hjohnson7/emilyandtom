import React from 'react';
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Box,
  Button,
  Drawer,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import styled from 'styled-components';
import { useTheme } from 'styled-components';
import useBreakpoint from '../../hooks/useBreakPoints';

const Logo = styled(Typography)`
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-weight: bold;
  font-size: 1.5rem;
  color: ${({ theme }) => theme.colors.text};
  flex-grow: 1;
`;

const NavButton = styled(Button)`
  color: ${({ theme }) => theme.colors.text};
  text-transform: none;
  margin-left: ${({ theme }) => theme.spacing.md};
`;

const NavBar = () => {
  const theme = useTheme();
  const [openDrawer, setOpenDrawer] = React.useState(false);
  const breakpoint = useBreakpoint();
  const isMobile = breakpoint === 'xs'

  const handleDrawerToggle = () => {
    setOpenDrawer(!openDrawer);
  };

  const navLinks = ['FAQs', 'Travel', 'Accommodation', 'About'];

  return (
    <>
      <AppBar position="sticky" sx={{ background: theme.colors.backgroundDarker, boxShadow: theme.shadows.medium }}>
        <Toolbar>
          {isMobile && (
            <IconButton edge="start" color="inherit" onClick={handleDrawerToggle} aria-label="menu">
              <MenuIcon />
            </IconButton>
          )}

          <Logo theme={theme}>Emily & Tom</Logo>

          {!isMobile && (
            <Box sx={{ display: 'flex', flexGrow: 1 }}>
              {navLinks.map((link) => (
                <NavButton key={link} theme={theme}>{link}</NavButton>
              ))}
            </Box>
          )}

          <IconButton color="inherit" edge="end">
            <AccountCircleIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Drawer anchor="left" open={openDrawer} onClose={handleDrawerToggle}>
        <List sx={{ width: 250 }}>
          {navLinks.map((text) => (
            <ListItem button key={text} onClick={handleDrawerToggle}>
              <ListItemText primary={text} />
            </ListItem>
          ))}
        </List>
      </Drawer>
    </>
  );
};

export default NavBar;
