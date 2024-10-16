import { ColumnDef } from '@tanstack/react-table';
import { Trash } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';
import swal from 'sweetalert';
import { env } from '../../../lib/env';
import { Organizations } from '../org/columns';

export type Departments = {
  id: number;
  name: string;
  orgid: number;
  organization?: Organizations;
};

const useDeleteDepartment = () => {
  const queryClient = useQueryClient();

  return useCallback(
    async (department: Departments) => {
      const result = await swal({
        title: 'Tem certeza que deseja excluir?',
        text: 'Essa ação é irreversível!',
        icon: 'warning',
        buttons: {
          cancel: {
            text: 'Não, cancelar',
            visible: true,
            value: false,
          },
          confirm: {
            text: 'Sim, excluir',
            visible: true,
            value: true,
          },
        },
        dangerMode: true,
      });

      if (result) {
        try {
          const response = await fetch(
            `${env.VITE_API_URL}/v1/departments/org/${department.orgid}/${department.id}`,
            {
              method: 'DELETE',
              headers: {
                Authorization: `Bearer ${localStorage.getItem('access_token')}`,
              },
            },
          );

          if (!response.ok) {
            throw new Error('Failed to delete');
          }

          queryClient.invalidateQueries({
            queryKey: ['departments', department.orgid],
          });

          swal('Sucesso', 'Departamento apagado com sucesso', 'success');
        } catch (error) {
          swal('Erro', 'Erro ao apagar departamento', 'error');
          console.log(error);
        }
      } else {
        swal('Cancelado', 'O departamento não foi excluído', 'info');
      }
    },
    [queryClient],
  );
};

export const columns: ColumnDef<Departments>[] = [
  {
    accessorKey: 'id',
    header: 'Identificador',
  },
  {
    accessorKey: 'name',
    header: 'Nome',
  },
  {
    accessorKey: 'orgid',
    header: 'Organização',
  },
  {
    header: 'Ações',
    cell: ({ row }) => {
      const deleteDepartment = useDeleteDepartment();
      return (
        <button
          className="text-white bg-slate-400 hover:bg-red-400 p-2 rounded-md"
          onClick={() => deleteDepartment(row.original)}
        >
          <Trash size={16} />
        </button>
      );
    },
  },
];
