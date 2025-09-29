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
import NotFound from './pages/NotFound';
import Error from './pages/Error';

function App() {
  return (
    <Router basename='/'>
      <AuthProvider>
        <Routes>
          <Route path='/' element={<Login />} />
          <Route path='/home' element={<Home />} />
          <Route path='/about' element={<About />} />
          <Route path='/benefits' element={<Benefit />} />
          <Route path='/events' element={<Event />} />
          <Route path='/sns' element={<Sns />} />
          <Route path='/faq' element={<Faq />} />
          <Route path='/error' element={<Error />} />
          <Route path='*' element={<NotFound />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
