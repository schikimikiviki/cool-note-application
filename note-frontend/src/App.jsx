import api from "./api/axiosConfig";
import { useEffect, useState } from "react";

import "./index.css";
import NoteList from "./components/NoteList/NoteList.jsx";
import Header from "./components/Header/Header.jsx";
import Popup from "./components/Popup/Popup.jsx";
import Footer from "./components/Footer/Footer.jsx";

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

  const handleSearch = async (searchTerm) => {
    const originalNotes = await api.get("").then((result) => result.data);

    if (searchTerm === "") {
      setNotes(originalNotes);
    } else {
      const filteredNotes = originalNotes.filter((note) =>
        note.name.includes(searchTerm)
      );
      setNotes(filteredNotes);
    }
  };

  return (
    <div
      className={`main-page ${isDarkThemeSet ? "dark-theme" : "light-theme"}`}
    >
      {isDarkThemeSet ? (
        <div className="bg-animation">
          <div id="stars"></div>
          <div id="stars2"></div>
          <div id="stars3"></div>
          <div id="stars4"></div>
        </div>
      ) : (
        <div id="background-wrap">
          <div className="x1">
            <div className="cloud"></div>
          </div>

          <div className="x2">
            <div className="cloud"></div>
          </div>

          <div className="x3">
            <div className="cloud"></div>
          </div>

          <div className="x4">
            <div className="cloud"></div>
          </div>

          <div className="x5">
            <div className="cloud"></div>
          </div>
        </div>
      )}

      <Header
        onReceive={handleRequest}
        onClick={handleThemeChange}
        onType={handleSearch}
      />
      {isPopupOpen && <Popup onClose={closePopup} onAdd={load} />}
      <NoteList notes={notes} onDelete={handleDeleteFromState} />
      <Footer />
    </div>
  );
}

export default App;
