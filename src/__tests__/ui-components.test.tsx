import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';

// Mock LanguageContext (used by Modal and other components)
vi.mock('../contexts/LanguageContext', () => ({
  useLanguage: () => ({
    lang: 'en' as const,
    setLang: vi.fn(),
    t: (key: string) => {
      const map: Record<string, string> = {
        'common.close': 'Close dialog',
      };
      return map[key] ?? key;
    },
  }),
}));

import {
  Button,
  Card,
  Input,
  Badge,
  ProgressBar,
  Tabs,
  Modal,
  EmptyState,
  Avatar,
  Skeleton,
} from '../components/ui';

// ============================================================
// BUTTON
// ============================================================
describe('Button', () => {
  it('renders with children', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('applies variant class', () => {
    render(<Button variant="danger">Delete</Button>);
    const btn = screen.getByRole('button');
    expect(btn.className).toContain('mm-button--danger');
  });

  it('applies size class', () => {
    render(<Button size="lg">Large</Button>);
    const btn = screen.getByRole('button');
    expect(btn.className).toContain('mm-button--lg');
  });

  it('handles click events', () => {
    const handler = vi.fn();
    render(<Button onClick={handler}>Press</Button>);
    fireEvent.click(screen.getByRole('button'));
    expect(handler).toHaveBeenCalledOnce();
  });

  it('shows loading state', () => {
    render(<Button loading>Saving</Button>);
    const btn = screen.getByRole('button');
    expect(btn.className).toContain('mm-button--loading');
    expect(btn).toHaveAttribute('aria-busy', 'true');
    expect(btn).toBeDisabled();
  });

  it('renders disabled state', () => {
    render(<Button disabled>Disabled</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('renders icon', () => {
    render(<Button icon={<span data-testid="icon">★</span>}>Star</Button>);
    expect(screen.getByTestId('icon')).toBeInTheDocument();
  });

  it('applies fullWidth class', () => {
    render(<Button fullWidth>Full</Button>);
    expect(screen.getByRole('button').className).toContain('mm-button--full-width');
  });
});

// ============================================================
// CARD
// ============================================================
describe('Card', () => {
  it('renders children', () => {
    render(<Card>Card content</Card>);
    expect(screen.getByText('Card content')).toBeInTheDocument();
  });

  it('applies variant class', () => {
    const { container } = render(<Card variant="elevated">Elevated</Card>);
    expect(container.firstChild).toHaveClass('mm-card--elevated');
  });

  it('applies padding class', () => {
    const { container } = render(<Card padding="xl">Padded</Card>);
    expect(container.firstChild).toHaveClass('mm-card--padding-xl');
  });

  it('interactive card (with onClick) has button role', () => {
    const handler = vi.fn();
    render(<Card onClick={handler}>Clickable</Card>);
    const card = screen.getByRole('button');
    expect(card).toBeInTheDocument();
    fireEvent.click(card);
    expect(handler).toHaveBeenCalledOnce();
  });

  it('interactive card responds to Enter key', () => {
    const handler = vi.fn();
    render(<Card onClick={handler}>Keyable</Card>);
    const card = screen.getByRole('button');
    fireEvent.keyDown(card, { key: 'Enter' });
    expect(handler).toHaveBeenCalledOnce();
  });

  it('non-interactive card has no role="button"', () => {
    const { container } = render(<Card>Static</Card>);
    expect(container.firstChild).not.toHaveAttribute('role');
  });
});

// ============================================================
// INPUT
// ============================================================
describe('Input', () => {
  it('renders with label', () => {
    render(<Input label="Email" />);
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
  });

  it('shows error message', () => {
    render(<Input label="Email" error="Required" />);
    expect(screen.getByRole('alert')).toHaveTextContent('Required');
  });

  it('sets aria-invalid when there is an error', () => {
    render(<Input label="Email" error="Invalid" />);
    expect(screen.getByLabelText('Email')).toHaveAttribute('aria-invalid', 'true');
  });

  it('handles change events', () => {
    const handler = vi.fn();
    render(<Input label="Name" onChange={handler} />);
    fireEvent.change(screen.getByLabelText('Name'), { target: { value: 'Ali' } });
    expect(handler).toHaveBeenCalled();
  });

  it('renders helper text', () => {
    render(<Input label="Pass" helperText="Min 8 chars" />);
    expect(screen.getByText('Min 8 chars')).toBeInTheDocument();
  });

  it('renders disabled', () => {
    render(<Input label="Disabled" disabled />);
    expect(screen.getByLabelText('Disabled')).toBeDisabled();
  });

  it('applies size class', () => {
    render(<Input label="Small" size="sm" />);
    const input = screen.getByLabelText('Small');
    expect(input.className).toContain('mm-input--sm');
  });
});

// ============================================================
// BADGE
// ============================================================
describe('Badge', () => {
  it('renders children', () => {
    render(<Badge>New</Badge>);
    expect(screen.getByText('New')).toBeInTheDocument();
  });

  it('applies variant class', () => {
    const { container } = render(<Badge variant="success">OK</Badge>);
    expect(container.firstChild).toHaveClass('mm-badge--success');
  });

  it('applies size class', () => {
    const { container } = render(<Badge size="sm">Sm</Badge>);
    expect(container.firstChild).toHaveClass('mm-badge--sm');
  });

  it('renders icon', () => {
    render(<Badge icon={<span data-testid="badge-icon">★</span>}>Star</Badge>);
    expect(screen.getByTestId('badge-icon')).toBeInTheDocument();
  });

  it('renders all variants without error', () => {
    const variants = ['default', 'success', 'warning', 'error', 'info', 'premium'] as const;
    for (const variant of variants) {
      const { unmount } = render(<Badge variant={variant}>{variant}</Badge>);
      expect(screen.getByText(variant)).toBeInTheDocument();
      unmount();
    }
  });
});

// ============================================================
// PROGRESS BAR
// ============================================================
describe('ProgressBar', () => {
  it('renders with correct aria value', () => {
    render(<ProgressBar value={65} />);
    const bar = screen.getByRole('progressbar');
    expect(bar).toHaveAttribute('aria-valuenow', '65');
    expect(bar).toHaveAttribute('aria-valuemin', '0');
    expect(bar).toHaveAttribute('aria-valuemax', '100');
  });

  it('clamps value to 0-100', () => {
    const { rerender } = render(<ProgressBar value={150} />);
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '100');

    rerender(<ProgressBar value={-10} />);
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '0');
  });

  it('shows label when showLabel is true', () => {
    render(<ProgressBar value={42} showLabel />);
    expect(screen.getByText('42%')).toBeInTheDocument();
  });

  it('does not show label by default', () => {
    render(<ProgressBar value={42} />);
    expect(screen.queryByText('42%')).not.toBeInTheDocument();
  });

  it('applies variant class', () => {
    const { container } = render(<ProgressBar value={50} variant="success" />);
    expect(container.firstChild).toHaveClass('mm-progress--success');
  });

  it('applies animated class', () => {
    const { container } = render(<ProgressBar value={50} animated />);
    expect(container.firstChild).toHaveClass('mm-progress--animated');
  });
});

// ============================================================
// TABS
// ============================================================
describe('Tabs', () => {
  const tabItems = [
    { id: 'tab1', label: 'Tab One' },
    { id: 'tab2', label: 'Tab Two' },
    { id: 'tab3', label: 'Tab Three' },
  ];

  it('renders all tabs', () => {
    render(<Tabs tabs={tabItems} activeTab="tab1" onChange={vi.fn()} />);
    expect(screen.getByText('Tab One')).toBeInTheDocument();
    expect(screen.getByText('Tab Two')).toBeInTheDocument();
    expect(screen.getByText('Tab Three')).toBeInTheDocument();
  });

  it('marks the active tab as selected', () => {
    render(<Tabs tabs={tabItems} activeTab="tab2" onChange={vi.fn()} />);
    const tab2 = screen.getByText('Tab Two').closest('button');
    expect(tab2).toHaveAttribute('aria-selected', 'true');
  });

  it('marks inactive tabs as not selected', () => {
    render(<Tabs tabs={tabItems} activeTab="tab2" onChange={vi.fn()} />);
    const tab1 = screen.getByText('Tab One').closest('button');
    expect(tab1).toHaveAttribute('aria-selected', 'false');
  });

  it('calls onChange when a tab is clicked', () => {
    const onChange = vi.fn();
    render(<Tabs tabs={tabItems} activeTab="tab1" onChange={onChange} />);
    fireEvent.click(screen.getByText('Tab Two'));
    expect(onChange).toHaveBeenCalledWith('tab2');
  });

  it('has tablist role', () => {
    render(<Tabs tabs={tabItems} activeTab="tab1" onChange={vi.fn()} />);
    expect(screen.getByRole('tablist')).toBeInTheDocument();
  });

  it('each tab has role="tab"', () => {
    render(<Tabs tabs={tabItems} activeTab="tab1" onChange={vi.fn()} />);
    const tabs = screen.getAllByRole('tab');
    expect(tabs).toHaveLength(3);
  });
});

// ============================================================
// MODAL
// ============================================================
describe('Modal', () => {
  it('renders children when open', () => {
    render(
      <Modal isOpen onClose={vi.fn()} title="Test Modal">
        Modal content
      </Modal>
    );
    expect(screen.getByText('Modal content')).toBeInTheDocument();
  });

  it('renders the title', () => {
    render(
      <Modal isOpen onClose={vi.fn()} title="My Title">
        Body
      </Modal>
    );
    expect(screen.getByText('My Title')).toBeInTheDocument();
  });

  it('has dialog role', () => {
    render(
      <Modal isOpen onClose={vi.fn()} title="Dialog">
        Content
      </Modal>
    );
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('has aria-modal="true"', () => {
    render(
      <Modal isOpen onClose={vi.fn()} title="Accessible">
        Content
      </Modal>
    );
    expect(screen.getByRole('dialog')).toHaveAttribute('aria-modal', 'true');
  });

  it('calls onClose when close button is clicked', () => {
    const onClose = vi.fn();
    render(
      <Modal isOpen onClose={onClose} title="Close Me">
        Body
      </Modal>
    );
    fireEvent.click(screen.getByLabelText('Close dialog'));
    expect(onClose).toHaveBeenCalledOnce();
  });

  it('calls onClose when Escape key is pressed', () => {
    const onClose = vi.fn();
    render(
      <Modal isOpen onClose={onClose} title="Esc Test">
        Body
      </Modal>
    );
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(onClose).toHaveBeenCalledOnce();
  });

  it('calls onClose when overlay is clicked', () => {
    const onClose = vi.fn();
    const { container } = render(
      <Modal isOpen onClose={onClose} title="Overlay">
        Body
      </Modal>
    );
    const overlay = container.querySelector('.mm-modal-overlay');
    if (overlay) fireEvent.click(overlay);
    expect(onClose).toHaveBeenCalledOnce();
  });
});

// ============================================================
// EMPTY STATE
// ============================================================
describe('EmptyState', () => {
  it('renders title', () => {
    render(<EmptyState title="No items" />);
    expect(screen.getByText('No items')).toBeInTheDocument();
  });

  it('renders description', () => {
    render(<EmptyState title="Empty" description="Nothing here yet" />);
    expect(screen.getByText('Nothing here yet')).toBeInTheDocument();
  });

  it('renders action', () => {
    render(
      <EmptyState
        title="Empty"
        action={<button>Add Item</button>}
      />
    );
    expect(screen.getByText('Add Item')).toBeInTheDocument();
  });

  it('renders icon', () => {
    render(
      <EmptyState
        title="No data"
        icon={<span data-testid="empty-icon">📭</span>}
      />
    );
    expect(screen.getByTestId('empty-icon')).toBeInTheDocument();
  });

  it('renders mimiMessage', () => {
    render(<EmptyState title="Empty" mimiMessage="Mimi says hi!" />);
    expect(screen.getByText('Mimi says hi!')).toBeInTheDocument();
  });
});

// ============================================================
// AVATAR
// ============================================================
describe('Avatar', () => {
  it('renders image when src is provided', () => {
    const { container } = render(<Avatar src="https://example.com/photo.jpg" alt="User" />);
    const wrapper = container.querySelector('.mm-avatar');
    expect(wrapper).toBeInTheDocument();
    const img = wrapper?.querySelector('img.mm-avatar__image');
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('src', 'https://example.com/photo.jpg');
  });

  it('shows fallback when no src is provided', () => {
    render(<Avatar fallback="AB" />);
    expect(screen.getByText('AB')).toBeInTheDocument();
  });

  it('shows "?" fallback when nothing provided', () => {
    render(<Avatar />);
    expect(screen.getByText('?')).toBeInTheDocument();
  });

  it('applies size class', () => {
    const { container } = render(<Avatar size="xl" fallback="X" />);
    expect(container.firstChild).toHaveClass('mm-avatar--xl');
  });

  it('has role="img"', () => {
    render(<Avatar fallback="A" alt="Test" />);
    expect(screen.getByRole('img')).toBeInTheDocument();
  });
});

// ============================================================
// SKELETON
// ============================================================
describe('Skeleton', () => {
  it('renders with default text variant', () => {
    const { container } = render(<Skeleton />);
    expect(container.firstChild).toHaveClass('mm-skeleton--text');
  });

  it('renders circle variant', () => {
    const { container } = render(<Skeleton variant="circle" />);
    expect(container.firstChild).toHaveClass('mm-skeleton--circle');
  });

  it('renders rect variant', () => {
    const { container } = render(<Skeleton variant="rect" />);
    expect(container.firstChild).toHaveClass('mm-skeleton--rect');
  });

  it('renders card variant', () => {
    const { container } = render(<Skeleton variant="card" />);
    expect(container.firstChild).toHaveClass('mm-skeleton--card');
  });

  it('renders multiple skeletons with count', () => {
    const { container } = render(<Skeleton count={3} />);
    const group = container.querySelector('.mm-skeleton-group');
    expect(group).toBeInTheDocument();
    expect(group?.children).toHaveLength(3);
  });

  it('is hidden from accessibility tree', () => {
    const { container } = render(<Skeleton />);
    expect(container.firstChild).toHaveAttribute('aria-hidden', 'true');
  });

  it('applies custom width and height', () => {
    const { container } = render(<Skeleton width={200} height={50} />);
    const el = container.firstChild as HTMLElement;
    expect(el.style.width).toBe('200px');
    expect(el.style.height).toBe('50px');
  });
});
