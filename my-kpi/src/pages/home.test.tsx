// import { render, screen, waitFor } from '@testing-library/react';
// import { vi, Mock } from 'vitest';
// import Home from './home';
// import { MemoryRouter } from 'react-router-dom';
// import { useAuthGuard } from '../hooks/auth-guard';

// vi.mock('../hooks/auth-guard');
// vi.mock('../components/surveys/show-surveys', () => ({
//   ShowSurveys: ({ surveys }: { surveys: any[] }) => (
//     <div data-testid="show-surveys">
//       {surveys.map((survey, index) => (
//         <div key={index}>{survey.title}</div>
//       ))}
//     </div>
//   ),
// }));

// vi.mock('../lib/env', () => ({
//   env: {
//     VITE_API_URL: 'http://mocked-api',
//   },
// }));

// global.fetch = vi.fn();
// (global as any).swal = vi.fn();

// declare global {
//   interface Window {
//     swal: any;
//   }
// }

// window.swal = vi.fn();

// describe('Home', () => {
//   beforeEach(() => {
//     (useAuthGuard as Mock).mockImplementation(() => {});
//     localStorage.setItem('id', '123');
//     localStorage.setItem('access_token', 'mockedToken');
//     (fetch as Mock).mockClear();
//     vi.spyOn(console, 'log').mockImplementation(() => {});
//   });

//   afterEach(() => {
//     vi.restoreAllMocks();
//   });

//   const renderWithRouter = (ui: React.ReactNode) => {
//     return render(<MemoryRouter>{ui}</MemoryRouter>);
//   };

//   it('renders without crashing', () => {
//     renderWithRouter(<Home />);
//     expect(screen.getByText(/você possui/i)).toBeInTheDocument();
//   });

//   it('fetches surveys and displays the correct message', async () => {
//     (fetch as Mock).mockResolvedValueOnce({
//       ok: true,
//       json: async () => [
//         { id: 1, title: 'Survey 1' },
//         { id: 2, title: 'Survey 2' },
//       ],
//     });

//     renderWithRouter(<Home />);

//     await waitFor(() => {
//       expect(screen.getByText(/2 pesquisas não respondidas/i)).toBeInTheDocument();
//     });

//     expect(screen.getByTestId('show-surveys')).toBeInTheDocument();
//     expect(screen.getByText('Survey 1')).toBeInTheDocument();
//     expect(screen.getByText('Survey 2')).toBeInTheDocument();
//   });

//   it('handles no surveys correctly', async () => {
//     (fetch as Mock).mockResolvedValueOnce({
//       ok: true,
//       json: async () => [],
//     });

//     renderWithRouter(<Home />);

//     await waitFor(() => {
//       expect(screen.getByText(/0 pesquisa não respondida/i)).toBeInTheDocument();
//     });

//     expect(screen.queryByTestId('show-surveys')).not.toBeInTheDocument();
//   });

//   it('handles errors while fetching surveys', async () => {
//     (fetch as Mock).mockRejectedValueOnce(new Error('Erro ao buscar pesquisas'));

//     renderWithRouter(<Home />);

//     await waitFor(() => {
//       expect(screen.getByText(/você possui 0 pesquisa não respondida/i)).toBeInTheDocument();
//     });

//     expect(console.log).toHaveBeenCalledWith(new Error('Erro ao buscar pesquisas'));
//     expect((global as any).swal).toHaveBeenCalledWith(
//       'Erro',
//       'Não foi possível buscar as pesquisas pendentes',
//       'error'
//     );
//   });
// });
