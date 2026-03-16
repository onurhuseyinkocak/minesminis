import React, { ReactNode } from 'react';
import './Tabs.css';

export interface TabItem {
  id: string;
  label: string;
  icon?: ReactNode;
}

export type TabsVariant = 'underline' | 'pill';

export interface TabsProps {
  tabs: TabItem[];
  activeTab: string;
  onChange: (tabId: string) => void;
  variant?: TabsVariant;
  className?: string;
}

export const Tabs: React.FC<TabsProps> = ({
  tabs,
  activeTab,
  onChange,
  variant = 'underline',
  className = '',
}) => {
  const classes = [
    'mm-tabs',
    variant === 'pill' && 'mm-tabs--pill',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={classes} role="tablist">
      {tabs.map((tab) => {
        const isActive = tab.id === activeTab;
        return (
          <button
            key={tab.id}
            className={`mm-tab ${isActive ? 'mm-tab--active' : ''}`}
            role="tab"
            aria-selected={isActive}
            id={`tab-${tab.id}`}
            aria-controls={`tabpanel-${tab.id}`}
            tabIndex={isActive ? 0 : -1}
            onClick={() => onChange(tab.id)}
            type="button"
          >
            {tab.icon && (
              <span className="mm-tab__icon" aria-hidden="true">
                {tab.icon}
              </span>
            )}
            {tab.label}
          </button>
        );
      })}
    </div>
  );
};

Tabs.displayName = 'Tabs';
