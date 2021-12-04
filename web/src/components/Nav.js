import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCameraRetro } from '@fortawesome/free-solid-svg-icons';

export default function Nav({ user }) {
  return (
    <nav className="Nav">
      <ul className="Nav__links">
        <li>
          <Link to="/" className="Nav__link">
            Socialapp
          </Link>
        </li>
        {user && <UserRoutes />}
      </ul>
    </nav>
  );
}

function UserRoutes() {
  return (
    <>
      <li>
        <Link to="/" className="Nav__link-push">
          <FontAwesomeIcon icon={faCameraRetro} />
        </Link>
      </li>
      <li>
        <Link to="/upload" className="Nav__link-push">
          <FontAwesomeIcon icon={faCameraRetro} />
        </Link>
      </li>
    </>
  );
}
