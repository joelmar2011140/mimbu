import SingleEdicao from "@/components/Edicoes/SingleEdicao";
import useBlockChain from "@/hooks/useBlockchain";
import { StandardLayout } from "@/layouts/StandardLayout";
import { fetchEdicao } from "@/lib/fetch.functions";
import { useStoreActions } from "easy-peasy";
import { GetServerSidePropsContext } from "next";
import { useRouter } from "next/router";
import { useEffect } from "react";

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  const edicao = await fetchEdicao(ctx.params.idEdicao)
  console.log(ctx.req.cookies)
  if (ctx.req.cookies.jwt == null) {
    return {
      redirect: {
        permanent: true,
        destination: `/login`
      },
    }
  }
  return {
    props: { edicao }
  }
}

export default function SingleEdicaoPage({ edicao }: any) {
  const { blockChain } = useBlockChain()
  const clearAll = useStoreActions((accao: any) => accao.clearAll)
  const roteador = useRouter()

  useEffect(() => {
    if (blockChain.provider != null) {
      blockChain.provider.on('accountsChanged', async (contas: any) => {
        await fetch('http://localhost:3000/api/auth/logout', { method: 'DELETE' })
        clearAll()
        roteador.reload()
        return
      })
    }
  }, [blockChain, clearAll, roteador])

  return (
    <StandardLayout tituloDaPagina={`Edição ${edicao.nomeEdicao}`} descricao="Mimbu">
      <SingleEdicao edicao={edicao} />
    </StandardLayout>
  )
}
