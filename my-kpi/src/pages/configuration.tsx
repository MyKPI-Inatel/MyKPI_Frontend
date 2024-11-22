import { useContext, useEffect, useState } from 'react';
import { columns as orgColumns } from '../components/config/org/columns';
import { columns as dptColumns } from '../components/config/department/columns';
import { columns as userColumns } from '../components/config/users/columns';
import { DataTable } from '../components/data-table';
import { Layout } from '../components/layout';
import { CreateOrganization } from '../components/config/org/create-org';
import { CreateDepartment } from '../components/config/department/create-dpt';
import { DataContext } from '../context/data-context';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Spinner } from '../components/ui/spinner';
import { useAuthGuard } from '../hooks/auth-guard';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { CreateUser } from '../components/config/users/create-user';

export default function Configuration() {
  useAuthGuard();
  const navigate = useNavigate();
  const {
    users,
    organizations,
    departments,
    orgId,
    handleOrgChange,
    isOrganizationsLoading,
    isDepartmentsLoading,
  } = useContext(DataContext);

  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (token) {
      try {
        const decodedToken = jwtDecode<{ usertype: string }>(token);
        setUserRole(decodedToken.usertype);
      } catch (error) {
        console.error('Failed to decode token:', error);
        setUserRole(null);
      }
    }
  }, []);

  useEffect(() => {
    if (userRole === 'employee') {
      navigate('/');
    }
  }, [userRole, navigate]);

  return (
    <Layout className="flex flex-col w-full space-y-5 p-5">
      <div className="flex w-full space-x-5">
        {/* Funcionário Section */}
        <div className="flex flex-col w-1/2 space-y-5 shadow-md p-5 rounded-md">
          <div className="flex justify-between items-center">
            <div className="flex space-x-5">
              <span className="font-bold text-2xl">Funcionário</span>
            </div>
            <CreateUser />
          </div>
          {isDepartmentsLoading ? (
            <div className="flex justify-center items-center h-full">
              <Spinner />
            </div>
          ) : (
            <DataTable columns={userColumns} data={users} />
          )}
        </div>

        {/* Departments Section */}
        <div className="flex flex-col w-1/2 space-y-5 shadow-md p-5 rounded-md">
          <div className="flex justify-between items-center">
            <div className="flex space-x-5">
              <span className="font-bold text-2xl">Departamentos</span>
              {organizations.length > 0 && <Select
                defaultValue={orgId?.toString()}
                onValueChange={(value) => handleOrgChange(Number(value))}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Organização" />
                </SelectTrigger>
                <SelectContent>
                  {organizations.length > 0 &&
                    organizations.map((org) => (
                      <SelectItem key={org.id} value={org.id.toString()}>
                        {org.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>}
            </div>
            <CreateDepartment />
          </div>
          {isDepartmentsLoading ? (
            <div className="flex justify-center items-center h-full">
              <Spinner />
            </div>
          ) : (
            <DataTable columns={dptColumns} data={departments} />
          )}
        </div>
      </div>

      {/* "Organização" only for superadmin */}
      {userRole === 'superadmin' && (
        <div className="flex flex-col w-full space-y-5 shadow-md p-5 rounded-md" data-testid="organization-section">
          <div className="flex justify-between items-center">
            <span className="font-bold text-2xl">Organização</span>
            <CreateOrganization />
          </div>
          {isOrganizationsLoading ? (
            <div className="flex justify-center items-center h-full">
              <Spinner />
            </div>
          ) : (
            <DataTable columns={orgColumns} data={organizations} />
          )}
        </div>
      )}
    </Layout>
  );
}
