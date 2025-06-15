import React, { useState } from 'react';
import {
    AppBar,
    Box,
    Toolbar,
    Typography,
    IconButton,
    Drawer,
    List,
    ListItem,
    ListItemButton,
    ListItemText,
    useMediaQuery,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import styled, { useTheme } from 'styled-components';
import useBreakpoint from '../../hooks/useBreakPoints';

const drawerWidth = 240;

const PageContainer = styled(Box)`
    display: flex;
    background-color: ${({ theme }) => theme.colors.backgroundLighter};
    min-height: 100vh;
`;

const Content = styled(Box)`
    flex-grow: 1;
    padding: ${({ theme }) => theme.spacing.lg};
    background-color: ${({ theme }) => theme.colors.backgroundMain};
`;

const NavBar = styled(AppBar)`
    background-color: ${({ theme }) => theme.colors.backgroundDarker} !important;
    color: white;
`;

const DrawerContent = ({ pages, handleNavClick }) => (
    <Box sx={{ width: drawerWidth }}>
        <List>
            {pages.map((page) => (
                <ListItem key={page.label} disablePadding>
                    <ListItemButton onClick={() => handleNavClick(page.label)}>
                        <ListItemText primary={page.label} />
                    </ListItemButton>
                </ListItem>
            ))}
        </List>
    </Box>
);

const AdminContainer = () => {
    const theme = useTheme();
    const breakpoint = useBreakpoint()
    const isMdUp = breakpoint !== 'xs' && breakpoint !== 'sm'
    const [mobileOpen, setMobileOpen] = useState(true);
    const [selectedPage, setSelectedPage] = useState('Dashboard');

    const pages = [
        { label: 'Dashboard', component: <Typography>Welcome to the Admin Dashboard</Typography> },
        { label: 'Guests', component: <Typography>Guest List Management</Typography> },
        { label: 'Rooms', component: <Typography>Room Allocations</Typography> },
        { label: 'RSVPs', component: <Typography>RSVP Overview</Typography> },
        // Add more as needed
    ];

    const currentContent = pages.find(p => p.label === selectedPage)?.component;

    const handleDrawerToggle = () => setMobileOpen(!mobileOpen);
    const handleNavClick = (label) => {
        setSelectedPage(label);
        setMobileOpen(false);
    };

    return (
        <PageContainer>
            {/* <NavBar position="fixed">
                <Toolbar>
                    {!isMdUp && (
                        <IconButton
                            color="inherit"
                            edge="start"
                            onClick={handleDrawerToggle}
                            sx={{ mr: 2 }}
                        >
                            <MenuIcon />
                        </IconButton>
                    )}
                    <Typography variant="h6" noWrap>
                        Admin Panel — {selectedPage}
                    </Typography>
                </Toolbar>
            </NavBar> */}

            <Box component="nav" sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}>
                {/* Mobile Drawer */}
                {!isMdUp && (
                    <Drawer
                        variant="temporary"
                        open={mobileOpen}
                        onClose={handleDrawerToggle}
                        ModalProps={{ keepMounted: true }}
                        sx={{
                            '& .MuiDrawer-paper': {
                                width: drawerWidth,
                                height: 'calc(100vh - 64px)',  // Fit below NavBar
                                top: '64px',                   // Push below NavBar
                                backgroundColor: theme.colors.backgroundDarker,
                            },
                        }}
                    >
                        <DrawerContent pages={pages} handleNavClick={handleNavClick} />
                    </Drawer>
                )}

                {/* Desktop Drawer */}
                {isMdUp && (
                    <Drawer
                        variant="permanent"
                        sx={{
                            '& .MuiDrawer-paper': {
                                width: drawerWidth,
                                height: 'calc(100vh - 64px)', // Fit below NavBar
                                top: '64px',                  // Push below NavBar
                                backgroundColor: theme.colors.backgroundDarker,
                            },
                        }}
                        open
                    >
                        <DrawerContent pages={pages} handleNavClick={handleNavClick} />
                    </Drawer>
                )}
            </Box>

            <Content>
                {currentContent}
            </Content>
        </PageContainer>
    );
};

export default AdminContainer;