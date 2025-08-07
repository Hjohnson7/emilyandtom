import React, {useState, useEffect} from 'react'
import InviteeCard from "./inviteeDetails"
import api from "../../constants/api"
import {
  TextField,
  Checkbox,
  Switch,
  FormControlLabel,
  Button,
  Box,
  Typography,
  Paper,
  Stack
} from '@mui/material';
import { useTheme } from 'styled-components';

const UserDetails = () => {

    const [users, setUsers] = useState([])
    const [filteredUsers, setFilteredUsers] = useState([])
    const [loading, setLoading] = useState(true)
    const [nameFilter, setNameFilter] = useState('')
    const [rsvpFilter, setRsvpFilter] = useState({active: false, value: false})
    const [comingFilter, setComingFilter] = useState({active: false, value: false})
    const theme = useTheme()
    
    const onApply = (filter, clear=false) => {
        if(clear){
            setFilteredUsers(users)
        }else{
            const filtered = users.filter((user) => {
                const fullName = user.fname.toLowerCase() + ' ' + user.lname.toLowerCase()
                return (fullName.includes(filter.name.toLowerCase()) && (!filter.rsvp.active ? true : user.rsvped === filter.rsvp.value) && (!filter.coming.active ? true : user.coming === filter.coming.value))
            })
            setFilteredUsers(filtered)
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        onApply({
          name: nameFilter,
          rsvp: rsvpFilter,
          coming: comingFilter
        });
      };
    
      const handleReset = () => {
        setNameFilter('');
        setRsvpFilter({ active: false, value: false });
        setComingFilter({ active: false, value: false });
    
        // Optionally, call onApply with cleared filters
        onApply({
          name: '',
          rsvp: { active: false, value: false },
          coming: { active: false, value: false }
        }, true);
      };

    useEffect(()=>{
        const loadUsers = async() => {
            try{
                const res = await api.get('/accounts/load-all-details/')
                setUsers(res.data)
                setFilteredUsers(res.data)
                setLoading(false)
            } catch(e){
                console.log(`Error - ${e}`)
                setLoading(false)
            }
        } 
        loadUsers()
    }, [])


    return (
        <Box>
        <Paper elevation={3} sx={{ p: 3, maxWidth: { xs: '100%', sm: 500 }, mx: 'auto', backgroundColor:  theme.colors.backgroundMain}}>
      <form onSubmit={handleSubmit}>
        <Typography variant="h6" gutterBottom>
          Apply Filters
        </Typography>

        {/* Name Filter */}
        <Box mb={2}>
          <TextField
            fullWidth
            label="Invites Name"
            value={nameFilter}
            onChange={(e) => setNameFilter(e.target.value)}
          />
        </Box>

        {/* RSVP Filter */}
        <Box mb={2}>
          <Stack direction="row" spacing={2} alignItems="center">
            <FormControlLabel
              control={
                <Checkbox
                  checked={rsvpFilter.active}
                  onChange={(e) =>
                    setRsvpFilter({ ...rsvpFilter, active: e.target.checked })
                  }
                />
              }
              label="Filter by RSVP"
            />
            <FormControlLabel
              control={
                <Switch
                  disabled={!rsvpFilter.active}
                  checked={rsvpFilter.value}
                  onChange={(e) =>
                    setRsvpFilter({ ...rsvpFilter, value: e.target.checked })
                  }
                />
              }
              label={rsvpFilter.value ? 'Yes' : 'No'}
            />
          </Stack>
        </Box>

        {/* Coming Filter */}
        <Box mb={2}>
          <Stack direction="row" spacing={2} alignItems="center">
            <FormControlLabel
              control={
                <Checkbox
                  checked={comingFilter.active}
                  onChange={(e) =>
                    setComingFilter({ ...comingFilter, active: e.target.checked })
                  }
                />
              }
              label="Filter by Coming"
            />
            <FormControlLabel
              control={
                <Switch
                  disabled={!comingFilter.active}
                  checked={comingFilter.value}
                  onChange={(e) =>
                    setComingFilter({ ...comingFilter, value: e.target.checked })
                  }
                />
              }
              label={comingFilter.value ? 'Yes' : 'No'}
            />
          </Stack>
        </Box>

        {/* Action Buttons */}
        <Stack direction="row" spacing={2}>
          <Button type="submit" variant="contained" fullWidth>
            Apply Filters
          </Button>
          <Button
            type="button"
            variant="outlined"
            onClick={handleReset}
            fullWidth
          >
            Reset Filters
          </Button>
        </Stack>
      </form>
    </Paper>
        {loading ? <>Loading</> : 
                filteredUsers.map((user)=>{return (<InviteeCard userDetails={user}/>)})}
        </Box>
)
}

export default UserDetails