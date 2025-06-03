import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  Grid,
  Divider,
} from '@mui/material';
import { useTheme } from 'styled-components';

// Dummy data for demonstration
const rooms = [
  {
    name: 'The Loquiers',
    capacity: 6,
    guests: ['John Doe', 'Jane Smith', 'Abbie Turner'],
  },
  {
    name: 'Long Orchard',
    capacity: 4,
    guests: ['Mike Johnson'],
  },
  {
    name: 'Welsh Bury',
    capacity: 4,
    guests: [],
  },
  {
    name: 'Garden Cliff',
    capacity: 8,
    guests: ['Emily Rose', 'Tom Hardy', 'Liam Dean'],
  },
  {
    name: 'Hope Wood',
    capacity: 6,
    guests: ['Zara Lane'],
  },
  {
    name: 'Break Heart Hill',
    capacity: 4,
    guests: [],
  },
  {
    name: 'May Hill',
    capacity: 8,
    guests: ['Rachel Green', 'Ross Geller', 'Monica Geller'],
  },
];

const RoomMapWithGuests = () => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        padding: { xs: 2, md: 4 },
        backgroundColor: theme.colors.backgroundDarker,
      }}
    >
      <Typography
        variant="h4"
        sx={{
          marginBottom: 4,
          fontWeight: 'bold',
          textAlign: 'center',
          color: theme.colors.text,
        }}
      >
        Room Assignments & Availability
      </Typography>

      <Grid container spacing={3}>
        {rooms.map((room, idx) => {
          const available = room.capacity - room.guests.length;
          return (
            <Grid item xs={12} sm={6} md={4} key={idx}>
              <Card
                variant="outlined"
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  borderColor: theme.colors.backgroundLighter,
                }}
              >
                <CardContent>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    {room.name}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ marginBottom: 1 }}
                  >
                    Capacity: {room.capacity} | Available: {available}
                  </Typography>

                  <Divider sx={{ my: 1 }} />

                  {room.guests.length > 0 ? (
                    <Box
                      sx={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: 1,
                      }}
                    >
                      {room.guests.map((guest, i) => (
                        <Chip
                          key={i}
                          label={guest}
                          color="secondary"
                          variant="outlined"
                          size="small"
                        />
                      ))}
                    </Box>
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      No guests yet.
                    </Typography>
                  )}
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
};

export default RoomMapWithGuests;
