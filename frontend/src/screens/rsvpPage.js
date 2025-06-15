import React, { useEffect, useState } from 'react';
import axios from 'axios';
import SwipeableViews from 'react-swipeable-views';
import {
    MobileStepper,
    Button,
    Box,
    Typography,
    Grid,
} from '@mui/material';
import RSVPForm from '../components/rsvpForm/rsvpForm';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/authContext';
import { useSnackbar } from 'notistack';
import { KeyboardArrowLeft, KeyboardArrowRight } from '@mui/icons-material';
import styled, { useTheme } from 'styled-components';
import useBreakpoint from '../hooks/useBreakPoints';
import RSVPConfirmationDialog from '../components/rsvpForm/dialogPopup';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';

const PageContainer = styled(Box)`
    min-height: 100vh;
    background-color: ${({ theme }) => theme.colors.backgroundLighter};
`

const Container = styled(Box)`
    width: 80%;
    margin: auto;
    padding-top: ${({ theme }) => theme.spacing.lg}
    @media (max-width: 700px){
        width: 100%;
        padding-top: ${({ theme }) => theme.spacing.md};
  }
`

const TextDisplay = styled(Typography)`
    color: ${({ theme }) => theme.colors.backgroundMain};
`

const StepperContainer = styled.div`
  display: none;

  @media (min-width: 768px) {
    display: flex;
    justify-content: center;
    margin-top: ${({ theme }) => theme.spacing.lg};
  }
`;

