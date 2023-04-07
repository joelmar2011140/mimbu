import Joi from "joi";
import { ICriarEdicao } from "./edicoes.types";

export const validarRegistoEdicao = Joi.object<ICriarEdicao>({
  nomeEdicao: Joi.string().required().empty().messages({
    'any.required': 'Por favor especifique um nome para esta edição',
    'string.base': 'Por favor especifique um nome para esta edição',
    'string.empty': 'Por favor especifique um nome para esta edição',
  }),
  capa: Joi.string().required().empty().messages({
    'any.required': 'Por favor especifique uma capa para esta edição',
    'string.base': 'Por favor especifique uma capa para esta edição',
    'string.empty': 'Por favor especifique uma capa para esta edição',
  }),
  categorias: Joi.array().items(Joi.string()).required().empty().messages({
    'any.required': 'Por favor indique as categorias  para esta edição',
    'array.base': 'Por favor indique as categorias  para esta edição',
    'array.empty': 'Por favor indique as categorias  para esta edição',
  }),
  dataComeco: Joi.string().required().empty().messages({
    'any.required': 'Por favor indique a data de começo desta edição',
    'string.base': 'Por favor indique a data de começo desta edição',
    'string.empty': 'Por favor indique a data de começo desta edição',
  }),
  dataTermino: Joi.string().required().empty().messages({
    'any.required': 'Por favor indique a data de finalização desta edição',
    'string.base': 'Por favor indique a data de finalização desta edição',
    'string.empty': 'Por favor indique a data de finalização desta edição',
  }),
})

export const validarAtualizarEdicao = Joi.object<ICriarEdicao>({
  nomeEdicao: Joi.string().empty().messages({
    'any.required': 'Por favor especifique um nome para esta edição',
    'string.base': 'Por favor especifique um nome para esta edição',
    'string.empty': 'Por favor especifique um nome para esta edição',
  }),
  capa: Joi.string().empty().messages({
    'any.required': 'Por favor especifique uma capa para esta edição',
    'string.base': 'Por favor especifique uma capa para esta edição',
    'string.empty': 'Por favor especifique uma capa para esta edição',
  }),
  categorias: Joi.array().items(Joi.string()).empty().messages({
    'any.required': 'Por favor indique as categorias  para esta edição',
    'array.base': 'Por favor indique as categorias  para esta edição',
    'array.empty': 'Por favor indique as categorias  para esta edição',
  }),
  dataComeco: Joi.string().empty().messages({
    'any.required': 'Por favor indique a data de começo desta edição',
    'string.base': 'Por favor indique a data de começo desta edição',
    'string.empty': 'Por favor indique a data de começo desta edição',
  }),
  dataTermino: Joi.string().empty().messages({
    'any.required': 'Por favor indique a data de finalização desta edição',
    'string.base': 'Por favor indique a data de finalização desta edição',
    'string.empty': 'Por favor indique a data de finalização desta edição',
  }),
})