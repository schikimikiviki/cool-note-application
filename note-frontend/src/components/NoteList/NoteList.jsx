import React, { useState, useEffect } from "react";
import api from "../../api/axiosConfig";
import "./NoteList.css";

const NoteList = ({ notes, onDelete, titles }) => {
  const [editingNote, setEditingNote] = useState(null);
  const [editedContent, setEditedContent] = useState("");
  const [areTitlesVisible, setAreTitlesVisible] = useState(true);
  const [isDoneList, setIsDoneList] = useState(Array(notes.length).fill(false));

  useEffect(() => {
    setAreTitlesVisible(titles);
  }, [titles]);

  console.log(notes);

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

  const handleDone = (index) => {
    if (!isDoneList[index]) {
      const updatedIsDoneList = [...isDoneList];
      updatedIsDoneList[index] = true;
      setIsDoneList(updatedIsDoneList);
    }
  };

  return (
    <div className="main-container">
      {notes.map((note, index) => (
        <div key={note.id} style={{ position: "relative" }}>
          <div
            className={`note-container ${isDoneList[index] ? "overlay" : ""}`}
            style={{
              backgroundColor: isDoneList[index] ? "grey" : note.color,
            }}
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

                {areTitlesVisible ? (
                  <h2 className="handwriting">{note.name}</h2>
                ) : (
                  <h2></h2>
                )}

                <div className="handwriting">{note.content}</div>
                <hr className="line"></hr>
                <div className="heading-small">Note-id: {note.id}</div>
                <br />

                <div className="note-footer">
                  <span
                    className="link-default"
                    onClick={() => handleEdit(note.id)}
                  >
                    Edit
                  </span>
                  <button
                    onClick={() => handleDone(index)}
                    className={`done-button ${
                      isDoneList[index] ? "disabled" : ""
                    }`}
                    disabled={isDoneList[index]}
                  >
                    {isDoneList[index] ? "✔️" : "Done ✔️"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default NoteList;