const RSVPPage = () => {
    const [rsvpData, setRsvpData] = useState(null);
    const [formData, setFormData] = useState({});
    const [completedForms, setCompletedForms] = useState(0);
    const [activeStep, setActiveStep] = useState(0);
    const [roomsAvailable, setRoomsAvailable] = useState([])
    const [viewCompleted, setViewCompleted] = useState(false);
    const [openDialog, setOpenDialog] = useState(false);
    const [dialogContent, setDialogContent] = useState('');
    const [dataToSubmit, setDataToSubmit] = useState([]);
    const theme = useTheme()

    const { user } = useAuth()
    const navigate = useNavigate()
    const { enqueueSnackbar } = useSnackbar()
    const breakpoint = useBreakpoint()
    const isLarger = breakpoint !== 'xs'


    useEffect(() => {
        if (!user) {
            enqueueSnackbar('You need to log in to rsvp to the wedding', { variant: 'warning' })
            navigate('/login')
        }
        axios.get('/api/invitations/get-invitation/').then(res => {
            setRsvpData(res.data);
        });

        axios.get('api/invitations/get-rooms/').then(res => {
            setRoomsAvailable(res.data)
        })

    }, [user])

    const handleChange = (e, guest) => {
        const { name, value, type, checked } = e.target || {};
        const original = { ...formData };
        const curr = original[guest.name] ? { ...original[guest.name] } : {};

        const previousRoomId = name === 'accommodation' && curr.accommodation ? parseInt(curr.accommodation) : null;
        curr[name] = type === 'checkbox' ? checked : value;
        original[guest.name] = curr;

        if (name === 'accommodation') {
            const selectedRoomId = parseInt(value);
            const updatedRooms = roomsAvailable.map((room) => {
                const selected = [...room.selected];
                if (room.id === selectedRoomId) selected.push(1);
                if (room.id === previousRoomId && previousRoomId !== selectedRoomId) selected.pop();
                return { ...room, selected };
            });
            setRoomsAvailable(updatedRooms);
        }

        let completed = 0;
        for (const guest in original) {
            if (original[guest].submit === true) {
                completed++;
            }
        }
        console.log(name, value, type, checked)
        console.log(original)
        setFormData(original);
        setCompletedForms(completed);
    };

    const handleSubmitAll = () => {
        const formEntries = Object.entries(formData);
        const totalGuests = rsvpForms.length;

        const toSubmit = [];
        const partiallyCompleted = [];
        const skippedGuests = [];
        const notAttending = [];

        formEntries.forEach(([guestName, form]) => {
            if (form.notAttending === 'no' && form.submit) {
                toSubmit.push({ name: guestName, notAttending: true });
                notAttending.push(guestName);
                return;
            }

            if (form.submit) {
                toSubmit.push({ name: guestName, ...form });
            } else {
                const hasData = Object.entries(form).some(
                    ([key, value]) =>
                        key !== 'submit' && key !== 'notAttending' &&
                        value !== '' &&
                        value !== false &&
                        value !== null &&
                        value !== undefined
                );
                if (hasData) partiallyCompleted.push(guestName);
                else skippedGuests.push(guestName);
            }
        });

        if (toSubmit.length < totalGuests || partiallyCompleted.length > 0 || notAttending.length > 0) {
            let message = `You're submitting ${toSubmit.length} of ${totalGuests} forms.\n`;

            if (partiallyCompleted.length > 0) {
                message += `Partially completed: ${partiallyCompleted.join(', ')}.\n`;
            }
            if (notAttending.length > 0) {
                message += `Marked as not attending: ${notAttending.join(', ')}.\n`;
            }

            message += `Do you want to proceed?`;
            setDialogContent(message);
            setDataToSubmit(toSubmit);
            setOpenDialog(true);
            return;
        }

        submitToBackend(toSubmit);
    };

    const submitToBackend = async (toSubmit) => {
        try {
            await axios.post('/api/invitations/submit-rsvps/', toSubmit);
            enqueueSnackbar('RSVPs submitted successfully!', { variant: 'success' });
            // optionally redirect or refetch
        } catch (error) {
            enqueueSnackbar('There was an error submitting your RSVPs.', { variant: 'error' });
        }
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

    const rsvpForms = guests.filter((guest) => { return guest.rsvpd === false })
    const rsvpCompleted = guests.filter((guest) => { return guest.rsvpd === true })

    return (
        <PageContainer>
            <Container>
                <TextDisplay variant="h4" align="center" gutterBottom>
                    RSVP
                </TextDisplay>

                <Grid container justifyContent="center" sx={{ mb: 2 }}>
                    <Button
                        sx={{ backgroundColor: theme.colors.backgroundDarker }}
                        onClick={() => setViewCompleted(!viewCompleted)}
                    >
                        {viewCompleted ? 'View Incomplete Forms' : 'View Completed RSVPs'}
                    </Button>
                </Grid>

                {!viewCompleted ? (
                    <>
                        <TextDisplay variant="subtitle1" align="center" gutterBottom>
                            {`Guest ${activeStep + 1} of ${rsvpForms.length}`}
                        </TextDisplay>
                        <TextDisplay variant="h6" align="center">
                            {rsvpForms[activeStep]?.name}
                        </TextDisplay>

                        <SwipeableViews index={activeStep} onChangeIndex={setActiveStep} enableMouseEvents>
                            {rsvpForms.map((guest, index) => {
                                const guestData = formData[guest.name] || {};
                                return (
                                            <RSVPForm
                                                rooms={roomsAvailable}
                                                guest={guest}
                                                index={index}
                                                formData={guestData}
                                                handleChange={handleChange}
                                            />
                                );
                            })}
                        </SwipeableViews>

                        {isLarger && (
                            <StepperContainer>
                                <MobileStepper
                                    variant="dots"
                                    steps={rsvpForms.length}
                                    position="static"
                                    activeStep={activeStep}
                                    nextButton={
                                        <Button
                                            size="small"
                                            onClick={() => setActiveStep((prev) => prev + 1)}
                                            disabled={activeStep === rsvpForms.length - 1}
                                            sx={{ color: theme.colors.backgroundDarker }}
                                        >
                                            Next
                                            <KeyboardArrowRight />
                                        </Button>
                                    }
                                    backButton={
                                        <Button
                                            size="small"
                                            onClick={() => setActiveStep((prev) => prev - 1)}
                                            disabled={activeStep === 0}
                                            sx={{ color: theme.colors.backgroundDarker }}
                                        >
                                            <KeyboardArrowLeft />
                                            Back
                                        </Button>
                                    }
                                    sx={{
                                        backgroundColor: theme.colors.backgroundMain,
                                        maxWidth: 400,
                                        width: '100%',
                                        borderRadius: '12px',
                                        boxShadow: '0 0 6px rgba(0,0,0,0.1)',
                                    }}
                                />
                            </StepperContainer>
                        )}

                        <Grid container justifyContent="center" sx={{ mt: 4 }}>
                            <Button
                                variant="contained"
                                color="secondary"
                                onClick={handleSubmitAll}
                                fullWidth
                            >
                                Submit All RSVP Forms ({completedForms}/{rsvpForms.length})
                            </Button>
                        </Grid>
                    </>
                ) : (
                    <>
                        <TextDisplay variant="h6" align="center" gutterBottom>
                            Completed RSVPs
                        </TextDisplay>

                        {rsvpCompleted.length === 0 ? (
                            <Typography align="center" sx={{ mt: 4 }}>
                                No completed RSVPs yet.
                            </Typography>
                        ) : (
                            rsvpCompleted.map((guest, index) => {
                                const details = guest.details;

                                return (
                                    <Box
                                        key={index}
                                        sx={{
                                            p: 3,
                                            mb: 3,
                                            borderRadius: 3,
                                            backgroundColor: theme.colors.backgroundMain,
                                            boxShadow: '0 0 6px rgba(0,0,0,0.08)'
                                        }}
                                    >
                                        <Typography variant="h6" gutterBottom>
                                            {guest.name}
                                        </Typography>

                                        <Grid container spacing={1}>
                                            <Grid item xs={6}>
                                                <Typography variant="body2"><strong>Arrival Day:</strong> {details.arrival_day}</Typography>
                                            </Grid>

                                            <Grid item xs={6}>
                                                <Typography variant="body2"><strong>Accommodation:</strong> {details.accommodation}</Typography>
                                            </Grid>
                                            <Grid item xs={6}>
                                                <Typography variant="body2"><strong>Food Preference:</strong> {details.food_selection}</Typography>
                                            </Grid>

                                            <Grid item xs={6}>
                                                <Typography variant="body2"><strong>Bringing Food:</strong> {details.bringing_food ? 'Yes' : 'No'}</Typography>
                                            </Grid>
                                            <Grid item xs={6}>
                                                <Typography variant="body2"><strong>Favourite Song:</strong> {details.favourite_song || '—'}</Typography>
                                            </Grid>

                                            <Grid item xs={12}>
                                                <Typography variant="body2">
                                                    <strong>Allergies:</strong>{' '}
                                                    {details.allergies && details.allergies.length > 0
                                                        ? details.allergies.join(', ')
                                                        : 'None'}
                                                </Typography>
                                            </Grid>

                                            {details.room && (
                                                <Grid item xs={12}>
                                                    <Typography variant="body2">
                                                        <strong>Room:</strong> {typeof details.room === 'object' && 'name' in details.room ? details.room.name : 'Assigned'}
                                                    </Typography>
                                                </Grid>
                                            )}
                                        </Grid>
                                    </Box>
                                );
                            })
                        )}
                    </>
                )}
            </Container>

            <RSVPConfirmationDialog
                open={openDialog}
                onClose={() => setOpenDialog(false)}
                onConfirm={() => {
                    setOpenDialog(false);
                    submitToBackend(dataToSubmit);
                }}
                content={dialogContent}
            />
        </PageContainer>
    );
}

export default RSVPPage;
