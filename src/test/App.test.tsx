import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import App from '../App';

describe('App Component', () => {
  it('renders progress text in the header', () => {
    render(<App />);
    expect(screen.getByText(/VoyageEngine/i)).toBeInTheDocument();
  });

  it('renders the initial planner form', () => {
    render(<App />);
    expect(screen.getByText(/Plan Your Escape/i)).toBeInTheDocument();
  });
});
