import React, { useState, useEffect } from 'react';
import SearchBar from './components/SearchBar';
import PriceDisplay from './components/PriceDisplay';
import PriceChart from './components/PriceChart';
import RangeToggle from './components/RangeToggle';

const App: React.FC = () => {
  const [coinInput, setCoinInput] = useState('');
  const [coinId, setCoinId] = useState('');
  const [coinName, setCoinName] = useState('');
  const [currentPrice, setCurrentPrice] = useState<number | null>(null);
  const [chartData, setChartData] = useState<any[]>([]);
  const [selectedRange, setSelectedRange] = useState('1W');

  const fetchChartData = async (id: string, range: string) => {
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
      console.log(`Fetching chart for ${id}, range: ${range}`);
      const res = await fetch(`https://api.coingecko.com/api/v3/coins/${id}/market_chart?vs_currency=usd&days=${days}`);
      if (!res.ok) throw new Error('API failed');
      const json = await res.json();

      const formatted = json.prices.map((p: [number, number]) => ({
        time: new Date(p[0]).toLocaleDateString(),
        price: p[1],
      }));

      setChartData(formatted);
    } catch (err) {
      console.error('Chart fetch error:', err);
      alert('Failed to fetch chart data.');
    }
  };

  const handleSearch = async () => {
    try {
      const res = await fetch(`https://api.coingecko.com/api/v3/coins/list`);
      const coins = await res.json();

      const found = coins.find((c: any) =>
        c.name.toLowerCase() === coinInput.toLowerCase() ||
        c.symbol.toLowerCase() === coinInput.toLowerCase()
      );

      if (!found) {
        alert('Coin not found');
        return;
      }

      setCoinId(found.id);
      setCoinName(found.name);

      const priceRes = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${found.id}&vs_currencies=usd`);
      const priceJson = await priceRes.json();
      setCurrentPrice(priceJson[found.id].usd);
    } catch (err) {
      console.error('Search error:', err);
      alert('Failed to search or get price');
    }
  };

  // Fetch chart data when coinId or selectedRange changes
  useEffect(() => {
    if (coinId) {
      fetchChartData(coinId, selectedRange);
    }
  }, [coinId, selectedRange]);

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>🪙 Crypto Price Search</h1>
      <SearchBar value={coinInput} onChange={setCoinInput} onSearch={handleSearch} />

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
