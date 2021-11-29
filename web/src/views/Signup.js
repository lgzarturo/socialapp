import React, { useState } from 'react';
import Axios from 'axios';

import Main from '../components/Main';
import portraitImage from '../resources/img/portrait-of-amazed-blonde.jpg';

export default function Signup() {
  const [user, setUser] = useState({
    name: 'Arturo Lopez',
    email: '',
    password: '',
    biography: '',
  });

  function handleInputChange(event) {
    const { name, value } = event.target;
    setUser({ ...user, [name]: value });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    try {
      const { data } = await Axios.post('/api/v1/users/signup', user);
      console.log(data);
    } catch (e) {
      console.error(e);
    }
  }

  return (
    <Main center={true}>
      <div className="Signup">
        <img src={portraitImage} alt="portrait-of-amazed-blonde" className="Signup__img" />
        <div className="FormContainer">
          <h1 className="Form__titulo">Socialapp</h1>
          <p className="FormContainer__info">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
          <form onSubmit={handleSubmit} noValidate>
            <input
              type="text"
              name="name"
              placeholder="Nombre y apellido"
              className="Form__field"
              required
              onChange={handleInputChange}
              value={user.name}
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              className="Form__field"
              required
              onChange={handleInputChange}
              value={user.email}
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              className="Form__field"
              required
              onChange={handleInputChange}
            />
            <textarea
              name="biography"
              className="Form__field"
              placeholder="Biography"
              onChange={handleInputChange}
              value={user.biography}
            ></textarea>
            <button type="submit" className="Form__submit">
              Signup
            </button>
            <p className="FormContainer__info">
              Ya tienes una cuenta? <a href="/login">Inicia sesión</a>
            </p>
          </form>
        </div>
      </div>
    </Main>
  );
}
