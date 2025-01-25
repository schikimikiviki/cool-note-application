import { useState, useEffect } from 'react';
import api from '../../api/axiosConfig.js';
import './UserList.css';

const UsersList = () => {
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(10);
  const [showUser, setShowUser] = useState(null);

  useEffect(() => {
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
    fetchUsers();
  }, []);

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = users.slice(
    indexOfFirstUser,
    indexOfFirstUser + usersPerPage
  );

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleShowUser = (user) => {
    console.log(user);
    setShowUser(user);
  };

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignContent: 'center',
        height: 'auto',
        flexDirection: 'column',
      }}
    >
      <h2>
        <u>Get all users</u>
      </h2>
      <div style={{ display: 'flex' }}>
        <div style={{ width: '20%', maxWidth: '20%', minWidth: '20%' }}>
          <ul>
            {currentUsers.map((user) => (
              <li key={user.id}>
                {user.username}
                <button
                  className='button-details'
                  onClick={() => handleShowUser(user)}
                >
                  View Details
                </button>
              </li>
            ))}
          </ul>
          <br />

          <div>
            {[...Array(Math.ceil(users.length / usersPerPage)).keys()].map(
              (number) => (
                <button
                  key={number}
                  onClick={() => paginate(number + 1)}
                  className='pagination-button'
                >
                  {number + 1}
                </button>
              )
            )}
          </div>
        </div>
        {showUser && (
          <div style={{ marginLeft: '20px' }}>
            <h2>User Details</h2>
            <p className='userlist-item'>
              <strong className='item-heading'>username:</strong>{' '}
              {showUser.username}
            </p>
            <p className='userlist-item'>
              <strong className='item-heading'>id:</strong> {showUser.id}
            </p>
            <p className='userlist-item'>
              <strong className='item-heading'>email:</strong> {showUser.email}
            </p>
            <p className='userlist-item'>
              <strong className='item-heading'>colorPalette:</strong>
              {JSON.stringify(showUser.colorPalette)}
            </p>
            <p className='userlist-item'>
              <strong className='item-heading'>customColorPaletteList:</strong>

              {showUser.customColorPaletteList.map((item) => (
                <li className='list-par' key={item.id}>
                  <strong>⭐ id:</strong> {item.id} <br />
                  <strong>name:</strong> {item.name} <br />
                  <strong>
                    userSetColors:
                    {item.userSetColors.map((item, index) => (
                      <li key={index} style={{ marginBottom: '5px' }}>
                        {item}
                      </li>
                    ))}
                  </strong>
                  -------------------------
                </li>
              ))}
            </p>
            <p className='userlist-item'>
              <strong className='item-heading'>customPairs:</strong>
              {JSON.stringify(showUser.customPairs)}
            </p>

            <p className='userlist-item'>
              <strong className='item-heading'>deleteAllDone:</strong>
              {showUser.deleteAllDone}
            </p>
            <p className='userlist-item'>
              <strong className='item-heading'>
                favoritePaletteReference:
              </strong>
              {showUser.favoritePaletteReference}
            </p>
            <p className='userlist-item'>
              <strong className='item-heading'>fontSize:</strong>
              {showUser.fontSize}
            </p>
            <p className='userlist-item'>
              <strong className='item-heading'>fullname:</strong>
              {showUser.fullname}
            </p>
            <p className='userlist-item'>
              <strong className='item-heading'>hideDoneNotes:</strong>
              {showUser.hideDoneNotes}
            </p>
            <p className='userlist-item'>
              <strong className='item-heading'>isAuthActive:</strong>
              {showUser.isAuthActive}
            </p>
            <p className='userlist-item'>
              <strong className='item-heading'>loginList:</strong>
              {showUser.loginList.map((item, index) => (
                <li
                  className='list-par'
                  key={index}
                  style={{ marginBottom: '5px' }}
                >
                  {item}
                </li>
              ))}
            </p>

            <p className='userlist-item'>
              <strong className='item-heading'>notes:</strong>

              {showUser.notes.map((item) => (
                <li className='list-par' key={item.id}>
                  <strong>⭐ id:</strong> {item.id} <br />
                  <strong>colorString:</strong> {item.colorString} <br />
                  <strong>content:</strong> {item.content} <br />
                  <strong>createdAt:</strong> {item.createdAt} <br />
                  <strong>dueDate:</strong> {item.dueDate} <br />
                  <strong>fontColor:</strong> {item.fontColor} <br />
                  <strong>isDone:</strong> {item.isDone} <br />
                  <strong>title:</strong> {item.title} <br />
                  ---------------------------
                </li>
              ))}
            </p>
            <p className='userlist-item'>
              <strong className='item-heading'>password:</strong>
              {showUser.password}
            </p>
            <p className='userlist-item'>
              <strong className='item-heading'>roles:</strong>
              {showUser.roles.map((item, index) => (
                <li key={index} style={{ marginBottom: '5px' }}>
                  {item}
                </li>
              ))}
            </p>
            <p className='userlist-item'>
              <strong className='item-heading'>showNoteTitles:</strong>
              {showUser.showNoteTitles}
            </p>
            <p className='userlist-item'>
              <strong className='item-heading'>theme:</strong>
              {showUser.theme}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UsersList;
