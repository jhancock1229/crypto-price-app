import React, { useState, useEffect } from 'react';
import SearchBar from './components/SearchBar';
import PriceDisplay from './components/PriceDisplay';
import PriceChart from './components/PriceChart';
import RangeToggle from './components/RangeToggle';

const App: React.FC = () => {
  const [coin, setCoin] = useState('');
  const [coinId, setCoinId] = useState('');
  const [currentPrice, setCurrentPrice] = useState<number | null>(null);
  const [chartData, setChartData] = useState<any[]>([]);
  const [selectedRange, setSelectedRange] = useState('1W');

  const fetchChartData = async (id: string, range: string) => {
    if (!id || !range) return;

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
      const res = await fetch(`https://api.coingecko.com/api/v3/coins/${id}/market_chart?vs_currency=usd&days=${days}`);
      if (!res.ok) throw new Error('API failed');
      const json = await res.json();

      const formatted = json.prices.map((p: [number, number]) => ({
        time: new Date(p[0]).toLocaleDateString(),
        price: p[1],
      }));

      setChartData(formatted);
    } catch (err) {
      console.error('Failed to fetch chart data:', err);
      alert('Failed to fetch chart data.');
    }
  };

  const handleSearch = async () => {
    if (!coin.trim()) {
      alert('Please enter a coin name or symbol');
      return;
    }

    try {
      const res = await fetch(`https://api.coingecko.com/api/v3/coins/list`);
      const coins = await res.json();
      const found = coins.find((c: any) =>
        c.name.toLowerCase() === coin.toLowerCase() ||
        c.symbol.toLowerCase() === coin.toLowerCase()
      );

      if (!found) {
        alert('Coin not found');
        return;
      }

      const newCoinId = found.id;
      setCoinId(newCoinId);

      const priceRes = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${newCoinId}&vs_currencies=usd`);
      const priceJson = await priceRes.json();
      setCurrentPrice(priceJson[newCoinId].usd);
    } catch (err) {
      console.error('Search error:', err);
      alert('Failed to fetch price data');
    }
  };

  useEffect(() => {
    if (coinId && selectedRange) {
      fetchChartData(coinId, selectedRange);
    }
  }, [coinId, selectedRange]);

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>🪙 Crypto Price Search</h1>
      <SearchBar value={coin} onChange={setCoin} onSearch={handleSearch} />

      {currentPrice !== null && (
        <>
          <PriceDisplay coin={coin} price={currentPrice} />
          <RangeToggle selected={selectedRange} onSelect={setSelectedRange} />
          <PriceChart data={chartData} />
        </>
      )}
    </div>
  );
};

export default App;
