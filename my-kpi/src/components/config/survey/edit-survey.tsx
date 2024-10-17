import { useQueryClient } from '@tanstack/react-query';
import { env } from '../../../lib/env';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../../ui/dialog';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import { useState } from 'react';
import swal from 'sweetalert';

type EditSurveyProps = {
  survey: {
    id: number;
    title: string;
  };
};

export const EditSurvey = ({ survey }: EditSurveyProps) => {
  const queryClient = useQueryClient();
  const [title, setTitle] = useState(survey.title);

  async function handleUpdate(formData: FormData) {
    const updatedTitle = formData.get('title');

    if (!updatedTitle) {
      swal('Erro', 'O título é obrigatório', 'error');
      return;
    }

    try {
      const response = await fetch(`${env.VITE_API_URL}/v1/surveys/${survey.id}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: updatedTitle,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update survey');
      }

      queryClient.invalidateQueries({
        queryKey: ['surveys'],
      });

      swal('Sucesso', 'Questionário atualizado com sucesso', 'success');
    } catch (error) {
      swal('Erro', 'Erro ao atualizar questionário', 'error');
      console.error(error);
    }
  }

  return (
    <Dialog>
      <DialogTrigger className="p-2 bg-slate-400 hover:bg-yellow-400 rounded-md text-white">
        Editar
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar Questionário</DialogTitle>
        </DialogHeader>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleUpdate(new FormData(e.currentTarget));
          }}
          className="flex flex-col items-end gap-4 pt-4"
        >
          <div className="flex flex-col w-full gap-4">
            <Label htmlFor="title" className="text-left">
              Questionário
            </Label>
            <Input
              type="text"
              id="title"
              name="title"
              placeholder="Título do Questionário"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <DialogClose type="submit" className="px-5 py-2 bg-blue-500 rounded-md text-white">
            Salvar
          </DialogClose>
        </form>
      </DialogContent>
    </Dialog>
  );
};
