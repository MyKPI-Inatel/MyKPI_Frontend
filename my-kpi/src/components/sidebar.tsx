import {
  ArrowLeftFromLine,
  ArrowRightFromLine,
  Database,
  Goal,
  House,
  PartyPopper,
  Rocket,
  ScrollText,
} from 'lucide-react';
import { Fragment, useState } from 'react';

export default function Sidebar() {
  const [isSelected, setIsSelected] = useState('inicio');
  const [isMenuOpen, setIsMenuOpen] = useState(true);

  return (
    <Fragment>
      {isMenuOpen ? (
        <div className="flex flex-col col-span-1 p-5 space-y-6 border-r w-full min-w-64">
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
              onClick={() => {
                setIsSelected('inicio');
              }}
              className={`flex space-x-2 p-4 rounded-lg cursor-pointer ${isSelected === 'inicio' ? 'bg-blue-500 text-white' : 'text-black'}`}
            >
              <House />
              <span>Início</span>
            </a>
            <a
              onClick={() => {
                setIsSelected('celebracoes');
              }}
              className={`flex space-x-2 p-4 rounded-lg cursor-pointer ${isSelected === 'celebracoes' ? 'bg-blue-500 text-white' : 'text-black'}`}
            >
              <PartyPopper />
              <span>Celebrações</span>
            </a>
            <a
              onClick={() => {
                setIsSelected('desenvolvimento');
              }}
              className={`flex space-x-2 p-4 rounded-lg cursor-pointer ${isSelected === 'desenvolvimento' ? 'bg-blue-500 text-white' : 'text-black'}`}
            >
              <Rocket />
              <span>Desenvolvimento</span>
            </a>
            <a
              onClick={() => {
                setIsSelected('objetivos');
              }}
              className={`flex space-x-2 p-4 rounded-lg cursor-pointer ${isSelected === 'objetivos' ? 'bg-blue-500 text-white' : 'text-black'}`}
            >
              <Goal />
              <span>Objetivos</span>
            </a>
            <a
              onClick={() => {
                setIsSelected('gamificacao');
              }}
              className={`flex space-x-2 p-4 rounded-lg cursor-pointer ${isSelected === 'gamificacao' ? 'bg-blue-500 text-white' : 'text-black'}`}
            >
              <Database />
              <span>Gamificação</span>
            </a>
            <a
              onClick={() => {
                setIsSelected('desempenho');
              }}
              className={`flex space-x-2 p-4 rounded-lg cursor-pointer ${isSelected === 'desempenho' ? 'bg-blue-500 text-white' : 'text-black'}`}
            >
              <ScrollText />
              <span>Desempenho</span>
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
