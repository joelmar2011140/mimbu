import { useState } from "react";
import FormularioArtista from "./formularios/FormularioArtista";
import FormularioVotante from "./formularios/FormularioVotante";

function Tabs () {
  const [activeTab, setActiveTab] = useState("tab1");

  const handleClick = (tab: any) => setActiveTab(tab)

  return (
    <div className="flex flex-col">
      <div className="flex mb-4">
        <span
          style={{width: '100%'}}
          className={`mr-2 cursor-pointer py-2 px-4 rounded ${
            activeTab === "tab1"
              ? "bg-blue-500 text-white"
              : "bg-gray-200 text-gray-600"
          }`}
          onClick={() => handleClick("tab1")}
        >
          Eu sou um votante
        </span>
        <span
          style={{width: '100%'}}
          className={`mr-2 cursor-pointer py-2 px-4 rounded ${
            activeTab === "tab2"
              ? "bg-blue-500 text-white"
              : "bg-gray-200 text-gray-600"
          }`}
          onClick={() => handleClick("tab2")}
        >
          Eu sou um artista
        </span>
      </div>
      <div>
        {activeTab === "tab1" ? <FormularioVotante /> : null}
        {activeTab === "tab2" ? <FormularioArtista /> : null}
      </div>
    </div>
  );
};

export default Tabs