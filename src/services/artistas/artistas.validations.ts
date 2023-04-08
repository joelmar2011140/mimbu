import Joi from "joi";

export const validarRegistoArtista = Joi.object({
  nomeArtistico: Joi.string().required().empty().messages({
    'any.required': 'Informe por favor o seu nome artístico',
    'string.base': 'Informe por favor o seu nome artístico',
    'string.empty': 'Informe por favor o seu nome artístico'
  }),
  dataNascimento: Joi.string().required().empty().messages({
    'any.required': 'Informe por favor a sua data de nascimento',
    'string.base': 'Informe por favor a sua data de nascimento',
    'string.empty': 'Informe por favor a sua data de nascimento',
  }),
  genero: Joi.string().required().empty().messages({
    'any.required': 'Informe por favor o seu género',
    'string.base': 'Informe por favor o seu género',
    'string.empty': 'Informe por favor o seu género',
  }),
  imagemPerfil: Joi.string().required().empty().messages({
    'any.required': 'Faça upload da sua imagem',
    'string.base': 'Faça upload da sua imagem',
    'string.empty': 'Faça upload da sua imagem',
  }),
  nomeProvincia: Joi.string().required().empty().messages({
    'any.required': 'Indique por favor o nome da sua província',
    'string.base': 'Indique por favor o nome da sua província',
    'string.empty': 'Indique por favor o nome da sua província',
  }),
  nomeMunicipio: Joi.string().required().empty().messages({
    'any.required': 'Indique por favor o nome do seu município',
    'string.base': 'Indique por favor o nome do seu município',
    'string.empty': 'Indique por favor o nome do seu município',
  }),
  nomeDistrito: Joi.string().required().empty().messages({
    'any.required': 'Indique por favor o nome do seu distrito',
    'string.base': 'Indique por favor o nome do seu distrito',
    'string.empty': 'Indique por favor o nome do seu distrito',
  }),
  nomeBairro: Joi.string().required().empty().messages({
    'any.required': 'Indique por favor o nome do seu bairro',
    'string.base': 'Indique por favor o nome do seu bairro',
    'string.empty': 'Indique por favor o nome do seu bairro',
  }),
  nomeRua: Joi.string().required().empty().messages({
    'any.required': 'Indique por favor o nome do sua rua',
    'string.base': 'Indique por favor o nome do sua rua',
    'string.empty': 'Indique por favor o nome do sua rua',
  }),
  titulo: Joi.string().required().empty().messages({
    'any.required': 'Indique por favor o titulo da música a concorrer',
    'string.base': 'Indique por favor o titulo da música a concorrer',
    'string.empty': 'Indique por favor o titulo da música a concorrer',
  }),
  link_musica: Joi.string().required().empty().messages({
    'any.required': 'Indique por favor o link da música a concorrer',
    'string.base': 'Indique por favor o link da música a concorrer',
    'string.empty': 'Indique por favor o link da música a concorrer',
  }),
  ano_gravacao: Joi.number().required().empty().messages({
    'any.required': 'Indique por favor o ano de lançamento da música a concorrer',
    'number.base': 'Indique por favor o ano de lançamento da música a concorrer',
    'number.empty': 'Indique por favor o ano de lançamento da música a concorrer',
  }),
  nomeGenero: Joi.string().required().empty().messages({
    'any.required': 'Indique por favor o género da música a concorrer',
    'string.base': 'Indique por favor o género da música a concorrer',
    'string.empty': 'Indique por favor o género da música a concorrer',
  }),
  idEdicao: Joi.string().required().empty().messages({
    'any.required': 'Seleccione por favor a edição',
    'string.base': 'Seleccione por favor a edição',
    'string.empty': 'Seleccione por favor a edição',
  }),
  idCategoria: Joi.string().required().empty().messages({
    'any.required': 'Seleccione por favor a categoria',
    'string.base': 'Seleccione por favor a categoria',
    'string.empty': 'Seleccione por favor a categoria',
  }),
  email: Joi.string().email().required().empty().messages({
    'any.required': 'Informe por favor o seu email',
    'string.base': 'Informe por favor o seu email',
    'string.empty': 'Informe por favor o seu email',
    'string.email': 'Informe por favor um email válido'
  }),
  telefone: Joi.string().min(9).max(9).required().empty().messages({
    'any.required': 'Informe por favor o seu telefone',
    'string.base': 'Informe por favor o seu telefone',
    'string.empty': 'Informe por favor o seu telefone',
    'string.min': 'Informe por favor um número de telefone válido',
    'string.max': 'Informe por favor um número de telefone válido'
  }),
  senha: Joi.string().min(6).required().empty().messages({
    'any.required': 'Informe por favor uma senha',
    'string.base': 'Informe por favor uma senha',
    'string.empty': 'Informe por favor uma senha',
    'string.min': 'Senha deve ter no mínimo 6 carácteres',
  }),
  enderecoBlockchain: Joi.string()
})

