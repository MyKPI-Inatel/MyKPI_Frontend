import {
  ArrowLeftFromLine,
  ArrowRightFromLine,
  Bolt,
  Database,
  Goal,
  House,
  PartyPopper,
  Rocket,
  ScrollText,
} from "lucide-react";
import { Fragment, useState } from "react";
import { useLocation } from "react-router-dom";

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
              className={`flex space-x-2 p-4 rounded-lg cursor-pointer ${getIsSelected("/") ? "bg-blue-500 text-white" : "text-black"}`}
            >
              <House />
              <span>Início</span>
            </a>
            <a
              className={`flex space-x-2 p-4 rounded-lg cursor-pointer ${getIsSelected("/celebracoes") ? "bg-blue-500 text-white" : "text-black"}`}
            >
              <PartyPopper />
              <span>Celebrações</span>
            </a>
            <a
              className={`flex space-x-2 p-4 rounded-lg cursor-pointer ${getIsSelected("/desenvolvimento") ? "bg-blue-500 text-white" : "text-black"}`}
            >
              <Rocket />
              <span>Desenvolvimento</span>
            </a>
            <a
              className={`flex space-x-2 p-4 rounded-lg cursor-pointer ${getIsSelected("/objetivos") ? "bg-blue-500 text-white" : "text-black"}`}
            >
              <Goal />
              <span>Objetivos</span>
            </a>
            <a
              className={`flex space-x-2 p-4 rounded-lg cursor-pointer ${getIsSelected("/gamificacao") ? "bg-blue-500 text-white" : "text-black"}`}
            >
              <Database />
              <span>Gamificação</span>
            </a>
            <a
              className={`flex space-x-2 p-4 rounded-lg cursor-pointer ${getIsSelected("/desempenho") ? "bg-blue-500 text-white" : "text-black"}`}
            >
              <ScrollText />
              <span>Desempenho</span>
            </a>
            <a
              className={`flex space-x-2 p-4 rounded-lg cursor-pointer ${getIsSelected("/config") ? "bg-blue-500 text-white" : "text-black"}`}
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
