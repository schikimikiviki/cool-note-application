import axios from 'axios';

export const fetchGetFromBackend = async (path, errorType) => {
  try {
    const res = await fetch(`http://localhost:8080/${path}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!res.ok) {
      throw new Error(`HTTP error! Status: ${res.status}`);
    }

    const data = await res.json();

    return data;
  } catch (error) {
    console.error(`Error during fetch type: ${errorType} - ${error}`);
    return null; // Explicitly return null if an error occurs
  }
};

export const loadUserNotes = async (userName) => {
  try {
    const response = await axios.get(`http://localhost:8080/users/${userName}`);
    console.log('fetching url: ', `http://localhost:8080/users/${userName}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching user notes:', error);
    throw error;
  }
};

export const turnHexToEnum = (hex) => {
  let enumVal;
  if (hex === '#FF595E') {
    enumVal = 'RED';
  } else if (hex === '#FFCA3A') {
    enumVal = 'YELLOW';
  } else if (hex === '#8AC926') {
    enumVal = 'GREEN';
  } else if (hex === '#1982C4') {
    enumVal = 'BLUE';
  } else if (hex === '#6A4C93') {
    enumVal = 'PURPLE';
  }
  return enumVal;
};

export const turnEnumToHex = (color) => {
  let hex;
  if (color === 'RED') {
    hex = '#FF595E';
  } else if (color === 'YELLOW') {
    hex = '#FFCA3A';
  } else if (color === 'GREEN') {
    hex = '#8AC926';
  } else if (color === 'BLUE') {
    hex = '#1982C4';
  } else if (color === 'PURPLE') {
    hex = '#6A4C93';
  }
  return hex;
};

export default {
  loadUserNotes,
  fetchGetFromBackend,
  turnEnumToHex,
  turnHexToEnum,
};
