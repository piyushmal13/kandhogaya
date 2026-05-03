import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { SovereignCard } from './SovereignCard';

describe('SovereignCard Component', () => {
  it('renders natively without crashing', () => {
    render(<SovereignCard />);
    expect(screen.getByText('SovereignCard')).toBeInTheDocument();
  });
});
