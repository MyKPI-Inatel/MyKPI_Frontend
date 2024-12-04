import { useEffect, useState } from 'react';
import { Layout } from '../components/layout';
import { env } from '../lib/env';
import { useAuthGuard } from '../hooks/auth-guard';
import { Spinner } from '../components/ui/spinner';

export default function Home() {
  useAuthGuard();
  const [surveys, setSurveys] = useState([]);
  const [userData, setUserData] = useState({
    name: '',
    organization: '',
    department: '',
    id: '',
  });
  const [isLoading, setIsLoading] = useState(true);

  async function fetchUserData() {
    try {
      const response = await fetch(env.VITE_API_URL + `/v1/me/`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
      });

      if (!response.ok) {
        throw new Error('Erro ao buscar dados do usuário');
      }

      const data = await response.json();

      const organization = await fetch(env.VITE_API_URL + `/v1/organizations/${data.orgid}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
      });

      if (!organization.ok) {
        throw new Error('Erro ao buscar dados da organização');
      }

      const organizationData = await organization.json();

      data.organization = organizationData.name;

      const department = await fetch(env.VITE_API_URL + `/v1/departments/org/${data.orgid}/${data.deptid}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
      });

      if (!department.ok) {
        throw new Error('Erro ao buscar dados da empresa');
      }

      const companyData = await department.json();

      data.department = companyData.name;

      setUserData({
        name: data.name || '',
        organization: data.organization || '',
        department: data.department || '',
        id: data.id || '',
      });

      fetchSurveys(data.id);
    } catch (error) {
      console.error(error);
      swal('Erro', 'Não foi possível buscar os dados do usuário', 'error');
    }
  }

  async function fetchSurveys(userId) {
    try {
      const response = await fetch(env.VITE_API_URL + `/v1/surveys/unresponded/${userId}`, {
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
      console.error(error);
      swal('Erro', 'Não foi possível buscar as pesquisas pendentes', 'error');
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchUserData();
  }, []);

  return isLoading ? (
    <Layout className="flex w-full space-x-5 p-5">
      <div className="flex flex-col w-full space-y-5 shadow-md p-5 rounded-md">
        <div className="flex justify-center items-center h-full">
          <Spinner />
        </div>
      </div>
    </Layout>
  ) : (
    <Layout className="w-full p-5">
      <div className="p-5 w-full flex flex-col items-center bg-white space-y-2 rounded-md">
        <div className="w-full flex flex-col justify-between items-start bg-transparent p-5 space-y-2">
          <h2 className="text-xl font-bold">Bem-vindo, {userData.name}</h2>
          <p>
            {userData.organization}, departamento {userData.department}
          </p>
        </div>
        <div className="w-full flex flex-col items-center  rounded-md space-y-4">
          <h2 className="text-lg font-semibold">Pesquisas Não Respondidas</h2>
          {surveys.length > 0 ? (
            <table className="table-auto w-full border-collapse border bg-gray-50 p-5 rounded-md border-gray-400">
              <tbody>
                {surveys.map((survey) => (
                  <tr key={survey.id}>
                    <td className="border border-gray-300 p-2">{survey.title}</td>
                    <td className="border border-gray-300 p-2 text-center">
                      <button
                        className="bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600"
                        onClick={() => (window.location.href = `/surveys/${survey.id}`)}
                      >
                        Responder
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>Você não possui pesquisas pendentes no momento.</p>
          )}
        </div>
      </div>
    </Layout>
  );
}
