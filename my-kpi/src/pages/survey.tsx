import { useState } from 'react';
import { Layout } from '../components/layout';
import { CreateSurvey } from '../components/config/survey/create-survey';
import { Trash, Pencil } from 'lucide-react';

type Questionario = {
  id: number;
  title: string;
};

export default function Surveys() {
  const [selectedQuestionario, setSelectedQuestionario] = useState<Questionario | null>(null);

  const mockQuestionarios: Questionario[] = [
    { id: 1, title: 'Satisfação com o Atendimento ao Cliente' },
    { id: 2, title: 'Pesquisa de Clima Organizacional' },
    { id: 3, title: 'Avaliação de Produtos e Serviços' },
    { id: 4, title: 'Preferências de Compras Online' },
    { id: 5, title: 'Satisfação com o Ambiente de Trabalho' },
    { id: 6, title: 'Feedback sobre o Processo de Entrega' },
    { id: 7, title: 'Pesquisa de Opinião sobre o Novo Website' },
    { id: 8, title: 'Qualidade do Atendimento em Eventos' },
    { id: 9, title: 'Nível de Satisfação com os Benefícios Corporativos' },
    { id: 10, title: 'Avaliação da Experiência em Compras na Loja' },
  ];

  const handleSelectQuestionario = (questionario: Questionario) => {
    setSelectedQuestionario(questionario);
  };

  return (
    <Layout className="flex w-full space-x-5 p-5">
      {/* Questionarios */}
      <div
        className={`flex flex-col ${
          selectedQuestionario ? 'w-2/3' : 'w-full'
        } space-y-5 shadow-md p-5 rounded-md transition-all duration-300`}
      >
        <div className="flex justify-between items-center">
          <span className="font-bold text-2xl">Questionarios</span>
          <CreateSurvey />
        </div>

        <div className="overflow-y-auto">
          <table className="min-w-full table-auto">
            <thead>
              <tr className="text-left">
                <th className="px-4 py-2">ID</th>
                <th className="px-4 py-2">Questionario</th>
              </tr>
            </thead>
            <tbody>
              {mockQuestionarios.map((questionario) => (
                <tr
                  key={questionario.id}
                  className="cursor-pointer hover:bg-gray-200"
                  onClick={() => handleSelectQuestionario(questionario)}
                >
                  <td className="px-4 py-2">{questionario.id}</td>
                  <td className="px-4 py-2">{questionario.title}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detalhes */}
      {selectedQuestionario && (
        <div className="flex flex-col w-1/3 space-y-5 shadow-md p-5 rounded-md transition-all duration-300">
          <div className="flex justify-between items-center">
            <span className="font-bold text-2xl">Detalhes</span>
            <div className="flex space-x-2">
              <button className="p-2 bg-slate-400 hover:bg-red-400 rounded-md hover:bg-red-600">
                <Trash className="text-white" size={16} />
              </button>
              <button className="p-2 bg-slate-400 hover:bg-yellow-400 rounded-md">
                <Pencil className="text-white" size={16} />
              </button>
            </div>
          </div>
          <div className="mt-5">
            <p className="text-lg font-bold">Título</p>
            <p>{selectedQuestionario.title}</p>
          </div>
        </div>
      )}
    </Layout>
  );
}
// import { useContext } from 'react';
// import { Layout } from '../components/layout';
// import { CreateSurvey } from '../components/config/survey/create-survey';
// import { DataTable } from '../components/data-table';
// import { columns as surveyColumns } from '../components/config/survey/columns';
// import { DataContext } from '../context/data-context';
// import { Spinner } from '../components/ui/spinner';

// export default function Surveys() {
//   const { surveys, isSurveysLoading } = useContext(DataContext);

//   return (
//     <Layout className="flex w-full space-x-5 p-5">
//       {/* Questionarios */}
//       <div className="flex flex-col w-full space-y-5 shadow-md p-5 rounded-md">
//         <div className="flex justify-between items-center">
//           <span className="font-bold text-2xl">Questionarios</span>
//           <CreateSurvey />
//         </div>
//         {isSurveysLoading ? (
//           <div className="flex justify-center items-center h-full">
//             <Spinner />
//           </div>
//         ) : (
//           <DataTable columns={surveyColumns} data={surveys} />
//         )}
//       </div>
//     </Layout>
//   );
// }
