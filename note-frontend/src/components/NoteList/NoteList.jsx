import React, { useState, useEffect } from 'react';
import api from '../../api/axiosConfig';
import './NoteList.css';
import EditPopup from '../EditPopup/EditPopup';
import parse from 'html-react-parser';

const NoteList = ({
  notes,
  onDelete,
  titles,
  onLoad,
  fontSize,
  colors,
  isDoneDelete,
  userData,
  isDefault,
  onEditDefault,
  updateDone,
  onDefaultDelete,
}) => {
  const [editingNote, setEditingNote] = useState(null);
  const [areTitlesVisible, setAreTitlesVisible] = useState();
  const [isDoneList, setIsDoneList] = useState([]);
  const [areDoneDeleted, setAreDoneDeleted] = useState();
  const [width, setWidth] = useState(window.innerWidth);
  const [isMobile, setIsMobile] = useState(false);

  function handleWindowSizeChange() {
    setWidth(window.innerWidth);
  }
  useEffect(() => {
    window.addEventListener('resize', handleWindowSizeChange);
    return () => {
      window.removeEventListener('resize', handleWindowSizeChange);
    };
  }, []);

  useEffect(() => {
    setIsMobile(width <= 768 ? true : false);
  }, [width]);

  // Sync the `isDoneList` whenever `notes` change
  useEffect(() => {
    setAreTitlesVisible(titles);

    // Initialize `isDoneList` based on the `notes` prop
    const initialIsDoneList = notes.map((note) => note.isDone); // Make sure `isDone` is the correct property
    setIsDoneList(initialIsDoneList);
    setAreDoneDeleted(isDoneDelete);
  }, [notes, titles, isDoneDelete]);

  const handleEdit = (noteId) => {
    setEditingNote(noteId);
  };

  const handleCancelEdit = () => {
    setEditingNote(null);
  };

  const handleSave = async (noteId, noteObj) => {
    const authToken = localStorage.getItem('authToken');

    if (isDefault) {
      onEditDefault(noteObj, noteId);
      setTimeout(() => {
        setEditingNote(null);
      }, 0);
    } else {
      try {
        // console.log('Edited Body:', noteObj);

        await api.patch(`/api/notes/${noteId}`, noteObj, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Basic ${authToken}`,
          },
        });
        setEditingNote(null);

        // load ausführen, damit die edited note im state ist
        onLoad();
      } catch (error) {
        console.error('Error while saving note:', error);
      }
    }
  };

  const handleDeleteDefault = async (noteId) => {
    onDefaultDelete(noteId);
  };

  const handleDelete = async (noteId) => {
    const authToken = localStorage.getItem('authToken');

    try {
      await api.delete(`api/notes/${noteId}`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Basic ${authToken}`,
        },
      });
      // console.log(`Note with id ${noteId} sucessfully deleted!`);
      onDelete(noteId);
    } catch (error) {
      console.error('Error while deleting note:', error);
    }
  };

  const handleDoneNote = async (state, noteId) => {
    updateDone(state, noteId);
  };

  const handleDone = async (noteId, index) => {
    try {
      // Toggle the current state (done <-> not done)
      const newDoneState = !isDoneList[index];

      // console.log('IS DONE STATE: ', newDoneState);
      const authToken = localStorage.getItem('authToken');

      // Send the PATCH request to update the `done` state
      const response = await api.patch(
        `/api/notes/${noteId}`,
        { isDone: newDoneState }, // Send the updated 'done' state
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Basic ${authToken}`,
          },
        }
      );

      // If the update is successful, update the local state
      if (response.status === 200) {
        const updatedIsDoneList = [...isDoneList];
        updatedIsDoneList[index] = newDoneState;
        setIsDoneList(updatedIsDoneList);
      }

      if (userData.deleteAllDone) {
        // console.log('user has set done notes to be deleted!');

        try {
          api.delete(`/api/notes/${noteId}`, {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Basic ${authToken}`,
            },
          });

          // console.log('All notes deleted');
        } catch (err) {
          console.error('Error deleting notes:', err);
          return; // Exit early if deletion fails
        }
      }

      onLoad(); // Reload to reflect changes from DB
    } catch (error) {
      console.error('Error while changing note state:', error);
    }
  };

  const changeISOString = (isostring) => {
    // format so this looks better
    if (!isostring) return '';
    const parts = isostring.split('T');
    const result = parts[0] + ' @' + parts[1].substring(0, 5);
    return result;
  };

  return (
    <div className='main-container'>
      {isDefault
        ? notes.map((note) => (
            <div lang='de' key={note.id} style={{ position: 'relative' }}>
              <div
                className={`note-container ${note.isDone ? 'overlay' : ''}`}
                style={{
                  backgroundColor: note.isDone ? 'grey' : note.colorString,
                  visibility: note.isDone && areDoneDeleted ? 'hidden' : '',
                }}
              >
                {editingNote === note.id ? (
                  <EditPopup
                    note={note}
                    onSave={handleSave}
                    onCancel={handleCancelEdit}
                    fontSize={fontSize}
                    colors={colors}
                    isDefault={isDefault}
                  />
                ) : null}

                <div>
                  <p
                    style={{
                      fontStyle: userData.fontStyle,
                      fontSize: isMobile ? '13px' : fontSize,
                      color: note.fontColor,
                      marginTop: isMobile ? '-10px' : '-20px',
                      marginLeft: isMobile ? '-10px' : '-20px',
                      marginBottom: '10px',
                    }}
                  >
                    {changeISOString(note.dueDate) || ''}
                  </p>
                  <span
                    className='close-button'
                    onClick={() => handleDeleteDefault(note.id)}
                  >
                    X
                  </span>

                  {areTitlesVisible ? (
                    <h2
                      lang='de'
                      className='handwriting'
                      style={{
                        fontSize: isMobile
                          ? '18px'
                          : fontSize === 'var(--font-size-big)'
                          ? '35px'
                          : '18px',
                        color: note.fontColor || '#000000',
                        fontFamily: userData.fontStyle || 'Montserrat',
                        marginBottom: '10px',
                      }}
                    >
                      {note.title}
                    </h2>
                  ) : (
                    <h2></h2>
                  )}

                  <div
                    className='handwriting'
                    style={{
                      fontSize: isMobile ? '16px' : fontSize,
                      color: note.fontColor || '#000000',
                      fontFamily: userData.fontStyle || 'Montserrat',
                    }}
                  >
                    {parse(note.content)}
                  </div>
                  <hr className='line'></hr>
                  <div
                    className='heading-small'
                    style={{
                      fontSize:
                        fontSize === 'var(--font-size-big)' ? '20px' : '15px',
                      fontFamily: userData.fontStyle || 'Montserrat',
                    }}
                  >
                    Note-id: {note.id}
                  </div>
                  <br />

                  <div className='note-footer'>
                    <p
                      className={note.isDone ? 'invisible' : 'link-default'}
                      style={{
                        fontSize: fontSize,
                        fontFamily: userData.fontStyle || 'Montserrat',
                      }}
                      disabled={note.isDone}
                      onClick={() => handleEdit(note.id)}
                    >
                      Edit
                    </p>
                    <button
                      onClick={() => handleDoneNote(!note.isDone, note.id)}
                      className='done-button'
                      style={{ fontFamily: userData.fontStyle || 'Montserrat' }}
                    >
                      {note.isDone ? '✔️' : 'Done ✔️'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        : notes.map((note, index) => (
            <div lang='de' key={note.id} style={{ position: 'relative' }}>
              <div
                className={`note-container ${
                  isDoneList[index] ? 'overlay' : ''
                }`}
                style={{
                  backgroundColor: isDoneList[index]
                    ? 'grey'
                    : note.colorString,
                  visibility:
                    isDoneList[index] && areDoneDeleted ? 'hidden' : '',
                }}
              >
                {editingNote === note.id ? (
                  <EditPopup
                    note={note}
                    onSave={handleSave}
                    onCancel={handleCancelEdit}
                    fontSize={fontSize}
                    colors={colors}
                    isDefault={isDefault}
                  />
                ) : null}
                <div>
                  <p
                    style={{
                      fontStyle: userData.fontStyle,
                      fontSize: fontSize,
                      color: note.fontColor,
                      marginTop: '-10px',
                      marginLeft: '-10px',
                      marginBottom: '10px',
                    }}
                  >
                    {changeISOString(note.dueDate) || ''}
                  </p>
                  <span
                    className='close-button'
                    onClick={() => handleDelete(note.id)}
                  >
                    X
                  </span>

                  {areTitlesVisible ? (
                    <h2
                      lang='de'
                      className='handwriting'
                      style={{
                        fontSize:
                          fontSize === 'var(--font-size-big)' ? '35px' : '18px',
                        color: note.fontColor || '#000000',
                        fontFamily: userData.fontStyle || 'Montserrat',
                        marginBottom: '10px',
                      }}
                    >
                      {note.title}
                    </h2>
                  ) : (
                    <h2></h2>
                  )}

                  <div
                    className='handwriting'
                    style={{
                      fontSize: fontSize,
                      color: note.fontColor || '#000000',
                      fontFamily: userData.fontStyle || 'Montserrat',
                    }}
                  >
                    {parse(note.content)}
                  </div>
                  <hr className='line'></hr>
                  <div
                    className='heading-small'
                    style={{
                      fontSize:
                        fontSize === 'var(--font-size-big)' ? '20px' : '15px',
                      fontFamily: userData.fontStyle || 'Montserrat',
                    }}
                  >
                    Note-id: {note.id}
                  </div>
                  <br />

                  <div className='note-footer'>
                    <span
                      className={
                        isDoneList[index] ? 'invisible' : 'link-default'
                      }
                      style={{
                        fontSize: fontSize,
                        fontFamily: userData.fontStyle || 'Montserrat',
                      }}
                      disabled={isDoneList[index]}
                      onClick={() => handleEdit(note.id)}
                    >
                      Edit
                    </span>
                    <button
                      onClick={() => handleDone(note.id, index)}
                      className={`done-button`}
                      style={{ fontFamily: userData.fontStyle || 'Montserrat' }}
                    >
                      {isDoneList[index] ? '✔️ ' : 'Done ✔️'}{' '}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
    </div>
  );
};

export default NoteList;
