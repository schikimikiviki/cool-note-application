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
              {showUser.username ?? 'N/A'}
            </p>
            <p className='userlist-item'>
              <strong className='item-heading'>id:</strong>{' '}
              {showUser.id ?? 'N/A'}
            </p>
            <p className='userlist-item'>
              <strong className='item-heading'>email:</strong>{' '}
              {showUser.email ?? 'N/A'}
            </p>
            <p className='userlist-item'>
              <strong className='item-heading'>colorPalette:</strong>{' '}
              {JSON.stringify(showUser.colorPalette ?? 'N/A')}
            </p>
            <p className='userlist-item'>
              <strong className='item-heading'>customColorPaletteList:</strong>
              {showUser.customColorPaletteList?.length > 0
                ? showUser.customColorPaletteList.map((item) => (
                    <li className='list-par' key={item.id ?? Math.random()}>
                      <strong>⭐ id:</strong> {item.id ?? 'N/A'} <br />
                      <strong>name:</strong> {item.name ?? 'N/A'} <br />
                      <strong>
                        userSetColors:
                        {item.userSetColors?.length > 0
                          ? item.userSetColors.map((color, index) => (
                              <li key={index} style={{ marginBottom: '5px' }}>
                                {color}
                              </li>
                            ))
                          : 'N/A'}
                      </strong>
                      -------------------------
                    </li>
                  ))
                : 'N/A'}
            </p>
            <p className='userlist-item'>
              <strong className='item-heading'>customPairs:</strong>{' '}
              {JSON.stringify(showUser.customPairs ?? 'N/A')}
            </p>
            <p className='userlist-item'>
              <strong className='item-heading'>deleteAllDone:</strong>{' '}
              {showUser.deleteAllDone ?? 'N/A'}
            </p>
            <p className='userlist-item'>
              <strong className='item-heading'>
                favoritePaletteReference:
              </strong>{' '}
              {showUser.favoritePaletteReference ?? 'N/A'}
            </p>
            <p className='userlist-item'>
              <strong className='item-heading'>fontSize:</strong>{' '}
              {showUser.fontSize ?? 'N/A'}
            </p>
            <p className='userlist-item'>
              <strong className='item-heading'>fullname:</strong>{' '}
              {showUser.fullname ?? 'N/A'}
            </p>
            <p className='userlist-item'>
              <strong className='item-heading'>hideDoneNotes:</strong>{' '}
              {showUser.hideDoneNotes ?? 'N/A'}
            </p>
            <p className='userlist-item'>
              <strong className='item-heading'>isAuthActive:</strong>{' '}
              {showUser.isAuthActive ?? 'N/A'}
            </p>
            <p className='userlist-item'>
              <strong className='item-heading'>loginList:</strong>
              {showUser.loginList?.length > 0
                ? showUser.loginList.map((item, index) => (
                    <li
                      key={index}
                      className='list-par'
                      style={{ marginBottom: '5px' }}
                    >
                      {item}
                    </li>
                  ))
                : 'N/A'}
            </p>
            <p className='userlist-item'>
              <strong className='item-heading'>notes:</strong>
              {showUser.notes?.length > 0
                ? showUser.notes.map((note) => (
                    <li className='list-par' key={note.id ?? Math.random()}>
                      <strong>⭐ id:</strong> {note.id ?? 'N/A'} <br />
                      <strong>colorString:</strong> {note.colorString ?? 'N/A'}{' '}
                      <br />
                      <strong>content:</strong> {note.content ?? 'N/A'} <br />
                      <strong>createdAt:</strong> {note.createdAt ?? 'N/A'}{' '}
                      <br />
                      <strong>dueDate:</strong> {note.dueDate ?? 'N/A'} <br />
                      <strong>fontColor:</strong> {note.fontColor ?? 'N/A'}{' '}
                      <br />
                      <strong>isDone:</strong> {note.isDone ?? 'N/A'} <br />
                      <strong>title:</strong> {note.title ?? 'N/A'} <br />
                      ---------------------------
                    </li>
                  ))
                : 'N/A'}
            </p>
            <p className='userlist-item'>
              <strong className='item-heading'>password:</strong>{' '}
              {showUser.password ?? 'N/A'}
            </p>
            <p className='userlist-item'>
              <strong className='item-heading'>roles:</strong>
              {showUser.roles?.length > 0
                ? showUser.roles.map((role, index) => (
                    <li key={index} style={{ marginBottom: '5px' }}>
                      {role}
                    </li>
                  ))
                : 'N/A'}
            </p>
            <p className='userlist-item'>
              <strong className='item-heading'>showNoteTitles:</strong>{' '}
              {showUser.showNoteTitles ?? 'N/A'}
            </p>
            <p className='userlist-item'>
              <strong className='item-heading'>theme:</strong>{' '}
              {showUser.theme ?? 'N/A'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UsersList;
