import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimesCircle } from '@fortawesome/free-regular-svg-icons';

export default function Error({ message, click }) {
  if (!message) return null;
  return (
    <div className="ErrorContainer" role="alert">
      <div className="Error__inner">
        <span className="block">{message}</span>
        <button className="Error__button" onClick={click}>
          <FontAwesomeIcon icon={faTimesCircle} className="Error__icon" />
        </button>
      </div>
    </div>
  );
}
