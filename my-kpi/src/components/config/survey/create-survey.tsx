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

export const CreateSurvey = () => {
  const queryClient = useQueryClient();
  const orgId = Number(localStorage.getItem('userOrgId'));

  async function handleCreation(formData: FormData) {
    const title = formData.get('title');

    if (!title || !orgId) {
      swal('Erro', 'O título é obrigatório', 'error');
      return;
    }

    try {
      const response = await fetch(`${env.VITE_API_URL}/v1/surveys/`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          orgid: orgId,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create survey');
      }

      queryClient.invalidateQueries({
        queryKey: ['surveys'],
      });

      swal('Sucesso', 'Questionário criado com sucesso', 'success');
    } catch (error) {
      swal('Erro', 'Erro ao criar questionário', 'error');
      console.error(error);
    }
  }

  return (
    <Dialog>
      <DialogTrigger className="px-5 py-2 bg-blue-500 rounded-md text-white">Adicionar</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Criar um novo Questionário</DialogTitle>
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
              Questionário
            </Label>
            <Input type="text" id="title" name="title" placeholder="Título do Questionário" />
          </div>
          <DialogClose type="submit" className="px-5 py-2 bg-blue-500 rounded-md text-white">
            Salvar
          </DialogClose>
        </form>
      </DialogContent>
    </Dialog>
  );
};
