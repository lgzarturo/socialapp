import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, useParams } from 'react-router-dom';
import Axios from 'axios';

import Nav from './components/Nav';
import Loading from './components/Loading';
import Error from './components/Error';

import Signup from './views/Signup';
import Login from './views/Login';
import Upload from './views/Upload';
import Feed from './views/Feed';

import { getToken, setToken, deleteToken, initAxiosInterceptors } from './helpers/auth';
import Main from './components/Main';

initAxiosInterceptors();

export default function App() {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);

  useEffect(() => {
    const checkLoggedIn = async () => {
      if (!getToken()) {
        setLoadingUser(false);
        return;
      }
      try {
        const { data } = await Axios.get('/api/v1/users/me');
        setUser(data);
        setLoadingUser(false);
      } catch (error) {
        console.log(error);
      }
    };
    checkLoggedIn();
  }, []);

  async function handleLogin(email, password) {
    const { data } = await Axios.post('/api/v1/users/login', {
      email,
      password,
    });
    setUser(data.user);
    setToken(data.token);
  }

  async function handleSignup(user) {
    const { data } = await Axios.post('/api/v1/users/signup', user);
    setUser(data.user);
    setToken(data.token);
  }

  async function handleLogout() {
    setUser(null);
    deleteToken();
  }

  function showError(error) {
    setError(error);
  }

  function hideError() {
    setError(null);
  }

  if (loadingUser) {
    return (
      <Main center>
        <Loading />
      </Main>
    );
  }

  console.log(user);

  return (
    <Router>
      <Nav user={user} />
      <Error message={error} click={hideError} />
      {user ? (
        <AuthenticatedRoutes showError={showError} />
      ) : (
        <AnonymousRoutes login={handleLogin} signup={handleSignup} showError={showError} />
      )}
    </Router>
  );
}

function AuthenticatedRoutes({ showError }) {
  return (
    <Routes>
      <Route path="/upload" element={<Upload showError={showError} />} />
      <Route path="/" element={<Feed showError={showError} />} index={true} />
    </Routes>
  );
}

function AnonymousRoutes({ login, signup, showError }) {
  return (
    <Routes>
      <Route path="/login" element={<Login login={login} showError={showError} />} />
      <Route path="/" element={<Signup signup={signup} showError={showError} />} index={true} />
    </Routes>
  );
}
