import { useState } from 'react';
import UsersList from '../UserList';
import './AdminPage.css';

const AdminPage = () => {
  return (
    <>
      <div className='admin-page'>
        <h1>Admin Page</h1>

        <h2>
          <u>Get all users</u>
        </h2>
        <UsersList />
        <h2>
          <u>Add a new user</u>
        </h2>
        <h2>
          <u>Delete user</u>
        </h2>
      </div>
    </>
  );
};

export default AdminPage;
