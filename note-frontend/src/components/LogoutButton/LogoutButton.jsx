import './LogoutButton.css';
import { useNavigate } from 'react-router-dom';

const LogoutButton = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    //logout user and renove userData from localstorage
    localStorage.removeItem('userData');
    navigate('/login');
  };
  return (
    <>
      <button className='button-hover' onClick={handleLogout}>
        Logout →
      </button>
    </>
  );
};

export default LogoutButton;
