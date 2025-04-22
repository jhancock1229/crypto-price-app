import React, { useState } from 'react';
import SearchBar from './components/SearchBar';
import PriceDisplay from './components/PriceDisplay';
import PriceChart from './components/PriceChart';

const App: React.FC = () => {
  const [coin, setCoin] = useState('');
  const [currentPrice, setCurrentPrice] = useState<number | null>(null);
  const [chartData, setChartData] = useState<any[]>([]);

  const handleSearch = async () => {
    try {
      const res = await fetch(`https://api.coingecko.com/api/v3/coins/list`);
      const coins = await res.json();
      const found = coins.find((c: any) => c.name.toLowerCase() === coin.toLowerCase() || c.symbol.toLowerCase() === coin.toLowerCase());
      
      if (!found) {
        alert('Coin not found');
        return;
      }


      // Fetch current price
      const priceRes = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${found.id}&vs_currencies=usd`);
      const priceJson = await priceRes.json();
      setCurrentPrice(priceJson[found.id].usd);

      // Fetch 7-day chart data
      const chartRes = await fetch(`https://api.coingecko.com/api/v3/coins/${found.id}/market_chart?vs_currency=usd&days=7`);
      const chartJson = await chartRes.json();

      const formatted = chartJson.prices.map((p: [number, number]) => ({
        time: new Date(p[0]).toLocaleDateString(),
        price: p[1],
      }));

      setChartData(formatted);
    } catch (err) {
      console.error(err);
      alert('Failed to fetch data');
    }
  };

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>🪙 Crypto Price Search</h1>
      <SearchBar value={coin} onChange={setCoin} onSearch={handleSearch} />

      {currentPrice !== null && <PriceDisplay coin={coin} price={currentPrice} />}
      {chartData.length > 0 && <PriceChart data={chartData} />}
    </div>
  );
};

export default App;
