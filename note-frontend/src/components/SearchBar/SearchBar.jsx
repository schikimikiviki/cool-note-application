import "./SearchBar.css";
import React, { useState } from "react";

const SearchBar = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearchInputChange = (event) => {
    setSearchQuery(event.target.value);
  };

  // filtering should be in time with typing in stuff

  //   const handleSearchSubmit = (event) => {
  //     event.preventDefault();
  //     console.log(`Searching for: ${searchQuery}`);
  //     // Add your search functionality here
  //   };

  return (
    <form className="search-form" onSubmit={handleSearchSubmit}>
      <input
        className="search-input"
        type="text"
        placeholder="Search..."
        value={searchQuery}
        onChange={handleSearchInputChange}
      />
    </form>
  );
};

export default SearchBar;
