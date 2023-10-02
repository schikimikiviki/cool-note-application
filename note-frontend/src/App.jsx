import api from "./api/axiosConfig";
import { useEffect, useState } from "react";
import "./styles.css";
import "./index.css";
import NoteList from "./components/NoteList";
import Header from "./components/Header";

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
      <Header />
      <NoteList notes={notes} />
    </div>
  );
}

export default App;
