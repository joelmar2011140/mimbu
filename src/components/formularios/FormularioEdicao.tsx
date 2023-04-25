import { SubmitHandler, useForm } from "react-hook-form";
import Input from "../Input"
import { fetchCategorias } from "@/lib/fetch.functions";
import { useQuery } from "react-query";
import { useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { useRouter } from "next/router";
import Select from 'react-select'

export default function FormularioEdicao() {
  const roteador = useRouter()
  const [errObj, setObject] = useState({ isLoading: false, errMsg: '' })
  const { register, handleSubmit, formState: { errors } } = useForm()
  const { data } = useQuery('categorias', fetchCategorias)
  const [categorias, setCategorias] = useState([])
  const filteredCate = data != null ? data.data.map((categoria: any) => ({ label: categoria.nomeCategoria, value: categoria.idCategoria })) : []

  const onSubmit: SubmitHandler<any> = async (data, e) => {
    e?.preventDefault()
    const formData = new FormData()
    if (categorias.length > 0) {
      formData.append('capa', data.capa[0])
      formData.append('dataComeco', data.dataComeco)
      formData.append('dataComeco', data.dataComeco)
      formData.append('dataTermino', data.dataTermino)
      formData.append('nomeEdicao', data.nomeEdicao)
      formData.append('categorias', JSON.stringify(categorias.map((cat: any) => (cat.value))))
    }
    try {
      const incomingResponse = await axios.post('http://localhost:3000/api/edicoes', formData)
      setObject({ isLoading: false, errMsg: '' })
      toast(incomingResponse.data.message, { type: 'success', position: 'bottom-right' })
      return roteador.reload()
    } catch (err: any) {
      console.error(err)
      if (err.name === 'AxiosError') {
        toast(err.response.data.message, { type: 'error', position: 'bottom-right' })
        return
      }
    }
  }

  return (
    <>
      <Input name="nomeEdicao" type="text" label="Título da edição" placeholder="Título da edição" register={register} />
      <p className="text-red-700">{errors.nomeEdicao ? "Insira o título desta edição por favor" : null}</p>
      <div className="flex items-center justify-between flex-row">
        <Input name="dataComeco" type="date" label="Data começo" placeholder="Data começo" register={register} />
        <Input name="dataTermino" type="date" label="Data término" placeholder="Data término" register={register} />
      </div>
      <p className="text-red-700">{errors.dataComeco ? "Insira a data de início das votações" : errors.dataTermino ? 'Insira a data de fim das votações' : null}</p>
      <Input name="capa" type="file" register={register} label="Capa do evento" placeholder="Capa do evento" />
      <p className="text-red-700">{errors.imagem ? "Insira uma capa para o evento por favor" : null}</p>
      <label htmlFor='genero' className="mb-2 text-lg font-medium">Seleccione a categoria</label>
      <Select className="mb-16" isMulti options={filteredCate} placeholder='Selecionar categorias' onChange={(e) => setCategorias(e as any)} />
      <button onClick={handleSubmit(onSubmit)} className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Adicionar uma edição</button>
    </>

  )
}

export function FormularioNoticia() {
  const roteador = useRouter()
  const [errObj, setObject] = useState({ isLoading: false, errMsg: '' })
  const { register, handleSubmit, formState: { errors } } = useForm()

  const onSubmit: SubmitHandler<any> = async (data, e) => {
    e?.preventDefault()
    const formData = new FormData()
    formData.append('imagemDaNoticia', data.imagemDaNoticia[0])
    formData.append('tituloDaNoticia', data.tituloDaNoticia)
    formData.append('dataDaNoticia', data.dataDaNoticia)
    formData.append('conteudo', data.dataTermino)
    try {
      const incomingResponse = await axios.post('http://localhost:3000/api/noticias', formData)
      setObject({ isLoading: false, errMsg: '' })
      toast(incomingResponse.data.message, { type: 'success', position: 'bottom-right' })
      return roteador.reload()
    } catch (err: any) {
      console.error(err)
      if (err.name === 'AxiosError') {
        toast(err.response.data.message, { type: 'error', position: 'bottom-right' })
        return
      }
    }
  }

  return (
    <>
      <Input name="tituloDaNoticia" type="text" label="Título da notícia" placeholder="Título da notícia" register={register} />
      <p className="text-red-700">{errors.tituloDaNoticia ? "Insira o título desta notícia por favor" : null}</p>
      <Input name="dataDaNoticia" type="date" label="Data da notícia" placeholder="Data da notícia" register={register} />
      <p className="text-red-700">{errors.dataDaNoticia ? "Insira a data desta notícia" : null}</p>
      <Input name="imagemDaNoticia" type="file" register={register} label="Imagem da notícia" placeholder="Imagem da notícia" />
      <p className="text-red-700">{errors.imagemDaNoticia ? "Insira uma imagem para esta notícia por favor" : null}</p>
      <button onClick={handleSubmit(onSubmit)} className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Adicionar uma notícia</button>
    </>

  )
}

export function FormularioCategoria() {
  const roteador = useRouter()
  const [errObj, setObject] = useState({ isLoading: false, errMsg: '' })
  const { register, handleSubmit, formState: { errors } } = useForm()

  const onSubmit: SubmitHandler<any> = async (data, e) => {
    e?.preventDefault()
    try {
      const incomingResponse = await axios.post('http://localhost:3000/api/categorias', data)
      setObject({ isLoading: false, errMsg: '' })
      toast(incomingResponse.data.message, { type: 'success', position: 'bottom-right' })
      return roteador.reload()
    } catch (err: any) {
      console.error(err)
      if (err.name === 'AxiosError') {
        toast(err.response.data.message, { type: 'error', position: 'bottom-right' })
        return
      }
    }
  }

  return (
    <>
      <Input name="nomeCategoria" type="text" label="Nome da categoria" placeholder="Nome da categoria" register={register} />
      <p className="text-red-700">{errors.nomeCategoria ? "Insira o nome desta categoria por favor" : null}</p>
      <button onClick={handleSubmit(onSubmit)} className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Adicionar uma categoria</button>
    </>

  )
}

export function FormularioEditarCategoria({ idCategoria }: any) {
  const roteador = useRouter()
  const [errObj, setObject] = useState({ isLoading: false, errMsg: '' })
  const { register, handleSubmit, formState: { errors } } = useForm()

  const onSubmit: SubmitHandler<any> = async (data, e) => {
    e?.preventDefault()
    try {
      const incomingResponse = await axios.put(`http://localhost:3000/api/categorias/${idCategoria.idCategoria}`, data)
      setObject({ isLoading: false, errMsg: '' })
      toast(incomingResponse.data.message, { type: 'success', position: 'bottom-right' })
      return roteador.reload()
    } catch (err: any) {
      console.error(err)
      if (err.name === 'AxiosError') {
        toast(err.response.data.message, { type: 'error', position: 'bottom-right' })
        return
      }
    }
  }

  return (
    <>
      <Input name="nomeCategoria" type="text" label="Nome da categoria" placeholder="Nome da categoria" register={register} />
      <p className="text-red-700">{errors.nomeCategoria ? "Insira o nome desta categoria por favor" : null}</p>
      <button onClick={handleSubmit(onSubmit)} className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Editar uma categoria</button>
    </>

  )
}


export function FormularioNoticiaEditar({ idEdicao }: any) {
  const roteador = useRouter()
  const [errObj, setObject] = useState({ isLoading: false, errMsg: '' })
  const { register, handleSubmit, formState: { errors } } = useForm()

  const onSubmit: SubmitHandler<any> = async (data, e) => {
    e?.preventDefault()
    const formData = new FormData()
    try {
      if (data.imagemDaNoticia.length > 0) {
        formData.append('imagemDaNoticia', data.imagemDaNoticia[0])
        if (idEdicao != null) {
          const incomingResponse = await axios.patch(`http://localhost:3000/api/noticias/${idEdicao.idEdicao}`, formData)
          setObject({ isLoading: false, errMsg: '' })
          toast(incomingResponse.data.message, { type: 'success', position: 'bottom-right' })
          return roteador.reload()
        }
      } if (data.dataDaNoticia.length > 0) {
        formData.append('dataDaNoticia', data.dataDaNoticia)
        if (idEdicao != null) {
          const incomingResponse = await axios.patch(`http://localhost:3000/api/noticias/${idEdicao.idEdicao}`, formData)
          setObject({ isLoading: false, errMsg: '' })
          toast(incomingResponse.data.message, { type: 'success', position: 'bottom-right' })
          return roteador.reload()
        }
      } if (data.tituloDaNoticia.length > 0) {
        formData.append('tituloDaNoticia', data.dataTermino)
        if (idEdicao != null) {
          const incomingResponse = await axios.patch(`http://localhost:3000/api/noticias/${idEdicao.idEdicao}`, formData)
          setObject({ isLoading: false, errMsg: '' })
          toast(incomingResponse.data.message, { type: 'success', position: 'bottom-right' })
          return roteador.reload()
        }
      } if (data.tituloDaNoticia.length > 0) {
        formData.append('tituloDaNoticia', data.tituloDaNoticia)
        if (idEdicao != null) {
          const incomingResponse = await axios.patch(`http://localhost:3000/api/noticias/${idEdicao.idEdicao}`, formData)
          setObject({ isLoading: false, errMsg: '' })
          toast(incomingResponse.data.message, { type: 'success', position: 'bottom-right' })
          return roteador.reload()
        }
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
    <>
      <Input name="tituloDaNoticia" type="text" label="Título da notícia" placeholder="Título da notícia" register={register} />
      <p className="text-red-700">{errors.tituloDaNoticia ? "Insira o título desta notícia por favor" : null}</p>
      <Input name="dataDaNoticia" type="date" label="Data da notícia" placeholder="Data da notícia" register={register} />
      <p className="text-red-700">{errors.dataDaNoticia ? "Insira a data desta notícia" : null}</p>
      <Input name="imagemDaNoticia" type="file" register={register} label="Imagem da notícia" placeholder="Imagem da notícia" />
      <p className="text-red-700">{errors.imagemDaNoticia ? "Insira uma imagem para esta notícia por favor" : null}</p>
      <button onClick={handleSubmit(onSubmit)} className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Editar uma notícia</button>
    </>

  )
}

export function FormularioEdicaoEditar({ idEdicao }: any) {
  console.log(idEdicao)
  const roteador = useRouter()
  const [errObj, setObject] = useState({ isLoading: false, errMsg: '' })
  const { register, handleSubmit, formState: { errors } } = useForm()
  const { data } = useQuery('categorias', fetchCategorias)
  const [categorias, setCategorias] = useState([])
  const filteredCate = data != null ? data.data.map((categoria: any) => ({ label: categoria.nomeCategoria, value: categoria.idCategoria })) : []

  const onSubmit: SubmitHandler<any> = async (data, e) => {
    e?.preventDefault()
    const formData = new FormData()
    try {
      if (data.capa.length > 0) {
        formData.append('capa', data.capa[0])
        if (idEdicao != null) {
          const incomingResponse = await axios.patch(`http://localhost:3000/api/edicoes/${idEdicao.idEdicao}`, formData)
          setObject({ isLoading: false, errMsg: '' })
          toast(incomingResponse.data.message, { type: 'success', position: 'bottom-right' })
          return roteador.reload()
        }
      } if (categorias.length > 0) {
        formData.append('categorias', JSON.stringify(categorias.map((cat: any) => (cat.value))))
        if (idEdicao != null) {
          const incomingResponse = await axios.patch(`http://localhost:3000/api/edicoes/${idEdicao.idEdicao}`, formData)
          setObject({ isLoading: false, errMsg: '' })
          toast(incomingResponse.data.message, { type: 'success', position: 'bottom-right' })
          return roteador.reload()
        }
      } if (data.dataComeco.length > 0) {
        formData.append('dataComeco', data.dataComeco)
        if (idEdicao != null) {
          const incomingResponse = await axios.patch(`http://localhost:3000/api/edicoes/${idEdicao.idEdicao}`, formData)
          setObject({ isLoading: false, errMsg: '' })
          toast(incomingResponse.data.message, { type: 'success', position: 'bottom-right' })
          return roteador.reload()
        }
      } if (data.dataTermino.length > 0) {
        formData.append('dataTermino', data.dataTermino)
        if (idEdicao != null) {
          const incomingResponse = await axios.patch(`http://localhost:3000/api/edicoes/${idEdicao.idEdicao}`, formData)
          setObject({ isLoading: false, errMsg: '' })
          toast(incomingResponse.data.message, { type: 'success', position: 'bottom-right' })
          return roteador.reload()
        }
      } if (data.nomeEdicao.length > 0) {
        formData.append('nomeEdicao', data.nomeEdicao)
        if (idEdicao != null) {
          const incomingResponse = await axios.patch(`http://localhost:3000/api/edicoes/${idEdicao.idEdicao}`, formData)
          setObject({ isLoading: false, errMsg: '' })
          toast(incomingResponse.data.message, { type: 'success', position: 'bottom-right' })
          return roteador.reload()
        }
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
    <>
      <Input name="nomeEdicao" type="text" label="Título da edição" placeholder="Título da edição" register={register} />
      <p className="text-red-700">{errors.nomeEdicao ? "Insira o título desta edição por favor" : null}</p>
      <div className="flex items-center justify-between flex-row">
        <Input name="dataComeco" type="date" label="Data começo" placeholder="Data começo" register={register} />
        <Input name="dataTermino" type="date" label="Data término" placeholder="Data término" register={register} />
      </div>
      <p className="text-red-700">{errors.dataComeco ? "Insira a data de início das votações" : errors.dataTermino ? 'Insira a data de fim das votações' : null}</p>
      <Input name="capa" type="file" register={register} label="Capa do evento" placeholder="Capa do evento" />
      <p className="text-red-700">{errors.imagem ? "Insira uma capa para o evento por favor" : null}</p>
      <label htmlFor='genero' className="mb-2 text-lg font-medium">Seleccione a categoria</label>
      <Select className="mb-16" isMulti options={filteredCate} placeholder='Selecionar categorias' onChange={(e) => setCategorias(e as any)} />
      <button onClick={handleSubmit(onSubmit)} className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Editar uma edição</button>
    </>

  )
}


export function FormularioArtistaEditar({ idArtista }: any) {
  const roteador = useRouter()
  const [errObj, setObject] = useState({ isLoading: false, errMsg: '' })
  const { register, handleSubmit, formState: { errors } } = useForm()
  const { data } = useQuery('categorias', fetchCategorias)

  const onSubmit: SubmitHandler<any> = async (data, e) => {
    e?.preventDefault()
    const formData = new FormData()
    try {
      if (data.imagemPerfil.length > 0) {
        formData.append('imagemPerfil', data.imagemPerfil[0])
        if (idArtista != null) {
          const incomingResponse = await axios.patch(`http://localhost:3000/api/artistas/${idArtista.idArtista}`, formData)
          setObject({ isLoading: false, errMsg: '' })
          toast(incomingResponse.data.message, { type: 'success', position: 'bottom-right' })
          return roteador.reload()
        }
      } if (data.dataNascimento.length > 0) {
        formData.append('dataNascimento', data.dataNascimento)
        if (idArtista != null) {
          const incomingResponse = await axios.patch(`http://localhost:3000/api/artistas/${idArtista.idArtista}`, formData)
          setObject({ isLoading: false, errMsg: '' })
          toast(incomingResponse.data.message, { type: 'success', position: 'bottom-right' })
          return roteador.reload()
        }
      } if (data.telefone.length > 0) {
        formData.append('telefone', data.telefone)
        if (idArtista != null) {
          const incomingResponse = await axios.patch(`http://localhost:3000/api/artistas/${idArtista.idArtista}`, formData)
          setObject({ isLoading: false, errMsg: '' })
          toast(incomingResponse.data.message, { type: 'success', position: 'bottom-right' })
          return roteador.reload()
        }
      } if (data.nomeProvincia.length > 0) {
        formData.append('nomeProvincia', data.nomeProvincia)
        if (idArtista != null) {
          const incomingResponse = await axios.patch(`http://localhost:3000/api/artistas/${idArtista.idArtista}`, formData)
          setObject({ isLoading: false, errMsg: '' })
          toast(incomingResponse.data.message, { type: 'success', position: 'bottom-right' })
          return roteador.reload()
        }
      } if (data.nomeMunicipio.length > 0) {
        formData.append('nomeMunicipio', data.nomeMunicipio)
        if (idArtista != null) {
          const incomingResponse = await axios.patch(`http://localhost:3000/api/artistas/${idArtista.idArtista}`, formData)
          setObject({ isLoading: false, errMsg: '' })
          toast(incomingResponse.data.message, { type: 'success', position: 'bottom-right' })
          return roteador.reload()
        }
      } if (data.nomeDistrito.length > 0) {
        formData.append('nomeDistrito', data.nomeDistrito)
        if (idArtista != null) {
          const incomingResponse = await axios.patch(`http://localhost:3000/api/artistas/${idArtista.idArtista}`, formData)
          setObject({ isLoading: false, errMsg: '' })
          toast(incomingResponse.data.message, { type: 'success', position: 'bottom-right' })
          return roteador.reload()
        }
      } if (data.nomeBairro.length > 0) {
        formData.append('nomeBairro', data.nomeDistrito)
        if (idArtista != null) {
          const incomingResponse = await axios.patch(`http://localhost:3000/api/artistas/${idArtista.idArtista}`, formData)
          setObject({ isLoading: false, errMsg: '' })
          toast(incomingResponse.data.message, { type: 'success', position: 'bottom-right' })
          return roteador.reload()
        }
      } if (data.nomeArtistico.length > 0) {
        formData.append('nomeArtistico', data.nomeArtistico)
        if (idArtista != null) {
          const incomingResponse = await axios.patch(`http://localhost:3000/api/artistas/${idArtista.idArtista}`, formData)
          setObject({ isLoading: false, errMsg: '' })
          toast(incomingResponse.data.message, { type: 'success', position: 'bottom-right' })
          return roteador.reload()
        }
      } if (data.nomeRua.length > 0) {
        formData.append('nomeRua', data.nomeRua)
        if (idArtista != null) {
          const incomingResponse = await axios.patch(`http://localhost:3000/api/artistas/${idArtista.idArtista}`, formData)
          setObject({ isLoading: false, errMsg: '' })
          toast(incomingResponse.data.message, { type: 'success', position: 'bottom-right' })
          return roteador.reload()
        }
      } if (data.email.length > 0) {
        formData.append('email', data.email)
        if (idArtista != null) {
          const incomingResponse = await axios.patch(`http://localhost:3000/api/artistas/${idArtista.idArtista}`, formData)
          setObject({ isLoading: false, errMsg: '' })
          toast(incomingResponse.data.message, { type: 'success', position: 'bottom-right' })
          return roteador.reload()
        }
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
    <>
      <Input name="nomeArtistico" type="text" label="Nome Artístico" placeholder="Nome Artístico" register={register} />
      <p className="text-red-700">{errors.nomeArtistico ? "Insira o nome artístico por favor" : null}</p>
      <Input name="dataNascimento" type="date" label="Data de nascimento" placeholder="Data de nascimento" register={register} />
      <p className="text-red-700">{errors.dataNascimento ? "Insira a data de nascimento" : null}</p>
      <Input name="nomeProvincia" type="text" label="Província" placeholder="Província" register={register} />
      <p className="text-red-700">{errors.nomeProvincia ? "Insira o nome da província" : null}</p>
      <Input name="nomeMunicipio" type="text" label="Munícipio" placeholder="Munícipio" register={register} />
      <p className="text-red-700">{errors.nomeMunicipio ? "Insira o nome do munícipio" : null}</p>
      <Input name="nomeDistrito" type="text" label="Distrito" placeholder="Distrito" register={register} />
      <p className="text-red-700">{errors.nomeDistrito ? "Insira o nome do distrito" : null}</p>
      <Input name="nomeBairro" type="text" label="Bairro" placeholder="Bairro" register={register} />
      <p className="text-red-700">{errors.nomeBairro ? "Insira o nome do bairro" : null}</p>
      <Input name="nomeRua" type="text" label="Rua" placeholder="Rua" register={register} />
      <p className="text-red-700">{errors.nomeRua ? "Insira o nome da rua" : null}</p>
      <Input name="email" type="email" label="Email" placeholder="Email" register={register} />
      <p className="text-red-700">{errors.email ? "Insira o email" : null}</p>
      <Input name="telefone" type="email" label="Telefone" placeholder="Telefone" register={register} />
      <p className="text-red-700">{errors.telefone ? "Insira o telefone" : null}</p>
      <Input name="imagemPerfil" type="file" register={register} label="Imagem de perfil" placeholder="Imagem de perfil" />
      <p className="text-red-700">{errors.imagem ? "Insira uma capa para o evento por favor" : null}</p>

      <button onClick={handleSubmit(onSubmit)} className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Editar um artista</button>
    </>

  )
}
