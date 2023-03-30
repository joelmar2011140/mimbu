import { SubmitHandler, useForm } from "react-hook-form";
import Input from "../Input"

export default function FormularioArtista() {
  const { register, handleSubmit, formState: { errors } } = useForm()

  const onSubmit: SubmitHandler<any> = data => {
    alert(JSON.stringify(data));
  };

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
      <select id='edicao' {...register('edicao', { required: true })} className=" block appearance-none w-full bg-white hover:border-gray-500 pr-8 shadow leading-tight focus:shadow-outline  border-2 border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:border-blue-500">
        <option value='masculino'>Masculino</option>
        <option value='feminino'>Feminino</option>
      </select>
      <p className="text-red-700">{errors.categoria ? "Seleccione uma edição por favor" : null}</p>
      <label htmlFor='categoria' className="mb-2 text-lg font-medium">Seleccione uma categoria</label>
      <select id='categoria'  {...register('categoria', { required: true })}  className=" block appearance-none w-full bg-white hover:border-gray-500 pr-8 shadow leading-tight focus:shadow-outline  border-2 border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:border-blue-500">
        <option value='masculino'>Masculino</option>
        <option value='feminino'>Feminino</option>
      </select>
      <p className="text-red-700">{errors.categoria ? "Seleccione uma categoria por favor" : null}</p>
      <div className="flex items-center justify-between flex-row">
        <Input name="email" type="email" label="Email" placeholder="Email" required register={register} />
        <Input name="telefone" type="tel" label="Telefone" placeholder="Telefone" required register={register} />
      </div>
      <p className="text-red-700">{errors.email ? "Insira o seu email por favor" : errors.telefone ? 'Insira o número de telefone' : null}</p>
      <Input name="senha" type="password" label="Palavra-passe" placeholder="Palavra-passe" required register={register} />
      <p className="text-red-700">{errors.senha ? "Insira uma senha por favor" : null}</p>
      <button onClick={handleSubmit(onSubmit)} className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Inscrever-se</button>
    </>

  )
}
