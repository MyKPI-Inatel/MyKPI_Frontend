import { createContext, useCallback, useEffect, useState } from 'react';
import { Organizations } from '../components/config/org/columns';
import { Departments } from '../components/config/department/columns';
import { Questionario } from '../components/config/survey/columns';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { env } from '../lib/env';
import { jwtDecode } from 'jwt-decode';
import { Users } from '../components/config/users/columns';
import { Pergunta } from '../components/config/question/columns';

export type DataContextType = {
  users: Users[];
  organizations: Organizations[];
  departments: Departments[];
  questions: Pergunta[];
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
    const token = localStorage.getItem('access_token');

    if (!token) {
      return;
    }

    const { usertype, orgid } = jwtDecode<{ usertype: string; orgid: number }>(token);

    const url =
      usertype === 'superadmin'
        ? `${env.VITE_API_URL}/v1/surveys/`
        : `${env.VITE_API_URL}/v1/surveys/org/${orgid}`;

    const response = await fetch(url, {
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

  const fetchQuestions = useCallback(async () => {
    const response = await fetch(`${env.VITE_API_URL}/v1/questions/`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('access_token')}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch questions');
    }

    return response.json();
  }, []);

  const { data: questions = [] } = useQuery<Pergunta[]>({
    queryKey: ['questions'],
    queryFn: fetchQuestions,
    enabled: userRole === 'superadmin' || userRole === 'orgadmin',
  });

  const fetchUsers = useCallback(async () => {
    const response = await fetch(`${env.VITE_API_URL}/v1/users`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('access_token')}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch users');
    }

    return response.json();
  }, []);

  const { data: users = [] } = useQuery<Users[]>({
    queryKey: ['users'],
    queryFn: fetchUsers,
    enabled: userRole === 'superadmin',
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
        users,
        organizations,
        departments,
        questions,
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
