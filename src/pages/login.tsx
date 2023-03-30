import { SubmitHandler, useForm } from 'react-hook-form'
import { LayoutForms } from "@/layouts/StandardLayout";
import Input from "@/components/Input";
import FormWrapper from "@/components/FormWrapper";

export default function LoginPage() {
  const { register, handleSubmit } = useForm()

  const onSubmit: SubmitHandler<any> = data => {
    alert(JSON.stringify(data));
  };

  return (
    <LayoutForms descricao="Página de login da mimbu" tituloDaPagina="Seja bem-vindo(a) à mimbu insere as tuas credenciais para começar a usar a mimbu">
      <FormWrapper descriptionText="Ainda não possui uma conta?" link="/registo" linkText="Registrar-se agora mesmo" onSubmit={handleSubmit(onSubmit)} >
        <h1 className="text-gray-600 text-center my-4 mb-4 font-bold text-4xl tracking-wide">Mimbu</h1>
        <p className="text-gray-600 text-center my-4 mb-4  tracking-wide">Insere as tuas credenciais e bora lá usar o Mimbu</p>
        <Input required register={register} name="email" type="email" label="Email" placeholder="Email" />
        <Input required register={register} name='senha' label="Palavra-passe" placeholder="Palavra-passe" type='password' />
        <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Iniciar a sessão</button>
      </FormWrapper>
    </LayoutForms>
  )
}
