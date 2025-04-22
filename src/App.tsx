import React, { useState, useEffect, useCallback } from 'react';
import SearchBar from './components/SearchBar';
import PriceDisplay from './components/PriceDisplay';
import PriceChart from './components/PriceChart';
import RangeToggle from './components/RangeToggle';

const App: React.FC = () => {
  const [query, setQuery] = useState('');
  const [coinId, setCoinId] = useState('');
  const [coinName, setCoinName] = useState('');
  const [currentPrice, setCurrentPrice] = useState<number | null>(null);
  const [chartData, setChartData] = useState<any[]>([]);
  const [selectedRange, setSelectedRange] = useState('1W');

  const fetchChartData = useCallback(async (id: string, range: string) => {
    if (!id) return;

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
      const url = `https://api.coingecko.com/api/v3/coins/${id}/market_chart?vs_currency=usd&days=${days}`;
      console.log('Fetching chart from:', url);

      const res = await fetch(url);
      if (!res.ok) throw new Error(`Chart fetch failed for ${id}`);

      const json = await res.json();
      const formatted = json.prices.map((p: [number, number]) => ({
        time: new Date(p[0]).toLocaleDateString(),
        price: p[1],
      }));

      setChartData(formatted);
    } catch (err) {
      console.error(err);
      alert(`Failed to fetch chart data. Please try again.`);
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

      if (!priceJson[newCoinId]) throw new Error('Price fetch returned no data');
      setCurrentPrice(priceJson[newCoinId].usd);
    } catch (err) {
      console.error(err);
      alert('Search failed. Check network or try again.');
    }
  };

  useEffect(() => {
    if (coinId) {
      fetchChartData(coinId, selectedRange);
    }
  }, [coinId, selectedRange, fetchChartData]);

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>🔍 Crypto Price Search</h1>
      <SearchBar value={query} onChange={setQuery} onSearch={handleSearch} />
      {currentPrice !== null && (
        <>
          <PriceDisplay coin={coinName} price={currentPrice} />
          <RangeToggle selected={selectedRange} onSelect={setSelectedRange} />
          <PriceChart data={chartData} />
        </>
      )}
    </div>
  );
};

export default App;
