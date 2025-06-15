import './App.css';
import 'react-phone-input-2/lib/style.css';
import Navbar from './components/Navbar';
import ShortMenu from './components/ShortMenu';
import HorizontalProductmenu from './components/HorizontalProductmenu'
import Carousel from './components/Carousel';
import BigHorizontalProductmenu from './components/BigHorizontalProductmenu';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from './components/LoginPage';
import SignupPage from './components/SignupPage';
import OtpPage from './components/OtpPage';
function App() {
  return (
    <><Router>
      <Routes>
        <Route
          path='/'
          element={
            <layout>
              <Navbar />
              <ShortMenu />
              <HorizontalProductmenu />
              <Carousel />
              <BigHorizontalProductmenu />
            </layout>
          } />
        <Route exact path='/login' element={<LoginPage />} />
        <Route exact path='/signup' element={<SignupPage />} />
        <Route exact path='/otp' element={<OtpPage />} />
      </Routes>
    </Router>
    </>
  );
}

export default App;
