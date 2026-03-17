import React from 'react';
import { LucideIcon } from 'lucide-react';
import './ContentPageHeader.css';

interface ContentPageHeaderProps {
    icon: LucideIcon;
    title: string;
    description: string;
    iconColor?: string;
    children?: React.ReactNode; // For search bars, stats, etc.
    filterSlot?: React.ReactNode; // For tabs or dropdowns
}

const ContentPageHeader: React.FC<ContentPageHeaderProps> = ({
    icon: Icon,
    title,
    description,
    iconColor = "var(--primary)",
    children,
    filterSlot
}) => {
    return (
        <div className="library-header-container">
            <div className="library-header-glass">
                <div className="library-header-main">
                    <div className="library-title-section">
                        <div className="library-icon-box">
                            <Icon size={32} color={iconColor} />
                        </div>
                        <div className="library-text-box">
                            <h1>{title}</h1>
                            <p>{description}</p>
                        </div>
                    </div>

                    {children && (
                        <div className="library-actions-section">
                            {children}
                        </div>
                    )}
                </div>

                {filterSlot && (
                    <div className="library-filter-section">
                        {filterSlot}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ContentPageHeader;
