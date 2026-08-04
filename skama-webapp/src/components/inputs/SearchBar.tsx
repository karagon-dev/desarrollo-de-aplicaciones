import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon from '@mui/icons-material/Search';
import { Input } from './Input';
import type { InputProps } from './Input';

export interface SearchBarProps extends Omit<InputProps, 'type'> {
  onSearch?: (value: string) => void;
}

export function SearchBar({
  placeholder = 'Buscar...',
  onSearch,
  onKeyDown,
  ...props
}: SearchBarProps) {
  return (
    <Input
      type="search"
      placeholder={placeholder}
      aria-label={placeholder}
      slotProps={{
        input: {
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon fontSize="small" color="action" />
            </InputAdornment>
          ),
        },
      }}
      onKeyDown={(event) => {
        onKeyDown?.(event);
        if (event.key === 'Enter' && onSearch) {
          onSearch((event.target as HTMLInputElement).value);
        }
      }}
      {...props}
    />
  );
}
