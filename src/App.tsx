import React, { useState, useEffect } from 'react';
import SearchBar from './components/SearchBar';
import PriceDisplay from './components/PriceDisplay';
import PriceChart from './components/PriceChart';
import RangeToggle from './components/RangeToggle';

const App: React.FC = () => {
  const [coin, setCoin] = useState('');
  const [currentPrice, setCurrentPrice] = useState<number | null>(null);
  const [chartData, setChartData] = useState<any[]>([]);
  const [selectedRange, setSelectedRange] = useState('1W'); // default to 1 week

  const fetchChartData = async (coinId: string, range: string) => {
    let days = '7';

    switch (range) {
      case '1D': days = '1'; break;
      case '5D': days = '5'; break;
      case '1W': days = '7'; break;
      case '1M': days = '30'; break;
      case '1Y': days = '365'; break;
      case 'YTD': days = '365'; break; // Not supported by CoinGecko, fallback to 365
      case 'ALL': days = 'max'; break;
    }

    const res = await fetch(`https://api.coingecko.com/api/v3/coins/${coinId}/market_chart?vs_currency=usd&days=${days}`);
    const json = await res.json();

    const formatted = json.prices.map((p: [number, number]) => ({
      time: new Date(p[0]).toLocaleDateString(),
      price: p[1],
    }));

    setChartData(formatted);
  };

  const handleSearch = async () => {
    if (!coin) {
      alert('Please enter a coin name or symbol');
      return;
    }

    try {
      const res = await fetch(`https://api.coingecko.com/api/v3/coins/list`);
      const coins = await res.json();
      const found = coins.find((c: any) => c.name.toLowerCase() === coin.toLowerCase() || c.symbol.toLowerCase() === coin.toLowerCase());

      if (!found) {
        alert('Coin not found');
        return;
      }

      const priceRes = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${found.id}&vs_currencies=usd`);
      const priceJson = await priceRes.json();
      setCurrentPrice(priceJson[found.id].usd);

      await fetchChartData(found.id, selectedRange);
    } catch (err) {
      console.error(err);
      alert('Failed to fetch data');
    }
  };

  // useEffect to refetch chart data when selectedRange changes
  useEffect(() => {
    if (!coin) return; // Don't run if no coin is selected
    handleSearch();
  }, [selectedRange]); // This runs every time selectedRange changes

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
