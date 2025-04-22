import React from 'react';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onSearch: () => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ value, onChange, onSearch }) => {
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      onSearch();
    }
  };

  return (
    <div style={{ marginBottom: '1rem' }}>
      <input
        type="text"
        placeholder="Search cryptocurrency..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyPress}
        style={{ padding: '0.5rem', fontSize: '1rem', width: '250px' }}
      />
      <button
        onClick={onSearch}
        style={{
          padding: '0.5rem 1rem',
          marginLeft: '0.5rem',
          fontSize: '1rem',
          cursor: 'pointer',
        }}
      >
        Search
      </button>
    </div>
  );
};

export default SearchBar;
