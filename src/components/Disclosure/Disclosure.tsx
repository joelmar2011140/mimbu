import useBlockChain from "@/hooks/useBlockchain";
import { Transition, Dialog } from "@headlessui/react";
import { useStoreState } from "easy-peasy";
import { useRouter } from "next/router";
import React, { Fragment, useEffect, useState } from "react";
import { toast } from "react-toastify";
import jsPDF from 'jspdf';

const handleGeneratePDF = (nomeArtista: string, edicao: string, categoria: string) => {
  const doc = new jsPDF();
  doc.text(`Edição: ${edicao}`, 10, 10)
  doc.text(`Categoria: ${categoria}`, 10, 20)
  doc.text(`Votou em : ${nomeArtista}`, 10, 30)
  doc.text(`Data: ${new Date().toLocaleString('pt', { day: 'numeric', month: 'long', year: 'numeric' })}`, 10, 40);
  doc.save('ticket-voto.pdf');
}

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
  const [isOpen, setIsOpen] = useState(false)
  const [bilhete, setBilhete] = useState('')
  const idEdicao = useStoreState((state: any) => state.edicao.idEdicao)
  const enderecoBlockChain = useStoreState((state: any) => state.enderecoBlockChain)
  const bi = useStoreState((state: any) => state.votante.biVotante)
  const roteador = useRouter()
  const { blockChain } = useBlockChain()
  const [selectedCategory, setSelectedCategory] = useState(null);

  const [votos, setVotos] = useState([]);

  useEffect(() => {
    const fetchVotes = async () => {
      if (selectedCategory != null) {
        const votesPromises = selectedCategory.artistas.map((artista: any) => votoDeUmArtista(artista.usuario.enderecoBlockchain, idEdicao, selectedCategory.idCategoria));
        const votesValues = await Promise.all(votesPromises);
        setVotos(votesValues)
      }
    };
    fetchVotes();
  }, [selectedCategory ]);

  const handleCategoryClick = (categoria: any) => setSelectedCategory(categoria);

  function votar(enderecoArtista: string, bi: string, idEdicao: string, categoria: string, nomeArtista?: string) {
    if (blockChain != null && enderecoBlockChain.length > 0) {
      blockChain.contrato.votar(enderecoArtista, bi, idEdicao, categoria, { from: enderecoBlockChain }).then((result) => {
        console.log('votar', result)
        handleGeneratePDF(nomeArtista as string, nomeEdicao, selectedCategory.nomeCategoria)
        toast('Voto submetido com sucesso', { type: 'success', position: 'bottom-right' })
        roteador.reload()
      }).catch((err: any) => {
        console.log('erro', err)
        const errFromString = err.toString()
        console.log(errFromString)

        const reasonIndex = errFromString.indexOf('"reason": "') + 11;
        const reason = errFromString.substring(reasonIndex, errFromString.indexOf('"', reasonIndex));

        toast(reason, { type: 'error', position: 'bottom-right' })

        if (err.code === 4001) {
          return toast('Transação falhada, pois cancelou o voto', { type: 'error', position: 'bottom-right' })
        }
      })

    }
  }

  async function votoDeUmArtista(enderecoArtista: string, idEdicao: string, categoria: string) {
    let votes
    if (blockChain != null && enderecoBlockChain.length > 0) {
      const votos = await blockChain.contrato.numeroDeVotosArtistaCategoriaEdicao(enderecoArtista, idEdicao, categoria)
      votes = votos.toNumber()
    }
    return votes
  }

  function closeModal() {
    setIsOpen(false)
  }

  function openModal() {
    setIsOpen(true)
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
                  <button onClick={openModal} className="py-1 px-2 bg-amber-500 text-white p-4">
                    Votar
                  </button>
                </div>
              </div>
              <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={() => closeModal()}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900"
                  >
                    Verificar bilhete de identidade
                  </Dialog.Title>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                    Insere o número do bilhete
                    </p>
                  </div>
                  {
                    
                    <div className='w-full mt-4 flex flex-col gap-4'>
                      <input onChange={(e) => setBilhete(e.target.value)} type='text' name='bilhete' placeholder='Bilhete de identidade' value={bilhete} className="border-2 w-full border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:border-blue-500" />
                      <button onClick={() => votar(artista.usuario.enderecoBlockchain, bi, idEdicao, selectedCategory.idCategoria, artista.nomeArtistico)} disabled={(bi.length === 0) || (bi !== bilhete)} className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">votar</button>
                    </div>
                  }
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Disclosure
