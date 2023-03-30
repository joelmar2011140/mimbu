import { SubmitHandler, useForm } from 'react-hook-form'
import { LayoutForms } from "@/layouts/StandardLayout";
import Input from "@/components/Input";
import FormWrapper from "@/components/FormWrapper";
import Tabs from '@/components/Tabs';

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
