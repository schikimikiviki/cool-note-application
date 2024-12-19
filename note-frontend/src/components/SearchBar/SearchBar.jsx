import './SearchBar.css';
import React, { useState } from 'react';

const SearchBar = ({ onSearch, fontSize }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchInputChange = (event) => {
    const newSearchQuery = event.target.value;
    setSearchQuery(newSearchQuery);
    onSearch(newSearchQuery);
  };

  return (
    <form className='search-form'>
      <input
        className='search-input'
        style={{ fontSize: fontSize }}
        type='text'
        placeholder='Search...'
        value={searchQuery}
        onChange={handleSearchInputChange}
      />
    </form>
  );
};

export default SearchBar;
