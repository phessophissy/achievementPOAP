import { describe, expect, it } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import EventCard from '../components/Event/EventCard';
import { formatAddress, formatNumber, getProgress, isValidStacksAddress } from '../utils/helpers';

describe('Domain smoke tests', () => {
  it('renders EventCard with expected route link', () => {
    const event = {
      id: 42,
      name: 'Stacks Meetup',
      description: 'Community meetup',
      startTime: 1,
      endTime: Math.floor(Date.now() / 1000) + 7200,
      active: true,
      currentMints: 15,
      maxMints: 50,
      imageUri: 'https://example.com/image.png',
    };

    render(
      <BrowserRouter>
        <EventCard event={event} />
      </BrowserRouter>
    );

    expect(screen.getByRole('heading', { name: 'Stacks Meetup' })).toBeInTheDocument();
    expect(screen.getByRole('link')).toHaveAttribute('href', '/events/42');
    expect(screen.getByText('15 / 50')).toBeInTheDocument();
  });

  it('validates helper function baseline behavior', () => {
    expect(formatAddress('SP2KYZRNME33Y39GP3RKC90DQJ45EF1N0NZNVRE09')).toContain('...');
    expect(formatNumber(12345)).toBe('12,345');
    expect(getProgress(25, 100)).toBe(25);
    expect(isValidStacksAddress('SP2KYZRNME33Y39GP3RKC90DQJ45EF1N0NZNVRE09')).toBe(true);
  });
});
