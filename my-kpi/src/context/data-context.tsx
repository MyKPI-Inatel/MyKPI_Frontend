import { createContext, useCallback, useEffect, useState } from 'react';
import { Organizations } from '../components/config/org/columns';
import { Departments } from '../components/config/department/columns';
import { Questionario } from '../components/config/survey/columns';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { env } from '../lib/env';
import { jwtDecode } from 'jwt-decode';

export type DataContextType = {
  organizations: Organizations[];
  departments: Departments[];
  surveys: Questionario[];
  orgId?: number;
  handleOrgChange: (id: number) => void;
  isOrganizationsLoading: boolean;
  isDepartmentsLoading: boolean;
  isSurveysLoading: boolean;
};

type DataProviderProps = {
  children: React.ReactNode;
};

export const DataContext = createContext({} as DataContextType);

export function DataProvider({ children }: DataProviderProps) {
  const [orgId, setOrgId] = useState<number>(1);
  const [userRole, setUserRole] = useState<string | null>(null);
  const queryClient = useQueryClient();

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (token) {
      const decodedToken = jwtDecode<{ usertype: string }>(token);
      setUserRole(decodedToken.usertype);
    }
  }, []);

  const fetchOrganizations = useCallback(async () => {
    const response = await fetch(`${env.VITE_API_URL}/v1/organizations/`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('access_token')}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch organizations');
    }

    return response.json();
  }, []);

  const { data: organizations = [], isLoading: isOrganizationsLoading } = useQuery<Organizations[]>({
    queryKey: ['organizations'],
    queryFn: fetchOrganizations,
    enabled: userRole === 'superadmin',
  });

  const fetchDepartments = useCallback(async () => {
    const response = await fetch(`${env.VITE_API_URL}/v1/departments/org/${orgId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('access_token')}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch departments');
    }

    return response.json();
  }, [orgId]);

  const { data: departments = [], isLoading: isDepartmentsLoading } = useQuery<Departments[]>({
    queryKey: ['departments', orgId],
    queryFn: fetchDepartments,
    enabled: userRole === 'orgadmin' || userRole === 'superadmin',
  });

  const fetchSurveys = useCallback(async () => {
    const response = await fetch(`${env.VITE_API_URL}/v1/surveys/`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('access_token')}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch surveys');
    }

    return response.json();
  }, []);

  const { data: surveys = [], isLoading: isSurveysLoading } = useQuery<Questionario[]>({
    queryKey: ['surveys'],
    queryFn: fetchSurveys,
    enabled: userRole === 'orgadmin' || userRole === 'superadmin',
  });

  const handleOrgChange = (id: number) => {
    setOrgId(id);
    queryClient.refetchQueries({
      queryKey: ['departments', id],
    });
  };

  return (
    <DataContext.Provider
      value={{
        organizations,
        departments,
        surveys,
        orgId,
        handleOrgChange,
        isOrganizationsLoading,
        isDepartmentsLoading,
        isSurveysLoading,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}
