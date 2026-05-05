import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { EliteCard } from './EliteCard';

describe('EliteCard Component', () => {
  it('renders natively without crashing', () => {
    render(<EliteCard />);
    expect(screen.getByText('EliteCard')).toBeInTheDocument();
  });
});
