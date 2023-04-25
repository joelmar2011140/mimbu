import React, { useState, Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react'
import { AiOutlineArrowLeft, AiOutlineArrowRight } from 'react-icons/ai'
import { useQuery } from 'react-query';
import { fetchEdicoesParam, fetchNoticiasParam, fetchVotantesParam } from '@/lib/fetch.functions';
import Link from 'next/link';
import { showPath } from './Disclosure/Disclosure';
import { BsPencil } from 'react-icons/bs';
import { RiDeleteBin6Line } from 'react-icons/ri'
import FormularioEdicao, { FormularioEdicaoEditar, FormularioNoticia, FormularioNoticiaEditar } from './formularios/FormularioEdicao';
import { useRouter } from 'next/router';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useStoreState } from 'easy-peasy';

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
                            <Link className='underline' href={`/panel/edicoes/${edicao.idEdicao}`}>{edicao.nomeEdicao}</Link>
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
      if (setSelectedNoticia != null) {
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