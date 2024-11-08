import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Pergunta } from '../components/config/question/columns';
import { env } from '../lib/env';
import { Layout } from '../components/layout';

export const RespondSurveys = () => {
  const [questions, setQuestions] = useState<Pergunta[]>([]);
  const { surveyId } = useParams<{ surveyId: string }>();
  const navigate = useNavigate();

  useEffect(() => {
    if (surveyId) {
      const fetchQuestions = async () => {
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
        }
      };

      fetchQuestions();
    }
  }, [surveyId]);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const answers = Array.from(formData.entries()).map(([key, value]) => ({
      questionid: parseInt(key),
      score: parseInt(value as string),
    }));

    const employeeId = localStorage.getItem('id');

    fetch(`${env.VITE_API_URL}/v1/questions/respond/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('access_token')}`,
      },
      body: JSON.stringify({
        employeeid: Number(employeeId),
        surveyid: Number(surveyId),
        answers,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to submit answers');
        }

        swal('Respostas enviadas com sucesso', '', 'success');
        navigate('/');
      })
      .catch((error) => {
        console.error(error);
        swal('Erro ao enviar respostas', '', 'error');
      });
  }

  return (
    <Layout className="p-5 space-y-5">
      <h1 className="text-lg font-semibold">Responda as perguntas</h1>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {questions.map((question) => {
          return (
            <div key={question.id} className="border p-4 rounded-md min-w-80">
              <label htmlFor={question.title} className="block font-semibold mb-2">
                {question.title}
              </label>
              <div className="flex justify-between">
                {[1, 2, 3, 4, 5].map((value) => (
                  <div key={value} className="flex flex-col items-center">
                    <label htmlFor={`${question.id}-${value}`}>{value}</label>
                    <input
                      type="radio"
                      id={`${question.id}-${value}`}
                      name={question.id.toString()}
                      value={value}
                      required
                    />
                  </div>
                ))}
              </div>
            </div>
          );
        })}
        <button type="submit" className="bg-blue-500 text-white p-2 rounded-md col-span-full">
          Enviar
        </button>
      </form>
    </Layout>
  );
};
