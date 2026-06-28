import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import OnboardingPage from '../app/page';
import { CareerProvider } from '../context/CareerContext';

// Mock the Next.js router
const pushMock = vi.fn();
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: pushMock,
  }),
}));

const renderWithProvider = (ui: React.ReactElement) => {
  return render(
    <CareerProvider>
      {ui}
    </CareerProvider>
  );
};

describe('OnboardingPage', () => {
  it('renders all form fields', () => {
    renderWithProvider(<OnboardingPage />);

    expect(screen.getByLabelText(/Your Name/i)).toBeDefined();
    expect(screen.getByLabelText(/Current Role/i)).toBeDefined();
    expect(screen.getByLabelText(/Target Role/i)).toBeDefined();
    expect(screen.getByLabelText(/Years of Experience/i)).toBeDefined();
    expect(screen.getByText(/Key Skills/i)).toBeDefined();
    expect(screen.getByRole('button', { name: /Generate My Roadmap/i })).toBeDefined();
  });

  it('shows validation errors when submitting an empty form', async () => {
    renderWithProvider(<OnboardingPage />);

    const submitBtn = screen.getByRole('button', { name: /Generate My Roadmap/i });
    fireEvent.click(submitBtn);

    expect(await screen.findByText('Name is required.')).toBeDefined();
    expect(await screen.findByText('Current role is required.')).toBeDefined();
    expect(await screen.findByText('Target role is required.')).toBeDefined();
    expect(await screen.findByText('Experience is required.')).toBeDefined();
    expect(await screen.findByText('At least one skill is required.')).toBeDefined();
    expect(pushMock).not.toHaveBeenCalled();
  });

  it('navigates and saves state on valid form submission', async () => {
    const user = userEvent.setup();
    renderWithProvider(<OnboardingPage />);

    // Fill out the required inputs
    await user.type(screen.getByLabelText(/Your Name/i), 'Jane Doe');
    await user.type(screen.getByLabelText(/Current Role/i), 'Junior Dev');
    await user.type(screen.getByLabelText(/Target Role/i), 'Senior Dev');
    await user.selectOptions(screen.getByLabelText(/Years of Experience/i), '3');

    // Add a skill
    const skillInput = screen.getByPlaceholderText('Type and press Enter');
    await user.type(skillInput, 'React{enter}');

    const submitBtn = screen.getByRole('button', { name: /Generate My Roadmap/i });
    await user.click(submitBtn);

    // Verify it navigated successfully
    expect(pushMock).toHaveBeenCalledWith('/roadmap');
  });
});
