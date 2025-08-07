import React from 'react';
import PropTypes from 'prop-types';
import {
    Card,
    Grid,
    Stack,
    CardActionArea,
    CardContent,
    Typography,
    CardHeader,
    Chip,
    Box
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import FamilyRestroomIcon from '@mui/icons-material/FamilyRestroom';
import HotelIcon from '@mui/icons-material/Hotel';
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import CakeIcon from '@mui/icons-material/Cake';
import styled, { useTheme } from 'styled-components';

const DUMMMY = [1, 2]

const test = {
    email: 'alice@example.com',
    full_name: 'Alice Smith',
    rsvped: true,
    coming: true,
    rsvps: [
        {
            name: 'Alice Smith',
            arrival_day: 'FRI',
            food_selection: 'vegetarian',
            allergies: ['Peanuts'],
            room: { id: 2, name: 'Blue Suite' },
            message: 'Can’t wait!',
            coming: true,
            rsvped: true,
        },
    ],
    partner: {
        name: 'Bob Smith',
        rsvped: true,
        coming: true,
        rsvp: {
            name: 'Bob Smith',
            arrival_day: 'SAT',
            food_selection: 'standard',
            allergies: [],
            room: null,
            message: '',
            coming: true,
            rsvped: true,
        },
    },
    children: [
        {
            name: 'Charlie',
            age: 5,
            rsvped: false,
            coming: false,
            rsvp: null,
        },
    ],
}


const InviteeCard = ({ userDetails = test }) => {

    const theme = useTheme()

    const displayRSVP = (rsvp, notAttending = false) => {
        return (
            <CardContent sx={{ width: '80%' }}>
                <Typography variant='h6'>
                    {notAttending ? 'Not attending' : 'RSVP'}
                </Typography>
                {rsvp && (
                    <Grid sx={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }}>
                        <Typography sx={{ minWidth: '33%' }}>
                            <HotelIcon /> Arrival Day: {rsvp.arrival_day === 'FRI' ? 'Friday' : 'Saturday'}
                        </Typography>
                        {rsvp.arrival_day === 'FRI' && (
                            <Typography sx={{ minWidth: '33%' }}>
                                <HotelIcon /> Purchasing Food: {rsvp.purchasing_food ? 'Yes' : 'No'}
                            </Typography>
                        )}
                        <Typography sx={{ minWidth: '33%' }}>
                            <HotelIcon /> Accomodation: {rsvp.room}
                        </Typography>
                        <Typography sx={{ minWidth: '33%' }}>
                            <MusicNoteIcon />Song: {rsvp.favourite_song}
                        </Typography>
                        <Typography sx={{ minWidth: '33%' }}>
                            <MusicNoteIcon />Message: {rsvp.message}
                        </Typography>
                        <Typography sx={{ minWidth: '33%' }}>
                            <RestaurantMenuIcon />Dietry Requirements: {rsvp.food_selection}
                        </Typography>
                        <Typography sx={{ minWidth: '33%' }}>
                            <RestaurantMenuIcon />Allergies: {rsvp.allergies?.map(alg => `${alg.name}, `)}
                        </Typography>

                    </Grid>
                )}
            </CardContent>
        )
    }

    const displayAddGuest = (guest, child = false) => {
        return (
            <>{(child && guest.age < 6) ? <></> :
                (
                    <Card sx={{ marginLeft: theme.spacing.xxl, backgroundColor: theme.colors.backgroundMain, marginBottom: theme.spacing.sm, borderRadius: theme.borders.radius }}>
                        <Grid sx={{ display: 'flex', flexDirection: 'row' }}>
                            <CardContent sx={{ borderRight: 'dotted', margin: '5px' }}>
                                <Typography>
                                    <><PersonIcon />{guest.name}</>
                                </Typography>
                                <Typography>
                                    RSVP: <Chip size="small" label={guest.rsvped ? "rsvp'd" : "awaiting"} color={guest.rsvped ? "success" : 'warning'}></Chip>
                                </Typography>
                                <Typography>
                                    Coming: <Chip
                                        size="small"
                                        label={(guest.rsvped && guest.coming) ? "Attending" : (guest.rsvped && !guest.coming) ? "Not Attending" : 'awaiting'}
                                        color={(guest.rsvped && guest.coming) ? "success" : (guest.rsvped && !guest.coming) ? 'error' : 'warning'}></Chip>
                                </Typography>
                            </CardContent>
                            {displayRSVP(guest.rsvp, guest.rsvped && !guest.coming)}
                        </Grid>
                    </Card>
                )}
            </>
        )
    }

    const underEights = (children) => {
        console.log(children)
        if (children.length) {
            let underEights = children.filter((child) => child.age < 6)
            let underEightsComing = underEights.filter((child) => { return (child.rsvped && child.coming) })
            return underEights.length ? <Typography>{`Under 5s - (${underEightsComing.length}/${underEights.length})`}</Typography> : <></>
        } else {
            return <></>
        }
    }

    return (
        <Box>
            <Grid container spacing={2} sx={{ color: 'black', margin: `${theme.spacing.lg} 0` }}>
                <Card sx={{ backgroundColor: theme.colors.backgroundDarker, borderRadius: theme.borders.radius, padding: theme.spacing.md }}>
                    <Grid>
                        <Grid sx={{ display: 'flex', flexDirection: 'row', borderBottom: 'dotted', marginBottom: theme.spacing.md }}>
                            <CardContent sx={{ borderRight: 'dotted', margin: '5px', maxWidth: '50%' }}>
                                <Typography>
                                    <Grid sx={{ display: 'flex', flexDirection: 'column', flexWrap: 'wrap', marginBottom: theme.spacing.sm }}>
                                        <div><PersonIcon />{userDetails.fname} {userDetails.lname}</div>
                                        <Typography sx={{
                                            whiteSpace: 'normal',
                                            wordBreak: 'break-word',
                                            overflowWrap: 'break-word',
                                        }}>{userDetails.email}</Typography>
                                        {underEights(userDetails.children)}
                                    </Grid>
                                </Typography>
                                <Typography>
                                    RSVP: <Chip size="small" label={userDetails.rsvped ? "rsvp'd" : "awaiting"} color={userDetails.rsvped ? "success" : 'warning'}></Chip>
                                </Typography>
                                <Typography>
                                    Coming: <Chip
                                        size="small"
                                        label={(userDetails.rsvped && userDetails.coming) ? "Attending" : (userDetails.rsvped && !userDetails.coming) ? "Not Attending" : 'awaiting'}
                                        color={(userDetails.rsvped && userDetails.coming) ? "success" : (userDetails.rsvped && !userDetails.coming) ? 'error' : 'warning'}></Chip>
                                </Typography>
                            </CardContent>
                            {((userDetails.rsvped && userDetails.coming) && (userDetails?.rsvps[0])) ? displayRSVP(userDetails.rsvps[0]) : <Typography variant='h6'>Not Attending</Typography>}
                        </Grid>
                        {userDetails.partner && displayAddGuest(userDetails.partner)}
                        {userDetails.children && userDetails.children.map((child) => displayAddGuest(child, true))}
                    </Grid>
                </Card>
            </Grid>
        </Box>
    )
}

export default InviteeCard