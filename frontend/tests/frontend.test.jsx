import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect } from 'vitest';
import App from '../src/App';
import Plants from '../src/pages/Plants';
import Remedies from '../src/pages/Remedies';

const renderWithRouter = (ui) => {
  return render(<BrowserRouter>{ui}</BrowserRouter>);
};

describe('Frontend Tests', () => {
  it('renders home page and disclaimer', () => {
    render(<App />);
    expect(screen.getByText(/Disclaimer:/i)).toBeInTheDocument();
    expect(screen.getByText(/Welcome to HomeRemedis/i)).toBeInTheDocument();
  });

  it('renders plant list from mocked API data', async () => {
    renderWithRouter(<Plants />);
    expect(screen.getByText(/Loading plants.../i)).toBeInTheDocument();
    
    await waitFor(() => {
      expect(screen.getByText('Mocked Plant 1')).toBeInTheDocument();
    });
    expect(screen.getByText('Another Plant')).toBeInTheDocument();
  });

  it('filters plants by search input', async () => {
    renderWithRouter(<Plants />);
    await waitFor(() => {
      expect(screen.getByText('Mocked Plant 1')).toBeInTheDocument();
    });

    const searchInput = screen.getByPlaceholderText(/Search plants.../i);
    fireEvent.change(searchInput, { target: { value: 'Mocked' } });

    await waitFor(() => {
      expect(screen.queryByText('Another Plant')).not.toBeInTheDocument();
      expect(screen.getByText('Mocked Plant 1')).toBeInTheDocument();
    });
  });

  it('renders remedy list and filters by category', async () => {
    renderWithRouter(<Remedies />);
    await waitFor(() => {
      expect(screen.getByText('Remedy 1')).toBeInTheDocument();
    });
    expect(screen.getByText('Remedy 2')).toBeInTheDocument();

    // The categories are mocked to return ['Cold', 'Fever', 'Skin']
    await waitFor(() => {
      expect(screen.getByText('Skin', { selector: 'button' })).toBeInTheDocument();
    });

    const skinFilter = screen.getByText('Skin', { selector: 'button' });
    fireEvent.click(skinFilter);

    await waitFor(() => {
      expect(screen.getByText('Remedy 2')).toBeInTheDocument();
      expect(screen.queryByText('Remedy 1')).not.toBeInTheDocument();
    });
  });
});
