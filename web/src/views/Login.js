import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Main from '../components/Main';

export default function Login({ login, showError }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await login(email, password);
      console.info(response);
    } catch (error) {
      console.error(error.response.data.error);
      showError(error.response.data.message);
    }
  };

  return (
    <Main center={true}>
      <div className="FormContainer">
        <h1 className="Form__titulo">
          <span className="text-primary">
            <i className="fas fa-lock"></i>
          </span>
          Login
        </h1>
        <form onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              className="Form__field"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              className="Form__field"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="Form__submit">
            Login
          </button>
          <p className="FormContainer__info">
            No tienes cuenta? <Link to="/">Regístrate</Link>
          </p>
        </form>
      </div>
    </Main>
  );
}
