import { ArrowLeftFromLine, ArrowRightFromLine, Bolt, FileQuestion, Binoculars, House } from 'lucide-react';
import { Fragment, useState } from 'react';
import { useLocation } from 'react-router-dom';

export default function Sidebar() {
  const [isMenuOpen, setIsMenuOpen] = useState(true);
  const location = useLocation();

  const getIsSelected = (path: string) => location.pathname === path;

  return (
    <Fragment>
      {isMenuOpen ? (
        <div className="flex flex-col p-5 space-y-6 border-r min-w-64">
          <button
            onClick={() => {
              setIsMenuOpen(!isMenuOpen);
            }}
            className="flex justify-end"
          >
            <ArrowLeftFromLine />
          </button>
          <div className="flex flex-col space-y-5">
            <a
              href="/"
              className={`flex space-x-2 p-4 rounded-lg cursor-pointer ${getIsSelected('/') ? 'bg-blue-500 text-white' : 'text-black'}`}
            >
              <House />
              <span>Início</span>
            </a>
            <a
              className={`flex space-x-2 p-4 rounded-lg cursor-pointer ${getIsSelected('/questions') ? 'bg-blue-500 text-white' : 'text-black'}`}
              href="/questions"
            >
              <FileQuestion />
              <span>Perguntas</span>
            </a>
            <a
              className={`flex space-x-2 p-4 rounded-lg cursor-pointer ${getIsSelected('/surveys') ? 'bg-blue-500 text-white' : 'text-black'}`}
              href="/surveys"
            >
              <Binoculars />
              <span>Questionários</span>
            </a>
            <a
              className={`flex space-x-2 p-4 rounded-lg cursor-pointer ${getIsSelected('/config') ? 'bg-blue-500 text-white' : 'text-black'}`}
              href="/config"
            >
              <Bolt />
              <span>Configurações</span>
            </a>
          </div>
        </div>
      ) : (
        <button
          onClick={() => {
            setIsMenuOpen(!isMenuOpen);
          }}
          className="flex p-3 m-2 justify-start bg-blue-500 text-white w-fit rounded-full"
        >
          <ArrowRightFromLine />
        </button>
      )}
    </Fragment>
  );
}
