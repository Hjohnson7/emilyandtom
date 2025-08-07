import { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom"
import { useAuth } from '../../contexts/authContext';
import {
    Button,
    Grid,
    Typography,
    Box,
} from '@mui/material';
import { useSnackbar } from 'notistack';
import { FormContainer, StyledTextField, StyledSignUpText } from "../../components/authentication/styledComponents"
import { motion } from 'framer-motion';

const ForgotPasswordPage = () => {

    const [requestSent, setRequestSent] = useState(false);
    
    const [formData, setFormData] = useState({
        email: ''
    })

    const { enqueueSnackbar } = useSnackbar();

    const navigate = useNavigate();

    const { user, resetPasswordRequest } = useAuth()

    const {email} = formData

    const onChange = e => setFormData({...formData, [e.target.name]: e.target.value})

    const onSubmit = async(e) => {
        e.preventDefault();
        const resp = await resetPasswordRequest(email);
        if(resp.status !== 204 || resp.status !== 400){
            enqueueSnackbar("Password Reset email sent.", { variant: "success" });
            setRequestSent(true)
        } else{
            enqueueSnackbar(resp.data, { variant: "error" });
        }
        
    }

    useEffect(()=>{
        if(user){
            navigate('/')
        }
        if (requestSent) {
            navigate('/')
        } 
    }, [requestSent])

    return (
        <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2 }}
      >
        <FormContainer elevation={3}>
        <Typography variant="h5" gutterBottom>
            Forgot Password
        </Typography>
        <Box component="form" onSubmit={onSubmit}>
            <Grid item >
                <StyledTextField
                    fullWidth
                    label="Email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={onChange}
                    required
                />
            </Grid>
            <Button
                type="submit"
                variant="contained"
                color="primary"
                sx={{ marginTop: 2 }}
                fullWidth
            >
                Send Reset Email
            </Button>
            <StyledSignUpText onClick={()=>{navigate('/login')}}>
                Remebered your password?
                </StyledSignUpText>
        </Box>
    </FormContainer>
    </motion.div>
    )
}


export default ForgotPasswordPage;
