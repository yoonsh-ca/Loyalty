import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import './App.css';
import Home from './pages/Home';
import Benefit from './pages/Benefit';
import Faq from './pages/Faq';
import Sns from './pages/Sns';
import Location from './pages/Location';
import Event from './pages/Event';

function App() {
  return (
    <Router basename='/loyalty'>
      <Routes>
        <Route path='/' element={<Login />} />
        <Route path='/home' element={<Home />} />
        <Route path='/benefits' element={<Benefit />} />
        <Route path='/events' element={<Event />} />
        <Route path='/location' element={<Location />} />
        <Route path='/sns' element={<Sns />} />
        <Route path='/faq' element={<Faq />} />
      </Routes>
    </Router>
  );
}

export default App;
