import { useState, useEffect } from 'react';
import SearchBar from './components/SearchBar';
import PriceChart from './components/PriceChart';
import { getDaysFromRange, getDateRangeLabel } from './utils/dateUtils';


interface Coin {
  id: string;
  name: string;
  symbol: string;
}

function App() {
  const [query, setQuery] = useState('');
  const [coin, setCoin] = useState<Coin | null>(null);
  const [allCoins, setAllCoins] = useState<Coin[]>([]);
  const [selectedRange, setSelectedRange] = useState('1');

  useEffect(() => {
    const fetchCoins = async () => {
      const res = await fetch('https://api.coingecko.com/api/v3/coins/list');
      const data = await res.json();
      setAllCoins(data);
    };
    fetchCoins();
  }, []);

  const handleSearch = () => {
    const found = allCoins.find(
      (c) =>
        c.name.toLowerCase() === query.toLowerCase() ||
        c.symbol.toLowerCase() === query.toLowerCase()
    );
    if (found) {
      setCoin(found);
    } else {
      alert('Coin not found.');
    }
  };

  const closeDropdown = () => {
    // No internal dropdown state in App, but needed as prop to SearchBar
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Crypto Price Viewer</h1>
      <SearchBar
        value={query}
        onChange={setQuery}
        onSearch={handleSearch}
        allCoins={allCoins}
        closeDropdown={closeDropdown}
      />

      {coin && (
        <>
          <h2>{coin.name} ({coin.symbol.toUpperCase()})</h2>
          <div style={{ margin: '1rem 0' }}>
            {['1', '5', '7', '30', '365', 'ytd', 'max'].map((range) => (
              <button
                key={range}
                onClick={() => setSelectedRange(range)}
                style={{
                  marginRight: '0.5rem',
                  padding: '0.5rem 1rem',
                  backgroundColor: selectedRange === range ? '#4F46E5' : '#E5E7EB',
                  color: selectedRange === range ? '#fff' : '#000',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: 'pointer',
                }}
              >
                {range === '1' ? '1 Day' :
                  range === '5' ? '5 Days' :
                    range === '7' ? '1 Week' :
                      range === '30' ? '1 Month' :
                        range === '365' ? '1 Year' :
                          range === 'ytd' ? 'YTD' : 'All'}
              </button>
            ))}
          </div>
          <PriceChart coinId={coin.id} range={selectedRange} />
          {coin && (
            <>
              <PriceChart coinId={coin.id} range={selectedRange} />
              <p className="text-center text-gray-500 text-sm mt-2">
                Showing data for: <span className="font-medium">{dateRangeLabel}</span>
              </p>
            </>
          )}

        </>
      )}
    </div>
  );
}

export default App;
