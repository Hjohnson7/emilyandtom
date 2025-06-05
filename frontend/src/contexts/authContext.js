// src/context/AuthContext.js
import React, { createContext, useState, useEffect } from 'react';
import {APPURL} from "../constants/appUrl"
import api from '../constants/api';
import useAutoRefreshToken from '../hooks/useAutoRefreshHook';
import { useSnackbar } from 'notistack';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true); // To prevent flashing
    const { enqueueSnackbar } = useSnackbar();

    useAutoRefreshToken()  // Auto refresh login every 4 mins if login.

    useEffect(() => {
        const fetchUser = async () => {
          try {
            const res = await api.get(`${APPURL}auth/users/me/`, {
                withCredentials: true,
            });
            setUser({
                fname: res.data.fname,
                lname: res.data.lname,
                email: res.data.email,
                is_staff: res.data.is_staff,
                is_admin: res.data.is_admin,
                sent_invite: res.data.sent_invite,
                rsvped: res.data.rsvped,
                quiz_response: res.data.quiz_response,
                temp_password: res.data.temp_password,
              })
          } catch (err) {
            setUser(null); // Not logged in
          } finally {
            setLoading(false);
          }
        };
        fetchUser();
      }, []);

    const login = async (email, password) => {
        try {
            let response = await api.post(
                `${APPURL}auth/login`,
                { email, password },
            );
            if (response?.error){
                return response
            }
            // Token is automatically stored in HttpOnly cookies by Django backend
            const res = await api.get(`${APPURL}auth/users/me/`, {
                withCredentials: true,
            });
            setUser({
                fname: res.data.fname,
                lname: res.data.lname,
                email: res.data.email,
                is_staff: res.data.is_staff,
                is_admin: res.data.is_admin,
                sent_invite: res.data.sent_invite,
                rsvped: res.data.rsvped,
                quiz_response: res.data.quiz_response,
                temp_password: res.data.temp_password,
              })
            return {user: res.data}
            } catch (error) {
                console.error('Login failed', error);
                setUser(null)
                return {error: `Error in signing in - ${error}`}
            }
    };

    const signup = async (email, fname, lname, mobile, password, confirmPassword) => {
        try {
            let response = await api.post(
                `${APPURL}auth/users/`,
                {
                    email: email,
                    fname: fname,
                    lname: lname,
                    mobile: mobile,
                    password: password,
                    re_password: confirmPassword
                }
            );

            return response
        }
        catch (error){
            console.log(error)
            return error
        }
    };

    const logout = () => {
        // Delete the tokens by sending a logout request to the backend
        api.post(`${APPURL}auth/logout`, {}, { withCredentials: true })
        .then(() => {
            setUser(null)
            console.log('Logged out');
        })
        .catch(err => {
            setUser(null)
            console.error('Logout failed', err);
        });
    };

    const verify = (uid, token) => {
        let response = api.post(`${APPURL}auth/users/activation/`, {
            uid: uid,
            token: token
        })
        return response
    }

    const resetPasswordRequest = (email) => {
        let response = api.post(`${APPURL}auth/users/reset_password/`, {
            email: email
        })
        return response
    }

    const resetPassword = (uid, token, new_password, re_new_password) => {
        let response = api.post(`${APPURL}auth/users/reset_password_confirm/`, {
            uid: uid,
            token: token,
            new_password: new_password,
            re_new_password: re_new_password

        })
        return response
    }

    return (
        <AuthContext.Provider value={{ user, loading, login, logout, signup, verify, resetPasswordRequest, resetPassword }}>
        {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => React.useContext(AuthContext);
