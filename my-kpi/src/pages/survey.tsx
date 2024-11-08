import { useContext, useEffect, useState } from 'react';
import { Layout } from '../components/layout';
import { CreateSurvey } from '../components/config/survey/create-survey';
import { DataTable } from '../components/data-table';
import { columns as surveyColumns } from '../components/config/survey/columns';
import { DataContext } from '../context/data-context';
import { Spinner } from '../components/ui/spinner';
import { Trash } from 'lucide-react';
import { EditSurvey } from '../components/config/survey/edit-survey';
import { Questionario } from '../components/config/survey/columns';
import { useAuthGuard } from '../hooks/auth-guard';
import { useNavigate } from 'react-router-dom';

export default function Surveys() {
  useAuthGuard();

  const { surveys, isSurveysLoading } = useContext(DataContext);
  const [selectedSurvey] = useState<Questionario | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const role = localStorage.getItem('usertype');

    if (role === 'employee') {
      return navigate('/');
    }
  }, []);

  return (
    <Layout className="flex w-full space-x-5 p-5">
      {/* Questionarios */}
      <div
        className={`flex flex-col ${
          selectedSurvey ? 'w-2/3' : 'w-full'
        } space-y-5 shadow-md p-5 rounded-md transition-all duration-300`}
      >
        <div className="flex justify-between items-center">
          <span className="font-bold text-2xl">Questionarios</span>
          <CreateSurvey />
        </div>

        {isSurveysLoading ? (
          <div className="flex justify-center items-center h-full">
            <Spinner />
          </div>
        ) : (
          <DataTable columns={surveyColumns} data={surveys} />
        )}
      </div>

      {/* Detalhes */}
      {selectedSurvey && (
        <div className="flex flex-col w-1/3 space-y-5 shadow-md p-5 rounded-md transition-all duration-300">
          <div className="flex justify-between items-center">
            <span className="font-bold text-2xl">Detalhes</span>
            <div className="flex space-x-2">
              <button className="p-2 bg-slate-400 rounded-md hover:bg-red-600">
                <Trash className="text-white" size={16} />
              </button>
              <EditSurvey survey={selectedSurvey} />
            </div>
          </div>
          <div className="mt-5">
            <p className="text-lg font-bold">Título</p>
            <p>{selectedSurvey.title}</p>
          </div>
        </div>
      )}
    </Layout>
  );
}
