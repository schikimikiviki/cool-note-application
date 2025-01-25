import UsersList from '../UserList/UserList';
import './AdminPage.css';
import { useNavigate } from 'react-router-dom';
import AddUserForm from '../AddUserForm/AddUserForm';

const AdminPage = () => {
  const navigate = useNavigate();

  return (
    <>
      <div className='admin-header'>
        <h1>Admin Page</h1>
        <br />
        <button
          onClick={() => {
            navigate('/home');
          }}
          style={{ padding: '5px' }}
        >
          return /home
        </button>
      </div>
      <div className='admin-page'>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <UsersList />
          <br />

          <AddUserForm />
          <br />
          <h2>
            <u>Delete user</u>
          </h2>
        </div>
      </div>
    </>
  );
};

export default AdminPage;
