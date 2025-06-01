import axios from 'axios';
import { APPURL } from './appUrl';

const apiGeneric = axios.create({
  baseURL: APPURL,
  withCredentials: false,
  headers: {
    'Content-Type': 'application/json',
  },
});


export default apiGeneric;