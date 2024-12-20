import axios from 'axios';

export const getAllColorPalettes = async () => {
  // fetch available color palettes

  try {
    const res = await fetch(`http://localhost:8080/api/colorpalettes/`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!res.ok) {
      throw new Error(`HTTP error! Status: ${res.status}`);
    }

    const data = await res.json();

    // console.log('DATA: ', data);

    return data;
  } catch (error) {
    console.error(`Error during fetch type:  ${error}`);
    return null; // Explicitly return null if an error occurs
  }
};

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

const colorMapping = {
  RED: '#FF595E',
  YELLOW: '#FFCA3A',
  GREEN: '#8AC926',
  BLUE: '#1982C4',
  PURPLE: '#6A4C93',
  COTTONCANDY: '#ffd6ff',
  MAGNOLIA: '#E7C6FF',
  LAVENDER: '#C8B6FF',
  SKY: '#b8c0ff',
  MEDIUMBLUE: '#BBD0FF',
  MOSS: '#606C38',
  OGRE: '#283618',
  CREME: '#FEFAE0',
  BEIGE: '#DDA15E',
  PUMPKIN: '#BC6C25',
  MARINE: '#26547C',
  FUCHSIA: '#EF476F',
  EGG: '#FFD166',
  TURQUOISE: '#06D6A0',
  WHITE: '#FFFCF9',
  BROWN: '#825F45',
  GREENISH: '#797D62',
  OCRE: '#D08C60',
  BRIGHT: '#FFCB69',
  COOL: '#997B66',
  NEON_YELLOW: '#FFDD00',
  NEON_ORANGE: '#FF7D00',
  NEON_PINK: '#FF006D',
  NEON_GREEN: '#ADFF02',
  NEON_PURPLE: '#8F00FF',
};

export const turnEnumToHex = (color) => colorMapping[color] || null;

// Convert hex to enum
export const turnHexToEnum = (hex) => {
  const entries = Object.entries(colorMapping);
  const match = entries.find(([_, value]) => value === hex);
  return match ? match[0] : null;
};

export default {
  loadUserNotes,
  fetchGetFromBackend,
  turnEnumToHex,
  turnHexToEnum,
  getAllColorPalettes,
};
