import React, { useState, useEffect, useCallback } from 'react';
import SearchBar from './components/SearchBar';
import PriceDisplay from './components/PriceDisplay';
import PriceChart from './components/PriceChart';
import RangeToggle from './components/RangeToggle';
import { Coin } from './types';

const App: React.FC = () => {
  const [query, setQuery] = useState('');
  const [coinId, setCoinId] = useState('');
  const [coinName, setCoinName] = useState('');
  const [currentPrice, setCurrentPrice] = useState<number | null>(null);
  const [chartData, setChartData] = useState<any[]>([]);
  const [selectedRange, setSelectedRange] = useState('1W');
  const [loadingChart, setLoadingChart] = useState(false);

  // In-memory cache to prevent redundant requests
  const chartCache = React.useRef<{ [range: string]: any[] }>({});

  const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

  const fetchChartData = useCallback(async (id: string, range: string) => {
    if (!id) return;

    // Use cache if available
    if (chartCache.current[range]) {
      console.log(`Using cached chart data for ${range}`);
      setChartData(chartCache.current[range]);
      return;
    }

    let days = '7';
    switch (range) {
      case '1D': days = '1'; break;
      case '5D': days = '5'; break;
      case '1W': days = '7'; break;
      case '1M': days = '30'; break;
      case '1Y': days = '365'; break;
      case 'YTD': days = '365'; break;
      case 'ALL': days = 'max'; break;
    }

    try {
      setLoadingChart(true);
      await delay(1000); // slow down fetches to avoid API throttling

      const url = `https://api.coingecko.com/api/v3/coins/${id}/market_chart?vs_currency=usd&days=${days}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error(`Failed chart fetch for ${id}`);

      const json = await res.json();
      const formatted = json.prices.map((p: [number, number]) => ({
        time: new Date(p[0]).toLocaleDateString(),
        price: p[1],
      }));

      chartCache.current[range] = formatted;
      setChartData(formatted);
    } catch (err) {
      console.error(err);
      alert('Error fetching chart data. Please wait a few seconds and try again.');
    } finally {
      setLoadingChart(false);
    }
  }, []);

  const handleSearch = async () => {
    if (!query.trim()) return;

    try {
      const listRes = await fetch(`https://api.coingecko.com/api/v3/coins/list`);
      const coins = await listRes.json();

      const match = coins.find((c: any) =>
        c.name.toLowerCase() === query.toLowerCase() ||
        c.symbol.toLowerCase() === query.toLowerCase()
      );

      if (!match) {
        alert('Coin not found');
        return;
      }

      const newCoinId = match.id;
      setCoinId(newCoinId);
      setCoinName(match.name);

      const priceRes = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${newCoinId}&vs_currencies=usd`);
      const priceJson = await priceRes.json();

      if (!priceJson[newCoinId]) throw new Error('Price not found');
      setCurrentPrice(priceJson[newCoinId].usd);

      chartCache.current = {}; // clear previous cache
    } catch (err) {
      console.error(err);
      alert('Failed to search for coin.');
    }
  };

  useEffect(() => {
    if (coinId) {
      fetchChartData(coinId, selectedRange);
    }
  }, [coinId, selectedRange, fetchChartData]);

  const [allCoins, setAllCoins] = useState<Coin[]>([]);

  useEffect(() => {
    const fetchAllCoins = async () => {
      try {
        const res = await fetch('https://api.coingecko.com/api/v3/coins/list');
        const coins = await res.json();
        setAllCoins(coins);
      } catch (err) {
        console.error('Error fetching coins:', err);
      }
    };
    fetchAllCoins();
  }, []);

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>📊 Crypto Price Tracker</h1>
      <SearchBar
        value={query}
        onChange={setQuery}
        onSearch={handleSearch}
        allCoins={allCoins}
      />

      {currentPrice !== null && (
        <>
          <PriceDisplay coin={coinName} price={currentPrice} />
          <RangeToggle selected={selectedRange} onSelect={(range) => {
            if (!loadingChart) setSelectedRange(range);
          }} />
          {loadingChart ? <p>Loading chart...</p> : <PriceChart data={chartData} />}
        </>
      )}
    </div>
  );
};

export default App;
