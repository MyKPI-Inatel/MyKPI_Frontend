import { useQuery } from '@tanstack/react-query';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from '../../ui/dialog';
import { env } from '../../../lib/env';
import { useNavigate } from 'react-router-dom';

interface RespondedSurveyProps {
  id: number
}

export const RespondedSurveys = ({ id }: RespondedSurveyProps) => {
  const navigate = useNavigate();
  const fetchSurveys = async () => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      throw new Error('Token not found');
    }

    const response = await fetch(`${env.VITE_API_URL}/v1/reports/${id}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch surveys');
    }

    return response.json();
  };

  const { data, isLoading, isError } = useQuery({ queryKey: ['responded-surveys'], queryFn: fetchSurveys });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Erro ao carregar</div>;
  }

  return (
    <Dialog>
      <DialogTrigger className="px-5 py-2 bg-green-500 rounded-md text-white">Relatório</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Pesquisas respondidas</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4 pt-4">
          {data.map((survey: any) => (
            <div
              key={survey.question_id}
              className="border p-4 rounded shadow-sm"
            >
              <h3 className="font-semibold mb-2">{survey.question_title}</h3>
              <p>
                <strong>Pontuação Média</strong> {parseFloat(survey.average_score).toFixed(2)}
              </p>
              <p>
              <strong>Fator de Multiplicação da Pontuação</strong> {parseFloat(survey.scorefactor_multiplied).toFixed(2)}
              </p>
            </div>
          ))}
          <button
            className="text-white bg-slate-400 hover:bg-blue-400 p-2 rounded-md"
            onClick={() => navigate(`/reports/${id}`)}
          >
            Ver gráfico de barras
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
