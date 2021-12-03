import React, { useState, useEffect } from 'react';
import Axios from 'axios';

import Nav from './components/Nav';
import Loading from './components/Loading';

import Signup from './views/Signup';
import Login from './views/Login';

import { getToken, setToken, deleteToken, initAxiosInterceptors } from './helpers/auth';
import Main from './components/Main';

initAxiosInterceptors();

export default function App() {
  const [user, setUser] = useState(null);
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

  if (loadingUser) {
    return (
      <Main center>
        <Loading />
      </Main>
    );
  }

  return (
    <div className="WrapperContainer">
      <Nav />
      <Signup signup={handleSignup} />
      <Login login={handleLogin} />
      <div>{JSON.stringify(user)}</div>
    </div>
  );
}
