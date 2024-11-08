import { useEffect, useState } from 'react';
import { Layout } from '../components/layout';
import { env } from '../lib/env';
import { ShowSurveys } from '../components/surveys/show-surveys';

export default function Home() {
  const [surveys, setSurveys] = useState([]);

  async function fetchSurveys() {
    const id = localStorage.getItem('id');
    try {
      const response = await fetch(env.VITE_API_URL + `/v1/surveys/unresponded/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
      });

      if (!response.ok) {
        throw new Error('Erro ao buscar pesquisas');
      }

      const data = await response.json();

      setSurveys(data);
    } catch (error) {
      console.log(error);
      swal('Erro', 'Não foi possível buscar as pesquisas pendentes', 'error');
    }
  }

  useEffect(() => {
    fetchSurveys();
  }, []);

  return (
    <Layout className="w-full p-5">
      <div className="p-5 w-full flex flex-col items-center bg-yellow-100 space-y-2 rounded-md">
        <h1 className="text-lg font-semibold">
          Você possui{' '}
          {surveys.length > 1
            ? `${surveys.length} pesquisas não respondidas`
            : `${surveys.length} pesquisa não respondida`}
        </h1>
        {surveys.length ? <ShowSurveys surveys={surveys} /> : null}
      </div>
    </Layout>
  );
}
