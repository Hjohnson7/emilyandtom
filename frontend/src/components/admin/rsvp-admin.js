import React, { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Grid,
  IconButton,
} from '@mui/material';
import { useTheme } from 'styled-components';
import { Delete as DeleteIcon } from '@mui/icons-material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/authContext';

import { useSnackbar } from 'notistack';

const RSVPAdmin = () => {
  const theme = useTheme();
  const navigate = useNavigate()
  const { user } = useAuth()

  useEffect(() => {
      if(!user){
          navigate('/')
      }
  }, [user])

  const {enqueueSnackbar, closeSnackbar} = useSnackbar()

  const [formData, setFormData] = useState({
    fname: '',
    lname: '',
    email: '',
    partner: '',
    children: [],
  });

  const [showPartner, setShowPartner] = useState(false);
  const [children, setChildren] = useState([]);

  const handleInputChange = (field) => (e) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handlePartnerToggle = () => {
    setShowPartner(true);
  };

  const handleChildChange = (index, key, value) => {
    const updated = [...children];
    updated[index][key] = value;
    setChildren(updated);
  };

  const addChild = () => {
    setChildren((prev) => [...prev, { name: '', age: '' }]);
  };

  const removeChild = (index) => {
    const updated = [...children];
    updated.splice(index, 1);
    setChildren(updated);
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
    const finalData = {
      fname: formData.fname,
      lname: formData.lname,
      email: formData.email,
      partner: showPartner ? formData.partner : undefined,
      children: children.filter((c) => c.name && c.age),
    };
    try{
        const response = await axios.post('/api/accounts/create-guest-users/', finalData)
        console.log(response)
        const usersCreated = response.data.created_users[0].toString()
        enqueueSnackbar(`Added guest - ${usersCreated}`, { variant: 'success' })
        setFormData({
            fname: '',
            lname: '',
            email: '',
            partner: '',
            children: [],
          })
    } catch (error){
        enqueueSnackbar(`Error - ${error} - speak to Harry`, { variant: 'error' })
    }
  };
  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        p: 4,
        background: theme.colors.backgroundLighter,
        borderRadius: 2,
        maxWidth: 600,
        margin: 'auto',
        boxShadow: theme.shadows.medium,
      }}
    >
      <Typography variant="h5" gutterBottom sx={{color: theme.colors.backgroundDarker}}>
        Invite a guest/guests
      </Typography>

      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="First Name"
            value={formData.fname}
            onChange={handleInputChange('fname')}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Last Name"
            value={formData.lname}
            onChange={handleInputChange('lname')}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Email"
            type="email"
            value={formData.email}
            onChange={handleInputChange('email')}
          />
        </Grid>

        {showPartner && (
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Partner Name"
              value={formData.partner}
              onChange={handleInputChange('partner')}
            />
          </Grid>
        )}

        <Grid item xs={12}>
          {!showPartner && (
            <Button variant="outlined" onClick={handlePartnerToggle}>
              Add Partner
            </Button>
          )}
        </Grid>

        <Grid item xs={12}>
          <Button variant="outlined" onClick={addChild}>
            Add Child
          </Button>
        </Grid>

        {children.map((child, index) => (
          <Grid key={index} container spacing={2} alignItems="center">
            <Grid item xs={5}>
              <TextField
                fullWidth
                label="Child Name"
                value={child.name}
                onChange={(e) =>
                  handleChildChange(index, 'name', e.target.value)
                }
              />
            </Grid>
            <Grid item xs={5}>
              <TextField
                fullWidth
                label="Age"
                type="number"
                value={child.age}
                onChange={(e) =>
                  handleChildChange(index, 'age', e.target.value)
                }
              />
            </Grid>
            <Grid item xs={2}>
              <IconButton onClick={() => removeChild(index)}>
                <DeleteIcon />
              </IconButton>
            </Grid>
          </Grid>
        ))}

        {/* <Grid item xs={12} mt={2} sx={{display: 'flex', justifyContent: 'flex-end'}}>
          <Button type="submit" variant="contained" color="primary">
            Submit
          </Button>
        </Grid> */}
        </Grid>
        <Box display="flex" justifyContent="flex-end">
                        <Button
                          type="submit"
                            variant="contained"
                            sx={{
                                background: theme.colors.primary,
                                color: "#fff",
                                borderRadius: theme.borders.radiuslg,
                                fontWeight: 600,
                                "&:hover": { filter: "brightness(1.05)" },
                                marginTop: theme.spacing.xl
                            }}
                        > Submit
                        </Button>
                    </Box>
    </Box>
  );
};

export default RSVPAdmin;
