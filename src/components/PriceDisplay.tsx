interface PriceDisplayProps {
    coin: string;
    price: number;
  }
  
  const PriceDisplay: React.FC<PriceDisplayProps> = ({ coin, price }) => {
    return (
      <div style={{ marginTop: '2rem', fontSize: '1.5rem' }}>
        Current price of <strong>{coin}</strong>: ${price.toLocaleString()}
      </div>
    );
  };
  
  export default PriceDisplay;
  