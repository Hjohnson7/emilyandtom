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
    Tooltip
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import styled, { useTheme } from 'styled-components';
import useBreakpoint from '../../hooks/useBreakPoints';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/authContext';
import LogoutIcon from '@mui/icons-material/Logout';
import BarChartIcon from '@mui/icons-material/BarChart';
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';

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
  color: ${({ theme }) => theme.colors.text} !important;
  text-transform: none;
  margin-left: ${({ theme }) => theme.spacing.md};
`;

const NavBar = () => {
    const theme = useTheme();
    const [openDrawer, setOpenDrawer] = React.useState(false);
    const breakpoint = useBreakpoint();
    const isMobile = breakpoint === 'xs'
    const { user, logout } = useAuth()

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

    const navLinks = [{ name: 'FAQs', link: 'faqs' }, { name: 'Travel', link: 'travel' }, { name: 'Accommodation', link: 'accomodation' }];

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
                            {user &&
                                <>
                                <NavButton key={'messageBoard'} theme={theme} onClick={() => goTo('message-board')}>Message Board</NavButton>
                                <NavButton key={'rsvp'} theme={theme} onClick={() => goTo('rsvp')}>RSVP</NavButton>
                                </>
                                
                            }
                        </Box>
                    )}
                    {user?.is_staff && (
                         <>
                         <Tooltip title="Manage"><IconButton color="inherit" onClick={() => navigate('admin-page')}>
                         <SupervisorAccountIcon />
                         </IconButton></Tooltip>
                         <Tooltip title="Admin"><IconButton color="inherit" onClick={goToAdmin}>
                         <AdminPanelSettingsIcon />
                         </IconButton></Tooltip>
                         </>
                    )}
                    {user ? (<Tooltip title="logout"><IconButton color="inherit" onClick={logout}>
                        <LogoutIcon />
                    </IconButton></Tooltip>) : <IconButton color="inherit" edge="end" onClick={() => goTo('login')}>
                        <AccountCircleIcon />
                    </IconButton>}
                </Toolbar>
            </AppBar>

            <Drawer anchor="left" open={openDrawer} onClose={handleDrawerToggle}>
                <List sx={{ width: 250, background: theme.colors.backgroundDarker, boxShadow: theme.shadows.medium, height: '100%' }} >
                    {navLinks.map((text) => (
                        <ListItem button key={text.name} onClick={handleDrawerToggle}>
                            <ListItemText primary={text.name} onClick={() => goTo(text.link)} />
                        </ListItem>
                    ))}

                    {user &&
                    <>
                    <ListItem button key={'message-board'} onClick={handleDrawerToggle}>
                            <ListItemText primary={'Message Board'} onClick={() => goTo('message-board')} />
                        </ListItem>
                        <ListItem button key={'rsvp'} onClick={handleDrawerToggle}>
                            <ListItemText primary={'rsvp'} onClick={() => goTo('rsvp')} />
                        </ListItem>
                    </>
                    }
                    {user?.is_staff && (
                         <>
                         <ListItem button key={'manage-wedding'} onClick={handleDrawerToggle}>
                            <AccountCircleIcon onClick={() => navigate('admin-page')}/> <ListItemText primary={'Message Board'} onClick={() => navigate('admin-page')} />
                             </ListItem>
                             <ListItem button key={'admin-page'} onClick={handleDrawerToggle}>
                             <SupervisorAccountIcon onClick={goToAdmin}/> <ListItemText primary={'rsvp'} onClick={goToAdmin} />
                             </ListItem>
                         </>
                    )}

                </List>
            </Drawer>
        </>
    );
};

export default NavBar;
