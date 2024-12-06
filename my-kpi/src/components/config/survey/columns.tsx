import { ColumnDef } from '@tanstack/react-table';
import { Trash } from 'lucide-react';
import { env } from '../../../lib/env';
import { useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';
import swal from 'sweetalert';
import { EditSurvey } from './edit-survey';
import { RespondedSurveys } from './generate-report';

export type Questionario = {
  id: number;
  title: string;
};

const useDeleteSurvey = () => {
  const queryClient = useQueryClient();

  return useCallback(
    async (survey: Questionario) => {
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
          const response = await fetch(`${env.VITE_API_URL}/v1/surveys/${survey.id}`, {
            method: 'DELETE',
            headers: {
              Authorization: `Bearer ${localStorage.getItem('access_token')}`,
            },
          });

          if (!response.ok) {
            throw new Error('Failed to delete');
          }

          queryClient.invalidateQueries({
            queryKey: ['surveys'],
          });

          swal('Sucesso', 'Questionário apagado com sucesso', 'success');
        } catch (error) {
          swal('Erro', 'Erro ao apagar questionário', 'error');
          console.error(error);
        }
      } else {
        swal('Cancelado', 'O questionário não foi excluído', 'info');
      }
    },
    [queryClient],
  );
};

export const columns: ColumnDef<Questionario>[] = [
  {
    accessorKey: 'id',
    header: 'Identificador',
    cell: ({ row }) => <span>{row.original.id}</span>,
  },
  {
    accessorKey: 'title',
    header: 'Questionário',
    cell: ({ row }) => <span>{row.original.title}</span>,
  },
  {
    header: 'Ações',
    cell: ({ row }) => {
      const deleteSurvey = useDeleteSurvey();
      return (
        <div className="flex space-x-2">
          <button
            className="text-white bg-slate-400 hover:bg-red-400 p-2 rounded-md"
            onClick={() => deleteSurvey(row.original)}
          >
            <Trash size={16} />
          </button>
          <EditSurvey survey={row.original} />
          <RespondedSurveys id={row.original.id} />
        </div>
      );
    },
  },
];
