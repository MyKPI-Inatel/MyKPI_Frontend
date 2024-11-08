import { useParams } from 'react-router-dom';
import { Layout } from '../components/layout';
import { CreateQuestion } from '../components/config/question/create-question';
import { DataTable } from '../components/data-table';
import { columns as questionColumns, Pergunta } from '../components/config/question/columns';
import { Spinner } from '../components/ui/spinner';
import { env } from '../lib/env';
import { useQuery } from '@tanstack/react-query';
import { ChooseQuestion } from '../components/config/question/choose-question';

const fetchQuestions = async (surveyId: string) => {
  const response = await fetch(`${env.VITE_API_URL}/v1/questions/survey/${surveyId}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('access_token')}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch questions');
  }

  return response.json();
};

export default function Questions() {
  const { surveyId } = useParams<{ surveyId: string }>();

  const {
    data: questions,
    isLoading,
    error,
  } = useQuery<Pergunta[], Error>({
    queryKey: ['questions', surveyId],
    queryFn: () => fetchQuestions(surveyId!),
    enabled: !!surveyId,
  });

  if (isLoading) {
    return (
      <Layout className="flex w-full space-x-5 p-5">
        <div className="flex flex-col w-full space-y-5 shadow-md p-5 rounded-md">
          <div className="flex justify-center items-center h-full">
            <Spinner />
          </div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout className="flex w-full space-x-5 p-5">
        <div className="flex flex-col w-full space-y-5 shadow-md p-5 rounded-md">
          <div className="flex justify-center items-center h-full">
            <span className="text-red-500">Error: {error.message}</span>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout className="flex w-full space-x-5 p-5">
      <div className="flex flex-col w-full space-y-5 shadow-md p-5 rounded-md">
        <div className="flex justify-between items-center">
          <span className="font-bold text-2xl">Perguntas</span>
          <ChooseQuestion />
          <CreateQuestion />
        </div>
        <DataTable columns={questionColumns} data={questions!} />
      </div>
    </Layout>
  );
}
