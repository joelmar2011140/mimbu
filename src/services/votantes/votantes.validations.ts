import Joi from "joi";

export const validarRegistoVotante = Joi.object({
  bilheteDeIdentidade: Joi.string().max(14).required().empty().messages({
    'any.required': 'Forneça por favor o seu número de bilhete de identidade',
    'string.base': 'Forneça por favor o seu número de bilhete de identidade',
    'string.empty': 'Forneça por favor o seu número de bilhete de identidade',
    'string.max': 'Insira um número de bilhete de identidade válido'
  }),
  provincia: Joi.string().required().empty().messages({
    'any.required': 'Forneça por favor a sua província',
    'string.base': 'Forneça por favor a sua província',
    'string.empty': 'Forneça por favor a sua província',
  }),
  municipio: Joi.string().required().empty().messages({
    'any.required': 'Forneça por favor o seu município',
    'string.base': 'Forneça por favor o seu município',
    'string.empty': 'Forneça por favor o seu município',
  }),
  distrito: Joi.string().required().empty().messages({
    'any.required': 'Forneça por favor o seu distrito',
    'string.base': 'Forneça por favor o seu distrito',
    'string.empty': 'Forneça por favor o seu distrito',
  }),
  bairro: Joi.string().required().empty().messages({
    'any.required': 'Forneça por favor o seu bairro',
    'string.base': 'Forneça por favor o seu bairro',
    'string.empty': 'Forneça por favor o seu bairro',
  }),
  rua: Joi.string().required().empty().messages({
    'any.required': 'Forneça por favor a sua rua',
    'string.base': 'Forneça por favor a sua rua',
    'string.empty': 'Forneça por favor a sua rua',
  }),
  email: Joi.string().email().required().empty().messages({
    'any.required': 'Forneça por favor o seu email',
    'string.email': 'Forneça por favor o seu email',
    'string.base': 'Forneça por favor o seu email',
    'string.empty': 'Forneça por favor o seu email',
  }),
  enderecoBlockchain: Joi.string().required().empty().messages({
    'any.required': 'Forneça por favor a sua carteira digital',
    'string.email': 'Forneça por favor a sua carteira digital',
    'string.base': 'Forneça por favor a sua carteira digital',
    'string.empty': 'Forneça por favor a sua carteira digital',
  }),
})

export const validarAtualizarVotante = Joi.object({
  bilheteDeIdentidade: Joi.string().max(14).empty().messages({
    'any.required': 'Forneça por favor o seu número de bilhete de identidade',
    'string.base': 'Forneça por favor o seu número de bilhete de identidade',
    'string.empty': 'Forneça por favor o seu número de bilhete de identidade',
    'string.min': 'Insira um número de bilhete de identidade válido'
  }),
  provincia: Joi.string().empty().messages({
    'any.required': 'Forneça por favor a sua província',
    'string.base': 'Forneça por favor a sua província',
    'string.empty': 'Forneça por favor a sua província',
  }),
  municipio: Joi.string().empty().messages({
    'any.required': 'Forneça por favor o seu município',
    'string.base': 'Forneça por favor o seu município',
    'string.empty': 'Forneça por favor o seu município',
  }),
  distrito: Joi.string().empty().messages({
    'any.required': 'Forneça por favor o seu distrito',
    'string.base': 'Forneça por favor o seu distrito',
    'string.empty': 'Forneça por favor o seu distrito',
  }),
  bairro: Joi.string().empty().messages({
    'any.required': 'Forneça por favor o seu bairro',
    'string.base': 'Forneça por favor o seu bairro',
    'string.empty': 'Forneça por favor o seu bairro',
  }),
  rua: Joi.string().empty().messages({
    'any.required': 'Forneça por favor a sua rua',
    'string.base': 'Forneça por favor a sua rua',
    'string.empty': 'Forneça por favor a sua rua',
  }),
  email: Joi.string().email().empty().messages({
    'any.required': 'Forneça por favor o seu email',
    'string.email': 'Forneça por favor o seu email',
    'string.base': 'Forneça por favor o seu email',
    'string.empty': 'Forneça por favor o seu email',
  }),
  enderecoBlockchain: Joi.string().empty().messages({
    'any.required': 'Forneça por favor a sua carteira digital',
    'string.email': 'Forneça por favor a sua carteira digital',
    'string.base': 'Forneça por favor a sua carteira digital',
    'string.empty': 'Forneça por favor a sua carteira digital',
  }),
})