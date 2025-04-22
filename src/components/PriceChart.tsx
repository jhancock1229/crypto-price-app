import React, { useEffect, useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

export interface PriceChartProps {
  coinId: string;
  range: string;
}

const PriceChart: React.FC<PriceChartProps> = ({ coinId, range }) => {
  const [chartData, setChartData] = useState<{ time: string; price: number }[]>([]);

  useEffect(() => {
    const fetchChartData = async () => {
      let days = range;
      if (range === 'ytd') {
        const ytdStart = new Date(new Date().getFullYear(), 0, 1);
        const currentDate = Math.floor(Date.now() / 1000);
        const startDate = Math.floor(ytdStart.getTime() / 1000);

        const res = await fetch(
          `https://api.coingecko.com/api/v3/coins/${coinId}/market_chart/range?vs_currency=usd&from=${startDate}&to=${currentDate}`
        );
        const data = await res.json();
        setChartData(
          data.prices.map(([timestamp, price]: [number, number]) => ({
            time: new Date(timestamp).toLocaleDateString(),
            price,
          }))
        );
        return;
      }

      const res = await fetch(
        `https://api.coingecko.com/api/v3/coins/${coinId}/market_chart?vs_currency=usd&days=${days}`
      );
      const data = await res.json();
      setChartData(
        data.prices.map(([timestamp, price]: [number, number]) => ({
          time: new Date(timestamp).toLocaleDateString(),
          price,
        }))
      );
    };

    fetchChartData();
  }, [coinId, range]);

  return (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart data={chartData}>
        <XAxis dataKey="time" />
        <YAxis domain={['auto', 'auto']} />
        <Tooltip />
        <Line type="monotone" dataKey="price" stroke="#4F46E5" dot={false} />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default PriceChart;
