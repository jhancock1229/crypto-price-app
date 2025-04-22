import React, { useState, useEffect, useRef } from 'react';

type Coin = {
  id: string;
  name: string;
  symbol: string;
};

interface SearchBarProps {
  value: string;
  onChange: (val: string) => void;
  onSearch: () => void;
  allCoins: Coin[];
}

const SearchBar: React.FC<SearchBarProps> = ({ value, onChange, onSearch, allCoins }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [filteredCoins, setFilteredCoins] = useState<Coin[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const listener = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', listener);
    return () => document.removeEventListener('mousedown', listener);
  }, []);

  useEffect(() => {
    const search = value.toLowerCase();
    const matches = allCoins.filter(
      (coin) =>
        coin.name.toLowerCase().includes(search) ||
        coin.symbol.toLowerCase().includes(search)
    ).slice(0, 20); // limit for performance
    setFilteredCoins(matches);
  }, [value, allCoins]);

  const handleSelect = (coin: Coin) => {
    onChange(coin.name);
    setShowDropdown(false);
  };

  return (
    <div ref={containerRef} style={{ position: 'relative', marginBottom: '1rem' }}>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setShowDropdown(true)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') onSearch();
        }}
        placeholder="Search cryptocurrency"
        style={{
          padding: '0.5rem',
          width: '100%',
          border: '1px solid #ccc',
          borderRadius: '5px',
        }}
      />
      {showDropdown && value && filteredCoins.length > 0 && (
        <ul
          style={{
            position: 'absolute',
            zIndex: 999,
            width: '100%',
            maxHeight: '200px',
            overflowY: 'auto',
            backgroundColor: 'white',
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
    </div>
  );
};

export default SearchBar;
