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
import { useNavigate } from 'react-router-dom';

const Logo = styled(Typography)`
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-weight: bold;
  font-size: 1.5rem;
  color: ${({ theme }) => theme.colors.text};
  flex-grow: 1;
`;

const LogoLink = styled(Typography)`
width: ${({ theme }) => theme.spacing.xxxl};
&:hover {
    cursor: pointer
  }
`

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

  const navigate = useNavigate()

  const handleDrawerToggle = () => {
    setOpenDrawer(!openDrawer);
  };

  const goToAdmin = () => {
    window.location.href = '/api/admin/';
}

const goTo = (ref) => {
    navigate(ref)
}

  const navLinks = [{name: 'FAQs', link: 'faqs'}, {name: 'Travel', link: 'travel'}, {name: 'Accommodation', link: 'accomodation'}, {name: 'About', link: 'about'}];

  return (
    <>
      <AppBar position="sticky" sx={{ background: theme.colors.backgroundDarker, boxShadow: theme.shadows.medium }}>
        <Toolbar>
          {isMobile && (
            <IconButton edge="start" color="inherit" onClick={handleDrawerToggle} aria-label="menu">
              <MenuIcon />
            </IconButton>
          )}

          <Logo theme={theme}> <LogoLink onClick={() => goTo('/')} >Emily & Tom</LogoLink></Logo>

          {!isMobile && (
            <Box sx={{ display: 'flex', flexGrow: 1 }}>
              {navLinks.map((link) => (
                <NavButton key={link.name} theme={theme} onClick={() => goTo(link.link)}>{link.name}</NavButton>
              ))}
            </Box>
          )}

          <IconButton color="inherit" edge="end" onClick={goToAdmin}>
            <AccountCircleIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Drawer anchor="left" open={openDrawer} onClose={handleDrawerToggle}>
        <List sx={{ width: 250 }}>
          {navLinks.map((text) => (
            <ListItem button key={text.name} onClick={handleDrawerToggle}>
              <ListItemText primary={text.name} />
            </ListItem>
          ))}
        </List>
      </Drawer>
    </>
  );
};

export default NavBar;
