import { createContext, useCallback, useState } from 'react';
import { Organizations } from '../components/config/org/columns';
import { Departments } from '../components/config/department/columns';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { env } from '../lib/env';

export type DataContextType = {
  organizations: Organizations[];
  departments: Departments[];
  orgId?: number;
  handleOrgChange: (id: number) => void;
  isDepartmentsLoading: boolean;
};

type DataProviderProps = {
  children: React.ReactNode;
};

export const DataContext = createContext({} as DataContextType);

export function DataProvider({ children }: DataProviderProps) {
  const [orgId, setOrgId] = useState<number>(1);
  const queryClient = useQueryClient();

  const fetchOrganizations = useCallback(async () => {
    const response = await fetch(`${env.VITE_API_URL}/v1/organizations/`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('access_token')}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch data');
    }

    return response.json();
  }, []);

  const { data: organizations = [] } = useQuery<Organizations[]>({
    queryKey: ['organizations'],
    queryFn: fetchOrganizations,
  });

  const fetchDepartments = useCallback(async () => {
    const response = await fetch(`${env.VITE_API_URL}/v1/departments/org/${orgId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('access_token')}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch data');
    }

    return response.json();
  }, [orgId]);

  const { data: departments = [], isLoading: isDepartmentsLoading } = useQuery<Departments[]>({
    queryKey: ['departments', orgId],
    queryFn: fetchDepartments,
  });

  const handleOrgChange = (id: number) => {
    setOrgId(id);
    queryClient.refetchQueries({
      queryKey: ['departments', id],
    });
  };

  return (
    <DataContext.Provider
      value={{ organizations, departments, orgId, handleOrgChange, isDepartmentsLoading }}
    >
      {children}
    </DataContext.Provider>
  );
}
