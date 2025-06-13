import React from 'react';

const SearchBar = ({ searchTerm, onSearchChange }) => {
  return (
    <div className="mb-6">
      <label htmlFor="search" className="block mb-2 text-lg font-medium">
        Search by Name:
      </label>
      <input
        type="text"
        id="search"
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        placeholder="Type to search..."
        className="border p-2 rounded w-full md:w-1/3"
      />
    </div>
  );
};

export default SearchBar;
