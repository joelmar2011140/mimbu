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
