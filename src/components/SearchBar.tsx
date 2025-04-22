interface SearchBarProps {
    value: string;
    onChange: (val: string) => void;
    onSearch: () => void;
  }
  
  const SearchBar: React.FC<SearchBarProps> = ({ value, onChange, onSearch }) => {
    return (
      <div style={{ marginTop: '1rem' }}>
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Enter coin name or symbol (e.g. bitcoin, eth)"
          style={{ padding: '0.5rem', fontSize: '1rem', width: '250px' }}
        />
        <button onClick={onSearch} style={{ marginLeft: '1rem', padding: '0.5rem 1rem', fontSize: '1rem' }}>
          Search
        </button>
      </div>
    );
  };
  
  export default SearchBar;
  