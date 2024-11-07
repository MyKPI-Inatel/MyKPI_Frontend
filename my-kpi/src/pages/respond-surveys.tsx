import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Pergunta } from "../components/config/question/columns";
import { env } from "../lib/env";
import { Layout } from "../components/layout";

export const RespondSurveys = () => {
  const [questions, setQuestions] = useState<Pergunta[]>([]);
  const { surveyId } = useParams<{ surveyId: string }>();
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
    <Layout className="p-5 space-y-5">
      <h1 className="text-lg font-semibold">Responda as perguntas</h1>
      <form>
        {questions.map((question) => {
          return (
            <div key={question.id} className="flex flex-col space-y-2">
              <label htmlFor={question.title}>{question.title}</label>
              <input type="number" min={1} max={5} id={question.id.toString()} />
            </div>
          );
        })}
      </form>
    </Layout>
  );
}