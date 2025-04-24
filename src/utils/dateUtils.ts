export function getDaysFromRange(range: string): string {
    const today = new Date();
  
    switch (range) {
      case '1d':
        return '1';
      case '5d':
        return '5';
      case '1w':
        return '7';
      case '1m':
        return '30';
      case '1y':
        return '365';
      case 'ytd': {
        const startOfYear = new Date(today.getFullYear(), 0, 1);
        const diffTime = Math.abs(today.getTime() - startOfYear.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays.toString();
      }
      case 'all':
        return 'max';
      default:
        return '30';
    }
  }
  
  export function getDateRangeLabel(range: string): string {
    const today = new Date();
    const format = (d: Date) => d.toLocaleDateString();
  
    switch (range) {
      case '1d': {
        const d = new Date();
        d.setDate(today.getDate() - 1);
        return `${format(d)} - ${format(today)}`;
      }
      case '5d': {
        const d = new Date();
        d.setDate(today.getDate() - 5);
        return `${format(d)} - ${format(today)}`;
      }
      case '1w': {
        const d = new Date();
        d.setDate(today.getDate() - 7);
        return `${format(d)} - ${format(today)}`;
      }
      case '1m': {
        const d = new Date();
        d.setMonth(today.getMonth() - 1);
        return `${format(d)} - ${format(today)}`;
      }
      case '1y': {
        const d = new Date();
        d.setFullYear(today.getFullYear() - 1);
        return `${format(d)} - ${format(today)}`;
      }
      case 'ytd': {
        const start = new Date(today.getFullYear(), 0, 1);
        return `${format(start)} - ${format(today)}`;
      }
      case 'all':
        return 'All Time';
      default:
        return '';
    }
  }
  