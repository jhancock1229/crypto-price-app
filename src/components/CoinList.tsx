import React from 'react';

type Prices = {
  bitcoin: { usd: number };
  ethereum: { usd: number };
  dogecoin: { usd: number };
};

type Props = {
  prices: Prices;
};

const CoinList = ({ prices }: Props) => {
  return (
    <div style={styles.prices}>
      <p style={styles.coin}><strong>Bitcoin:</strong> ${prices.bitcoin.usd}</p>
      <p style={styles.coin}><strong>Ethereum:</strong> ${prices.ethereum.usd}</p>
      <p style={styles.coin}><strong>Dogecoin:</strong> ${prices.dogecoin.usd}</p>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
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

export default CoinList;
