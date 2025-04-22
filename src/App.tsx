import { useEffect, useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

type Prices = {
  bitcoin: { usd: number };
  ethereum: { usd: number };
  dogecoin: { usd: number };
};

type CoinData = {
  time: string;
  price: number;
};

function App() {
  const [prices, setPrices] = useState<Prices | null>(null);
  const [chartData, setChartData] = useState<CoinData[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResult, setSearchResult] = useState<{ name: string; price: number } | null>(null);

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
    try {
      const res = await fetch(
        'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,dogecoin&vs_currencies=usd'
      );
      const data = await res.json();
      setPrices(data);
    } catch (error) {
      console.error('Failed to fetch prices:', error);
    }
  };

  const fetchChart = async () => {
    try {
      const res = await fetch(
        'https://api.coingecko.com/api/v3/coins/bitcoin/market_chart?vs_currency=usd&days=1'
      );
      const data = await res.json();
      const formatted = data.prices.map((p: [number, number]) => ({
        time: new Date(p[0]).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        price: p[1],
      }));
      setChartData(formatted);
    } catch (error) {
      console.error('Failed to fetch chart data:', error);
    }
  };

  const handleSearch = async () => {
    if (!searchTerm.trim()) return;
    try {
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
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Live Crypto Prices</h1>

      {/* Search Input */}
      <div style={styles.searchContainer}>
        <input
          type="text"
          placeholder="Search a coin (e.g. solana)"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={styles.searchInput}
        />
        <button onClick={handleSearch} style={styles.searchButton}>
          Search
        </button>
      </div>

      {/* Static Prices */}
      {prices ? (
        <div style={styles.prices}>
          <p style={styles.coin}><strong>Bitcoin:</strong> ${prices.bitcoin.usd}</p>
          <p style={styles.coin}><strong>Ethereum:</strong> ${prices.ethereum.usd}</p>
          <p style={styles.coin}><strong>Dogecoin:</strong> ${prices.dogecoin.usd}</p>
        </div>
      ) : (
        <p>Loading prices...</p>
      )}

      {/* Search Result */}
      {searchResult && (
        <p style={{ marginTop: '20px', fontSize: '1.25rem' }}>
          <strong>{searchResult.name.toUpperCase()}:</strong> ${searchResult.price}
        </p>
      )}

      {/* Chart */}
      <h2 style={{ marginTop: '40px' }}>Bitcoin (Last 24h)</h2>
      {chartData.length > 0 ? (
        <div style={{ width: '100%', maxWidth: '700px', margin: '0 auto' }}>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="price"
                stroke="#1db954"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
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
  prices: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    maxWidth: '400px',
    margin: '0 auto',
  },
  coin: {
    fontSize: 'clamp(1rem, 2.5vw, 1.5rem)',
  },
};

export default App;
