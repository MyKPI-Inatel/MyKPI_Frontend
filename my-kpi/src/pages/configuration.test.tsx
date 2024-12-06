// import { render, screen } from '@testing-library/react';
// import { MemoryRouter } from 'react-router-dom';
// import { vi, Mock } from 'vitest';
// import Configuration from './configuration';
// import { DataContext } from '../context/data-context';
// import { useAuthGuard } from '../hooks/auth-guard';
// import { jwtDecode } from 'jwt-decode';
// import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// const mockNavigate = vi.fn();
// vi.mock('react-router-dom', async () => {
//   const actual = await import('react-router-dom');
//   return {
//     ...actual,
//     useNavigate: () => mockNavigate, // Mocka o hook useNavigate
//   };
// });
// vi.mock('../hooks/auth-guard');
// vi.mock('jwt-decode', async () => {
//   const actual = await import('jwt-decode');
//   return {
//     ...actual,
//     jwtDecode: vi.fn(() => ({ usertype: 'superadmin' })), // Mock para jwtDecode
//   };
// });

// let mockLocalStorage: { [key: string]: string } = {};

// Object.defineProperty(window, 'localStorage', {
//   value: {
//     getItem: vi.fn((key) => mockLocalStorage[key]),
//     setItem: vi.fn((key, value) => {
//       mockLocalStorage[key] = value;
//     }),
//     clear: vi.fn(() => {
//       mockLocalStorage = {};
//     }),
//   },
//   writable: true,
// });


// const mockDataContext = {
//   users: [],
//   organizations: [],
//   departments: [],
//   orgId: 1,
//   handleOrgChange: vi.fn(),
//   isOrganizationsLoading: false,
//   isDepartmentsLoading: false,
//   questions: [],
//   surveys: [],
//   isSurveysLoading: false,
// };

// const queryClient = new QueryClient();

// describe('Configuration', () => {
//   beforeEach(() => {
//     (useAuthGuard as Mock).mockImplementation(() => {});
//     mockNavigate.mockClear();
//     localStorage.clear();
//   });

//   it('renders without crashing', () => {
//     render(
//       <QueryClientProvider client={queryClient}>
//         <DataContext.Provider value={mockDataContext}>
//           <MemoryRouter>
//             <Configuration />
//           </MemoryRouter>
//         </DataContext.Provider>
//       </QueryClientProvider>
//     );
//     expect(screen.getByText('Funcionário')).toBeInTheDocument();
//   });

//   it('redirects employee to home page', () => {
//     localStorage.setItem('access_token', 'mockedToken');
//     (jwtDecode as Mock).mockImplementation(() => ({ usertype: 'employee' }));

//     render(
//       <QueryClientProvider client={queryClient}>
//         <DataContext.Provider value={mockDataContext}>
//           <MemoryRouter>
//             <Configuration />
//           </MemoryRouter>
//         </DataContext.Provider>
//       </QueryClientProvider>
//     );

//     expect(mockNavigate).toHaveBeenCalledWith('/');
//   });

//   it('shows organization section for superadmin', () => {
//     render(
//       <QueryClientProvider client={queryClient}>
//         <DataContext.Provider value={mockDataContext}>
//           <MemoryRouter>
//             <Configuration />
//           </MemoryRouter>
//         </DataContext.Provider>
//       </QueryClientProvider>
//     );
//     expect(screen.getByText('Organização')).toBeInTheDocument();
//   });

//   it('does not show organization section for non-superadmin', async () => {
//     localStorage.setItem('access_token', 'mockedToken');
//     (jwtDecode as Mock).mockImplementation(() => ({ usertype: 'admin' }));
  
//     render(
//       <QueryClientProvider client={queryClient}>
//         <DataContext.Provider value={mockDataContext}>
//           <MemoryRouter>
//             <Configuration />
//           </MemoryRouter>
//         </DataContext.Provider>
//       </QueryClientProvider>
//     );
  
//     await screen.findByText('Funcionário');
  
//     expect(screen.queryByTestId('organization-section')).not.toBeInTheDocument();
//   });
// });