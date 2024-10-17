import { ColumnDef } from '@tanstack/react-table';
import { Trash } from 'lucide-react';
import { env } from '../../../lib/env';
import { useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';
import swal from 'sweetalert';

export type Organizations = {
  id: number;
  name: string;
};

const useDeleteOrganization = () => {
  const queryClient = useQueryClient();

  return useCallback(
    async (organization: Organizations) => {
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
          const response = await fetch(`${env.VITE_API_URL}/v1/organizations/${organization.id}`, {
            method: 'DELETE',
            headers: {
              Authorization: `Bearer ${localStorage.getItem('access_token')}`,
            },
          });

          if (!response.ok) {
            throw new Error('Failed to delete');
          }

          queryClient.invalidateQueries({
            queryKey: ['organizations'],
          });

          swal('Sucesso', 'Organização apagada com sucesso', 'success');
        } catch (error) {
          swal('Erro', 'Erro ao apagar organização', 'error');
          console.log(error);
        }
      } else {
        swal('Cancelado', 'A organização não foi excluída', 'info');
      }
    },
    [queryClient],
  );
};

export const columns: ColumnDef<Organizations>[] = [
  {
    accessorKey: 'id',
    header: 'Identificador',
  },
  {
    accessorKey: 'name',
    header: 'Nome',
  },
  {
    header: 'Ações',
    cell: ({ row }) => {
      const deleteOrganization = useDeleteOrganization();
      return (
        <button
          className="text-white bg-slate-400 hover:bg-red-400 p-2 rounded-md"
          onClick={() => deleteOrganization(row.original)}
        >
          <Trash size={16} />
        </button>
      );
    },
  },
];
