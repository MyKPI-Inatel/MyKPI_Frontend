import { useContext } from 'react';
import { columns as orgColumns } from '../components/config/org/columns';
import { columns as dptColumns } from '../components/config/department/columns';
import { DataTable } from '../components/data-table';
import { Layout } from '../components/layout';
import { CreateOrganization } from '../components/config/org/create-org';
import { CreateDepartment } from '../components/config/department/create-dpt';
import { DataContext } from '../context/data-context';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Spinner } from '../components/ui/spinner';

export default function Configuration() {
  const { organizations, departments, orgId, handleOrgChange, isOrganizationsLoading, isDepartmentsLoading } =
    useContext(DataContext);

  return (
    <Layout className="flex w-full space-x-5 p-5">
      {/* Organizations */}
      <div className="flex flex-col w-1/2 space-y-5 shadow-md p-5 rounded-md">
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

      {/* Departments */}
      <div className="flex flex-col w-1/2 space-y-5 shadow-md p-5 rounded-md">
        <div className="flex justify-between items-center">
          <div className="flex space-x-5">
            <span className="font-bold text-2xl">Departamentos</span>
            <Select
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
            </Select>
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
    </Layout>
  );
}
