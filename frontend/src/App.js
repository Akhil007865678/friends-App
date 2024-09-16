import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Home from './components/Home/Home';
import Login from './components/Login/Login';
import Register from './components/Register/Register';
import SearchResults from './components/Search/search';
import Recommendations from './components/Recommendation/Recommendation';
import Profile from './components/Profile/Profile';

const App = () => {
  const isAuthenticated = !!localStorage.getItem('token');

  return (
    <Router>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={isAuthenticated ? <Home /> : <Navigate to="/login" />} />
        <Route path="/" element={<Navigate to="/home" />} />
        <Route path="/search/:query" element={<SearchResults/>} />
        <Route path='/recommendation' element={<Recommendations/>} />
        <Route path='/profile' element={<Profile/>} />
      </Routes>
    </Router>
  );
};

export default App;
