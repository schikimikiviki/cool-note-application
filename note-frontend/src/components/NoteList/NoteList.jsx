import React, { useState, useEffect } from 'react';
import api from '../../api/axiosConfig';
import './NoteList.css';
import EditPopup from '../EditPopup/EditPopup';
import parse from 'html-react-parser';
import { turnEnumToHex, turnHexToEnum } from '../features/helpers';

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
}) => {
  const [editingNote, setEditingNote] = useState(null);
  const [areTitlesVisible, setAreTitlesVisible] = useState();
  const [isDoneList, setIsDoneList] = useState([]);
  const [areDoneDeleted, setAreDoneDeleted] = useState();

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
    if (isDefault) {
      onEditDefault(noteObj, noteId);
      setTimeout(() => {
        setEditingNote(null);
      }, 0);
    } else {
      try {
        console.log('Edited Body:', noteObj);

        await api.patch(`/api/notes/${noteId}`, noteObj, {
          headers: {
            'Content-Type': 'application/json',
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

  const handleDelete = async (noteId) => {
    try {
      await api.delete(`api/notes/${noteId}`);
      console.log(`Note with id ${noteId} sucessfully deleted!`);
      onDelete(noteId);
    } catch (error) {
      console.error('Error while deleting note:', error);
    }
  };

  const handleDone = async (noteId, index) => {
    try {
      // Toggle the current state (done <-> not done)
      const newDoneState = !isDoneList[index];

      // console.log('IS DONE STATE: ', newDoneState);

      // Send the PATCH request to update the `done` state
      const response = await api.patch(
        `/api/notes/${noteId}`,
        { isDone: newDoneState }, // Send the updated 'done' state
        {
          headers: {
            'Content-Type': 'application/json',
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
        console.log('user has set done notes to be deleted!');

        try {
          api.delete(`/api/notes/${noteId}`, {
            headers: { 'Content-Type': 'application/json' },
          });

          console.log('All notes deleted');
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
      {notes.map((note, index) => (
        <div key={note.id} style={{ position: 'relative' }}>
          <div
            className={`note-container ${isDoneList[index] ? 'overlay' : ''}`}
            style={{
              backgroundColor: isDoneList[index] ? 'grey' : note.colorString,
              visibility: isDoneList[index] && areDoneDeleted ? 'hidden' : '',
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
                  marginTop: '-20px',
                  marginLeft: '-20px',
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
                  className={isDoneList[index] ? 'invisible' : 'link-default'}
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
