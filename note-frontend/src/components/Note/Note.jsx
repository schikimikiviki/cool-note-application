import React, { useRef } from "react";
import "./Note.css";
import { useDrag } from "./useDrag";

const Note = ({
  note,
  index,
  isDone,
  onEdit,
  onSave,
  onDelete,
  onDone,
  areTitlesVisible,
}) => {
  console.log(note);
  const draggableRef = useRef(null);

  const { position, handleMouseDown } = useDrag({
    ref: draggableRef,
  });

  return (
    <div className="field">
      <div
        className="draggable"
        ref={draggableRef}
        style={{
          top: position.y,
          left: position.x,
        }}
      >
        <div className="draggable-panel" onMouseDown={handleMouseDown}></div>
        <div>
          {isDone ? (
            <div className="overlay" style={{ backgroundColor: "grey" }}></div>
          ) : (
            <div style={{ backgroundColor: note.color }}>
              <span className="close-button" onClick={() => onDelete(note.id)}>
                X
              </span>

              {areTitlesVisible ? (
                <h2 className="handwriting">{note.name}</h2>
              ) : (
                <h2></h2>
              )}

              <div className="handwriting draggable-content">
                {note.content}
              </div>
              <hr className="line"></hr>
              <div className="heading-small">Note-id: {note.id}</div>
              <br />

              <div className="note-footer">
                <span
                  className={isDone ? "invisible" : "link-default"}
                  disabled={isDone}
                  onClick={() => onEdit(note.id)}
                >
                  Edit
                </span>
                <button
                  onClick={() => onDone(note.id, index)}
                  className={`done-button ${isDone ? "disabled" : ""}`}
                  disabled={isDone}
                >
                  {isDone ? "✔️" : "Done ✔️"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Note;
