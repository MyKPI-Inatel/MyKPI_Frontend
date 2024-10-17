import { ColumnDef } from '@tanstack/react-table';
import { Trash } from 'lucide-react';
import { env } from '../../../lib/env';
import { useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';
import swal from 'sweetalert';
import { EditQuestion } from './edit-question';

export type Pergunta = {
  id: number;
  title: string;
  scoreFactor: number;
};

const useDeleteQuestion = () => {
  const queryClient = useQueryClient();

  return useCallback(
    async (question: Pergunta) => {
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
          const response = await fetch(`${env.VITE_API_URL}/v1/questions/${question.id}`, {
            method: 'DELETE',
            headers: {
              Authorization: `Bearer ${localStorage.getItem('access_token')}`,
            },
          });

          if (!response.ok) {
            throw new Error('Failed to delete');
          }

          queryClient.invalidateQueries({
            queryKey: ['questions'],
          });

          swal('Sucesso', 'Pergunta apagada com sucesso', 'success');
        } catch (error) {
          swal('Erro', 'Erro ao apagar pergunta', 'error');
          console.error(error);
        }
      } else {
        swal('Cancelado', 'A pergunta não foi excluída', 'info');
      }
    },
    [queryClient],
  );
};

export const columns: ColumnDef<Pergunta>[] = [
  {
    accessorKey: 'id',
    header: 'Identificador',
  },
  {
    accessorKey: 'title',
    header: 'Pergunta',
  },
  {
    accessorKey: 'scoreFactor',
    header: 'Fator de Pontuação',
  },
  {
    header: 'Ações',
    cell: ({ row }) => {
      const deleteQuestion = useDeleteQuestion();
      return (
        <div className="flex space-x-2">
          <button
            className="text-white bg-slate-400 hover:bg-red-400 p-2 rounded-md"
            onClick={() => deleteQuestion(row.original)}
          >
            <Trash size={16} />
          </button>
          <EditQuestion question={row.original} />
        </div>
      );
    },
  },
];
