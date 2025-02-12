import { useNavigate } from 'react-router-dom';

const LoginButton = (props) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate('/login');
  };

  const handleRegister = () => {
    navigate('/register');
  };

  return (
    <>
      <button
        className='button-hover'
        style={{ fontSize: props.fontSize }}
        onClick={handleLogout}
      >
        Login →
      </button>
      <button
        className='button-hover'
        style={{ fontSize: props.fontSize }}
        onClick={handleRegister}
      >
        Register →
      </button>
    </>
  );
};

export default LoginButton;
