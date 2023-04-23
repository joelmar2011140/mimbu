import { SubmitHandler, useForm } from "react-hook-form";
import Input from "../Input"
import { fetchEdicoesUser, fetchEdicao } from "@/lib/fetch.functions";
import { useQuery } from "react-query";
import { useEffect, useState } from "react";
import { useStoreActions, useStoreState } from "easy-peasy";
import useBlockChain from "@/hooks/useBlockchain";
import { toast } from "react-toastify";
import axios from "axios";
import { useRouter } from "next/router";

export default function FormularioArtista() {
  const roteador = useRouter()
  const [idEdicao, setIdEdicao] = useState('')
  const [errObj, setObject] = useState({ isLoading: false, errMsg: '' })
  const { blockChain } = useBlockChain()
  const setEndereco = useStoreActions((accao: any) => accao.setEnderecoBlockchain)
  const clearAll = useStoreActions((accao: any) => accao.clearAll)
  const enderecoBlockChain = useStoreState((state: any) => state.enderecoBlockChain)
  const { register, handleSubmit, formState: { errors } } = useForm()
  const { data, isLoading } = useQuery('edicoes', fetchEdicoesUser)
  const rawCate = useQuery(['edicao', idEdicao], () => fetchEdicao(idEdicao))

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

  const onSubmit: SubmitHandler<any> = async (data, e) => {
    e?.preventDefault()
    const formData = new FormData()
    formData.append('imagemPerfil', data.imagem[0])
    formData.append('nomeArtistico', data.nomeArtistico)
    formData.append('dataNascimento', data.dataNascimento)
    formData.append('genero', data.genero)
    formData.append('nomeProvincia', data.provincia)
    formData.append('nomeDistrito', data.distrito)
    formData.append('nomeMunicipio', data.municipio)
    formData.append('nomeBairro', data.bairro)
    formData.append('nomeRua', data.rua)
    formData.append('titulo', data.tituloMusica)
    formData.append('link_musica', data.linkMusica)
    formData.append('ano_gravacao', data.anoGravacao)
    formData.append('nomeGenero', data.generoMusica)
    formData.append('idEdicao', idEdicao)
    formData.append('idCategoria', data.categoria)
    formData.append('enderecoBlockchain', enderecoBlockChain)
    formData.append('senha', data.senha)
    formData.append('email', data.email)
    formData.append('telefone', data.telefone)
    try {
      if (enderecoBlockChain.length > 0) {
        const incomingResponse = await axios.post('http://localhost:3000/api/artistas', formData)
        setObject({ isLoading: false, errMsg: '' })
        registarArtistaBlockChain(enderecoBlockChain, data.nomeArtistico, data.categoria)
        toast(incomingResponse.data.message, { type: 'success', position: 'bottom-right' })
        return roteador.replace('/')
      }
    } catch (err: any) {
      console.error(err)
      if (err.name === 'AxiosError') {
        toast(err.response.data.message, { type: 'error', position: 'bottom-right' })
        return
      }
    }
  }

  function connectWallet(e: any) {
    e?.preventDefault()
    if (enderecoBlockChain.length === 0 && blockChain.provider != null) {
      blockChain.provider.request({ method: 'eth_requestAccounts' }).then((conta: any) => {
        console.log(conta)
        setEndereco(conta[0])
      }).catch((err: any) => {
        console.error('Erro aqui ', err)
        clearAll()
        if (err.code === '-32002') {
          return toast('Deve conectar à sua carteira à aplicação', { type: 'error', position: 'bottom-right' })
        } else if (err.code === '4001') {
          return toast('Deve conectar à sua carteira à aplicação', { type: 'error', position: 'bottom-right' })
        }
      })
      blockChain.provider.on('accountsChanged', (contas: any) => {
        if (contas.length === 0) {
          clearAll()
          return
        }
        setEndereco(contas[0])
      })
    }
  }

  useEffect(() => {
    if (blockChain.provider != null) {
      // Solicitar conta
      if (enderecoBlockChain.length) {
        blockChain.provider.request({ method: 'eth_requestAccounts' }).then((conta: any) => {
          console.log(conta)
          setEndereco(conta[0])
        }).catch((err: any) => {
          clearAll()
          console.error('Erro aqui ', err)
          if (err.code === '-32002') {
            return toast('Deve conectar à sua carteira à aplicação', { type: 'error', position: 'bottom-right' })
          } else if (err.code === '4001') {
            return toast('Deve conectar à sua carteira à aplicação', { type: 'error', position: 'bottom-right' })
          }
        })
        blockChain.provider.on('accountsChanged', (contas: any) => {
          if (contas.length === 0) {
            clearAll()
            return
          }
          setEndereco(contas[0])
        })
      }
    }
  }, [enderecoBlockChain, blockChain])

  return (
    <>
      <Input name="nomeArtistico" type="text" label="Nome artístico" placeholder="Nome artístico" required register={register} />
      <p className="text-red-700">{errors.nomeArtistico ? "Insira o seu nome artístico por favor" : null}</p>
      <Input name="dataNascimento" type="date" label="Data de nascimento" placeholder="Data de nascimento" required register={register} />
      <p className="text-red-700">{errors.dataNascimento ? "Insira a sua data de nascimento por favor" : null}</p>
      <label htmlFor='genero' className="mb-2 text-lg font-medium">Seleccione o genero</label>
      <select id='genero' required {...register('genero', { required: true })} className=" block appearance-none w-full bg-white hover:border-gray-500 pr-8 shadow leading-tight focus:shadow-outline  border-2 border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:border-blue-500">
        <option value='masculino'>Masculino</option>
        <option value='feminino'>Feminino</option>
      </select>
      <p className="text-red-700">{errors.genero ? "Seleccione um género por favor" : null}</p>
      <Input name="imagem" type="file" register={register} required label="Imagem de perfil" placeholder="Imagem de perfil" />
      <p className="text-red-700">{errors.imagem ? "Insira uma imagem de perfil por favor" : null}</p>
      <div className="flex items-center justify-between flex-row">
        <Input name="provincia" type="text" label="Provincia" placeholder="Provincia" required register={register} />
        <Input name="bairro" type="text" label="Bairro" placeholder="Bairro" required register={register} />
      </div>
      <p className="text-red-700">{errors.provincia ? "Insira o nome da provincia por favor" : errors.bairro ? 'Insira o nome do bairro' : null}</p>
      <Input name="municipio" type="text" label="Município" placeholder="Município" required register={register} />
      <p className="text-red-700">{errors.rua ? "Insira o nome da rua por favor" : null}</p>
      <Input name="rua" type="text" label="Rua" placeholder="Rua" required register={register} />
      <p className="text-red-700">{errors.rua ? "Insira o nome da rua por favor" : null}</p>
      <Input name="distrito" type="text" label="Distrito" placeholder="Distrito" required register={register} />
      <p className="text-red-700">{errors.distrito ? "Insira o nome do distrito por favor" : null}</p>
      <div className="flex items-center justify-between flex-row">
        <Input name="tituloMusica" type="text" label="Titulo da música" placeholder="Titulo da música" required register={register} />
        <Input name="linkMusica" type="link" label="Link da música" placeholder="Link da música" required register={register} />
      </div>
      <p className="text-red-700">{errors.tituloMusica ? "Insira o titulo da música por favor" : errors.linkMusica ? 'Insira o link da música' : null}</p>
      <div className="flex items-center justify-between flex-row">
        <Input name="anoGravacao" type="number" label="Ano de gravação" placeholder="Ano de gravação" required register={register} />
        <Input name="generoMusica" type="text" label="Gênero da música" placeholder="Gênero da música" required register={register} />
      </div>
      <p className="text-red-700">{errors.anoGravacao ? "Insira o ano de gravação da música por favor" : errors.generoMusica ? 'Insira o gênero da música' : null}</p>
      <label htmlFor='edicao' className="mb-2 text-lg font-medium">Seleccione uma edição</label>
      <select id='edicao' {...register('edicao', { required: true })} onChange={(e) => setIdEdicao(e.target.value)} className=" block appearance-none w-full bg-white hover:border-gray-500 pr-8 shadow leading-tight focus:shadow-outline  border-2 border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:border-blue-500">
        <option value="" disabled>Selecione uma edição</option>
        {
          (data != null) ? data.map((edicao: any) => (<option key={edicao.idEdicao} value={edicao.idEdicao}>{edicao.nomeEdicao}</option>)) : null
        }
      </select>
      <p className="text-red-700">{errors.categoria ? "Seleccione uma edição por favor" : null}</p>
      <label htmlFor='categoria' className="mb-2 text-lg font-medium">Seleccione uma categoria</label>
      <select id='categoria'  {...register('categoria', { required: true })} className=" block appearance-none w-full bg-white hover:border-gray-500 pr-8 shadow leading-tight focus:shadow-outline  border-2 border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:border-blue-500">
        <option value="" disabled>Selecione uma categoria</option>
        {
          (idEdicao.length > 0 && rawCate.data != null) ? rawCate.data.categoria.map((categoria: any) => (<option key={categoria.idCategoria} value={categoria.idCategoria}>{categoria.nomeCategoria}</option>)) : null
        }
      </select>
      <p className="text-red-700">{errors.categoria ? "Seleccione uma categoria por favor" : null}</p>
      <div className="flex items-center justify-between flex-row">
        <Input name="email" type="email" label="Email" placeholder="Email" required register={register} />
        <Input name="telefone" type="tel" label="Telefone" placeholder="Telefone" required register={register} />
      </div>
      <p className="text-red-700">{errors.email ? "Insira o seu email por favor" : errors.telefone ? 'Insira o número de telefone' : null}</p>
      <Input name="senha" type="password" label="Palavra-passe" placeholder="Palavra-passe" required register={register} />
      <p className="text-red-700">{errors.senha ? "Insira uma senha por favor" : null}</p>
      {
        (enderecoBlockChain === null || enderecoBlockChain.length === 0) ? (<button onClick={connectWallet} className="bg-indigo-500 text-white mr-4 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Conectar carteira</button>) : null
      }
      <button onClick={handleSubmit(onSubmit)} className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Inscrever-se</button>
    </>

  )
}
