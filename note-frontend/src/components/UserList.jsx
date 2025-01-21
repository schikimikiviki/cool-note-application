import { useState, useEffect } from 'react';
import api from '../api/axiosConfig.js';

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
      }}
    >
      <div>
        <ul>
          {currentUsers.map((user) => (
            <li key={user.id}>
              {user.username}
              <button onClick={() => handleShowUser(user)}>View Details</button>
            </li>
          ))}
        </ul>
        <div>
          {[...Array(Math.ceil(users.length / usersPerPage)).keys()].map(
            (number) => (
              <button key={number} onClick={() => paginate(number + 1)}>
                {number + 1}
              </button>
            )
          )}
        </div>
      </div>
      {showUser && (
        <div style={{ marginLeft: '20px' }}>
          <h2>User Details</h2>
          <p>
            <strong>username:</strong> {showUser.username}
          </p>
          <p>
            <strong>id:</strong> {showUser.id}
          </p>
          <p>
            <strong>email:</strong> {showUser.email}
          </p>
          <p>
            <strong>colorPalette:</strong>
            {JSON.stringify(showUser.colorPalette)}
          </p>
          <p>
            <strong>customColorPaletteList:</strong>

            {showUser.customColorPaletteList.map((item) => (
              <li key={item.id}>
                <strong>id:</strong> {item.id} <br />
                <strong>name:</strong> {item.name} <br />
                <strong>
                  userSetColors:
                  {item.userSetColors.map((item, index) => (
                    <li key={index} style={{ marginBottom: '5px' }}>
                      {item}
                    </li>
                  ))}
                </strong>
              </li>
            ))}
          </p>
          <p>
            <strong>customPairs:</strong>
            {JSON.stringify(showUser.customPairs)}
          </p>
          <p>
            <strong>customColorPaletteList:</strong>
            {JSON.stringify(showUser.customColorPaletteList)}
          </p>
          <p>
            <strong>deleteAllDone:</strong>
            {showUser.deleteAllDone}
          </p>
          <p>
            <strong>favoritePaletteReference:</strong>
            {showUser.favoritePaletteReference}
          </p>
          <p>
            <strong>fontSize:</strong>
            {showUser.fontSize}
          </p>
          <p>
            <strong>fullname:</strong>
            {showUser.fullname}
          </p>
          <p>
            <strong>hideDoneNotes:</strong>
            {showUser.hideDoneNotes}
          </p>
          <p>
            <strong>isAuthActive:</strong>
            {showUser.isAuthActive}
          </p>
          <p>
            <strong>loginList:</strong>
            {showUser.loginList.map((item, index) => (
              <li key={index} style={{ marginBottom: '5px' }}>
                {item}
              </li>
            ))}
          </p>

          <p>
            <strong>notes:</strong>

            {showUser.notes.map((item) => (
              <li key={item.id}>
                <strong>id:</strong> {item.id} <br />
                <strong>colorString:</strong> {item.colorString} <br />
                <strong>content:</strong> {item.content} <br />
                <strong>createdAt:</strong> {item.createdAt} <br />
                <strong>dueDate:</strong> {item.dueDate} <br />
                <strong>fontColor:</strong> {item.fontColor} <br />
                <strong>isDone:</strong> {item.isDone} <br />
                <strong>title:</strong> {item.title} <br />
              </li>
            ))}
          </p>
          <p>
            <strong>password:</strong>
            {showUser.password}
          </p>
          <p>
            <strong>roles:</strong>
            {showUser.roles.map((item, index) => (
              <li key={index} style={{ marginBottom: '5px' }}>
                {item}
              </li>
            ))}
          </p>
          <p>
            <strong>showNoteTitles:</strong>
            {showUser.showNoteTitles}
          </p>
          <p>
            <strong>theme:</strong>
            {showUser.theme}
          </p>
        </div>
      )}
    </div>
  );
};

export default UsersList;
