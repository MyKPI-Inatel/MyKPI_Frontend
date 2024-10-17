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

type EditQuestionProps = {
  question: {
    id: number;
    title: string;
    scoreFactor: number;
  };
};

export const EditQuestion = ({ question }: EditQuestionProps) => {
  const queryClient = useQueryClient();
  const [title, setTitle] = useState(question.title);
  const [scoreFactor, setScoreFactor] = useState(question.scoreFactor.toString());

  async function handleUpdate(formData: FormData) {
    const updatedTitle = formData.get('title');
    const updatedScoreFactor = formData.get('scoreFactor');

    if (!updatedTitle || !updatedScoreFactor) {
      swal('Erro', 'Todos os campos são obrigatórios', 'error');
      return;
    }

    try {
      const response = await fetch(`${env.VITE_API_URL}/v1/questions/${question.id}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: updatedTitle,
          scoreFactor: parseFloat(updatedScoreFactor as string),
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update question');
      }

      queryClient.invalidateQueries({
        queryKey: ['questions'],
      });

      swal('Sucesso', 'Pergunta atualizada com sucesso', 'success');
    } catch (error) {
      swal('Erro', 'Erro ao atualizar pergunta', 'error');
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
          <DialogTitle>Editar Pergunta</DialogTitle>
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
              Pergunta
            </Label>
            <Input
              type="text"
              id="title"
              name="title"
              placeholder="Título da Pergunta"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <Label htmlFor="scoreFactor" className="text-left">
              Fator de Pontuação
            </Label>
            <Input
              type="number"
              step="0.1"
              id="scoreFactor"
              name="scoreFactor"
              placeholder="Fator de Pontuação"
              value={scoreFactor}
              onChange={(e) => setScoreFactor(e.target.value)}
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
