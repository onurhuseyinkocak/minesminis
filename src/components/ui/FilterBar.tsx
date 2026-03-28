import './FilterBar.css';

export interface FilterOption {
  value: string;
  label: string;
  count?: number;
}

export interface FilterBarProps {
  options: FilterOption[];
  value: string | null;
  onChange: (value: string | null) => void;
  /** Label shown for the "all" chip. Default: "All" */
  allLabel?: string;
  className?: string;
}

export function FilterBar({
  options,
  value,
  onChange,
  allLabel = 'All',
  className = '',
}: FilterBarProps) {
  return (
    <div
      className={`mm-filterbar ${className}`}
      role="group"
      aria-label="Filter options"
    >
      <div className="mm-filterbar__track">
        {/* "All" chip */}
        <button
          type="button"
          className={[
            'mm-filterbar__chip',
            value === null && 'mm-filterbar__chip--active',
          ]
            .filter(Boolean)
            .join(' ')}
          onClick={() => onChange(null)}
          aria-pressed={value === null}
        >
          <span className="mm-filterbar__chip-label">{allLabel}</span>
        </button>

        {options.map((option) => {
          const isActive = value === option.value;
          return (
            <button
              key={option.value}
              type="button"
              className={[
                'mm-filterbar__chip',
                isActive && 'mm-filterbar__chip--active',
              ]
                .filter(Boolean)
                .join(' ')}
              onClick={() => onChange(isActive ? null : option.value)}
              aria-pressed={isActive}
            >
              <span className="mm-filterbar__chip-label">{option.label}</span>
              {option.count !== undefined && (
                <span className="mm-filterbar__chip-count" aria-hidden="true">
                  {option.count}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

FilterBar.displayName = 'FilterBar';
