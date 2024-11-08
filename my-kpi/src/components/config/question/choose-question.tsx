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
import { Label } from '../../ui/label';
import swal from 'sweetalert';
import { useParams } from 'react-router-dom';
import { useContext, useState } from 'react';
import { Pergunta } from './columns';
import { DataContext } from '../../../context/data-context';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';

export const ChooseQuestion = () => {
  const queryClient = useQueryClient();
  const { surveyId } = useParams<{ surveyId: string }>();
  const { questions } = useContext(DataContext);
  const [selectedQuestion, setSelectedQuestion] = useState<Pergunta | null>(null);

  async function handleAssociation() {
    if (!selectedQuestion) {
      swal('Erro', 'Selecione uma pergunta', 'error');
      return;
    }

    try {
      const response = await fetch(
        `${env.VITE_API_URL}/v1/questions/${selectedQuestion.id}/survey/${surveyId}`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access_token')}`,
          },
        },
      );

      if (!response.ok) {
        throw new Error('Failed to associate question with survey');
      }

      queryClient.invalidateQueries({
        queryKey: ['questions', surveyId],
      });

      swal('Sucesso', 'Pergunta criada com sucesso', 'success');
    } catch (error) {
      swal('Erro', 'Erro ao criar pergunta', 'error');
      console.error(error);
    }
  }

  return (
    <Dialog>
      <DialogTrigger className="px-5 py-2 bg-blue-500 rounded-md text-white">Atribuir</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Atribuir a pergunta ao questionário</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleAssociation} className="flex flex-col items-end gap-4 pt-4">
          <div className="flex flex-col w-full gap-4">
            <Label htmlFor="title" className="text-left">
              Pergunta
            </Label>
            <Select
              onValueChange={(value) => {
                const selectedQuestion = questions.find((question) => question.id === Number(value));
                if (selectedQuestion) {
                  setSelectedQuestion(selectedQuestion);
                }
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Questões" />
              </SelectTrigger>
              <SelectContent>
                {questions.length > 0 &&
                  questions.map((question) => (
                    <SelectItem key={question.id} value={question.id.toString()}>
                      {question.title}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>
          <DialogClose type="submit" className="px-5 py-2 bg-blue-500 rounded-md text-white">
            Salvar
          </DialogClose>
        </form>
      </DialogContent>
    </Dialog>
  );
};
