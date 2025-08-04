import React from 'react';
import PropTypes from 'prop-types';
import {
  Card,
  CardContent,
  Box,
  Typography,
  Chip,
  Divider,
  useTheme,
  Stack,
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import FamilyRestroomIcon from '@mui/icons-material/FamilyRestroom';
import HotelIcon from '@mui/icons-material/Hotel';
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import CakeIcon from '@mui/icons-material/Cake';

const statusBadge = (label, positive, theme) => ({
  display: 'inline-block',
  padding: '2px 8px',
  borderRadius: 999,
  fontSize: 10,
  fontWeight: 600,
  textTransform: 'uppercase',
  background: positive
    ? `linear-gradient(135deg, ${theme.palette.primary.light}44, ${theme.palette.success.light}44)`
    : `rgba(220, 53, 69, 0.1)`,
  color: positive ? theme.palette.success.dark : theme.palette.error.main,
  border: positive ? `1px solid ${theme.palette.warning.main}` : `1px solid ${theme.palette.error.light}`,
  marginRight: 6,
});

const smallLabel = { fontSize: '0.55rem', letterSpacing: 0.5, textTransform: 'uppercase' };

const formatRoom = room => {
  if (!room) return 'None';
  if (typeof room === 'object') return room.name || `#${room.id}`;
  return `#${room}`; // integer id
};

const RSVPDetail = ({ rsvp }) => {
  const theme = useTheme();
  if (!rsvp) return null;

  const allergies = Array.isArray(rsvp.allergies)
    ? rsvp.allergies.map(a => (typeof a === 'object' ? a.name : a))
    : [];

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))',
        gap: 12,
        mt: 1,
      }}
    >
      <Box>
        <Typography variant="caption" sx={smallLabel}>
          Arrival
        </Typography>
        <Typography variant="body2">{rsvp.arrival_day || '—'}</Typography>
      </Box>

      <Box>
        <Typography variant="caption" sx={smallLabel}>
          Food
        </Typography>
        <Stack direction="row" spacing={0.5} alignItems="center">
          <RestaurantMenuIcon fontSize="small" />
          <Typography variant="body2">{rsvp.food_selection || '—'}</Typography>
        </Stack>
      </Box>

      {allergies.length > 0 && (
        <Box>
          <Typography variant="caption" sx={smallLabel}>
            Allergies
          </Typography>
          <Stack direction="row" spacing={0.5} flexWrap="wrap">
            {allergies.map((a, i) => (
              <Chip
                key={i}
                label={a}
                size="small"
                sx={{
                  background: theme.palette.grey[100],
                  fontSize: 10,
                  borderRadius: 1,
                  mb: 0.5,
                }}
              />
            ))}
          </Stack>
        </Box>
      )}

      <Box>
        <Typography variant="caption" sx={smallLabel}>
          Room
        </Typography>
        <Stack direction="row" spacing={0.5} alignItems="center">
          <HotelIcon fontSize="small" />
          <Typography variant="body2">{formatRoom(rsvp.room)}</Typography>
        </Stack>
      </Box>

      {rsvp.favourite_song && (
        <Box>
          <Typography variant="caption" sx={smallLabel}>
            Song
          </Typography>
          <Stack direction="row" spacing={0.5} alignItems="center">
            <MusicNoteIcon fontSize="small" />
            <Typography variant="body2">{rsvp.favourite_song}</Typography>
          </Stack>
        </Box>
      )}

      {typeof rsvp.purchasing_food !== 'undefined' && (
        <Box>
          <Typography variant="caption" sx={smallLabel}>
            Purchasing Food
          </Typography>
          <Typography variant="body2">{rsvp.purchasing_food ? 'Yes' : 'No'}</Typography>
        </Box>
      )}

      {rsvp.message && (
        <Box sx={{ gridColumn: '1 / -1' }}>
          <Typography variant="caption" sx={smallLabel}>
            Message
          </Typography>
          <Typography variant="body2" sx={{ fontStyle: 'italic' }}>
            "{rsvp.message}"
          </Typography>
        </Box>
      )}
    </Box>
  );
};

