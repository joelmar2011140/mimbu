import React, { useState, Fragment, ChangeEvent } from 'react';
import { Dialog, Transition } from '@headlessui/react'
import { AiFillCalendar, AiFillHome, AiFillPhone, AiOutlineArrowLeft, AiOutlineArrowRight } from 'react-icons/ai'
import { useQuery } from 'react-query';
import { fetchArtistasParam, fetchCategoriasParam, fetchEdicoesParam, fetchNoticiasParam, fetchVotantesParam } from '@/lib/fetch.functions';
import Link from 'next/link';
import { showPath } from './Disclosure/Disclosure';
import { BsFillFileMusicFill, BsPencil } from 'react-icons/bs';
import { RiDeleteBin6Line } from 'react-icons/ri'
import FormularioEdicao, { FormularioArtistaEditar, FormularioCategoria, FormularioEdicaoEditar, FormularioEditarCategoria, FormularioNoticia, FormularioNoticiaEditar } from './formularios/FormularioEdicao';
import { useRouter } from 'next/router';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useStoreState } from 'easy-peasy';
import { BiCategory } from 'react-icons/bi';
import useBlockChain from '@/hooks/useBlockchain';

const Table = () => {
  const sq = useStoreState((state: any) => state.sq)
  const roteador = useRouter()
  const [selectedEdicao, setSelectedEdicao] = useState<any>({})
  const [pagina, setPagina] = useState(0)
  const [porPagina, setPorPagina] = useState(10)
  const [isOpen, setIsOpen] = useState(false)
  const [isOpenEdit, setIsOpenEdit] = useState(false)
  const [isOpenDelete, setIsOpenDelete] = useState(false)
  const { data, isLoading } = useQuery({
    queryKey: ['fetchEdicoes', pagina, porPagina, sq],
    queryFn: async () => await fetchEdicoesParam(pagina, porPagina, sq),
    keepPreviousData: true
  });

  function closeModal(type: 'normal' | 'edit' | 'delete') {
    switch (type) {
      case 'normal':
        setIsOpen(false)
        break
      case 'edit':
        setIsOpenEdit(false)
        break
      case 'delete':
        setIsOpenDelete(false)
        break
    }
  }

  function openModal(type: 'normal' | 'edit' | 'delete', edicao?: any) {
    switch (type) {
      case 'normal':
        setIsOpen(true)
        break
      case 'edit':
        setIsOpenEdit(true)
        setSelectedEdicao(edicao)
        break
      case 'delete':
        setIsOpenDelete(true)
        setSelectedEdicao(edicao)
        break
    }
  }

  async function eliminarEdicao(idEdicao: string) {
    try {
      if (selectedEdicao != null) {
        const incomingResponse = await axios.delete(`http://localhost:3000/api/edicoes/${idEdicao}`)
        toast(incomingResponse.data.message, { type: 'success', position: 'bottom-right' })
        return roteador.reload()
      }
    } catch (err: any) {
      console.error(err)
      if (err.name === 'AxiosError') {
        toast(err.response.data.message, { type: 'error', position: 'bottom-right' })
        return
      }
    }
  }

  return (
    <div className="w-full mt-12">
      <button className="rounded-none bg-green-600 p-4 text-white mb-8 font-bold" onClick={() => openModal('normal')}>+</button>
      {
        isLoading ? (<h1>Por favor aguarde</h1>) : (
          <div className="overflow-x-auto">
            <div className="w-full inline-block min-w-full">
              <table className="w-full divide-y divide-gray-200 border-b">
                <thead>
                  <tr>
                    <th className="px-6 py-3 text-left font-bold text-md  text-gray-800 tracking-wider">
                      Nome da Edição
                    </th>
                    <th className="px-6 py-3 text-left font-bold text-md  text-gray-800 tracking-wider">
                      Data começo
                    </th>
                    <th className="px-6 py-3 text-left font-bold text-md  text-gray-800 tracking-wider">
                      Data Término
                    </th>
                    <th className="px-6 py-3 text-left font-bold text-md  text-gray-800 tracking-wider">
                      Categorias
                    </th>
                    <th className="px-6 py-3 text-left font-bold text-md  text-gray-800 tracking-wider">
                      Capa do evento
                    </th>
                    <th className="px-6 py-3 text-left font-bold text-md  text-gray-800 tracking-wider">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {
                    data.data.map((edicao: any) => (
                      <tr key={edicao.idEdicao}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="h-16 flex items-center">
                            <Link className='underline' href={`/panel/admin/edicoes/${edicao.idEdicao}`}>{edicao.nomeEdicao}</Link>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="h-16 flex items-center">{new Date(edicao.dataComeco).toLocaleString('pt', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="h-16 flex items-center">{new Date(edicao.dataTermino).toLocaleString('pt', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="h-16 flex items-center">{edicao.categoria.map((categoria: any) => (categoria.nomeCategoria)).toString()}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="h-16 flex items-center">
                            <Link href={`http://localhost:3000/${showPath(edicao.capa)}`} className='underline'>Clique aqui para ver</Link>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className='w-full flex flex-row gap-2 items-center justify-center'>
                            <button className="rounded-none bg-indigo-600 p-2 text-white mb-8 font-bold" onClick={() => openModal('edit', edicao)}><BsPencil /></button>
                            <button className="rounded-none bg-red-600 p-2 text-white mb-8 font-bold" onClick={() => openModal('delete', edicao)}><RiDeleteBin6Line /></button>
                          </div>
                        </td>
                      </tr>
                    ))
                  }
                </tbody>
              </table>
            </div>
            <div className='mx-auto gap-6 p-2 mt-2 flex flex-row items-center justify-center'>
              <p>Total elementos: {data.paginator.totalCurrentResults}</p>
              <div className='flex flex-row items-center gap-2 justify-center'>
                <AiOutlineArrowLeft className='cursor-pointer' onClick={() => setPagina((pagina > 0) ? pagina - 1 : 0)} />
                <input type="number" className='border p-2 outline-none' min={0} defaultValue={10} onChange={(e) => setPorPagina(+e.target.value)} />
                <AiOutlineArrowRight className='cursor-pointer' onClick={() => setPagina(pagina + 1)} />
              </div>
              <p>Página: {pagina}</p>
            </div>
          </div>
        )
      }


      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={() => closeModal('normal')}>
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
            <div className="flex h-screen items-center justify-center p-4 text-center">
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
                    Adicionar uma edição
                  </Dialog.Title>
                  <div className="mt-2 h-full">
                    <p className="text-sm text-gray-500 mb-8">
                      Preencha por favor todos os campos
                    </p>
                    <FormularioEdicao />
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>

      <Transition appear show={isOpenEdit} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={() => closeModal('edit')}>
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
                    Editar uma edição
                  </Dialog.Title>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      Editar dados da edição {selectedEdicao != null ? selectedEdicao.nomeEdicao : null}
                    </p>
                  </div>
                  <FormularioEdicaoEditar idEdicao={selectedEdicao != null ? selectedEdicao : null} />
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>

      <Transition appear show={isOpenDelete} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={() => closeModal('delete')}>
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
                    Eliminar edição
                  </Dialog.Title>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      Deseja eliminar esta edição ?
                    </p>
                    <div className='w-full mt-6 flex flex-row gap-2 items-center justify-start'>
                      <button className="rounded-none bg-green-600 p-2 text-white mb-8 font-bold" onClick={async () => eliminarEdicao(selectedEdicao.idEdicao)}>Sim</button>
                      <button className="rounded-none bg-red-600 p-2 text-white mb-8 font-bold" onClick={() => closeModal('delete')}>Não</button>
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
};

export default Table;



export const TableForArtists = () => {
  const sq = useStoreState((state: any) => state.sq)
  const roteador = useRouter()
  const { blockChain } = useBlockChain()
  const enderecoBlockChain = useStoreState((state: any) => state.enderecoBlockChain)
  const artistaId = useStoreState((state: any) => state.artista.idArtista)
  const [selectedEdicao, setSelectedEdicao] = useState<any>({})
  const [participacao, setParticipacao] = useState({ titulo: '', link_musica: '', ano_gravacao: 0, nomeGenero: '' })
  const [selectedCategoria, setSelectedCategoria] = useState<any>({})
  const [pagina, setPagina] = useState(0)
  const [porPagina, setPorPagina] = useState(10)
  const [isOpen, setIsOpen] = useState(false)
  const [isOpenEdit, setIsOpenEdit] = useState(false)
  const [isOpenDelete, setIsOpenDelete] = useState(false)
  const { data, isLoading } = useQuery({
    queryKey: ['fetchEdicoes', pagina, porPagina, sq],
    queryFn: async () => await fetchEdicoesParam(pagina, porPagina, sq),
    keepPreviousData: true
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => setParticipacao({ ...participacao, [e.target.name]: e.target.value })

  function registarArtistaBlockChain(enderecoArtista: string, nome: string, categoria: string) {
    if (blockChain != null && enderecoBlockChain.length > 0) {
      blockChain.contrato.adicionarArtista(enderecoArtista, nome, categoria, { from: enderecoBlockChain }).catch((err: any) => {
        console.log('erro', err)
        if (err.code === 4001) {
          return toast('Transação falhada, pois cancelou o registo', { type: 'error', position: 'bottom-right' })
        }
      });
    }
  }

  async function participar () {
    try {

      
      const incomingData = {
        ...participacao,
        idCategoria: (Object.keys(selectedCategoria).length > 0) ? selectedCategoria.idCategoria : null,
        idEdicao: (Object.keys(selectedEdicao).length > 0) ? selectedEdicao.idEdicao : null
      }
      const incomingResponse = await axios.patch(`http://localhost:3000/api/artistas/${artistaId}/ingressar`, incomingData)
      registarArtistaBlockChain(enderecoBlockChain, data.idEdicao, data.categoria)
      toast(incomingResponse.data.message, { type: 'success', position: 'bottom-right' })
      return roteador.reload()
    } catch (err: any) {
      console.log(err)
      if (err.name === 'AxiosError') {
        toast(err.response.data.message, { type: 'error', position: 'bottom-right' })
        return
      }
    }
  }

  function closeModal(type: 'normal' | 'edit' | 'delete') {
    switch (type) {
      case 'normal':
        setIsOpen(false)
        break
      case 'edit':
        setIsOpenEdit(false)
        break
      case 'delete':
        setIsOpenDelete(false)
        break
    }
  }

  function openModal(type: 'normal' | 'edit' | 'delete', edicao?: any) {
    switch (type) {
      case 'normal':
        setIsOpen(true)
        break
      case 'edit':
        setIsOpenEdit(true)
        setSelectedEdicao(edicao)
        break
      case 'delete':
        setIsOpenDelete(true)
        setSelectedEdicao(edicao)
        break
    }
  }


  return (
    <div className="w-full mt-12">
      {
        isLoading ? (<h1>Por favor aguarde</h1>) : (
          <div className="overflow-x-auto">
            <div className="w-full inline-block min-w-full">
              <table className="w-full divide-y divide-gray-200 border-b">
                <thead>
                  <tr>
                    <th className="px-6 py-3 text-left font-bold text-md  text-gray-800 tracking-wider">
                      Nome da Edição
                    </th>
                    <th className="px-6 py-3 text-left font-bold text-md  text-gray-800 tracking-wider">
                      Data começo
                    </th>
                    <th className="px-6 py-3 text-left font-bold text-md  text-gray-800 tracking-wider">
                      Data Término
                    </th>
                    <th className="px-6 py-3 text-left font-bold text-md  text-gray-800 tracking-wider">
                      Categorias
                    </th>
                    <th className="px-6 py-3 text-left font-bold text-md  text-gray-800 tracking-wider">
                      Capa do evento
                    </th>
                    <th className="px-6 py-3 text-left font-bold text-md  text-gray-800 tracking-wider">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {
                    data.data.map((edicao: any) => (
                      <tr key={edicao.idEdicao}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="h-16 flex items-center">
                            <Link className='underline' href={`/panel/admin/edicoes/${edicao.idEdicao}`}>{edicao.nomeEdicao}</Link>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="h-16 flex items-center">{new Date(edicao.dataComeco).toLocaleString('pt', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="h-16 flex items-center">{new Date(edicao.dataTermino).toLocaleString('pt', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="h-16 flex items-center">{edicao.categoria.map((categoria: any) => (categoria.nomeCategoria)).toString()}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="h-16 flex items-center">
                            <Link href={`http://localhost:3000/${showPath(edicao.capa)}`} className='underline'>Clique aqui para ver</Link>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className='w-full flex flex-row gap-2 items-center justify-center'>
                            <button className="rounded-none bg-indigo-600 p-2 text-white mb-8 font-bold" onClick={() => openModal('edit', edicao)}>Participar</button>
                          </div>
                        </td>
                      </tr>
                    ))
                  }
                </tbody>
              </table>
            </div>
            <div className='mx-auto gap-6 p-2 mt-2 flex flex-row items-center justify-center'>
              <p>Total elementos: {data.paginator.totalCurrentResults}</p>
              <div className='flex flex-row items-center gap-2 justify-center'>
                <AiOutlineArrowLeft className='cursor-pointer' onClick={() => setPagina((pagina > 0) ? pagina - 1 : 0)} />
                <input type="number" className='border p-2 outline-none' min={0} defaultValue={10} onChange={(e) => setPorPagina(+e.target.value)} />
                <AiOutlineArrowRight className='cursor-pointer' onClick={() => setPagina(pagina + 1)} />
              </div>
              <p>Página: {pagina}</p>
            </div>
          </div>
        )
      }

      <Transition appear show={isOpenEdit} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={() => closeModal('edit')}>
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
                    Participar da edição {selectedEdicao != null ? selectedEdicao.nomeEdicao : null}
                  </Dialog.Title>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                    Seleccione uma categoria
                    </p>
                  </div>
                  { 
                    (Object.keys(selectedEdicao).length > 0) ? selectedEdicao.categoria.map((cat: any) => (
                      <span onClick={() => setSelectedCategoria(cat)} key={cat.idCategoria} className="inline-flex items-center mr-2 mt-4 rounded-md bg-gray-50 p-4 cursor-pointer text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10">{cat.nomeCategoria}</span> 
                    )) : null
                  }
                  {
                    (Object.keys(selectedCategoria).length > 0) ? (
                    <div className='w-full mt-4 flex flex-col gap-4'>
                      <input onChange={handleChange} type='text' name='titulo' placeholder='Título da música' value={participacao.titulo} className="border-2 w-full border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:border-blue-500" />
                      <input onChange={handleChange} type='text' name='link_musica' placeholder='Link da música' value={participacao.link_musica} className="border-2 w-full border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:border-blue-500" />
                      <input onChange={handleChange} type='text' name='ano_gravacao' placeholder='Ano de gravação da música' value={participacao.ano_gravacao} className="border-2 w-full border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:border-blue-500" />
                      <input onChange={handleChange} type='text' name='nomeGenero' placeholder='Género da música' value={participacao.nomeGenero} className="border-2 w-full border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:border-blue-500" />
                      <button onClick={participar} className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Participar</button>
                    </div>
                    ) : null
                  }
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
};




export const TableVotantes = () => {
  const sq = useStoreState((state: any) => state.sq)
  const roteador = useRouter()
  const [selectedVotante, setSelectedVotante] = useState<any>({})
  const [pagina, setPagina] = useState(0)
  const [porPagina, setPorPagina] = useState(10)
  const [isOpen, setIsOpen] = useState(false)
  const [isOpenEdit, setIsOpenEdit] = useState(false)
  const [isOpenDelete, setIsOpenDelete] = useState(false)
  const { data, isLoading } = useQuery({
    queryKey: ['fetchVotantes', pagina, porPagina, sq],
    queryFn: async () => await fetchVotantesParam(pagina, porPagina, sq),
    keepPreviousData: true
  })

  function closeModal(type: 'normal' | 'edit' | 'delete') {
    switch (type) {
      case 'normal':
        setIsOpen(false)
        break
      case 'edit':
        setIsOpenEdit(false)
        break
      case 'delete':
        setIsOpenDelete(false)
        break
    }
  }

  function openModal(type: 'normal' | 'edit' | 'delete', votante?: any) {
    switch (type) {
      case 'delete':
        setIsOpenDelete(true)
        setSelectedVotante(votante)
        break
    }
  }

  async function eliminarVotante(idVotante: string) {
    try {
      if (selectedVotante != null) {
        const incomingResponse = await axios.delete(`http://localhost:3000/api/votantes/${idVotante}`)
        toast(incomingResponse.data.message, { type: 'success', position: 'bottom-right' })
        return roteador.reload()
      }
    } catch (err: any) {
      console.error(err)
      if (err.name === 'AxiosError') {
        toast(err.response.data.message, { type: 'error', position: 'bottom-right' })
        return
      }
    }
  }

  return (
    <div className="w-full mt-12">
      {
        isLoading ? (<h1>Por favor aguarde</h1>) : (
          <div className="overflow-x-auto">
            <div className="w-full inline-block min-w-full">
              <table className="w-full divide-y divide-gray-200 border-b">
                <thead>
                  <tr>
                    <th className="px-6 py-3 text-left font-bold text-md  text-gray-800 tracking-wider">
                      Bilhete de identidade
                    </th>
                    <th className="px-6 py-3 text-left font-bold text-md  text-gray-800 tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left font-bold text-md  text-gray-800 tracking-wider">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {
                    data.data.data.map((votante: any) => (
                      <tr key={votante.idVotante}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="h-16 flex items-center">
                            <div className="h-16 flex items-center">{votante.bilheteDeIdentidade}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="h-16 flex items-center">{votante.usuario.email}</div>
                        </td>

                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className='w-full flex flex-row gap-2 items-center justify-center'>
                            <button className="rounded-none bg-red-600 p-2 text-white mb-8 font-bold" onClick={() => openModal('delete', votante)}><RiDeleteBin6Line /></button>
                          </div>
                        </td>
                      </tr>
                    ))
                  }
                </tbody>
              </table>
            </div>
            <div className='mx-auto gap-6 p-2 mt-2 flex flex-row items-center justify-center'>
              <p>Total elementos: {data.data.paginator.totalCurrentResults}</p>
              <div className='flex flex-row items-center gap-2 justify-center'>
                <AiOutlineArrowLeft className='cursor-pointer' onClick={() => setPagina((pagina > 0) ? pagina - 1 : 0)} />
                <input type="number" className='border p-2 outline-none' min={0} defaultValue={10} onChange={(e) => setPorPagina(+e.target.value)} />
                <AiOutlineArrowRight className='cursor-pointer' onClick={() => setPagina(pagina + 1)} />
              </div>
              <p>Página: {pagina}</p>
            </div>
          </div>
        )
      }

      <Transition appear show={isOpenDelete} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={() => closeModal('delete')}>
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
                    Eliminar votante
                  </Dialog.Title>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      Deseja eliminar este votante ?
                    </p>
                    <div className='w-full mt-6 flex flex-row gap-2 items-center justify-start'>
                      <button className="rounded-none bg-green-600 p-2 text-white mb-8 font-bold" onClick={async () => eliminarVotante(selectedVotante.idVotante)}>Sim</button>
                      <button className="rounded-none bg-red-600 p-2 text-white mb-8 font-bold" onClick={() => closeModal('delete')}>Não</button>
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
};


export const TableNoticias = () => {
  const sq = useStoreState((state: any) => state.sq)
  const roteador = useRouter()
  const [selectedNoticia, setSelectedNoticia] = useState<any>({})
  const [pagina, setPagina] = useState(0)
  const [porPagina, setPorPagina] = useState(10)
  const [isOpen, setIsOpen] = useState(false)
  const [isOpenEdit, setIsOpenEdit] = useState(false)
  const [isOpenDelete, setIsOpenDelete] = useState(false)
  const { data, isLoading } = useQuery({
    queryKey: ['fetchNoticias', pagina, porPagina, sq],
    queryFn: async () => await fetchNoticiasParam(pagina, porPagina, sq),
    keepPreviousData: true
  });

  function closeModal(type: 'normal' | 'edit' | 'delete') {
    switch (type) {
      case 'normal':
        setIsOpen(false)
        break
      case 'edit':
        setIsOpenEdit(false)
        break
      case 'delete':
        setIsOpenDelete(false)
        break
    }
  }

  function openModal(type: 'normal' | 'edit' | 'delete', noticia?: any) {
    switch (type) {
      case 'normal':
        setIsOpen(true)
        break
      case 'edit':
        setIsOpenEdit(true)
        setSelectedNoticia(noticia)
        break
      case 'delete':
        setIsOpenDelete(true)
        setSelectedNoticia(noticia)
        break
    }
  }

  async function eliminarNoticia(idNoticia: string) {
    try {
      if (selectedNoticia != null) {
        const incomingResponse = await axios.delete(`http://localhost:3000/api/noticias/${idNoticia}`)
        toast(incomingResponse.data.message, { type: 'success', position: 'bottom-right' })
        return roteador.reload()
      }
    } catch (err: any) {
      console.error(err)
      if (err.name === 'AxiosError') {
        toast(err.response.data.message, { type: 'error', position: 'bottom-right' })
        return
      }
    }
  }

  return (
    <div className="w-full mt-12">
      <button className="rounded-none bg-green-600 p-4 text-white mb-8 font-bold" onClick={() => openModal('normal')}>+</button>
      {
        isLoading ? (<h1>Por favor aguarde</h1>) : (
          <div className="overflow-x-auto">
            <div className="w-full inline-block min-w-full">
              <table className="w-full divide-y divide-gray-200 border-b">
                <thead>
                  <tr>
                    <th className="px-6 py-3 text-left font-bold text-md  text-gray-800 tracking-wider">
                      Titulo da notícia
                    </th>
                    <th className="px-6 py-3 text-left font-bold text-md  text-gray-800 tracking-wider">
                      Data da publicação
                    </th>
                    <th className="px-6 py-3 text-left font-bold text-md  text-gray-800 tracking-wider">
                      Capa da notícia
                    </th>
                    <th className="px-6 py-3 text-left font-bold text-md  text-gray-800 tracking-wider">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {
                    data.data.map((noticia: any) => (
                      <tr key={noticia.idNoticia}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="h-16 flex items-center">
                            <Link className='underline' href={`/noticias/${noticia.idNoticia}`}>{noticia.tituloDaNoticia}</Link>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="h-16 flex items-center">{new Date(noticia.dataDaNoticia).toLocaleString('pt', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
                        </td>

                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="h-16 flex items-center">
                            <Link target='_blank' href={`http://localhost:3000/${showPath(noticia.imagemDaNoticia)}`} className='underline'>Clique aqui para ver</Link>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className='w-full flex flex-row gap-2 items-center justify-center'>
                            <button className="rounded-none bg-indigo-600 p-2 text-white mb-8 font-bold" onClick={() => openModal('edit', noticia)}><BsPencil /></button>
                            <button className="rounded-none bg-red-600 p-2 text-white mb-8 font-bold" onClick={() => openModal('delete', noticia)}><RiDeleteBin6Line /></button>
                          </div>
                        </td>
                      </tr>
                    ))
                  }
                </tbody>
              </table>
            </div>
            <div className='mx-auto gap-6 p-2 mt-2 flex flex-row items-center justify-center'>
              <p>Total elementos: {data.paginator.totalCurrentResults}</p>
              <div className='flex flex-row items-center gap-2 justify-center'>
                <AiOutlineArrowLeft className='cursor-pointer' onClick={() => setPagina((pagina > 0) ? pagina - 1 : 0)} />
                <input type="number" className='border p-2 outline-none' min={0} defaultValue={10} onChange={(e) => setPorPagina(+e.target.value)} />
                <AiOutlineArrowRight className='cursor-pointer' onClick={() => setPagina(pagina + 1)} />
              </div>
              <p>Página: {pagina}</p>
            </div>
          </div>
        )
      }


      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={() => closeModal('normal')}>
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
            <div className="flex h-screen items-center justify-center p-4 text-center">
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
                    Adicionar uma noticia
                  </Dialog.Title>
                  <div className="mt-2 h-full">
                    <p className="text-sm text-gray-500 mb-8">
                      Preencha por favor todos os campos
                    </p>
                    <FormularioNoticia />
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>

      <Transition appear show={isOpenEdit} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={() => closeModal('edit')}>
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
                    Editar uma noticia
                  </Dialog.Title>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      Editar dados da edição {selectedNoticia != null ? selectedNoticia.tituloDaNoticia : null}
                    </p>
                  </div>
                  <FormularioNoticiaEditar idEdicao={selectedNoticia != null ? selectedNoticia : null} />
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>

      <Transition appear show={isOpenDelete} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={() => closeModal('delete')}>
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
                    Eliminar notícia
                  </Dialog.Title>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      Deseja eliminar esta notícia ?
                    </p>
                    <div className='w-full mt-6 flex flex-row gap-2 items-center justify-start'>
                      <button className="rounded-none bg-green-600 p-2 text-white mb-8 font-bold" onClick={async () => eliminarNoticia(selectedNoticia.idNoticia)}>Sim</button>
                      <button className="rounded-none bg-red-600 p-2 text-white mb-8 font-bold" onClick={() => closeModal('delete')}>Não</button>
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
};

export const CardListCategorias = () => {
  const sq = useStoreState((state: any) => state.sq)
  const roteador = useRouter()
  const [selectedCategoria, setSelectedCategoria] = useState<any>({})
  const [pagina, setPagina] = useState(0)
  const [porPagina, setPorPagina] = useState(10)
  const [isOpen, setIsOpen] = useState(false)
  const [isOpenEdit, setIsOpenEdit] = useState(false)
  const [isOpenDelete, setIsOpenDelete] = useState(false)
  const { data, isLoading } = useQuery({
    queryKey: ['fetchCategoriasInside', pagina, porPagina, sq],
    queryFn: async () => await fetchCategoriasParam(pagina, porPagina, sq),
    keepPreviousData: true
  });

  function closeModal(type: 'normal' | 'edit' | 'delete') {
    switch (type) {
      case 'normal':
        setIsOpen(false)
        break
      case 'edit':
        setIsOpenEdit(false)
        break
      case 'delete':
        setIsOpenDelete(false)
        break
    }
  }

  function openModal(type: 'normal' | 'edit' | 'delete', categoria?: any) {
    switch (type) {
      case 'normal':
        setIsOpen(true)
        break
      case 'edit':
        setIsOpenEdit(true)
        setSelectedCategoria(categoria)
        break
      case 'delete':
        setIsOpenDelete(true)
        setSelectedCategoria(categoria)
        break
    }
  }

  async function eliminarCategoria(idCategoria: string) {
    try {
      if (selectedCategoria != null) {
        const incomingResponse = await axios.delete(`http://localhost:3000/api/categorias/${idCategoria}`)
        toast(incomingResponse.data.message, { type: 'success', position: 'bottom-right' })
        return roteador.reload()
      }
    } catch (err: any) {
      console.error(err)
      if (err.name === 'AxiosError') {
        toast(err.response.data.message, { type: 'error', position: 'bottom-right' })
        return
      }
    }
  }

  return (
    <div className="w-full mt-12">
      <button className="rounded-none bg-green-600 p-4 text-white mb-8 font-bold" onClick={() => openModal('normal')}>+</button>
      {
        isLoading ? (<h1>Por favor aguarde</h1>) : (
          <div className="overflow-x-auto mx-auto">
            <div className="w-full min-w-full flex flex-row flex-wrap gap-4 items-center justify-start">
              {
                data.data.data.map((cat: any) => (
                  <div key={cat.idCategoria} className="bg-blue-800 w-1/4 rounded-md p-4">
                    <h1 className=" bg-white p-2 text-center text-blue-800 text-xl font-bold mb-4">{cat.nomeCategoria}</h1>
                    <hr className="my-4 border-black" />
                    <div className="flex justify-start">
                      <button className="bg-blue-900 text-white py-2 px-4 mr-2" onClick={() => openModal('edit', cat)}>
                        Editar dados
                      </button>
                      <button className="bg-blue-800 border border-cyan-300 text-white py-2 px-4 " onClick={() => openModal('delete', cat)}>
                        Eliminar
                      </button>
                    </div>
                  </div>
                ))
              }
            </div>
            <div className='mx-auto gap-6 p-2 mt-2 flex flex-row items-center justify-center'>
              <p>Total elementos: {data.data.paginator.totalCurrentResults}</p>
              <div className='flex flex-row items-center gap-2 justify-center'>
                <AiOutlineArrowLeft className='cursor-pointer' onClick={() => setPagina((pagina > 0) ? pagina - 1 : 0)} />
                <input type="number" className='border p-2 outline-none' min={0} defaultValue={10} onChange={(e) => setPorPagina(+e.target.value)} />
                <AiOutlineArrowRight className='cursor-pointer' onClick={() => setPagina(pagina + 1)} />
              </div>
              <p>Página: {pagina}</p>
            </div>
          </div>
        )
      }


      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={() => closeModal('normal')}>
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
            <div className="flex h-screen items-center justify-center p-4 text-center">
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
                    Adicionar uma categoria
                  </Dialog.Title>
                  <div className="mt-2 h-full">
                    <p className="text-sm text-gray-500 mb-8">
                      Preencha por favor todos os campos
                    </p>
                    <FormularioCategoria />
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>

      <Transition appear show={isOpenEdit} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={() => closeModal('edit')}>
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
                    Editar uma categoria
                  </Dialog.Title>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      Editar dados da categoria {selectedCategoria != null ? selectedCategoria.nomeCategoria : null}
                    </p>
                  </div>
                  <FormularioEditarCategoria idCategoria={selectedCategoria != null ? selectedCategoria : null} />
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>

      <Transition appear show={isOpenDelete} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={() => closeModal('delete')}>
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
                    Eliminar categoria
                  </Dialog.Title>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      Deseja eliminar esta categoria ?
                    </p>
                    <div className='w-full mt-6 flex flex-row gap-2 items-center justify-start'>
                      <button className="rounded-none bg-green-600 p-2 text-white mb-8 font-bold" onClick={async () => eliminarCategoria(selectedCategoria.idCategoria)}>Sim</button>
                      <button className="rounded-none bg-red-600 p-2 text-white mb-8 font-bold" onClick={() => closeModal('delete')}>Não</button>
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
};

export const CardListArtistas = () => {
  const sq = useStoreState((state: any) => state.sq)
  const roteador = useRouter()
  const [selectedArtista, setSelectedArtista] = useState<any>({})
  const [pagina, setPagina] = useState(0)
  const [porPagina, setPorPagina] = useState(10)
  const [isOpen, setIsOpen] = useState(false)
  const [isOpenEdit, setIsOpenEdit] = useState(false)
  const [isOpenDelete, setIsOpenDelete] = useState(false)
  const { data, isLoading } = useQuery({
    queryKey: ['fetchArtistasInside', pagina, porPagina, sq],
    queryFn: async () => await fetchArtistasParam(pagina, porPagina, sq),
    keepPreviousData: true
  });

  function closeModal(type: 'normal' | 'edit' | 'delete') {
    switch (type) {
      case 'normal':
        setIsOpen(false)
        break
      case 'edit':
        setIsOpenEdit(false)
        break
      case 'delete':
        setIsOpenDelete(false)
        break
    }
  }

  function openModal(type: 'normal' | 'edit' | 'delete', artista?: any) {
    switch (type) {
      case 'normal':
        setIsOpen(true)
        break
      case 'edit':
        setIsOpenEdit(true)
        setSelectedArtista(artista)
        break
      case 'delete':
        setIsOpenDelete(true)
        setSelectedArtista(artista)
        break
    }
  }

  async function eliminarArtista(idArtista: string) {
    try {
      if (selectedArtista != null) {
        const incomingResponse = await axios.delete(`http://localhost:3000/api/artistas/${idArtista}`)
        toast(incomingResponse.data.message, { type: 'success', position: 'bottom-right' })
        return roteador.reload()
      }
    } catch (err: any) {
      console.error(err)
      if (err.name === 'AxiosError') {
        toast(err.response.data.message, { type: 'error', position: 'bottom-right' })
        return
      }
    }
  }

  return (
    <div className="w-full mt-12">
      {
        isLoading ? (<h1>Por favor aguarde</h1>) : (
          <div className="overflow-x-auto mx-auto">
            <div className="w-full min-w-full flex flex-row flex-wrap gap-4 items-center justify-start">
              {
                data.data.map((artista: any) => (
                  <div key={artista.idArtista} className="bg-blue-800 h-2/4	 w-2/5 rounded-md p-4">
                    <h1 className=" bg-white p-2 text-center text-blue-800 text-xl font-bold mb-4">{artista.nomeArtistico}</h1>
                    <hr className="my-4 border-black" />
                    <div className="mb-8 flex flex-row items-center gap-4 p-2 text-xl text-white font-bold">
                      <AiFillHome
                        className=" text-white"
                        size={20}
                      />
                      <span className="mr-2">{artista.nomeProvincia}</span>
                    </div>
                    <div className="mb-8 flex flex-row items-center gap-4 p-2 text-xl text-white font-bold">
                      <AiFillCalendar
                        className=" text-white"
                        size={20}
                      />
                      <span className="mr-2">{new Date(artista.dataNascimento).toLocaleString('pt', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                    </div>
                    <div className="mb-8 flex flex-row items-center gap-4 p-2 text-xl text-white font-bold">
                      <AiFillPhone
                        className=" text-white"
                        size={20}
                      />
                      <span className="mr-2">{artista.telefone}</span>
                    </div>
                    <div className='flex flex-col gap-2'>
                      <span className="mr-2 text-white text-xl font-bold">Músicas</span>
                      {
                        artista.Musica.map((musica: any) => (
                          <div key={musica.idMusica} className="mb-8 flex flex-row items-center gap-4 p-2 text-xl text-white font-bold">
                            <BsFillFileMusicFill
                              className=" text-white"
                              size={20}
                            />
                            <Link href={musica.link_musica}>
                              <span className="mr-2">{musica.titulo}</span>
                            </Link>
                          </div>
                        ))
                      }
                    </div>
                    {
                      (artista.categorias.length > 0) ? (
                        <div className='flex flex-col gap-2'>
                          <span className="mr-2 text-white text-xl font-bold">Categorias a concorrer</span>
                          {
                            artista.categorias.map((categoria: any) => (
                              <div key={categoria.idCategoria} className="mb-8 flex flex-row items-center gap-4 p-2 text-xl text-white font-bold">
                                <BiCategory
                                  className=" text-white"
                                  size={20}
                                />
                                <span className="mr-2">{categoria.nomeCategoria}</span>
                              </div>
                            ))
                          }
                        </div>
                      ) : null
                    }
                    <div className="flex justify-start">
                      <button className="bg-blue-900 text-white py-2 px-4 mr-2" onClick={() => openModal('edit', artista)}>
                        Editar dados
                      </button>
                      <button className="bg-blue-800 border border-cyan-300 text-white py-2 px-4 " onClick={() => openModal('delete', artista)}>
                        Eliminar
                      </button>
                    </div>
                  </div>
                ))
              }
            </div>
            <div className='mx-auto gap-6 p-2 mt-2 flex flex-row items-center justify-center'>
              <p>Total elementos: {data.paginator.totalCurrentResults}</p>
              <div className='flex flex-row items-center gap-2 justify-center'>
                <AiOutlineArrowLeft className='cursor-pointer' onClick={() => setPagina((pagina > 0) ? pagina - 1 : 0)} />
                <input type="number" className='border p-2 outline-none' min={0} defaultValue={10} onChange={(e) => setPorPagina(+e.target.value)} />
                <AiOutlineArrowRight className='cursor-pointer' onClick={() => setPagina(pagina + 1)} />
              </div>
              <p>Página: {pagina}</p>
            </div>
          </div>
        )
      }

      <Transition appear show={isOpenEdit} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={() => closeModal('edit')}>
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
                    Editar um artista
                  </Dialog.Title>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      Editar dados do artista {selectedArtista != null ? selectedArtista.nomeArtistico : null}
                    </p>
                  </div>
                  <FormularioArtistaEditar idArtista={selectedArtista != null ? selectedArtista : null} />
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>

      <Transition appear show={isOpenDelete} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={() => closeModal('delete')}>
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
                    Eliminar artista
                  </Dialog.Title>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      Deseja eliminar esta artista ?
                    </p>
                    <div className='w-full mt-6 flex flex-row gap-2 items-center justify-start'>
                      <button className="rounded-none bg-green-600 p-2 text-white mb-8 font-bold" onClick={async () => eliminarArtista(selectedArtista.idArtista)}>Sim</button>
                      <button className="rounded-none bg-red-600 p-2 text-white mb-8 font-bold" onClick={() => closeModal('delete')}>Não</button>
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
};