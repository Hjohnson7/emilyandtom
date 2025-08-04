import React, {useEffect} from 'react'
import './App.css';
import { BrowserRouter as Router, Route, Routes  } from 'react-router-dom'
import GlobalStyle from './theme/globalStyles';
import { AuthProvider } from './contexts/authContext';
import { ThemeProvider } from './theme/themeContext'
import api from './constants/api';
import { SnackbarProvider } from 'notistack';
import HomePage from './screens/homepage/homepage';
import RsvpPage from './screens/rsvpPage';
import NavBar from './components/navigationBar/navigationBar';
import FaqPage from './screens/FAQPage/FAQPage';
import WeddingTravelInfo from './screens/travel/travel';
import AccomodationPage from './screens/accomodation/accomodation';
import LoginPage from './screens/authentication/loginPage';
import ForgotPasswordPage from './screens/authentication/forgotPassword';
import ResetPasswordPage from './screens/authentication/resetPassword';
import MessageScreen from './screens/messages/messages';
import AdminPage from './screens/admin/adminPage';
import ScrollToTop from './components/utils/scrollToTop';

function App() {

  useEffect(() => {
    api.get('csrf/')
      .then(res => console.log('CSRF cookie set'))
      .catch(err => console.error('CSRF setup failed', err));
  }, []);


  return (
       <AuthProvider>
      <ThemeProvider>
      <GlobalStyle />
      <Router>
        <div id="main">
        <SnackbarProvider maxSnack={3} anchorOrigin={{ vertical: 'top', horizontal: 'right' }} autoHideDuration={4000}>
        <NavBar />
        <ScrollToTop>
          <div className="inner" style={{ flex: 1 }}>
            <Routes>
            <Route exact path="/" element={<HomePage/>}/> 
            <Route exact path="/rsvp" element={<RsvpPage />} />
            <Route exact path="/faqs" element={<FaqPage/>} />
            <Route exact path="/travel" element={<WeddingTravelInfo />} />
            <Route exact path="/accomodation" element={<AccomodationPage />} />
            <Route exact path="/login" element={<LoginPage/>} />
            <Route exact path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route exact path="/password/reset/confirm/:uid/:token" element={<ResetPasswordPage />} />
            <Route exact path="/message-board" element={<MessageScreen />} />
            <Route exact path="admin-page" element={<AdminPage />} />
          </Routes>
        </div>
        </ScrollToTop>
        {/* <Footer /> */}
        </SnackbarProvider>
        </div>
      </Router>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
