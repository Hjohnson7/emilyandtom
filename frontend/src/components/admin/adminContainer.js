import React, { useState, useEffect } from 'react';
import {
    AppBar,
    Box,
    Typography,
    Drawer,
    List,
    ListItem,
    ListItemButton,
    ListItemText,
    Button
} from '@mui/material';
import styled, { useTheme } from 'styled-components';
import useBreakpoint from '../../hooks/useBreakPoints';
import RSVPAdmin from './rsvp-admin';
import { useAuth } from '../../contexts/authContext';
import { useNavigate } from 'react-router-dom';
import WeddingUpdateForm from './update-guests';
import RSVPAnalyticsDashboard from './dashboardPage';
import UserDetails from './guestDetails';

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
    const [mobileOpen, setMobileOpen] = useState(false);
    const [selectedPage, setSelectedPage] = useState('Dashboard');
    const navigate = useNavigate()
    const { user } = useAuth()

    useEffect(() => {
        if(!user){
            navigate('/')
        }
    }, [user])


    const pages = [
        { label: 'Dashboard', component: <RSVPAnalyticsDashboard /> },
        { label: 'Guests', component: <UserDetails/> },
        { label: 'Send Updates', component: <WeddingUpdateForm /> },
        { label: 'Send RSVPs', component: <RSVPAdmin/> },
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
            {!isMdUp && <Button onClick={handleDrawerToggle}>Open Navigation</Button>}
                {currentContent}
            </Content>
        </PageContainer>
    );
};

export default AdminContainer;