import React from 'react';
import Nav from './components/Nav';
import Signup from './views/Signup';

export default function App() {
  return (
    <div className="WrapperContainer">
      <Nav />
      <Signup />
    </div>
  );
}
