import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Mock, vi } from 'vitest';
import Login from './login';

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await import('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

global.fetch = vi.fn();
(global as any).swal = vi.fn();

describe('Login Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (fetch as Mock).mockClear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  const renderWithRouter = (ui: React.ReactNode) => {
    return render(<MemoryRouter>{ui}</MemoryRouter>);
  };

  it('should render the login form correctly', () => {
    renderWithRouter(<Login />);

    expect(screen.getByLabelText(/usuário/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/senha/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /entrar/i })).toBeInTheDocument();
  });

  it('should show an error message for invalid credentials', async () => {
    (fetch as Mock).mockResolvedValueOnce({
      ok: false,
    });

    renderWithRouter(<Login />);

    fireEvent.change(screen.getByLabelText(/usuário/i), { target: { value: 'invalidUser' } });
    fireEvent.change(screen.getByLabelText(/senha/i), { target: { value: 'invalidPass' } });
    fireEvent.click(screen.getByRole('button', { name: /entrar/i }));

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /entrar/i })).not.toBeDisabled();
    });

    expect(global.fetch).toHaveBeenCalledWith(expect.any(String), expect.any(Object));
  });

  it('should navigate to the home page on successful login', async () => {
    (fetch as Mock).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ access_token: 'fakeToken' }),
    });

    renderWithRouter(<Login />);

    fireEvent.change(screen.getByLabelText(/usuário/i), { target: { value: 'validUser' } });
    fireEvent.change(screen.getByLabelText(/senha/i), { target: { value: 'validPass' } });
    fireEvent.click(screen.getByRole('button', { name: /entrar/i }));

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/');
    });

    expect(localStorage.getItem('access_token')).toBe('fakeToken');
  });

  it('should display an error message for internal server error', async () => {
    (fetch as Mock).mockResolvedValueOnce({
      ok: false,
    });

    renderWithRouter(<Login />);

    fireEvent.change(screen.getByLabelText(/usuário/i), { target: { value: 'user' } });
    fireEvent.change(screen.getByLabelText(/senha/i), { target: { value: 'pass' } });
    fireEvent.click(screen.getByRole('button', { name: /entrar/i }));

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /entrar/i })).not.toBeDisabled();
    });
  });
});
