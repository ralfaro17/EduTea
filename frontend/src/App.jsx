// React imports
// import { useState } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom';

// Styles import
import './App.css';

// Pages imports
import Homepage from './pages/Homepage';
import Login from './pages/Login';
import Register from './pages/Register';
import About from './pages/About';
import Logout from './pages/Logout';
import AccountActivation from './pages/AccountActivation';
import Profile from './pages/Profile';
import ChaTMenu from './pages/ChatMenu';
import CreateRoom from './pages/CreateRoom';
import NotFound from './pages/NotFound';
import ChatRoom from './pages/ChatRoom';
import Settings from './pages/Settings';

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" Component={Homepage} />
          <Route path="/login" Component={Login} />
          <Route path="/register" Component={Register} />
          <Route path="/logout" Component={Logout} />
          <Route path="/about" Component={About} />
          <Route path="/activate-account" Component={AccountActivation} />
          <Route path="/profile" Component={Profile} />
          <Route path="/chat-menu" Component={ChaTMenu} />
          <Route path="/create-room" Component={CreateRoom} />
          <Route path="/chat-room" Component={ChatRoom} />
          <Route path="/settings" Component={Settings} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
