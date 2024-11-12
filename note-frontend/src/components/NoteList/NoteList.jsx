import React, { useState, useRef, useEffect } from 'react';
import api from '../../api/axiosConfig';
import './NoteList.css';
import EditPopup from '../EditPopup/EditPopup';

const NoteList = ({ notes, onDelete, titles }) => {
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
      editedNote.name = editedName;

      console.log(editedNote);

      await api.put(`/api/notes/${noteId}`, editedNote);

      setEditingNote(null);
    } catch (error) {
      console.error('Error while saving note:', error);
    }
  };

  const handleDelete = async (noteId) => {
    try {
      await api.delete(`/${noteId}`);
      console.log(`Note with id ${noteId} sucessfully deleted!`);
      onDelete(noteId);
    } catch (error) {
      console.error('Error while deleting note:', error);
    }
  };

  const handleDone = async (noteId, index) => {
    try {
      const updatedNote = await api.patch(`/${noteId}`, {
        done: !isDoneList[index],
      });

      if (updatedNote) {
        const updatedIsDoneList = [...isDoneList];
        updatedIsDoneList[index] = !isDoneList[index];
        setIsDoneList(updatedIsDoneList);
      }
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
              backgroundColor: isDoneList[index] ? 'grey' : note.color,
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
                <h2 className='handwriting'>{note.name}</h2>
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
