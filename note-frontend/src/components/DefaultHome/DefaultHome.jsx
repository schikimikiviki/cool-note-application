import { useState } from 'react';
import { useLocation } from 'react-router-dom';

import '../../index.css';
import NoteList from '../NoteList/NoteList.jsx';
import DefaultHeader from '../DefaultHeader/DefaultHeader.jsx';
import Popup from '../Popup/Popup.jsx';
import DefaultFooter from '../DefaultFooter/DefaultFooter.jsx';
import ColorSort from '../ColorSort/ColorSort.jsx';

function DefaultHome() {
  const [originalNotes, setOriginalNotes] = useState([
    {
      id: 1,
      title: 'Hello and welcome to the notes app!',
      content:
        'Take a look around. You can add notes by clicking the Add Note button in the top right. ',
      createdAt: '2025-01-08T19:53:30.618715',
      colorString: '#ffd6ff',
      isDone: false,
      fontColor: '#000000',
      dueDate: '2025-01-09T09:53:00.000Z',
    },
    {
      id: 2,
      title: 'You can test the functionality ... ',
      content:
        'Add a note that is due today. Now you can filter for this note.',
      createdAt: '2025-01-08T19:53:30.618715',
      colorString: '#E7C6FF',
      isDone: false,
      fontColor: '#000000',
      dueDate: '2025-01-09T09:53:00.000Z',
    },
    {
      id: 3,
      title: 'Search for an important note ... ',
      content:
        'You can also use the search bar to look up notes containing a specific title or content.',
      createdAt: '2025-01-08T19:53:30.618715',
      colorString: '#BBD0FF',
      isDone: false,
      fontColor: '#000000',
      dueDate: '2025-01-09T09:53:00.000Z',
    },
    {
      id: 4,
      title: 'Filter for a color ... ',
      content:
        'You can categorize your notes by color. Click on a color to use it as a filter.',
      createdAt: '2025-01-08T19:53:30.618715',
      colorString: '#E7C6FF',
      isDone: false,
      fontColor: '#000000',
      dueDate: '2025-01-09T09:53:00.000Z',
    },
    {
      id: 5,
      title: 'Like using notes?',
      content:
        'Use the register button to sign up and save your notes permanently.',
      createdAt: '2025-01-08T19:53:30.618715',
      colorString: '#C8B6FF',
      isDone: false,
      fontColor: '#000000',
      dueDate: '2025-01-09T09:53:00.000Z',
    },
    {
      id: 6,
      title: '... or download the app',
      content:
        '<p>for IOS and Android: <a rel="noopener noreferrer nofollow" href="https://blitznotiz.at/pwa"><u>here</u></a></p>',
      createdAt: '2025-01-08T19:53:30.618715',
      colorString: '#C8B6FF',
      isDone: false,
      fontColor: '#000000',
      dueDate: '2025-01-09T09:53:00.000Z',
    },
  ]);
  const [filteredNotes, setFilteredNotes] = useState(originalNotes);
  const [userData, setUserData] = useState({
    id: 0,
    username: 'Testuser',
    fullname: 'Test user',
    theme: 'NIGHT',
    fontSize: 'SMALL',
    colorPalette: {
      id: 10001,
      name: 'Pastel',
      colorList: ['#ffd6ff', '#E7C6FF', '#C8B6FF', '#b8c0ff', '#BBD0FF'],
    },
    notes: originalNotes,
  });
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isDarkThemeSet, setIsDarkThemeSet] = useState(false);
  const [hideTitles, setHideTitles] = useState(true);
  const location = useLocation();
  const { applicationState } = location.state || {};
  const [fontSize, setFontSize] = useState(); // put css prop in here
  const [userColors, setUserColors] = useState();
  const [hideDoneNotes, setHideDoneNotes] = useState(false);

  const openPopup = () => {
    setIsPopupOpen(true);
  };

  const closePopup = () => {
    setIsPopupOpen(false);
  };

  const handleThemeChange = () => {
    setIsDarkThemeSet(!isDarkThemeSet);
  };

  const handleSearch = (searchTerm) => {
    if (searchTerm === '') {
      setFilteredNotes(originalNotes);
    } else {
      const filteredNotes = originalNotes.filter(
        (note) =>
          note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          note.content.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredNotes(filteredNotes);
    }
  };

  const changeTitles = (data) => {
    setHideTitles(data);
  };

  const handleColorSort = (color) => {
    if (color === null) {
      setFilteredNotes(originalNotes);
    } else {
      const filteredNotes = originalNotes.filter(
        (note) => note.colorString === color
      );
      setFilteredNotes(filteredNotes);
    }
  };

  const handleHideNotes = (data) => {
    setHideDoneNotes(data);
    if (data) {
      const filteredNotes = originalNotes.filter((note) => !note.isDone);
      setFilteredNotes(filteredNotes);
    } else {
      setFilteredNotes(originalNotes);
    }
  };

  const filterDueDate = (filterState) => {
    if (filterState) {
      const today = new Date().toISOString().slice(0, 10);
      const filteredNotes = originalNotes.filter((note) => {
        if (note.dueDate) {
          const noteDate = note.dueDate.split('T')[0];
          return noteDate === today;
        }
        return false;
      });
      setFilteredNotes(filteredNotes);
    } else {
      setFilteredNotes(originalNotes);
    }
  };

  const handleAddNote = (newNote) => {
    setOriginalNotes((prevNotes) => [...prevNotes, newNote]);
    setFilteredNotes((prevNotes) => [...prevNotes, newNote]);
  };

  const editNoteDefault = (noteBody, noteId) => {
    setOriginalNotes((prevNotes) =>
      prevNotes.map((note) =>
        note.id === noteId ? { ...note, ...noteBody } : note
      )
    );
    setFilteredNotes((prevNotes) =>
      prevNotes.map((note) =>
        note.id === noteId ? { ...note, ...noteBody } : note
      )
    );
  };

  const handleDoneNote = (doneState, noteId) => {
    const updatedNotes = originalNotes.map((note) => {
      if (note.id === noteId) {
        return { ...note, isDone: doneState };
      }
      return note;
    });

    setOriginalNotes([...updatedNotes]);
    setFilteredNotes([...updatedNotes]);
  };

  const handleDelete = (noteId) => {
    const updatedNotes = originalNotes.filter((note) => note.id !== noteId);
    setOriginalNotes([...updatedNotes]);
    setFilteredNotes([...updatedNotes]);
  };

  return (
    <div
      className={`main-page ${isDarkThemeSet ? 'dark-theme' : 'light-theme'}`}
    >
      {isDarkThemeSet ? (
        <div className='bg-animation'>
          <div id='stars'></div>
          <div id='stars2'></div>
          <div id='stars3'></div>
          <div id='stars4'></div>
        </div>
      ) : (
        <div id='background-wrap'>
          <div className='x1'>
            <div className='cloud'></div>
          </div>
          <div className='x2'>
            <div className='cloud'></div>
          </div>
          <div className='x3'>
            <div className='cloud'></div>
          </div>
          <div className='x4'>
            <div className='cloud'></div>
          </div>
          <div className='x5'>
            <div className='cloud'></div>
          </div>
        </div>
      )}

      <DefaultHeader
        onClick={handleThemeChange}
        onReceive={openPopup}
        onType={handleSearch}
      />
      {isPopupOpen && (
        <Popup
          isDefault='true'
          onClose={closePopup}
          onAdd={handleAddNote}
          colors={userData.colorPalette.colorList}
        />
      )}

      <ColorSort
        colors={userData.colorPalette.colorList}
        onColorSort={handleColorSort}
        fontSize={fontSize}
        onFilterDue={filterDueDate}
      />

      <NoteList
        userData={userData}
        notes={filteredNotes}
        titles={hideTitles}
        isDoneDelete={hideDoneNotes}
        fontSize={fontSize}
        colors={userColors}
        isDefault={true}
        onEditDefault={editNoteDefault}
        updateDone={handleDoneNote}
        onDefaultDelete={handleDelete}
      />
      <DefaultFooter
        titles={hideTitles}
        onTitleChange={changeTitles}
        userDetails={userData}
        fontSize={fontSize}
        onHide={handleHideNotes}
        deleteDone={hideDoneNotes}
      />
    </div>
  );
}

export default DefaultHome;
