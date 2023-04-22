import React, { useState } from "react";

export function showPath(url: string): string | undefined {
  const urlSplited = url.split('\\')
  const indiceUrl = urlSplited.indexOf('uploads')
  if (indiceUrl !== -1) {
    const urlSerialized = urlSplited.slice(indiceUrl)
    return urlSerialized.join('/')
  }
  return undefined
}

const Disclosure = ({ categorias }: any) => {
  const [selectedCategory, setSelectedCategory] = useState(null);

  const handleCategoryClick = (categoria: any) => setSelectedCategory(categoria);

  return (
    <div className="container mx-auto mt-8">
      <div className="flex justify-center p-4 flex-col gap-4">
        {categorias.map((categoria: any) => (
          <button
            key={categoria.idCategoria}
            className="text-2xl text-white font-bold p-4"
            onClick={() => handleCategoryClick(categoria)}
          >
            {categoria.nomeCategoria}
          </button>
        ))}
      </div>
      {selectedCategory && (
        <div className="flex flex-row flex-wrap justify-center gap-6">
          {selectedCategory.artistas.map((artista: any) => (

            <div
              key={artista.idArtista}
              className=" overflow-hidden relative"
              style={{ minWidth: "400px", margin: "0 10px 20px 0" }} // Increased margin-bottom to 20px
            >
              <div
                className="h-80 bg-cover bg-center rounded-md relative"
                style={{ backgroundImage: `url(http://localhost:3000/${showPath(artista.imagemPerfil)})` }}
              >
                <div className="absolute bottom-0 left-0 w-full h-full flex flex-col gap-4 items-start justify-end p-4">
                  <p className="text-white text-xl bg-black p-2 text-left text-shadow-lg shadow-md">
                    {artista.nomeArtistico}
                  </p>
                </div>
              </div>

              <div className="p-4">
                <h2 className="text-lg font-bold mb-2">{artista.nomeArtista}</h2>
                <div className="flex items-center justify-between">
                  <span className="mr-2 text-white">Total votos: 10</span>
                  <button className="py-1 px-2 bg-green-500 text-white">
                    Ouvir música
                  </button>
                  <button className="py-1 px-2 bg-amber-500 text-white p-4">
                    Votar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Disclosure
