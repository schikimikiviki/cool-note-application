import api from "./api/axiosConfig";
import { useEffect, useState } from "react";

import "./index.css";
import NoteList from "./components/NoteList/NoteList.jsx";
import Header from "./components/Header/Header.jsx";
import Popup from "./components/Popup/Popup.jsx";

function App() {
  const [notes, setNotes] = useState([]);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isDarkThemeSet, setIsDarkThemeSet] = useState(false);

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

  const handleThemeChange = () => {
    setIsDarkThemeSet(!isDarkThemeSet);
  };

  return (
    <div
      className={`main-page ${isDarkThemeSet ? "dark-theme" : "light-theme"}`}
    >
      <Header onReceive={handleRequest} onClick={handleThemeChange} />
      {isPopupOpen && <Popup onClose={closePopup} onAdd={load} />}
      <NoteList notes={notes} onDelete={handleDeleteFromState} />
    </div>
  );
}

export default App;
