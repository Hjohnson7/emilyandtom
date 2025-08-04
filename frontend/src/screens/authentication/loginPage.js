import { motion } from 'framer-motion';
import React, { useState, useEffect } from 'react';
import {
    Button,
    Grid,
    Typography,
    Box,
    IconButton
} from '@mui/material';
import { FormContainer, StyledTextField, StyledSignUpText } from "../../components/authentication/styledComponents"
import { useAuth } from '../../contexts/authContext';
import { useNavigate } from 'react-router-dom';
import { useTheme } from 'styled-components';
import CloseIcon from '@mui/icons-material/Close';
import { useSnackbar } from 'notistack';



const LoginPage = () => {

    const { user, login } = useAuth()
    const navigate = useNavigate()
    const theme = useTheme()
    const [formValues, setFormValues] = useState({
        email: '',
        password: '',
    });


    const {enqueueSnackbar, closeSnackbar} = useSnackbar()

    const action = snackbarId => (
            <>
              <Button
                color="primary" // Uses your theme's primary color
                variant="contained"
                size="small"
                onClick={() => navigate('/rsvp')}
                sx={{ mr: 1 }}
              >
                RSVP
              </Button>
              <IconButton
                size="small"
                onClick={() => {closeSnackbar(snackbarId)}}
                sx={{ color: 'red' }}
              >
                <CloseIcon />
              </IconButton>
            </>
      );

    useEffect(() => {
        if (user) {
            navigate("/")
        }
    }, [user])

    const handleChange = (e) => {
        setFormValues({
            ...formValues,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        // Handle form submission logic here
        let { email, password } = formValues
        const res = await login(email, password)
        if (res.error) {
            alert(`ERROR SIGNING IN - ${res.error}`)
        } else {
            if(!res.rsvped){
              enqueueSnackbar("Please RSVP to our wedding.", { variant: "info", action});
            }
        }
    };

    return (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2 }}
        >
          <FormContainer elevation={3}>
            <Typography variant="h5" gutterBottom>
                Sign In
            </Typography>
            <Box component="form" onSubmit={handleSubmit}>
                <Grid item >
                    <StyledTextField
                        fullWidth
                        label="Email"
                        name="email"
                        type="email"
                        value={formValues.email}
                        onChange={handleChange}
                        required
                    />
                </Grid>
                <Grid item >
                    <StyledTextField
                        fullWidth
                        label="Password"
                        name="password"
                        type="password"
                        value={formValues.password}
                        onChange={handleChange}
                        required
                    />
                </Grid>
                <Button
                    type="submit"
                    variant="contained"
                    sx={{ marginTop: 2, backgroundColor: theme.colors.backgroundMain }}
                    fullWidth
                >
                    Sign In
                </Button>
                <StyledSignUpText onClick={()=>{navigate('/forgot-password')}}>
                    Forgot Password?
                </StyledSignUpText>
            </Box>
        </FormContainer>
        </motion.div>
    );
};

export default LoginPage;

