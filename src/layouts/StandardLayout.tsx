import Head from "next/head";
import { IStandardLayout } from "@/global.types";
import { Header } from "@/components/Header";
import useBlockChain from "@/hooks/useBlockchain";

export function StandardLayout ({ children, descricao, tituloDaPagina }: IStandardLayout) {
  const titulo: string = `Mimbu - ${tituloDaPagina}`
  return (
    <>
      <Head>
        <meta charSet="utf-8" />
        <meta name="description" content={descricao} />
        <meta name="keywords" content="Concurso de música angolana, blockchain, segurança" />
        <title>{titulo}</title>
      </Head>
      <Header />
      <main>
        { children }
      </main>
    </>
  )
}

export function LayoutForms ({ children, descricao, tituloDaPagina }: IStandardLayout) {
  const titulo: string = `Mimbu - ${tituloDaPagina}`
  const { blockChain } = useBlockChain()

  console.log(blockChain)

  return (
    <>
      <Head>
        <meta charSet="utf-8" />
        <meta name="description" content={descricao} />
        <meta name="keywords" content="Concurso de música angolana, blockchain, segurança" />
        <title>{titulo}</title>
      </Head>
      <main>
        { children }
      </main>
    </>
  )
}