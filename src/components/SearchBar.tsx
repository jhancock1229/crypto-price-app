import React from 'react';

type Props = {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onSearchClick: () => void;
};

const SearchBar = ({ searchTerm, onSearchChange, onSearchClick }: Props) => {
  return (
    <div style={styles.searchContainer}>
      <input
        type="text"
        placeholder="Search a coin (e.g. solana)"
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        style={styles.searchInput}
      />
      <button onClick={onSearchClick} style={styles.searchButton}>
        Search
      </button>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  searchContainer: {
    marginBottom: '20px',
  },
  searchInput: {
    padding: '10px',
    fontSize: '1rem',
    borderRadius: '5px',
    border: '1px solid #333',
    width: '80%',
    maxWidth: '300px',
  },
  searchButton: {
    padding: '10px 20px',
    marginLeft: '10px',
    borderRadius: '5px',
    border: 'none',
    backgroundColor: '#1db954',
    color: 'white',
    cursor: 'pointer',
  },
};

export default SearchBar;
