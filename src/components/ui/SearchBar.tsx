import { useRef, KeyboardEvent } from 'react';
import { Search, X } from 'lucide-react';
import './SearchBar.css';

export type SearchBarSize = 'sm' | 'md' | 'lg';

export interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  onClear?: () => void;
  size?: SearchBarSize;
  className?: string;
  autoFocus?: boolean;
  disabled?: boolean;
  'aria-label'?: string;
}

export function SearchBar({
  value,
  onChange,
  placeholder = 'Search...',
  onClear,
  size = 'md',
  className = '',
  autoFocus = false,
  disabled = false,
  'aria-label': ariaLabel = 'Search',
}: SearchBarProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleClear = () => {
    onChange('');
    onClear?.();
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape' && value) {
      handleClear();
    }
  };

  const classes = [
    'mm-searchbar',
    `mm-searchbar--${size}`,
    value && 'mm-searchbar--has-value',
    disabled && 'mm-searchbar--disabled',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={classes} role="search">
      <span className="mm-searchbar__icon" aria-hidden="true">
        <Search strokeWidth={2} />
      </span>

      <input
        ref={inputRef}
        type="search"
        className="mm-searchbar__input"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        disabled={disabled}
        autoFocus={autoFocus}
        aria-label={ariaLabel}
        autoComplete="off"
        spellCheck={false}
      />

      {value && (
        <button
          type="button"
          className="mm-searchbar__clear"
          onClick={handleClear}
          aria-label="Clear search"
          tabIndex={0}
        >
          <X strokeWidth={2.5} />
        </button>
      )}
    </div>
  );
}

SearchBar.displayName = 'SearchBar';
