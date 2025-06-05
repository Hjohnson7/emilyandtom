
import { useEffect, useState } from 'react';
import { useNavigate, useParams, redirect } from "react-router-dom"
import {
    Button,
    Grid,
    Typography,
    Box,
} from '@mui/material';

import { FormContainer, StyledTextField, StyledSignUpText } from "../../components/authentication/styledComponents"
import { useAuth } from '../../contexts/authContext';
import { useSnackbar } from 'notistack';
import { motion } from 'framer-motion';

const ResetPasswordPage = () => {

    const [requestSent, setRequestSent] = useState(false);

    const [formData, setFormData] = useState({
        new_password: '',
        re_new_password: ''
    })

    const { enqueueSnackbar } = useSnackbar();
    const {user, resetPassword} = useAuth()

    const navigate = useNavigate();

    const {new_password, re_new_password} = formData

    const onChange = e => setFormData({...formData, [e.target.name]: e.target.value})
    
    const {uid, token} = useParams()

    const onSubmit = async(e) => {
        if (new_password === re_new_password){
            e.preventDefault();
            const resp = await resetPassword(uid, token, new_password, re_new_password);
            if(resp.status !== 400 || resp.status !== 204){
                enqueueSnackbar("Password successfully reset", { variant: "success" });
                setRequestSent(true)
            }else{
                enqueueSnackbar(resp.data, { variant: "error" });
            }
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
                Sign Up
            </Typography>
            <Box component="form" onSubmit={onSubmit}>
                <Grid item >
                    <StyledTextField
                        fullWidth
                        label="Password"
                        name="new_password"
                        type="password"
                        value={formData.new_password}
                        onChange={onChange}
                        required
                    />
                </Grid>
                <Grid item >
                    <StyledTextField
                        fullWidth
                        label="Re-type Password"
                        name="re_new_password"
                        type="password"
                        value={formData.re_new_password}
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
                    Reset Password
                </Button>
                <StyledSignUpText onClick={()=>{navigate('/login')}}>
                Remebered your password?
                </StyledSignUpText>
            </Box>
        </FormContainer>
        </motion.div>
    )
}


export default ResetPasswordPage

