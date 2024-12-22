import React, { useState, useEffect } from 'react';
import api from '../../api/axiosConfig';
import './NoteList.css';
import EditPopup from '../EditPopup/EditPopup';
import { turnEnumToHex, turnHexToEnum } from '../features/helpers';

const NoteList = ({ notes, onDelete, titles, onLoad, fontSize, colors }) => {
  const [editingNote, setEditingNote] = useState(null);
  const [areTitlesVisible, setAreTitlesVisible] = useState(true);
  const [isDoneList, setIsDoneList] = useState([]);

  // Sync the `isDoneList` whenever `notes` change
  useEffect(() => {
    setAreTitlesVisible(titles);

    // Initialize `isDoneList` based on the `notes` prop
    const initialIsDoneList = notes.map((note) => note.isDone); // Make sure `isDone` is the correct property
    setIsDoneList(initialIsDoneList);
  }, [notes, titles]); // Re-run when notes or titles change

  const handleEdit = (noteId) => {
    setEditingNote(noteId);
  };

  const handleCancelEdit = () => {
    setEditingNote(null);
  };

  const handleSave = async (
    noteId,
    editedContent,
    selectedColor,
    editedName
  ) => {
    try {
      const editedNote = notes.find((note) => note.id === noteId);
      editedNote.content = editedContent;
      editedNote.color = selectedColor;
      editedNote.title = editedName;

      let editedBody = {
        content: editedContent,
        title: editedName,
        color: turnHexToEnum(selectedColor),
      };

      console.log(editedBody);

      await api.patch(`/api/notes/${noteId}`, editedBody, {
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

      console.log('IS DONE STATE: ', newDoneState);

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

      onLoad(); // Reload to reflect changes from DB
    } catch (error) {
      console.error('Error while changing note state:', error);
    }
  };

  return (
    <div className='main-container'>
      {notes.map((note, index) => (
        <div key={note.id} style={{ position: 'relative' }}>
          <div
            className={`note-container ${isDoneList[index] ? 'overlay' : ''}`}
            style={{
              backgroundColor: isDoneList[index]
                ? 'grey'
                : turnEnumToHex(note.color),
            }}
          >
            {editingNote === note.id ? (
              <EditPopup
                note={note}
                onSave={handleSave}
                onCancel={handleCancelEdit}
                fontSize={fontSize}
                colors={colors}
              />
            ) : null}
            <div>
              <span
                className='close-button'
                onClick={() => handleDelete(note.id)}
              >
                X
              </span>

              {areTitlesVisible ? (
                <h2 className='handwriting' style={{ fontSize: fontSize }}>
                  {note.title}
                </h2>
              ) : (
                <h2></h2>
              )}

              <div className='handwriting' style={{ fontSize: fontSize }}>
                {note.content}
              </div>
              <hr className='line'></hr>
              <div
                className='heading-small'
                style={{
                  fontSize:
                    fontSize === 'var(--font-size-big)' ? '20px' : '15px',
                }}
              >
                Note-id: {note.id}
              </div>
              <br />

              <div className='note-footer'>
                <span
                  className={isDoneList[index] ? 'invisible' : 'link-default'}
                  style={{ fontSize: fontSize }}
                  disabled={isDoneList[index]}
                  onClick={() => handleEdit(note.id)}
                >
                  Edit
                </span>
                <button
                  onClick={() => handleDone(note.id, index)}
                  className={`done-button`}
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
