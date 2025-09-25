import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import { AuthProvider } from './context/AuthContext';
import Login from './pages/Login';
import Home from './pages/Home';
import Benefit from './pages/Benefit';
import Faq from './pages/Faq';
import Sns from './pages/Sns';
import Event from './pages/Event';
import About from './pages/About';

function App() {
  return (
    <Router basename='/edmonton/loyalty'>
      <AuthProvider>
        <Routes>
          <Route path='/' element={<Login />} />
          <Route path='/home' element={<Home />} />
          <Route path='/about' element={<About />} />
          <Route path='/benefits' element={<Benefit />} />
          <Route path='/events' element={<Event />} />
          <Route path='/sns' element={<Sns />} />
          <Route path='/faq' element={<Faq />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
