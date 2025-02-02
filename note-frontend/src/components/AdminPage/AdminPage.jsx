import UsersList from '../UserList/UserList';
import './AdminPage.css';
import { useNavigate } from 'react-router-dom';
import AddUserForm from '../AddUserForm/AddUserForm';
import api from '../../api/axiosConfig';
import { useState, useEffect } from 'react';

const AdminPage = () => {
  const navigate = useNavigate();
  const [userID, setUserID] = useState('');
  const [users, setUsers] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [registrationMessage, setRegistrationMessage] = useState('');

  const fetchUsers = async () => {
    try {
      const response = await api.get(`/users`, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      setUsers(response.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const deleteUser = async (id) => {
    try {
      if (!id || isNaN(id) || id <= 0) {
        setErrorMessage('Please enter a valid numeric ID');
        setTimeout(() => {
          setErrorMessage('');
        }, 5000);

        return;
      }

      const response = await api.delete(`/users/${id}`, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.data.success) {
        setRegistrationMessage('Deletion successful!');
        setErrorMessage('');
        setUserID('');
        fetchUsers();
        setTimeout(() => {
          setRegistrationMessage('');
        }, 5000);
      } else {
        setErrorMessage('Deletion failed!');
        setTimeout(() => {
          setErrorMessage('');
        }, 5000);
      }
    } catch (err) {
      console.log(err);
      setErrorMessage(
        'Deletion impossible - please recheck the entered number'
      );
      setTimeout(() => {
        setErrorMessage('');
      }, 5000);
    }
  };

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
          <UsersList users={users} />
          <br />

          <AddUserForm onAdd={fetchUsers} />
          <br />
          <div>
            <h2>
              <u>Delete user</u>
            </h2>
            {errorMessage && (
              <div
                className='error-message'
                style={{ marginBottom: '20px', marginTop: '20px' }}
              >
                <p>{errorMessage}</p>
              </div>
            )}

            {registrationMessage && (
              <div
                className='registration-message'
                style={{ marginBottom: '20px', marginTop: '20px' }}
              >
                <p>{registrationMessage}</p>
              </div>
            )}
            <label className='form-item'>
              Enter user ID:
              <br />
              <input
                type='text'
                value={userID}
                onChange={(e) => setUserID(e.target.value)}
              />
            </label>
            <br />
            <br />
            <button
              style={{
                width: '150px',
                padding: '5px',
                backgroundColor: 'antiquewhite',
                border: 'none',
              }}
              onClick={() => deleteUser(userID)}
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminPage;
