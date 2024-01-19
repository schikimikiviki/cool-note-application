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
      {isDarkThemeSet ? (
        <div class="bg-animation">
          <div id="stars"></div>
          <div id="stars2"></div>
          <div id="stars3"></div>
          <div id="stars4"></div>
        </div>
      ) : (
        <div id="background-wrap">
          <div class="x1">
            <div class="cloud"></div>
          </div>

          <div class="x2">
            <div class="cloud"></div>
          </div>

          <div class="x3">
            <div class="cloud"></div>
          </div>

          <div class="x4">
            <div class="cloud"></div>
          </div>

          <div class="x5">
            <div class="cloud"></div>
          </div>
        </div>
      )}

      <Header onReceive={handleRequest} onClick={handleThemeChange} />
      {isPopupOpen && <Popup onClose={closePopup} onAdd={load} />}
      <NoteList notes={notes} onDelete={handleDeleteFromState} />
    </div>
  );
}

export default App;
