import { SubmitHandler, useForm } from "react-hook-form";
import Input from "../Input"

export default function FormularioVotante() {
  const { register, handleSubmit, formState: { errors } } = useForm()

  const onSubmit: SubmitHandler<any> = data => {
    alert(JSON.stringify(data));
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
      <div className="flex items-center justify-between flex-row">
        <Input name="email" type="email" label="Email" placeholder="Email" required register={register} />
        <Input name="telefone" type="tel" label="Telefone" placeholder="Telefone" required register={register} />
      </div>
      <p className="text-red-700">{errors.email ? "Insira o seu email por favor" : errors.telefone ? 'Insira o número de telefone' : null}</p>
      <button onClick={handleSubmit(onSubmit)} className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Inscrever-se</button>
    </>

  )
}
