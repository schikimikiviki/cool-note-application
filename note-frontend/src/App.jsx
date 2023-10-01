import api from "./api/axiosConfig";
import { useEffect, useState } from "react";
import "./styles.css";
import "./index.css";

function App() {
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    (async () => await load())();
  }, []);

  async function load() {
    const result = await api.get("");
    setNotes(result.data);
  }

  console.log(notes);

  return (
    <div>
      <h1 className="heading">My notes</h1>

      {notes.map((note) => (
        <div
          key={note.id}
          className="container mx-auto bg-gray-200 rounded-xl shadow border p-8 m-10"
        >
          <h2 className="handwriting">{note.name}</h2>
          <div className="handwriting"> {note.content}</div>

          {/* weird shit is happening */}
          <div className="container mx-auto bg-yellow-200 rounded-xl shadow border p-8 m-10">
            Note-id: {note.id}
          </div>
        </div>
      ))}
    </div>
  );
}

export default App;
