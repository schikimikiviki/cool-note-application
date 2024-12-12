import React, { useState, useRef, useEffect } from 'react';
import api from '../../api/axiosConfig';
import './NoteList.css';
import EditPopup from '../EditPopup/EditPopup';
import { loadUserNotes } from '../features/helpers';
import { turnEnumToHex, turnHexToEnum } from '../features/helpers';

const NoteList = ({ notes, onDelete, titles, onLoad }) => {
  const [editingNote, setEditingNote] = useState(null);
  const [areTitlesVisible, setAreTitlesVisible] = useState(true);
  const [isDoneList, setIsDoneList] = useState(Array(notes.length).fill(false));

  useEffect(() => {
    setAreTitlesVisible(titles);

    const initialIsDoneList = notes.map((note) => note.done);
    setIsDoneList(initialIsDoneList);
  }, [titles, notes]);

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
      // Toggle the current state
      const newDoneState = !isDoneList[index];

      console.log('IS DONE STATE: ');
      // Send the PATCH request to update the `done` state
      const response = await api.patch(
        `/api/notes/${noteId}`,
        { isDone: newDoneState },
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
    } catch (error) {
      console.error('Error while changing note state:', error);
    }
  };

  // const handleDone = async (noteId, index) => {
  //   try {
  //     const noteToChange = notes.find((note) => note.id === noteId);
  //     const updatedNote = await api.patch(`/api/notes/${noteId}`, {
  //       ...noteToChange,
  //       done: !isDoneList[index],
  //     });

  //     if (updatedNote) {
  //       const updatedIsDoneList = [...isDoneList];
  //       updatedIsDoneList[index] = !isDoneList[index];
  //       setIsDoneList(updatedIsDoneList);
  //     }
  //   } catch (error) {
  //     console.error('Error while changing note state:', error);
  //   }
  // };

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
                <h2 className='handwriting'>{note.title}</h2>
              ) : (
                <h2></h2>
              )}

              <div className='handwriting'>{note.content}</div>
              <hr className='line'></hr>
              <div className='heading-small'>Note-id: {note.id}</div>
              <br />

              <div className='note-footer'>
                <span
                  className={isDoneList[index] ? 'invisible' : 'link-default'}
                  disabled={isDoneList[index]}
                  onClick={() => handleEdit(note.id)}
                >
                  Edit
                </span>
                <button
                  onClick={() => handleDone(note.id, index)}
                  className={`done-button ${
                    isDoneList[index] ? 'disabled' : ''
                  }`}
                  disabled={isDoneList[index]}
                >
                  {isDoneList[index] ? '✔️' : 'Done ✔️'}
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
