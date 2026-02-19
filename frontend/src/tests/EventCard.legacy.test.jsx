import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import EventCard from '../components/Event/EventCard';

const mockEvent = {
  id: 1,
  name: 'Test Event',
  description: 'This is a test event description',
  imageUrl: '/test-image.png',
  startDate: '2024-01-15',
  endDate: '2024-01-20',
  location: 'Virtual',
  totalMinted: 50,
  maxSupply: 100,
  isActive: true,
};

const renderWithRouter = (component) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('EventCard Component', () => {
  it('renders event name', () => {
    renderWithRouter(<EventCard event={mockEvent} />);
    expect(screen.getByText('Test Event')).toBeInTheDocument();
  });

  it('renders event description', () => {
    renderWithRouter(<EventCard event={mockEvent} />);
    expect(screen.getByText(/This is a test event/)).toBeInTheDocument();
  });

  it('renders event image', () => {
    renderWithRouter(<EventCard event={mockEvent} />);
    const image = screen.getByRole('img');
    expect(image).toHaveAttribute('src', '/test-image.png');
  });

  it('shows active badge for active events', () => {
    renderWithRouter(<EventCard event={mockEvent} />);
    expect(screen.getByText('Active')).toBeInTheDocument();
  });

  it('shows ended badge for inactive events', () => {
    renderWithRouter(<EventCard event={{ ...mockEvent, isActive: false }} />);
    expect(screen.getByText('Ended')).toBeInTheDocument();
  });

  it('displays mint progress', () => {
    renderWithRouter(<EventCard event={mockEvent} />);
    expect(screen.getByText('50 / 100')).toBeInTheDocument();
  });

  it('links to event detail page', () => {
    renderWithRouter(<EventCard event={mockEvent} />);
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/events/1');
  });

  it('handles click events', () => {
    const onClick = vi.fn();
    renderWithRouter(<EventCard event={mockEvent} onClick={onClick} />);
    fireEvent.click(screen.getByRole('link'));
  });

  it('renders with custom className', () => {
    const { container } = renderWithRouter(
      <EventCard event={mockEvent} className="custom-class" />
    );
    expect(container.firstChild).toHaveClass('custom-class');
  });
});
