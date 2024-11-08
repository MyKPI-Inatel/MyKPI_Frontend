import { ColumnDef } from '@tanstack/react-table';
import { Trash } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';
import swal from 'sweetalert';
import { env } from '../../../lib/env';

export type Users = {
  id: number;
  name: string;
  email: string;
  deptid: number;
};

const useDeleteUser = () => {
  const queryClient = useQueryClient();

  return useCallback(
    async (user: Users) => {
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
          const response = await fetch(`${env.VITE_API_URL}/v1/users/${user.id}`, {
            method: 'DELETE',
            headers: {
              Authorization: `Bearer ${localStorage.getItem('access_token')}`,
            },
          });

          if (!response.ok) {
            throw new Error('Failed to delete');
          }

          queryClient.invalidateQueries({
            queryKey: ['users'],
          });

          swal('Sucesso', 'Usuário apagado com sucesso', 'success');
        } catch (error) {
          swal('Erro', 'Erro ao apagar usuário', 'error');
          console.log(error);
        }
      } else {
        swal('Cancelado', 'O usuário não foi excluído', 'info');
      }
    },
    [queryClient],
  );
};

export const columns: ColumnDef<Users>[] = [
  {
    accessorKey: 'id',
    header: 'Identificador',
  },
  {
    accessorKey: 'name',
    header: 'Nome',
  },
  {
    accessorKey: 'email',
    header: 'Email',
  },
  {
    accessorKey: 'deptid',
    header: 'Usuário',
  },
  {
    header: 'Ações',
    cell: ({ row }) => {
      const deleteUser = useDeleteUser();
      return (
        <button
          className="text-white bg-slate-400 hover:bg-red-400 p-2 rounded-md"
          onClick={() => deleteUser(row.original)}
        >
          <Trash size={16} />
        </button>
      );
    },
  },
];
