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
import swal from 'sweetalert';
import { useParams } from 'react-router-dom';

export const CreateQuestion = () => {
  const queryClient = useQueryClient();
  const { surveyId } = useParams<{ surveyId: string }>();
  console.log(surveyId);

  async function handleCreation(formData: FormData) {
    const title = formData.get('title');
    const scorefactor = formData.get('scorefactor');

    if (!title || !scorefactor) {
      swal('Erro', 'Todos os campos são obrigatórios', 'error');
      return;
    }

    try {
      const response = await fetch(`${env.VITE_API_URL}/v1/questions/`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          scorefactor: parseFloat(scorefactor as string),
          surveyid: surveyId ? parseInt(surveyId, 10) : 0,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create question');
      }

      queryClient.invalidateQueries({
        queryKey: ['questions'],
      });

      swal('Sucesso', 'Pergunta criada com sucesso', 'success');
    } catch (error) {
      swal('Erro', 'Erro ao criar pergunta', 'error');
      console.error(error);
    }
  }

  return (
    <Dialog>
      <DialogTrigger className="px-5 py-2 bg-blue-500 rounded-md text-white">Adicionar</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Criar uma nova pergunta</DialogTitle>
        </DialogHeader>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleCreation(new FormData(e.currentTarget));
          }}
          className="flex flex-col items-end gap-4 pt-4"
        >
          <div className="flex flex-col w-full gap-4">
            <Label htmlFor="title" className="text-left">
              Pergunta
            </Label>
            <Input type="text" id="title" name="title" placeholder="Título da Pergunta" />
            <Label htmlFor="scorefactor" className="text-left">
              Fator de Pontuação
            </Label>
            <Input
              type="number"
              step="0.1"
              id="scorefactor"
              name="scorefactor"
              placeholder="Fator de Pontuação"
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
