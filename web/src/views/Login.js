import React, { useState } from 'react';
import Main from '../components/Main';

export default function Login({ login }) {
  const [email, setEmail] = useState('arthurolg@gmail.com');
  const [password, setPassword] = useState('123456');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = login(email, password);
      console.log(response);
    } catch (error) {
      console.log(error);
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
        {error && <div className="alert alert-danger">{error}</div>}
        <form onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              className="Form__field"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
            />
          </div>
          <button type="submit" className="Form__submit">
            Login
          </button>
          <p className="FormContainer__info">
            No tienes cuenta? <a href="/signup">Regístrate</a>
          </p>
        </form>
      </div>
    </Main>
  );
}
