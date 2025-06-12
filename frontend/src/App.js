import './App.css';
import Navbar from './components/Navbar';
import ShortMenu from './components/ShortMenu';
import HorizontalProductmenu from './components/HorizontalProductmenu'
import Carousel from './components/Carousel';
import BigHorizontalProductmenu from './components/BigHorizontalProductmenu';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from './components/LoginPage';
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
      </Routes>
    </Router>
    </>
  );
}

export default App;
