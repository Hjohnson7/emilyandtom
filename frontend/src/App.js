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
        <SnackbarProvider maxSnack={3} anchorOrigin={{ vertical: 'top', horizontal: 'right' }} autoHideDuration={2000}>
        <NavBar />
          <div className="inner" style={{ flex: 1 }}>
            <Routes>
            <Route exact path="/" element={<HomePage/>}/> 
            <Route exact path="/rsvp/:id" element={<RsvpPage />} />
            {/* <Route exact path="/login" element={<LoginPage/>} />
            <Route exact path="/signup" element={<SignUp/>} />
            <Route exact path="/activate/:uid/:token" element={<Activate />} />
            <Route exact path="/password/reset/confirm/:uid/:token" element={<ResetPasswordPage />} />
            <Route exact path="/profile" element={<UserProfilePage />} />
            <Route exact path="/user/admin/calendar" element={<CalendarPage/>} />
            <Route exact path="user/admin/holidays" element={<StaffHolidayPage />} />
            <Route exact path="user/admin/working-hours" element={<StaffWorkingHoursPage />} />
            <Route exact path="/treatments" element={<TreatmentsPage />} />
            <Route exact path="/make-booking/:id" element={<BookingsPage />} />
            <Route exact path="/testimonials" element={<TestimonialPage/>} />
            <Route exact path="/book-now" element={<BookingFlowPage />} />
            <Route exact path="/user/admin/dashboard" element={<DashboardAnalyticsPage />} />
            <Route exact path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route exact path="/contact" element={<ContactPage />} />   */}
          </Routes>
        </div>
        {/* <Footer /> */}
        </SnackbarProvider>
        </div>
      </Router>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
