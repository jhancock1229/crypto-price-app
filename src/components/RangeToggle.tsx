interface RangeToggleProps {
    selected: string;
    onSelect: (range: string) => void;
  }
  
  const ranges = ['1D', '5D', '1W', '1M', '1Y', 'YTD', 'ALL'];
  
  const RangeToggle: React.FC<RangeToggleProps> = ({ selected, onSelect }) => {
    return (
      <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
        {ranges.map((range) => (
          <button
            key={range}
            onClick={() => onSelect(range)}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: selected === range ? '#4f46e5' : '#e5e7eb',
              color: selected === range ? 'white' : 'black',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
            }}
          >
            {range}
          </button>
        ))}
      </div>
    );
  };
  
  export default RangeToggle;
  