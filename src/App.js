import './App.css';
import Navbar from './components/Navbar';
import ShortMenu from './components/ShortMenu';
import HorizontalProductmenu from './components/HorizontalProductmenu'
import Carousel from './components/Carousel';
import BigHorizontalProductmenu from './components/BigHorizontalProductmenu';
function App() {
  return (
    <>
        <Navbar/>
        <ShortMenu/>
        <HorizontalProductmenu/>
        <Carousel/>
        <BigHorizontalProductmenu/>
    </>
  );
}

export default App;
