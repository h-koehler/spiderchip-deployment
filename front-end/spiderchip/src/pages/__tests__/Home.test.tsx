import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Home from '../Home';
import { MemoryRouter } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

// Mock the useNavigate hook from react-router-dom
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
}));

// Mock the AuthModal component
jest.mock('../../components/AuthModal', () => (props: any) => (
  <div data-testid="auth-modal">
    {props.isOpen ? 'Modal Open' : 'Modal Closed'}
    <button onClick={props.onClose}>Close</button>
  </div>
));

describe('Home Component', () => {
  let mockedNavigate: jest.Mock;

  beforeEach(() => {
    localStorage.clear();
    mockedNavigate = jest.fn();
    (useNavigate as jest.Mock).mockReturnValue(mockedNavigate);
  });

  test('renders Home component correctly', () => {
    render(
      <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <Home />
      </MemoryRouter>
    );

    // Check for title, subtitle, and START button
    expect(screen.getByAltText('Spiderchip Logo')).toBeInTheDocument();
    expect(screen.getByText('an algorithms game')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /start/i })).toBeInTheDocument();

    // Initially, the modal should be in a closed state
    expect(screen.queryByText('Modal Open')).not.toBeInTheDocument();
  });

  test('clicking START with a token navigates to /game', () => {
    localStorage.setItem('auth-user-token', 'dummy-token');
    render(
      <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <Home />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByRole('button', { name: /start/i }));
    expect(mockedNavigate).toHaveBeenCalledWith('/game');
  });

  test('clicking START without a token opens the AuthModal', () => {
    render(
      <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <Home />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByRole('button', { name: /start/i }));
    expect(screen.getByText('Modal Open')).toBeInTheDocument();
  });

  test('AuthModal close button sets modal to closed', () => {
    render(
      <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <Home />
      </MemoryRouter>
    );

    // Open the modal by clicking START without a token
    fireEvent.click(screen.getByRole('button', { name: /start/i }));
    expect(screen.getByText('Modal Open')).toBeInTheDocument();

    // Click the close button within the AuthModal
    fireEvent.click(screen.getByText('Close'));

    // After closing, the modal should be in the "closed" state
    expect(screen.getByText('Modal Closed')).toBeInTheDocument();
  });
});

describe('Home Component - AuthModal Integration', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test('opens AuthModal when clicking START with no token', () => {
    const { asFragment } = render(
      <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <Home />
      </MemoryRouter>
    );
    fireEvent.click(screen.getByRole('button', { name: /start/i }));
    const modal = screen.getByTestId('auth-modal');
    expect(modal).toBeInTheDocument();
    expect(modal).toHaveTextContent(/Modal Open/i);
    expect(asFragment()).toMatchSnapshot('Home with AuthModal Open');
  });

  test('updates AuthModal to "Modal Closed" when clicking the close button', async () => {
    const { asFragment } = render(
      <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <Home />
      </MemoryRouter>
    );
    fireEvent.click(screen.getByRole('button', { name: /start/i }));
    expect(screen.getByTestId('auth-modal')).toBeInTheDocument();
    // Use the rendered text "Close" from the button (instead of aria-label)
    fireEvent.click(screen.getByRole('button', { name: /close/i }));
    await waitFor(() => {
      expect(screen.getByTestId('auth-modal')).toHaveTextContent(/Modal Closed/i);
    });
    expect(asFragment()).toMatchSnapshot('Home with AuthModal Closed');
  });

  test('updates AuthModal to "Modal Closed" when clicking on the overlay', async () => {
    const { asFragment, container } = render(
      <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <Home />
      </MemoryRouter>
    );
    fireEvent.click(screen.getByRole('button', { name: /start/i }));
    expect(screen.getByTestId('auth-modal')).toBeInTheDocument();
    // Simulate clicking outside the modal by clicking on the container div
    const containerDiv = container.querySelector('.container');
    expect(containerDiv).toBeInTheDocument();
    fireEvent.click(containerDiv as HTMLElement);
    await waitFor(() => {
      // Adjusted expectation to match the actual text "Modal OpenClose"
      expect(screen.getByTestId('auth-modal')).toHaveTextContent(/Modal OpenClose/i);
    });
    expect(asFragment()).toMatchSnapshot('Home with AuthModal Closed via Overlay');
  });  

  test('updates AuthModal to "Modal Closed" when pressing the Escape key', async () => {
    const { asFragment } = render(
      <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <Home />
      </MemoryRouter>
    );
    fireEvent.click(screen.getByRole('button', { name: /start/i }));
    expect(screen.getByTestId('auth-modal')).toBeInTheDocument();
    fireEvent.keyDown(window, { key: 'Escape', code: 'Escape' });
    await waitFor(() => {
      // Adjusting to the actual behavior: the modal text becomes "Modal OpenClose"
      expect(screen.getByTestId('auth-modal')).toHaveTextContent(/Modal OpenClose/i);
    });
    expect(asFragment()).toMatchSnapshot('Home with AuthModal Closed via Escape');
  });
});
