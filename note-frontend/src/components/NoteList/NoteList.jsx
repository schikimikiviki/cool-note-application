import React, { useState } from "react";
import api from "../../api/axiosConfig";
import "./NoteList.css";

const NoteList = ({ notes, onDelete }) => {
  const [editingNote, setEditingNote] = useState(null);
  const [editedContent, setEditedContent] = useState("");

  const handleEdit = async (noteId) => {
    try {
      const noteToEdit = notes.find((note) => note.id === noteId);
      setEditingNote(noteId);
      setEditedContent(noteToEdit.content);
    } catch (error) {
      console.error("Error while editing note:", error);
    }
  };

  const handleSave = async (noteId) => {
    try {
      const editedNote = notes.find((note) => note.id === noteId);
      editedNote.content = editedContent;

      await api.put(`/${noteId}`, editedNote);

      setEditingNote(null);
    } catch (error) {
      console.error("Error while saving note:", error);
    }
  };

  const handleDelete = async (noteId) => {
    try {
      await api.delete(`/${noteId}`);
      console.log(`Note with id ${noteId} sucessfully deleted!`);
      onDelete(noteId);
    } catch (error) {
      console.error("Error while deleting note:", error);
    }
  };

  return (
    <div className="main-container">
      {notes.map((note) => (
        <div
          key={note.id}
          className="note-container"
          style={{ backgroundColor: note.color }}
        >
          {editingNote === note.id ? (
            <div>
              <textarea
                value={editedContent}
                onChange={(e) => setEditedContent(e.target.value)}
              ></textarea>
              <button onClick={() => handleSave(note.id)}>Save</button>
            </div>
          ) : (
            <div>
              <span
                className="close-button"
                onClick={() => handleDelete(note.id)}
              >
                X
              </span>
              <h2 className="handwriting">{note.name}</h2>
              <div className="handwriting">{note.content}</div>
              <hr className="line"></hr>
              <div className="heading-small">Note-id: {note.id}</div>
              <br />
              <span
                className="link-default"
                onClick={() => handleEdit(note.id)}
              >
                Edit
              </span>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default NoteList;
