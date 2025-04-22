import { useState } from 'react';

interface Coin {
  id: string;
  name: string;
  symbol: string;
}

interface SearchBarProps {
  value: string;
  onChange: (val: string) => void;
  onSearch: () => void;
  allCoins: Coin[];
  closeDropdown: () => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ value, onChange, onSearch, allCoins, closeDropdown }) => {
  const [showDropdown, setShowDropdown] = useState(false);

  const filteredCoins = allCoins.filter((coin) =>
    coin.name.toLowerCase().includes(value.toLowerCase()) ||
    coin.symbol.toLowerCase().includes(value.toLowerCase())
  ).slice(0, 10); // limit to top 10 matches

  const handleSelect = (coin: Coin) => {
    onChange(coin.name);
    closeDropdown();
    onSearch();
    setShowDropdown(false);
  };

  return (
    <div style={{ position: 'relative', marginBottom: '1rem' }}>
      <input
        type="text"
        placeholder="Search cryptocurrency..."
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
          setShowDropdown(true);
        }}
        onFocus={() => setShowDropdown(true)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            onSearch();
            closeDropdown();
            setShowDropdown(false);
          }
        }}
        style={{
          width: '100%',
          padding: '0.5rem',
          fontSize: '1rem',
          border: '1px solid #ccc',
          borderRadius: '5px',
        }}
      />

      {showDropdown && filteredCoins.length > 0 && (
        <ul
          style={{
            position: 'absolute',
            zIndex: 999,
            width: '100%',
            maxHeight: '200px',
            overflowY: 'auto',
            backgroundColor: 'white',
            color: '#000',
            border: '1px solid #ccc',
            borderRadius: '4px',
            listStyle: 'none',
            margin: 0,
            padding: 0,
          }}
        >
          {filteredCoins.map((coin) => (
            <li
              key={coin.id}
              onClick={() => handleSelect(coin)}
              style={{
                padding: '0.5rem',
                cursor: 'pointer',
                borderBottom: '1px solid #eee',
              }}
            >
              {coin.name} ({coin.symbol.toUpperCase()})
            </li>
          ))}
        </ul>
      )}

      <button
        onClick={() => {
          onSearch();
          closeDropdown();
          setShowDropdown(false);
        }}
        style={{
          marginTop: '0.5rem',
          padding: '0.5rem 1rem',
          backgroundColor: '#4F46E5',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
        }}
      >
        Search
      </button>
    </div>
  );
};

export default SearchBar;
