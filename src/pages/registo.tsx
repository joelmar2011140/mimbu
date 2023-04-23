import { LayoutForms } from "@/layouts/StandardLayout";
import FormWrapper from "@/components/FormWrapper";
import Tabs from '@/components/Tabs';
import { GetServerSidePropsContext } from 'next';

export async function getServerSideProps (ctx: GetServerSidePropsContext) {
  console.log(ctx.req.cookies)
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

export default function RegistoPage() {

  return (
    <LayoutForms descricao="Página de registo da mimbu" tituloDaPagina="Seja bem-vindo(a) à mimbu preencha o formulário e comece a usar a mimbu">
      <FormWrapper descriptionText="Já possui uma conta?" link="/login" linkText="Fazer login">
        <h1 className="text-gray-600 text-center my-4 mb-4 font-bold text-4xl tracking-wide">Mimbu</h1>
        <p className="text-gray-600 text-center my-4 mb-4  tracking-wide">Olá 🤘 e seja bem-vindo(a) à Mimbu , faça o registo agora mesmo</p>
        <Tabs />
      </FormWrapper>
    </LayoutForms>
  )
}
