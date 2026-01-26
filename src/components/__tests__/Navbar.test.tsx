import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Navbar from '../../components/Navbar';
import { BrowserRouter } from 'react-router-dom';

// Mock context providers
jest.mock('../../contexts/AuthContext', () => ({
    useAuth: () => ({ user: null, userProfile: null, signOut: jest.fn() })
}));
jest.mock('../../contexts/PremiumContext', () => ({
    usePremium: () => ({ isPremium: false })
}));

const renderWithRouter = (ui: React.ReactElement) => {
    return render(<BrowserRouter>{ui}</BrowserRouter>);
};

test('hamburger menu toggles overlay and navigation panel', () => {
    renderWithRouter(<Navbar />);
    const button = screen.getByLabelText(/toggle navigation menu/i);
    expect(button).toBeInTheDocument();
    // Initially closed
    expect(button).toHaveAttribute('aria-expanded', 'false');
    expect(screen.queryByRole('navigation')).toBeInTheDocument(); // nav exists
    // Overlay should not be in DOM initially
    expect(document.querySelector('.menu-overlay')).not.toBeInTheDocument();

    // Open menu
    fireEvent.click(button);
    expect(button).toHaveAttribute('aria-expanded', 'true');
    const overlay = document.querySelector('.menu-overlay');
    expect(overlay).toBeInTheDocument();
    expect(overlay).toHaveClass('active');
    const navLinks = document.querySelector('.nav-links');
    expect(navLinks).toHaveClass('active');

    // Close by clicking overlay
    if (overlay) fireEvent.click(overlay);
    expect(button).toHaveAttribute('aria-expanded', 'false');
    expect(document.querySelector('.menu-overlay')).not.toBeInTheDocument();
});
