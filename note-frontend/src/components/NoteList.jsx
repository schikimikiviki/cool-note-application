const NoteList = ({ notes }) => {
  return (
    <div className="main-container">
      {notes.map((note) => (
        <div key={note.id} className="note-container relative">
          <span className="close-button" onClick={() => handleDelete(note.id)}>
            X
          </span>
          <h2 className="handwriting">{note.name}</h2>
          <div className="handwriting">{note.content}</div>
          <hr className="line"></hr>
          <div className="heading-small">Note-id: {note.id}</div>
        </div>
      ))}
    </div>
  );
};

export default NoteList;
