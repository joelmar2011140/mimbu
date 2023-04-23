import { SubmitHandler, useForm } from 'react-hook-form'
import { LayoutForms } from "@/layouts/StandardLayout";
import Input from "@/components/Input";
import FormWrapper from "@/components/FormWrapper";
import { GetServerSidePropsContext } from 'next';
import { useStoreState, useStoreActions } from 'easy-peasy';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';
import useBlockChain from '@/hooks/useBlockchain';
import { useEffect } from 'react';
import { loginUser } from '@/lib/create.functions';

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  console.log(ctx.req.cookies)
  const jwt = ctx.req.cookies.jwt
  console.log(jwt)
  if (ctx.req.cookies.jwt != null) {
    return {
      redirect: {
        permanent: true,
        destination: `/`
      },
    }
  }
  return {
    props: {}
  }
}

export default function LoginPage() {
  const { register, handleSubmit } = useForm()
  const roteador = useRouter()
  const enderecoBlockChain = useStoreState((state: any) => state.enderecoBlockChain)
  const setEndereco = useStoreActions((accao: any) => accao.setEnderecoBlockchain)
  const clearAll = useStoreActions((accao: any) => accao.clearAll)
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
    try {
      let toSend = { ...data }
      if (enderecoBlockChain.length > 0) {
        toSend.enderecoBlockchain = enderecoBlockChain
        const incomingResponse = await loginUser(toSend)
        console.log(incomingResponse)
        if (incomingResponse.status === 401 || incomingResponse.status === 422) {
          return toast(incomingResponse.message, { type: 'error', position: 'bottom-right' })
        }
        toast(incomingResponse.message, { type: 'success', position: 'bottom-right' })
        return roteador.replace('/')
      }
    } catch (err: any) {
      console.error(err)
    }
  };

  return (
    <LayoutForms descricao="Página de login da mimbu" tituloDaPagina="Seja bem-vindo(a) à mimbu insere as tuas credenciais para começar a usar a mimbu">
      <FormWrapper descriptionText="Ainda não possui uma conta?" link="/registo" linkText="Registrar-se agora mesmo" onSubmit={handleSubmit(onSubmit)} >
        <h1 className="text-gray-600 text-center my-4 mb-4 font-bold text-4xl tracking-wide">Mimbu</h1>
        <p className="text-gray-600 text-center my-4 mb-4  tracking-wide">Insere as tuas credenciais e bora lá usar o Mimbu</p>
        <Input required register={register} name="email" type="email" label="Email" placeholder="Email" />
        <Input required register={register} name='senha' label="Palavra-passe" placeholder="Palavra-passe" type='password' />
        {
          (enderecoBlockChain === null || enderecoBlockChain.length === 0) ? (<button onClick={connectWallet} className="bg-indigo-500 text-white mr-4 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Conectar carteira</button>) : null
        }
        <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Iniciar a sessão</button>
      </FormWrapper>
    </LayoutForms>
  )
}
