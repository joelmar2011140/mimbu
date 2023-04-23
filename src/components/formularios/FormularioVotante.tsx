import { SubmitHandler, useForm } from "react-hook-form";
import Input from "../Input"
import { registarVotante } from "@/lib/create.functions";
import { toast } from 'react-toastify'
import useBlockChain from "@/hooks/useBlockchain";
import { useEffect, useState } from "react";
import { useStoreActions, useStoreState } from "easy-peasy";
import { useRouter } from "next/router";

export default function FormularioVotante() {
  const roteador = useRouter()
  const votante = useStoreState((state: any) => state.votante)
  const enderecoBlockChain = useStoreState((state: any) => state.enderecoBlockChain)
  const setEndereco = useStoreActions((accao: any) => accao.setEnderecoBlockchain)
  const clearAll = useStoreActions((accao: any) => accao.clearAll)
  const [errObj, setObject] = useState({ isLoading: false, errMsg: '' })
  const { register, handleSubmit, formState: { errors } } = useForm()
  const { blockChain } = useBlockChain()

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

  const onSubmit: SubmitHandler<any> = async (data, e) => {
    e?.preventDefault()
    setObject({ isLoading: true, errMsg: '' })
    try {
      let toSend = { ...data }
      if (enderecoBlockChain.length > 0) {
        toSend.enderecoBlockchain = enderecoBlockChain
        const incomingResponse = await registarVotante(toSend)
        console.log(incomingResponse)
        if (incomingResponse.status === 400 || incomingResponse.status === 409) {
          setObject({ isLoading: false, errMsg: '' })
          return toast(incomingResponse.message, { type: 'error', position: 'bottom-right' })
        }
        setObject({ isLoading: false, errMsg: '' })
        toast(incomingResponse.message, { type: 'success', position: 'bottom-right' })
        return roteador.replace('/')
      }
    } catch (err: any) {
      console.error(err)
    }
  };

  return (
    <>
      <Input name="bilheteDeIdentidade" type="text" label="Bilhete de identidade" placeholder="Bilhete de identidade" required register={register} />
      <p className="text-red-700">{errors.bilheteDeIdentidade ? "Insira o número de Bilhete de identidade por favor" : null}</p>
      <div className="flex items-center justify-between flex-row">
        <Input name="provincia" type="text" label="Provincia" placeholder="Provincia" required register={register} />
        <Input name="municipio" type="text" label="Muncípio" placeholder="Muncípio" required register={register} />
      </div>
      <p className="text-red-700">{errors.provincia ? "Insira o nome da provincia por favor" : errors.municipio ? 'Insira o nome do munícpio' : null}</p>
      <div className="flex items-center justify-between flex-row">
        <Input name="distrito" type="text" label="Distrito" placeholder="Distrito" required register={register} />
        <Input name="bairro" type="text" label="Bairro" placeholder="Bairro" required register={register} />
      </div>
      <p className="text-red-700">{errors.distrito ? "Insira o nome do distrito por favor" : errors.bairro ? 'Insira o nome do bairro' : null}</p>
      <Input name="rua" type="text" label="Rua" placeholder="Rua" required register={register} />
      <p className="text-red-700">{errors.rua ? "Insira o nome da rua por favor" : null}</p>
      <Input name="email" type="email" label="Email" placeholder="Email" required register={register} />
      <p className="text-red-700">{errors.email ? "Insira o seu email por favor" : errors.telefone ? 'Insira o número de telefone' : null}</p>
      {
        (enderecoBlockChain === null || enderecoBlockChain.length === 0) ? (<button onClick={connectWallet} className="bg-indigo-500 text-white mr-4 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Conectar carteira</button>) : null
      }
      <button disabled={(enderecoBlockChain === null || enderecoBlockChain.length === 0) || errObj.isLoading} onClick={handleSubmit(onSubmit)} className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Inscrever-se</button>
    </>

  )
}
