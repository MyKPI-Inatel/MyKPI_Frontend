import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Layout } from '../components/layout';
import { CreateQuestion } from '../components/config/question/create-question';
import { DataTable } from '../components/data-table';
import { columns as questionColumns } from '../components/config/question/columns';
import { Spinner } from '../components/ui/spinner';
import { Pergunta } from '../components/config/question/columns';
import { env } from '../lib/env';

export default function Questions() {
  const { surveyId } = useParams<{ surveyId: string }>();
  const [questions, setQuestions] = useState<Pergunta[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    if (surveyId) {
      const fetchQuestions = async () => {
        setIsLoading(true);
        try {
          const response = await fetch(`${env.VITE_API_URL}/v1/questions/survey/${surveyId}`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('access_token')}`,
            },
          });

          if (!response.ok) {
            throw new Error('Failed to fetch questions');
          }

          const data = await response.json();
          setQuestions(data);
        } catch (error) {
          console.error(error);
        } finally {
          setIsLoading(false);
        }
      };

      fetchQuestions();
    }
  }, [surveyId]);

  return (
    <Layout className="flex w-full space-x-5 p-5">
      <div className="flex flex-col w-full space-y-5 shadow-md p-5 rounded-md">
        <div className="flex justify-between items-center">
          <span className="font-bold text-2xl">Perguntas</span>
          <CreateQuestion />
        </div>
        {isLoading ? (
          <div className="flex justify-center items-center h-full">
            <Spinner />
          </div>
        ) : (
          <DataTable columns={questionColumns} data={questions} />
        )}
      </div>
    </Layout>
  );
}
