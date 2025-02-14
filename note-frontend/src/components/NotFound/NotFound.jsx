import React from 'react';
import { useNavigate } from 'react-router-dom';
import './NotFound.css';

function NotFound({ loggedIn }) {
  const navigate = useNavigate();

  return (
    <div className='container'>
      <h1 className='heading'>404 - Page Not Found</h1>
      <p className='message'>
        Oops! The page you're looking for doesn't exist. It might have been
        moved or deleted.
      </p>
      <button
        className='button'
        onClick={loggedIn ? () => navigate('/home') : () => navigate('/')}
      >
        Go Back Home
      </button>
    </div>
  );
}

export default NotFound;
