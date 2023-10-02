import api from "./api/axiosConfig";
import { useEffect, useState } from "react";
import "./styles.css";
import "./index.css";
import NoteList from "./components/NoteList";

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
      <NoteList notes={notes} />
    </div>
  );
}

export default App;
