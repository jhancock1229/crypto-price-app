import { useEffect, useState } from 'react';
import CoinList from './components/CoinList';
import SearchBar from './components/SearchBar';
import PriceChart from './components/PriceChart';

type Prices = {
  bitcoin: { usd: number };
  ethereum: { usd: number };
  dogecoin: { usd: number };
};

function App() {
  const [prices, setPrices] = useState<Prices | null>(null);
  const [chartData, setChartData] = useState<{ time: string; price: number }[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResult, setSearchResult] = useState<{ name: string; price: number } | null>(null);
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('theme') === 'dark';
  });

  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  useEffect(() => {
    fetchPrices();
    fetchChart();
    const interval = setInterval(() => {
      fetchPrices();
      fetchChart();
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchPrices = async () => {
    const cached = localStorage.getItem('cryptoPrices');
    const timestamp = localStorage.getItem('cryptoPricesTimestamp');
  
    const isFresh = timestamp && Date.now() - parseInt(timestamp) < 60000;
  
    if (cached && isFresh) {
      setPrices(JSON.parse(cached));
      return;
    }
  
    const res = await fetch(
      'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,dogecoin&vs_currencies=usd'
    );
    const data = await res.json();
    setPrices(data);
    localStorage.setItem('cryptoPrices', JSON.stringify(data));
    localStorage.setItem('cryptoPricesTimestamp', Date.now().toString());
  };
  
  const fetchChart = async () => {
    const res = await fetch(
      'https://api.coingecko.com/api/v3/coins/bitcoin/market_chart?vs_currency=usd&days=1'
    );
    const data = await res.json();
    const formatted = data.prices.map((p: [number, number]) => ({
      time: new Date(p[0]).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      price: p[1],
    }));
    setChartData(formatted);
  };

  const handleSearch = async () => {
    if (!searchTerm.trim()) return;
    const res = await fetch(
      `https://api.coingecko.com/api/v3/simple/price?ids=${searchTerm.toLowerCase()}&vs_currencies=usd`
    );
    const data = await res.json();
    if (data[searchTerm.toLowerCase()]) {
      setSearchResult({ name: searchTerm, price: data[searchTerm.toLowerCase()].usd });
    } else {
      setSearchResult(null);
      alert('Coin not found!');
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Live Crypto Prices</h1>
      <button onClick={() => setDarkMode(!darkMode)} style={{ margin: '1rem', padding: '0.5rem' }}>
        {darkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
      </button>

      <SearchBar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onSearchClick={handleSearch}
      />

      {prices ? <CoinList prices={prices} /> : <p>Loading prices...</p>}

      {searchResult && (
        <p style={{ marginTop: '20px', fontSize: '1.25rem' }}>
          <strong>{searchResult.name.toUpperCase()}:</strong> ${searchResult.price}
        </p>
      )}

      <h2 style={{ marginTop: '40px' }}>Bitcoin (Last 24h)</h2>
      {chartData.length > 0 ? (
        <div style={{ width: '100%', maxWidth: '700px', margin: '0 auto' }}>
          <PriceChart data={chartData} />
        </div>
      ) : (
        <p>Loading chart...</p>
      )}
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    textAlign: 'center',
    backgroundColor: '#121212',
    color: 'white',
    padding: '20px',
    minHeight: '100vh',
    fontFamily: 'Arial, sans-serif',
  },
  title: {
    marginBottom: '20px',
    fontSize: 'clamp(1.5rem, 4vw, 2.5rem)',
  },
};

export default App;
