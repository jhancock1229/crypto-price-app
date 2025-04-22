import { useEffect, useState } from 'react';

type Prices = {
  bitcoin: { usd: number };
  ethereum: { usd: number };
  dogecoin: { usd: number };
};

function App() {
  const [prices, setPrices] = useState<Prices | null>(null);

  useEffect(() => {
    fetchPrices();
    const interval = setInterval(fetchPrices, 30000);
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

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Live Crypto Prices</h1>
      {prices ? (
        <div>
          <p><strong>Bitcoin:</strong> ${prices.bitcoin.usd}</p>
          <p><strong>Ethereum:</strong> ${prices.ethereum.usd}</p>
          <p><strong>Dogecoin:</strong> ${prices.dogecoin.usd}</p>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    textAlign: 'center',
    backgroundColor: '#121212',
    color: 'white',
    padding: '40px',
    minHeight: '100vh',
  },
  title: {
    marginBottom: '20px',
  },
};

export default App;
