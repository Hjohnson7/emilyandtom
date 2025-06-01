import axios from 'axios';
import { APPURL } from './appUrl';

const api = axios.create({
  baseURL: APPURL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});


export default api;
