import React, { useEffect, useState } from 'react';
import axios from 'axios';
import SwipeableViews from 'react-swipeable-views';
import { MobileStepper, Button, Box, Typography, Container, Grid } from '@mui/material';
import RSVPForm from '../components/rsvpForm/rsvpForm';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/authContext';
import { useSnackbar } from 'notistack';


const RSVPPage = () => {
    const [rsvpData, setRsvpData] = useState(null);
    const [formData, setFormData] = useState({});
    const [completedForms, setCompletedForms] = useState([]);
    const [activeStep, setActiveStep] = useState(0);

    const { user } = useAuth()
    const navigate = useNavigate()
    const { enqueueSnackbar } = useSnackbar()

    useEffect(() => {
        if (!user) {
            enqueueSnackbar('You need to log in to rsvp to the wedding', { variant: 'warning' })
            navigate('/login')
        }
        axios.get('/api/invitations/get-invitation/').then(res => {
            setRsvpData(res.data);
        });
    }, [user])

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleCompleteForm = (index) => {
        if (!completedForms.includes(index)) {
            setCompletedForms((prev) => [...prev, index]);
        }
    };

    const handleNext = () => setActiveStep((prev) => Math.min(prev + 1, guests.length - 1));
    const handleBack = () => setActiveStep((prev) => Math.max(prev - 1, 0));

    const handleSubmitAll = () => {
        console.log('Submitting forms for', completedForms.length, 'guests');
        // Submit logic
    };

    if (!rsvpData) return <p>Loading...</p>;

    const guests = [];

    if (rsvpData.user?.name) guests.push({ ...rsvpData.user, role: 'user' });
    if (rsvpData.partner?.name) guests.push({ ...rsvpData.partner, role: 'partner' });
    if (Array.isArray(rsvpData.children)) {
        rsvpData.children.forEach((child, idx) =>
            guests.push({ ...child, role: 'child', id: idx })
        );
    }

    return (
        <Container maxWidth="sm" sx={{ mt: 4 }}>
            <Typography variant="h4" align="center" gutterBottom>
                RSVP
            </Typography>
            <Typography variant="subtitle1" align="center" gutterBottom>
                {`Guest ${activeStep + 1} of ${guests.length}`}
            </Typography>
            <Typography variant="h6" align="center" color="primary">
                {guests[activeStep].name}
            </Typography>

            <SwipeableViews index={activeStep} onChangeIndex={setActiveStep} enableMouseEvents>
                {guests.map((guest, index) => (
                    <Box key={index} sx={{ p: 2 }}>
                        <RSVPForm
                            guest={guest}
                            index={index}
                            formData={formData}
                            handleChange={handleChange}
                        />
                        <Button
                            variant="outlined"
                            color={completedForms.includes(index) ? "success" : "primary"}
                            fullWidth
                            sx={{ mt: 2 }}
                            onClick={() => handleCompleteForm(index)}
                        >
                            {completedForms.includes(index)
                                ? "Invitation Complete ✓"
                                : "Mark Invitation as Complete"}
                        </Button>
                    </Box>
                ))}
            </SwipeableViews>

            <MobileStepper
                steps={guests.length}
                position="static"
                activeStep={activeStep}
                nextButton={
                    <Button size="small" onClick={handleNext} disabled={activeStep === guests.length - 1}>
                        Next
                    </Button>
                }
                backButton={
                    <Button size="small" onClick={handleBack} disabled={activeStep === 0}>
                        Back
                    </Button>
                }
            />

            <Grid container justifyContent="center" sx={{ mt: 4 }}>
                <Button
                    variant="contained"
                    color="secondary"
                    onClick={handleSubmitAll}
                    fullWidth
                >
                    Submit All RSVP Forms ({completedForms.length}/{guests.length})
                </Button>
            </Grid>
        </Container>
    );
};

export default RSVPPage;
