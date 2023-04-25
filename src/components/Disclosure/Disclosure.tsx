import useBlockChain from "@/hooks/useBlockchain";
import { useStoreState } from "easy-peasy";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

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
  const nomeEdicao = useStoreState((state: any) => state.edicao.nomeEdicao)
  const enderecoBlockChain = useStoreState((state: any) => state.enderecoBlockChain)
  const bi = useStoreState((state: any) => state.votante.biVotante)
  const roteador = useRouter()
  const { blockChain } = useBlockChain()
  const [selectedCategory, setSelectedCategory] = useState(null);

  const [votos, setVotos] = useState([]);

  useEffect(() => {
    const fetchVotes = async () => {
      if (selectedCategory != null) {
        const votesPromises = selectedCategory.artistas.map((artista: any) => votoDeUmArtista(artista.usuario.enderecoBlockchain));
        const votesValues = await Promise.all(votesPromises);
        setVotos(votesValues)
      }
    };
    fetchVotes();
  }, [selectedCategory, votoDeUmArtista]);

  const handleCategoryClick = (categoria: any) => setSelectedCategory(categoria);

  function votar(enderecoArtista: string, bi: string, nomeEdicao: string, categoria: string) {
    if (blockChain != null && enderecoBlockChain.length > 0) {
      blockChain.contrato.votar(enderecoArtista, bi, nomeEdicao, categoria, { from: enderecoBlockChain }).then((result) => {
        console.log('votar', result)
        roteador.reload()
      }).catch((err: any) => {
        console.log('erro', err)
        const errFromString = err.toString()

        const reasonIndex = errFromString.indexOf('"reason": "') + 11;
        const reason = errFromString.substring(reasonIndex, errFromString.indexOf('"', reasonIndex));

        toast(reason, { type: 'error', position: 'bottom-right' })

        if (err.code === 4001) {
          return toast('Transação falhada, pois cancelou o voto', { type: 'error', position: 'bottom-right' })
        }
      })

    }
  }

  async function votoDeUmArtista(enderecoArtista: string) {
    let votes
    if (blockChain != null && enderecoBlockChain.length > 0) {
      const votos = await blockChain.contrato.numeroDeVotosArtistaCategoriaEdicao(enderecoArtista, nomeEdicao, selectedCategory.nomeCategoria)
      votes = votos.toNumber()
    }
    return votes
  }

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
          {(selectedCategory.artistas.length === 0) ? (<h1 className="text-2xl text-white">Sem artistas a concorrerem para esta categoria 😔 ...</h1>) : selectedCategory.artistas.map((artista: any, indiceArtista: number) => (
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
                  <span className="mr-2 text-white">Total votos: {votos[indiceArtista]}</span>
                  <button onClick={() => roteador.push(artista.Musica[0].link_musica)} className="py-1 px-2 bg-green-500 text-white">
                    Ouvir música
                  </button>
                  <button onClick={() => votar(artista.usuario.enderecoBlockchain, bi, selectedCategory.nomeCategoria)} className="py-1 px-2 bg-amber-500 text-white p-4">
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
