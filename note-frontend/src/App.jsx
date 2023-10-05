import api from "./api/axiosConfig";
import { useEffect, useState } from "react";
import "./styles.css";
import "./index.css";
import NoteList from "./components/NoteList";
import Header from "./components/Header";
import Popup from "./components/Popup";

function App() {
  const [notes, setNotes] = useState([]);
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  useEffect(() => {
    (async () => await load())();
  }, []);

  async function load() {
    const result = await api.get("");
    setNotes(result.data);
  }

  const handleDeleteFromState = async (noteId) => {
    console.log(noteId);
    await setNotes((notes) => notes.filter((note) => note.id !== noteId));
  };

  const openPopup = () => {
    setIsPopupOpen(true);
  };

  const closePopup = () => {
    setIsPopupOpen(false);
  };

  const handleRequest = () => {
    openPopup();
  };

  return (
    <div>
      <Header onReceive={handleRequest} />
      {isPopupOpen && <Popup onClose={closePopup} onAdd={load} />}
      <NoteList notes={notes} onDelete={handleDeleteFromState} />
    </div>
  );
}

export default App;