export const validarAtualizarArtista = Joi.object({
  nomeArtistico: Joi.string().empty().messages({
    'any.required': 'Informe por favor o seu nome artístico',
    'string.base': 'Informe por favor o seu nome artístico',
    'string.empty': 'Informe por favor o seu nome artístico'
  }),
  dataNascimento: Joi.string().empty().messages({
    'any.required': 'Informe por favor a sua data de nascimento',
    'string.base': 'Informe por favor a sua data de nascimento',
    'string.empty': 'Informe por favor a sua data de nascimento',
  }),
  genero: Joi.string().empty().messages({
    'any.required': 'Informe por favor o seu género',
    'string.base': 'Informe por favor o seu género',
    'string.empty': 'Informe por favor o seu género',
  }),
  imagemPerfil: Joi.string().empty().messages({
    'any.required': 'Faça upload da sua imagem',
    'string.base': 'Faça upload da sua imagem',
    'string.empty': 'Faça upload da sua imagem',
  }),
  nomeProvincia: Joi.string().empty().messages({
    'any.required': 'Indique por favor o nome da sua província',
    'string.base': 'Indique por favor o nome da sua província',
    'string.empty': 'Indique por favor o nome da sua província',
  }),
  nomeMunicipio: Joi.string().empty().messages({
    'any.required': 'Indique por favor o nome do seu município',
    'string.base': 'Indique por favor o nome do seu município',
    'string.empty': 'Indique por favor o nome do seu município',
  }),
  nomeDistrito: Joi.string().empty().messages({
    'any.required': 'Indique por favor o nome do seu distrito',
    'string.base': 'Indique por favor o nome do seu distrito',
    'string.empty': 'Indique por favor o nome do seu distrito',
  }),
  nomeBairro: Joi.string().empty().messages({
    'any.required': 'Indique por favor o nome do seu bairro',
    'string.base': 'Indique por favor o nome do seu bairro',
    'string.empty': 'Indique por favor o nome do seu bairro',
  }),
  nomeRua: Joi.string().empty().messages({
    'any.required': 'Indique por favor o nome do sua rua',
    'string.base': 'Indique por favor o nome do sua rua',
    'string.empty': 'Indique por favor o nome do sua rua',
  }),
  titulo: Joi.string().empty().messages({
    'any.required': 'Indique por favor o titulo da música a concorrer',
    'string.base': 'Indique por favor o titulo da música a concorrer',
    'string.empty': 'Indique por favor o titulo da música a concorrer',
  }),
  link_musica: Joi.string().empty().messages({
    'any.required': 'Indique por favor o link da música a concorrer',
    'string.base': 'Indique por favor o link da música a concorrer',
    'string.empty': 'Indique por favor o link da música a concorrer',
  }),
  ano_gravacao: Joi.number().empty().messages({
    'any.required': 'Indique por favor o ano de lançamento da música a concorrer',
    'number.base': 'Indique por favor o ano de lançamento da música a concorrer',
    'number.empty': 'Indique por favor o ano de lançamento da música a concorrer',
  }),
  nomeGenero: Joi.string().empty().messages({
    'any.required': 'Indique por favor o género da música a concorrer',
    'string.base': 'Indique por favor o género da música a concorrer',
    'string.empty': 'Indique por favor o género da música a concorrer',
  }),
  idEdicao: Joi.string().empty().messages({
    'any.required': 'Seleccione por favor a edição',
    'string.base': 'Seleccione por favor a edição',
    'string.empty': 'Seleccione por favor a edição',
  }),
  idCategoria: Joi.string().empty().messages({
    'any.required': 'Seleccione por favor a categoria',
    'string.base': 'Seleccione por favor a categoria',
    'string.empty': 'Seleccione por favor a categoria',
  }),
  email: Joi.string().email().empty().messages({
    'any.required': 'Informe por favor o seu email',
    'string.base': 'Informe por favor o seu email',
    'string.empty': 'Informe por favor o seu email',
    'string.email': 'Informe por favor um email válido'
  }),
  telefone: Joi.string().min(9).max(9).empty().messages({
    'any.required': 'Informe por favor o seu telefone',
    'string.base': 'Informe por favor o seu telefone',
    'string.empty': 'Informe por favor o seu telefone',
    'string.min': 'Informe por favor um número de telefone válido',
    'string.max': 'Informe por favor um número de telefone válido'
  }),
  senha: Joi.string().min(6).empty().messages({
    'any.required': 'Informe por favor uma senha',
    'string.base': 'Informe por favor uma senha',
    'string.empty': 'Informe por favor uma senha',
    'string.min': 'Senha deve ter no mínimo 6 carácteres',
  }),
  enderecoBlockchain: Joi.string()
})