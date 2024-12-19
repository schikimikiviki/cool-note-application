import './LogoutButton.css';
import { useNavigate } from 'react-router-dom';

const LogoutButton = (props) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    //logout user and renove userData from localstorage
    localStorage.removeItem('userData');
    navigate('/login');
  };
  return (
    <>
      <button
        className='button-hover'
        style={{ fontSize: props.fontSize }}
        onClick={handleLogout}
      >
        Logout →
      </button>
    </>
  );
};

export default LogoutButton;
