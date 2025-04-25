import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

// Mock the page components
jest.mock('./pages/Home', () => () => <div>Home Page</div>);
jest.mock('./pages/Game', () => () => <div>Game Page</div>);
jest.mock('./pages/LevelSelection.tsx', () => ({ setSelectedLevel }: { setSelectedLevel: any }) => <div>Level Selection Page</div>);
jest.mock('./pages/PuzzleUI.tsx', () => ({ level }: { level: any }) => <div>Puzzle UI Page</div>);

describe('App Routing', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test('renders Home page on default route "/"', () => {
    window.history.pushState({}, 'Test page', '/');
    render(<App />);
    expect(screen.getByText('Home Page')).toBeInTheDocument();
  });

  test('redirects to Home page from protected route "/game" when not authenticated', () => {
    window.history.pushState({}, 'Test page', '/game');
    render(<App />);
    expect(screen.getByText('Home Page')).toBeInTheDocument();
  });

  test('renders Game page when authenticated and accessing protected route "/game"', () => {
    localStorage.setItem('token', 'dummy-token');
    window.history.pushState({}, 'Test page', '/game');
    render(<App />);
    expect(screen.getByText('Game Page')).toBeInTheDocument();
  });

  test('redirects from "/puzzle-ui" to "/level-select" if no level is selected', () => {
    window.history.pushState({}, 'Test page', '/puzzle/');
    render(<App />);
    // Expect redirection to LevelSelection since no level is selected
    expect(screen.getByText('Level Selection Page')).toBeInTheDocument();
  });
});
