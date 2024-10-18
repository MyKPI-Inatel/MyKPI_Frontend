import { useState } from 'react';
import { Layout } from '../components/layout';
import { CreateQuestion } from '../components/config/question/create-question';
import { Trash, Pencil } from 'lucide-react';
import { useAuthGuard } from '../hooks/auth-guard';

type Pergunta = {
  id: number;
  title: string;
  scoreFactor: number;
};

export default function Questions() {
  useAuthGuard();

  const [selectedPergunta, setSelectedPergunta] = useState<Pergunta | null>(null);

  const mockPerguntas: Pergunta[] = [
    { id: 1, title: 'Qual é a sua cor favorita?', scoreFactor: 1.2 },
    { id: 2, title: 'Você gosta de música?', scoreFactor: 1.5 },
    { id: 3, title: 'Você pratica esportes?', scoreFactor: 1.8 },
    { id: 4, title: 'Você gosta de filmes?', scoreFactor: 1.1 },
    { id: 5, title: 'Qual é o seu animal preferido?', scoreFactor: 1.7 },
  ];

  const handleSelectPergunta = (pergunta: Pergunta) => {
    setSelectedPergunta(pergunta);
  };

  return (
    <Layout className="flex w-full space-x-5 p-5">
      {/* Perguntas */}
      <div
        className={`flex flex-col ${
          selectedPergunta ? 'w-2/3' : 'w-full'
        } space-y-5 shadow-md p-5 rounded-md transition-all duration-300`}
      >
        <div className="flex justify-between items-center">
          <span className="font-bold text-2xl">Perguntas</span>
          <CreateQuestion />
        </div>

        <div className="overflow-y-auto">
          <table className="min-w-full table-auto">
            <thead>
              <tr className="text-left">
                <th className="px-4 py-2">ID</th>
                <th className="px-4 py-2">Pergunta</th>
                <th className="px-4 py-2">Fator de Pontuação</th>
              </tr>
            </thead>
            <tbody>
              {mockPerguntas.map((pergunta) => (
                <tr
                  key={pergunta.id}
                  className="cursor-pointer hover:bg-gray-200"
                  onClick={() => handleSelectPergunta(pergunta)}
                >
                  <td className="px-4 py-2">{pergunta.id}</td>
                  <td className="px-4 py-2">{pergunta.title}</td>
                  <td className="px-4 py-2">{pergunta.scoreFactor}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detalhes */}
      {selectedPergunta && (
        <div className="flex flex-col w-1/3 space-y-5 shadow-md p-5 rounded-md transition-all duration-300">
          <div className="flex justify-between items-center">
            <span className="font-bold text-2xl">Detalhes</span>
            <div className="flex space-x-2">
              <button className="p-2 bg-slate-400 rounded-md hover:bg-red-600">
                <Trash className="text-white" size={16} />
              </button>
              <button className="p-2 bg-slate-400 hover:bg-yellow-400 rounded-md">
                <Pencil className="text-white" size={16} />
              </button>
            </div>
          </div>
          <div className="mt-5">
            <p className="text-lg font-bold">Título</p>
            <p>{selectedPergunta.title}</p>
          </div>
          <div className="mt-5">
            <p className="text-lg font-bold">Fator de Pontuação</p>
            <p>{selectedPergunta.scoreFactor}</p>
          </div>
        </div>
      )}
    </Layout>
  );
}

// import { useContext } from 'react';
// import { Layout } from '../components/layout';
// import { CreateQuestion } from '../components/config/question/create-question';
// import { DataTable } from '../components/data-table';
// import { columns as questionColumns } from '../components/config/question/columns';
// import { DataContext } from '../context/data-context';
// import { Spinner } from '../components/ui/spinner';

// export default function Questions() {
//   const { questions, isQuestionsLoading } = useContext(DataContext);

//   return (
//     <Layout className="flex w-full space-x-5 p-5">
//       {/* Perguntas */}
//       <div className="flex flex-col w-full space-y-5 shadow-md p-5 rounded-md">
//         <div className="flex justify-between items-center">
//           <span className="font-bold text-2xl">Perguntas</span>
//           <CreateQuestion />
//         </div>
//         {isQuestionsLoading ? (
//           <div className="flex justify-center items-center h-full">
//             <Spinner />
//           </div>
//         ) : (
//           <DataTable columns={questionColumns} data={questions} />
//         )}
//       </div>
//     </Layout>
//   );
// }
