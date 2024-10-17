import { createContext, useCallback, useState } from 'react';
import { Organizations } from '../components/config/org/columns';
import { Departments } from '../components/config/department/columns';
import { Pergunta } from '../components/config/question/columns';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { env } from '../lib/env';

export type DataContextType = {
  organizations: Organizations[];
  departments: Departments[];
  questions: Pergunta[];
  orgId?: number;
  handleOrgChange: (id: number) => void;
  isOrganizationsLoading: boolean;
  isDepartmentsLoading: boolean;
  isQuestionsLoading: boolean;
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
      throw new Error('Failed to fetch organizations');
    }

    return response.json();
  }, []);

  const { data: organizations = [], isLoading: isOrganizationsLoading } = useQuery<Organizations[]>({
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
      throw new Error('Failed to fetch departments');
    }

    return response.json();
  }, [orgId]);

  const { data: departments = [], isLoading: isDepartmentsLoading } = useQuery<Departments[]>({
    queryKey: ['departments', orgId],
    queryFn: fetchDepartments,
  });

  const fetchQuestions = useCallback(async () => {
    const response = await fetch(`${env.VITE_API_URL}/v1/questions`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('access_token')}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch questions');
    }

    return response.json();
  }, []);

  const { data: questions = [], isLoading: isQuestionsLoading } = useQuery<Pergunta[]>({
    queryKey: ['questions'],
    queryFn: fetchQuestions,
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
        questions,
        orgId,
        handleOrgChange,
        isOrganizationsLoading,
        isDepartmentsLoading,
        isQuestionsLoading,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}
