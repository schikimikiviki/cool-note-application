const NoteList = ({ notes }) => {
  return (
    <div>
      {notes.map((note) => (
        <div
          key={note.id}
          className="container mx-auto bg-gray-200 rounded-xl shadow border p-8 m-10"
        >
          <h2 className="handwriting">{note.name}</h2>
          <div className="handwriting"> {note.content}</div>

          {/* weird shit is happening */}
          <hr className="line"></hr>
          <div className="heading-small">Note-id: {note.id}</div>
        </div>
      ))}
    </div>
  );
};

export default NoteList;