const InviteeCard = ({ main }) => {
  const theme = useTheme();
  const primaryRsvp = Array.isArray(main.rsvps) && main.rsvps.length ? main.rsvps[0] : null;

  return (
    <Card
      elevation={0}
      sx={{
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        border: `1px solid ${theme.palette.divider}`,
        borderRadius: 2,
        mb: 1,
        background: theme.palette.background.paper,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* header stripe */}
      <Box
        sx={{
          height: 6,
          background: 'linear-gradient(135deg, #f3e8ff 0%, #ffe4e1 100%)',
        }}
      />

      <CardContent
        sx={{
          py: 1.25,
          px: 2,
          display: 'flex',
          gap: 2,
          alignItems: 'flex-start',
          flexWrap: 'wrap',
        }}
      >
        {/* Identity + status */}
        <Box sx={{ flex: '0 0 220px', minWidth: 180 }}>
          <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 0.5 }}>
            {main.fname} {main.lname}
          </Typography>
          {main.email && (
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
              {main.email}
            </Typography>
          )}
          <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.5, flexWrap: 'wrap' }}>
            <PersonIcon fontSize="small" />
            <Typography variant="caption">
              RSVP'd{' '}
              <Box component="span" sx={statusBadge('', !!main.rsvped, theme)}>
                {main.rsvped ? 'Yes' : 'No'}
              </Box>
            </Typography>
            <Typography variant="caption">
              Coming{' '}
              <Box component="span" sx={statusBadge('', !!main.coming, theme)}>
                {main.coming ? 'Yes' : 'No'}
              </Box>
            </Typography>
          </Stack>

          {main.partner && (
            <Box sx={{ mt: 1 }}>
              <Divider />
              <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 1 }}>
                <FamilyRestroomIcon fontSize="small" />
                <Typography variant="caption" fontWeight={700}>
                  Partner: {main.partner.name}
                </Typography>
              </Stack>
              <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 0.5, flexWrap: 'wrap' }}>
                <Typography variant="caption">
                  RSVP'd{' '}
                  <Box component="span" sx={statusBadge('', !!main.partner.rsvped, theme)}>
                    {main.partner.rsvped ? 'Yes' : 'No'}
                  </Box>
                </Typography>
                <Typography variant="caption">
                  Coming{' '}
                  <Box component="span" sx={statusBadge('', !!main.partner.coming, theme)}>
                    {main.partner.coming ? 'Yes' : 'No'}
                  </Box>
                </Typography>
              </Stack>
            </Box>
          )}
        </Box>

        <Divider orientation="vertical" flexItem sx={{ mr: 1 }} />

        {/* RSVP details */}
        <Box sx={{ flex: '1 1 480px', minWidth: 320, display: 'flex', flexDirection: 'column', gap: 0.75 }}>
          <Typography variant="subtitle2" fontWeight={600}>
            Main RSVP
          </Typography>
          {primaryRsvp ? (
            <RSVPDetail rsvp={primaryRsvp} />
          ) : (
            <Typography variant="body2" color="text.secondary">
              No RSVP submitted
            </Typography>
          )}

          {main.partner?.rsvp && (
            <Box sx={{ mt: 1 }}>
              <Divider sx={{ my: 1 }} />
              <Typography variant="subtitle2" fontWeight={600}>
                Partner RSVP
              </Typography>
              <RSVPDetail rsvp={main.partner.rsvp} />
            </Box>
          )}

          {Array.isArray(main.children) && main.children.length > 0 && (
            <Box sx={{ mt: 1 }}>
              <Divider sx={{ my: 1 }} />
              <Typography variant="subtitle2" fontWeight={600}>
                Children
              </Typography>
              <Stack direction="row" spacing={1} flexWrap="wrap">
                {main.children.map((c, idx) => (
                  <Box
                    key={idx}
                    sx={{
                      border: `1px solid ${theme.palette.divider}`,
                      borderRadius: 1,
                      px: 1,
                      py: 0.75,
                      minWidth: 140,
                      mr: 1,
                      background: theme.palette.grey[50],
                    }}
                  >
                    <Typography variant="body2" fontWeight={600}>
                      {c.name} {c.age !== undefined && `(${c.age})`}
                    </Typography>
                    <Stack direction="row" spacing={1} sx={{ mt: 0.5 }}>
                      <Typography variant="caption">
                        RSVP'd{' '}
                        <Box component="span" sx={statusBadge('', !!c.rsvped, theme)}>
                          {c.rsvped ? 'Yes' : 'No'}
                        </Box>
                      </Typography>
                      <Typography variant="caption">
                        Coming{' '}
                        <Box component="span" sx={statusBadge('', !!c.coming, theme)}>
                          {c.coming ? 'Yes' : 'No'}
                        </Box>
                      </Typography>
                    </Stack>
                    {c.rsvp && (
                      <Box sx={{ mt: 0.5 }}>
                        <Typography variant="caption" fontWeight={600}>
                          Child RSVP
                        </Typography>
                        <RSVPDetail rsvp={c.rsvp} />
                      </Box>
                    )}
                  </Box>
                ))}
              </Stack>
            </Box>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

InviteeCard.propTypes = {
  main: PropTypes.shape({
    id: PropTypes.number,
    email: PropTypes.string,
    fname: PropTypes.string,
    lname: PropTypes.string,
    rsvped: PropTypes.bool,
    coming: PropTypes.bool,
    partner: PropTypes.shape({
      name: PropTypes.string,
      rsvped: PropTypes.bool,
      coming: PropTypes.bool,
      rsvp: PropTypes.object,
    }),
    children: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string,
        age: PropTypes.number,
        rsvped: PropTypes.bool,
        coming: PropTypes.bool,
        rsvp: PropTypes.object,
      })
    ),
    rsvps: PropTypes.arrayOf(PropTypes.object),
  }).isRequired,
};

export default InviteeCard;
