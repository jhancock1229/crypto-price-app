import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

interface PriceChartProps {
  data: { time: string; price: number }[];
}

const PriceChart: React.FC<PriceChartProps> = ({ data }) => {
  return (
    <div style={{ marginTop: '2rem', height: '300px' }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <XAxis dataKey="time" />
          <YAxis domain={['auto', 'auto']} />
          <Tooltip />
          <Line type="monotone" dataKey="price" stroke="#8884d8" strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PriceChart;
